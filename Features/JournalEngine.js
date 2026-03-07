// ============================================
// JOURNAL ENGINE - Personal Journal System with PIN Lock
// ============================================
// Provides a secure, private journaling experience with mood tracking,
// entry management, and optional PIN protection
// ============================================

import { NeumorphicModal } from '../Core/Modal.js';

// ============================================
// CONSTANTS
// ============================================

const MOOD_OPTIONS = [
  // Positive moods
  { id: 'happy', emoji: '😊', title: 'Happy' },
  { id: 'joyful', emoji: '😄', title: 'Joyful' },
  { id: 'excited', emoji: '🤩', title: 'Excited' },
  { id: 'loved', emoji: '🥰', title: 'Loved' },
  { id: 'grateful', emoji: '🙏', title: 'Grateful' },
  { id: 'peaceful', emoji: '😌', title: 'Peaceful' },
  { id: 'calm', emoji: '🧘', title: 'Calm' },
  { id: 'relaxed', emoji: '😎', title: 'Relaxed' },
  { id: 'proud', emoji: '😤', title: 'Proud' },
  { id: 'confident', emoji: '💪', title: 'Confident' },
  { id: 'hopeful', emoji: '🌟', title: 'Hopeful' },
  { id: 'inspired', emoji: '✨', title: 'Inspired' },
  // Negative moods
  { id: 'sad', emoji: '😢', title: 'Sad' },
  { id: 'crying', emoji: '😭', title: 'Crying' },
  { id: 'lonely', emoji: '😔', title: 'Lonely' },
  { id: 'disappointed', emoji: '😞', title: 'Disappointed' },
  { id: 'anxious', emoji: '😰', title: 'Anxious' },
  { id: 'worried', emoji: '😟', title: 'Worried' },
  { id: 'stressed', emoji: '😫', title: 'Stressed' },
  { id: 'overwhelmed', emoji: '🤯', title: 'Overwhelmed' },
  { id: 'angry', emoji: '😠', title: 'Angry' },
  { id: 'frustrated', emoji: '😤', title: 'Frustrated' },
  { id: 'annoyed', emoji: '😒', title: 'Annoyed' },
  // Neutral/Other moods
  { id: 'tired', emoji: '😴', title: 'Tired' },
  { id: 'sick', emoji: '🤒', title: 'Sick' },
  { id: 'confused', emoji: '😕', title: 'Confused' },
  { id: 'surprised', emoji: '😲', title: 'Surprised' },
  { id: 'shocked', emoji: '😱', title: 'Shocked' },
  { id: 'nervous', emoji: '😬', title: 'Nervous' },
  { id: 'embarrassed', emoji: '😳', title: 'Embarrassed' }
];

const WRITING_PROMPTS = [
  "What made you smile today?",
  "What are you grateful for right now?",
  "What's on your mind?",
  "How are you really feeling?",
  "What would you like to remember about today?",
  "What challenged you today?",
  "What did you learn about yourself?",
  "What are you looking forward to?"
];

const ANIMATION_DURATION = 400; // ms

// ============================================
// JOURNAL ENGINE CLASS
// ============================================

class JournalEngine {
  constructor(app) {
    this.app = app;
    this.currentPage = 0;
    this.viewMode = 'write'; // 'write' | 'read'
    this.isOpen = false; // Book starts closed
    this.isLocked = false; // Current lock state
    this.activeModals = []; // Track modals for cleanup
  }

  // ============================================
  // MAIN RENDER METHOD
  // ============================================
  
  /**
   * Renders the journal tab structure
   * Creates the main container and header if not exists
   */
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
                  style="--header-img:url('/Public/Tabs/NavJournal.png');
                         --header-title:'';
                         --header-tag:'Your safe, private, secret space, to open up, vent and write down your emotions and thoughts'">
            <h1>My Personal Journal</h1>
            <h3>Your safe, private, secret space, to open up, vent and write down your emotions and thoughts</h3>
            <span class="header-sub"></span>
          </header>
          
          <div class="journal-book-wrapper" id="journal-wrapper">
            <!-- Journal content injected here -->
          </div>
        </div>
      </div>
    `;

    this.initializeLockState();
    this.renderJournal();
  }

  // ============================================
  // JOURNAL STATE RENDERERS
  // ============================================

  /**
   * Renders the journal based on current state (closed vs open)
   */
  renderJournal() {
    const wrapper = document.getElementById('journal-wrapper');
    if (!wrapper) return;

    const hasPin = !!this.app.state.data.journalPin;
    
    if (!this.isOpen) {
      this.renderClosedBook(wrapper, hasPin);
    } else {
      this.renderOpenBook(wrapper, hasPin);
    }
  }

  /**
   * Renders the closed journal cover
   */
  renderClosedBook(wrapper, hasPin) {
    const userName = this.app.state.currentUser?.name || 'My';
    const lockIcon = hasPin && this.isLocked ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>' : '';
    
    wrapper.innerHTML = `
      <div class="journal-closed" id="open-journal" style="opacity: 0; transform: scale(0.95);">
        <div class="journal-cover-title">${userName}'s<br>Personal Journal</div>
        <div class="journal-cover-subtitle">Tap to open and begin writing</div>
        <div class="journal-lock">${lockIcon}</div>
      </div>`;
    
    // Animate in
    const coverEl = wrapper.querySelector('.journal-closed');
    requestAnimationFrame(() => {
      coverEl.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
      coverEl.style.opacity = '1';
      coverEl.style.transform = 'scale(1)';
    });
    
    // Handle opening
    coverEl.addEventListener('click', () => {
      if (hasPin && this.isLocked) {
        this.promptUnlock();
      } else {
        this.openBook();
      }
    });
  }

  /**
   * Renders the open journal with navigation and pages
   */
  renderOpenBook(wrapper, hasPin) {
    wrapper.innerHTML = `
      <div class="journal-book" style="opacity: 0; transform: scale(0.95);">
        <!-- Top Navigation Bar -->
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
          <div class="mode-toggle">
            <button class="journal-btn-neuro mode-btn active" data-mode="write" style="display:inline-flex;align-items:center;gap:0.4rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg> Write</button>
            <button class="journal-btn-neuro mode-btn" data-mode="read" style="display:inline-flex;align-items:center;gap:0.4rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> Read</button>
          </div>
          <div style="display:flex;gap:.5rem;align-items:center;">
            <button class="journal-btn-neuro lock-toggle-btn" id="lock-toggle" style="display:inline-flex;align-items:center;gap:0.4rem;">
              ${hasPin ? (this.isLocked ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>' : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>') : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>'} Lock Journal
            </button>
            ${hasPin ? '<button class="journal-btn-neuro" id="pin-settings" title="PIN Settings" style="display:inline-flex;align-items:center;gap:0.4rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg></button>' : ''}
            <button class="journal-btn-neuro close-book-btn" id="close-journal" style="display:inline-flex;align-items:center;gap:0.4rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> Close</button>
          </div>
        </div>

        <!-- Pages Container -->
        <div class="journal-pages" id="journal-pages"></div>

        <!-- Bottom Controls -->
        <div class="journal-controls">
          <div class="journal-nav">
            <button class="journal-btn-neuro" id="prev-page" disabled>← Previous</button>
            <span class="page-indicator" id="page-indicator"></span>
            <button class="journal-btn-neuro" id="next-page" disabled>Next →</button>
          </div>
          <div style="display:flex;justify-content:center;margin-top:1rem;">
            <button class="journal-btn-neuro save-btn" id="save-entry" style="display:none;display:inline-flex;align-items:center;gap:0.4rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></svg> Save Entry</button>
          </div>
        </div>
      </div>`;

    // Animate in
    const bookEl = wrapper.querySelector('.journal-book');
    requestAnimationFrame(() => {
      bookEl.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
      bookEl.style.opacity = '1';
      bookEl.style.transform = 'scale(1)';
    });

    this.attachOpenEventListeners();
    this.renderCurrentView();
  }

  // ============================================
  // VIEW MODE RENDERERS
  // ============================================

  /**
   * Renders the write mode with text area and mood selector
   */
  renderWriteMode() {
    const pagesContainer = document.getElementById('journal-pages');
    const saveBtn = document.getElementById('save-entry');
    if (saveBtn) saveBtn.style.display = 'block';

    const randomPrompt = this.getRandomPrompt();
    const currentDate = this.formatDate(new Date());

    pagesContainer.innerHTML = `
      <div class="journal-page write-mode">
        <div class="journal-date">${currentDate}</div>

        <textarea class="journal-textarea" 
                  id="journal-entry-text" 
                  placeholder="Dear Journal, ${randomPrompt}"></textarea>

        <div class="prompt-box">
          <div class="prompt-text" style="display:flex;align-items:center;gap:0.4rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg> Writing prompt: ${randomPrompt}</div>
        </div>

        <div class="prompt-box">
          <div class="prompt-text">Your Mood</div>
          <div class="journal-mood" style="margin-top:.6rem;">
            ${this.renderMoodButtons()}
          </div>
        </div>
      </div>`;

    this.attachMoodListeners(pagesContainer);
    this.updateNavigation();
  }

  /**
   * Renders the read mode showing saved entries
   * @param {string} direction - Animation direction ('left', 'right', or 'none')
   */
  renderReadMode(direction = 'none') {
    const pagesContainer = document.getElementById('journal-pages');
    const saveBtn = document.getElementById('save-entry');
    if (saveBtn) saveBtn.style.display = 'none';

    const entries = this.app.state.data.journalEntries || [];
    
    if (entries.length === 0) {
      this.renderEmptyJournal(pagesContainer);
      return;
    }

    const sorted = [...entries].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const entry = sorted[this.currentPage];
    const originalIndex = entries.indexOf(entry);

    const moodEmoji = entry.mood ? this.getMoodEmoji(entry.mood) : '';
    const formattedDate = entry.date || this.formatDate(new Date(entry.timestamp));
    const flipClass = direction === 'left' ? 'page-flip-left' : direction === 'right' ? 'page-flip-right' : '';

    pagesContainer.innerHTML = `
      <div class="journal-page read-mode ${flipClass}">
        <div class="entry-actions">
          <button class="action-btn" onclick="window.featuresManager.engines.journal.editEntry(${originalIndex})" style="display:inline-flex;align-items:center;gap:0.4rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg> Edit</button>
          <button class="action-btn" onclick="window.featuresManager.engines.journal.deleteEntry(${originalIndex})" style="display:inline-flex;align-items:center;gap:0.4rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg> Delete</button>
        </div>
        <div class="journal-date">
          ${moodEmoji ? moodEmoji + ' ' : ''}
          ${formattedDate}
        </div>
        <div class="entry-content">${this.escapeHtml(entry.situation || entry.feelings || '')}</div>
      </div>`;
    
    this.updateNavigation();
  }

  /**
   * Renders empty state for journal with no entries
   */
  renderEmptyJournal(container) {
    container.innerHTML = `
      <div class="journal-page">
        <div class="empty-journal">
          <div class="empty-journal-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:48px;height:48px;"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></div>
          <p>Your journal is empty</p>
          <p style="font-size:.9rem;margin-top:.5rem;">Switch to Write mode to create your first entry</p>
        </div>
      </div>`;
    this.updateNavigation();
  }

  // ============================================
  // PIN/LOCK SYSTEM
  // ============================================
  
  /**
   * SECURITY NOTE: Current implementation uses btoa() which is BASE64 ENCODING, not encryption.
   * For production, replace with proper cryptographic hashing:
   * - Use Web Crypto API: crypto.subtle.digest('SHA-256', ...)
   * - Or integrate a proper password hashing library (bcrypt, argon2)
   * Current implementation provides basic obfuscation only.
   */

  /**
   * Initializes lock state from saved data
   */
  initializeLockState() {
    if (this.app.state.data.journalPin) {
      // Default to locked if PIN exists
      this.isLocked = this.app.state.data.journalLocked !== false;
    }
  }

  /**
   * Prompts user to set a new PIN
   */
  promptSetPin() {
    const modal = this.createModal({
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
      title: 'Set Journal PIN',
      content: `
        <div class="modal-input-wrapper">
          <label class="form-label">Enter 4-digit PIN</label>
          <input type="password" id="pin-input" class="form-input" 
                 maxlength="4" pattern="[0-9]*" inputmode="numeric" placeholder="••••">
          <label class="form-label" style="margin-top:1rem;">Confirm PIN</label>
          <input type="password" id="pin-confirm" class="form-input" 
                 maxlength="4" pattern="[0-9]*" inputmode="numeric" placeholder="••••">
          <p style="font-size:.85rem;color:var(--neuro-text-muted);margin-top:.5rem;">
            You can reset PIN using your account password
          </p>
        </div>
      `,
      onConfirm: (modal) => {
        const pinInput = modal.querySelector('#pin-input');
        const confirmInput = modal.querySelector('#pin-confirm');
        const pin = pinInput.value;
        const confirm = confirmInput.value;

        if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
          this.app.showToast('PIN must be 4 digits', 'warning');
          return false;
        }
        if (pin !== confirm) {
          this.app.showToast('PINs do not match', 'warning');
          return false;
        }

        // WARNING: btoa is NOT encryption - see security note above
        this.app.state.data.journalPin = btoa(pin);
        this.app.state.saveAppData();
        this.isLocked = true;
        this.app.showToast('PIN set successfully!', 'success');
        this.renderJournal();
        return true;
      }
    });

    // Focus first input
    setTimeout(() => modal.querySelector('#pin-input')?.focus(), 100);
  }

  /**
   * Prompts user to unlock journal with PIN
   */
  promptUnlock() {
    const modal = this.createModal({
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>',
      title: 'Unlock Journal',
      content: `
        <div class="modal-input-wrapper">
          <label class="form-label">Enter your PIN</label>
          <input type="password" id="unlock-pin" class="form-input" 
                 maxlength="4" pattern="[0-9]*" inputmode="numeric" placeholder="••••">
          <button class="btn" id="forgot-pin" style="margin-top:.5rem;font-size:.85rem;">
            Forgot PIN? Use account password
          </button>
        </div>
      `,
      onConfirm: (modal) => {
        const pinInput = modal.querySelector('#unlock-pin');
        const pin = pinInput.value;
        const savedPin = atob(this.app.state.data.journalPin || '');

        if (pin === savedPin) {
          this.isLocked = false;
          this.isOpen = true;
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

    // Handle forgot PIN button
    modal.querySelector('#forgot-pin')?.addEventListener('click', () => {
      this.closeModal(modal);
      this.resetPinWithAuth();
    });

    // Allow enter key to unlock
    const pinInput = modal.querySelector('#unlock-pin');
    pinInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        modal.querySelector('.modal-confirm')?.click();
      }
    });

    setTimeout(() => pinInput?.focus(), 100);
  }

  /**
   * Resets PIN using account password authentication
   */
  async resetPinWithAuth() {
    const modal = this.createModal({
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg>',
      title: 'Reset PIN',
      content: `
        <div class="modal-input-wrapper">
          <p style="margin-bottom:1rem;">Enter your account password to reset your journal PIN</p>
          <label class="form-label">Account Password</label>
          <input type="password" id="auth-password" class="form-input" placeholder="Enter your password">
        </div>
      `,
      onConfirm: async (modal) => {
        const passwordInput = modal.querySelector('#auth-password');
        const password = passwordInput.value;
        
        if (!password) {
          this.app.showToast('Please enter your password', 'warning');
          return false;
        }

        try {
          // Re-authenticate with Supabase
          const { error } = await this.app.supabase.auth.signInWithPassword({
            email: this.app.state.currentUser.email,
            password: password
          });

          if (error) {
            this.app.showToast('Incorrect password', 'error');
            passwordInput.value = '';
            passwordInput.focus();
            return false;
          }

          // Password correct - clear PIN and prompt for new one
          delete this.app.state.data.journalPin;
          this.app.state.saveAppData();
          this.isLocked = false;
          this.app.showToast('PIN reset! Set a new one', 'success');
          
          // Prompt for new PIN after modal closes
          setTimeout(() => this.promptSetPin(), 300);
          return true;

        } catch (err) {
          console.error('Authentication error:', err);
          this.app.showToast('Authentication failed', 'error');
          return false;
        }
      }
    });

    // Allow enter key
    const passwordInput = modal.querySelector('#auth-password');
    passwordInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        modal.querySelector('.modal-confirm')?.click();
      }
    });

    setTimeout(() => passwordInput?.focus(), 100);
  }

  /**
   * Shows PIN settings modal
   */
  showPinSettings() {
    const modal = this.createModal({
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',
      title: 'PIN Settings',
      content: `
        <div class="modal-input-wrapper">
          <button class="btn btn-primary" id="change-pin" style="width:100%;margin-bottom:.5rem;">
            Change PIN
          </button>
          <button class="btn" id="remove-pin" style="width:100%;">
            Remove PIN Lock
          </button>
        </div>
      `,
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
        { title: 'Remove PIN?', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>', confirmText: 'Remove PIN' }
      );
    });
  }

  // ============================================
  // ENTRY MANAGEMENT
  // ============================================

  /**
   * Saves a new journal entry
   */
  saveEntry() {
    const textArea = document.getElementById('journal-entry-text');
    const text = textArea?.value.trim();
    
    if (!text) {
      this.app.showToast('Please write something in your journal', 'warning');
      return;
    }

    const activeMood = document.querySelector('.mood-btn.active');
    const mood = activeMood?.dataset.mood || null;

    const entry = {
      situation: text,
      feelings: '',
      mood: mood,
      timestamp: new Date().toISOString(),
      date: this.formatDate(new Date())
    };

    this.app.state.addEntry('journal', entry);
    
    // Update gamification if available
    if (this.app.gamification) {
      this.app.gamification.progressQuest('daily', 'journal_entry', 1);
      this.app.gamification.incrementJournalEntries();
    }
    
    this.app.showToast('Journal entry saved!', 'success');

    // Clear form
    textArea.value = '';
    document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
    
    this.checkAchievements();

    // Auto-switch to read mode to show the new entry
    this.switchMode('read');
  }

  /**
   * Opens edit modal for existing entry
   * @param {number} index - Index of entry in the entries array
   */
  editEntry(index) {
    const entries = this.app.state.data.journalEntries || [];
    const entry = entries[index];
    if (!entry) return;

    const modal = this.createModal({
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>',
      title: 'Edit Journal Entry',
      content: `
        <div class="modal-input-wrapper">
          <label class="form-label" style="color:var(--neuro-text);margin-bottom:.5rem;display:block;">
            How did you feel?
          </label>
          <div style="display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:1rem;">
            ${this.renderMoodButtons(entry.mood)}
          </div>
          <label class="form-label" style="color:var(--neuro-text);margin-bottom:.5rem;display:block;">
            Entry
          </label>
          <textarea id="edit-entry" class="form-input" rows="8" placeholder="Write your thoughts...">${this.escapeHtml(entry.situation || entry.feelings || '')}</textarea>
        </div>
      `,
      onConfirm: (modal) => {
        const entryInput = modal.querySelector('#edit-entry');
        const newText = entryInput.value.trim();
        
        if (!newText) {
          this.app.showToast('Please write something', 'warning');
          return false;
        }
        
        const activeMood = modal.querySelector('.mood-btn.active');
        const newMood = activeMood?.dataset.mood || null;

        // Update entry
        entries[index].situation = newText;
        entries[index].feelings = '';
        entries[index].mood = newMood;

        this.app.state.data.journalEntries = entries;
        this.app.state.saveAppData();
        this.app.showToast('Journal entry updated!', 'success');
        this.renderCurrentView();
        return true;
      }
    });

    // Attach mood listeners
    this.attachMoodListeners(modal);
    
    setTimeout(() => modal.querySelector('#edit-entry')?.focus(), 100);
  }

  /**
   * Deletes a journal entry with confirmation
   * @param {number} index - Index of entry to delete
   */
  deleteEntry(index) {
    NeumorphicModal.showConfirm(
      'Are you sure you want to delete this journal entry? This action cannot be undone.',
      () => {
        const entries = this.app.state.data.journalEntries || [];
        entries.splice(index, 1);
        this.app.state.data.journalEntries = entries;
        this.app.state.saveAppData();
        this.app.showToast('Journal entry deleted', 'info');
        
        // Adjust current page if needed
        if (this.currentPage >= entries.length) {
          this.currentPage = Math.max(0, entries.length - 1);
        }
        
        this.renderCurrentView();
      },
      { title: 'Delete Journal Entry', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>', confirmText: 'Delete', isDanger: true }
    );
  }

  // ============================================
  // NAVIGATION & INTERACTION
  // ============================================

  /**
   * Opens the journal with animation
   */
  openBook() {
    const coverEl = document.querySelector('.journal-closed');
    if (!coverEl) {
      this.isOpen = true;
      this.renderJournal();
      return;
    }

    // Animate cover out
    coverEl.style.transition = `opacity ${ANIMATION_DURATION}ms ease-in, transform ${ANIMATION_DURATION}ms ease-in`;
    coverEl.style.opacity = '0';
    coverEl.style.transform = 'scale(0.9)';

    setTimeout(() => {
      this.isOpen = true;
      this.renderJournal();
    }, ANIMATION_DURATION);
  }

  /**
   * Closes the journal with animation
   */
  closeBook() {
    const bookEl = document.querySelector('.journal-book');
    if (!bookEl) {
      this.isOpen = false;
      this.renderJournal();
      return;
    }
    
    // Animate book out
    bookEl.style.transition = `opacity ${ANIMATION_DURATION}ms ease-in, transform ${ANIMATION_DURATION}ms ease-in`;
    bookEl.style.opacity = '0';
    bookEl.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
      this.isOpen = false;
      
      // Auto-lock on close if PIN exists
      if (this.app.state.data.journalPin) {
        this.isLocked = true;
        this.app.state.data.journalLocked = true;
        this.app.state.saveAppData();
      }
      
      this.renderJournal();
    }, ANIMATION_DURATION);
  }

  /**
   * Switches between write and read modes
   * @param {string} mode - 'write' or 'read'
   */
  switchMode(mode) {
    this.viewMode = mode;
    this.currentPage = 0;
    
    // Update button states
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`[data-mode="${mode}"]`)?.classList.add('active');
    
    this.renderCurrentView();
  }

  /**
   * Navigates between pages in read mode
   * @param {number} direction - -1 for previous, 1 for next
   */
  navigatePage(direction) {
    const entries = this.app.state.data.journalEntries || [];
    const maxPage = entries.length - 1;
    const newPage = this.currentPage + direction;
    
    if (newPage < 0 || newPage > maxPage) return;
    
    this.currentPage = newPage;
    this.renderReadMode(direction > 0 ? 'right' : 'left');
  }

  /**
   * Updates navigation button states and page indicator
   */
  updateNavigation() {
    const entries = this.app.state.data.journalEntries || [];
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const indicator = document.getElementById('page-indicator');

    if (this.viewMode === 'write') {
      // Hide navigation in write mode
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
      if (indicator) indicator.textContent = '';
    } else {
      // Show navigation in read mode
      if (prevBtn) {
        prevBtn.style.display = 'block';
        prevBtn.disabled = this.currentPage === 0;
      }
      if (nextBtn) {
        nextBtn.style.display = 'block';
        nextBtn.disabled = this.currentPage >= entries.length - 1;
      }
      if (indicator) {
        indicator.textContent = entries.length 
          ? `Entry ${this.currentPage + 1} of ${entries.length}` 
          : '';
      }
    }
  }

  /**
   * Renders current view based on viewMode
   */
  renderCurrentView() {
    this.viewMode === 'write' ? this.renderWriteMode() : this.renderReadMode();
  }

  // ============================================
  // EVENT LISTENERS
  // ============================================

  /**
   * Attaches event listeners for open journal
   */
  attachOpenEventListeners() {
    // Close button
    const closeBtn = document.getElementById('close-journal');
    closeBtn?.addEventListener('click', () => this.closeBook());

    // Lock toggle button
    const lockToggle = document.getElementById('lock-toggle');
    lockToggle?.addEventListener('click', () => this.handleLockToggle());

    // PIN settings button
    const pinSettings = document.getElementById('pin-settings');
    pinSettings?.addEventListener('click', () => this.showPinSettings());

    // Mode toggle buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = e.target.dataset.mode;
        this.switchMode(mode);
      });
    });

    // Page navigation
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    prevBtn?.addEventListener('click', () => this.navigatePage(-1));
    nextBtn?.addEventListener('click', () => this.navigatePage(1));

    // Save button
    const saveBtn = document.getElementById('save-entry');
    saveBtn?.addEventListener('click', () => this.saveEntry());
  }

  /**
   * Handles lock toggle button click
   */
  handleLockToggle() {
    const hasPin = !!this.app.state.data.journalPin;
    
    if (!hasPin) {
      // No PIN set - prompt to create one
      this.promptSetPin();
    } else if (this.isLocked) {
      // Currently locked - require PIN to unlock
      this.promptUnlock();
    } else {
      // Currently unlocked - lock it
      this.isLocked = true;
      this.app.state.data.journalLocked = true;
      this.app.state.saveAppData();
      this.app.showToast('Journal locked', 'info');
      this.renderJournal();
    }
  }

  /**
   * Attaches click handlers to mood buttons
   * @param {HTMLElement} container - Container element with mood buttons
   */
  attachMoodListeners(container) {
    container.querySelectorAll('.mood-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        container.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
      });
    });
  }

  // ============================================
  // ACHIEVEMENTS & GAMIFICATION
  // ============================================

  /**
   * Checks and grants achievements based on journal entry count
   */
  checkAchievements() {
    const total = this.app.state.data.journalEntries?.length || 0;
    const gm = this.app.gamification;
    if (!gm) return;

    const achievements = [
      { count: 1, id: 'first_journal', name: 'First Reflection', xp: 50, icon: '📔', 
        message: 'You\'ve begun your journey of self-reflection!' },
      { count: 10, id: 'journal_10', name: 'Reflective Writer', xp: 100, icon: '✏️', 
        message: '10 journal entries! Your self-awareness is growing!' },
      { count: 50, id: 'journal_50', name: 'Master Journaler', xp: 250, icon: '📖', 
        message: '50 entries! You are a master of introspection!' },
      { count: 100, id: 'journal_100', name: 'Chronicle Keeper', xp: 500, icon: '📚', 
        message: '100 journal entries! Your wisdom is documented!' }
    ];

    achievements.forEach(ach => {
      if (total === ach.count) {
        gm.grantAchievement({
          id: ach.id,
          name: ach.name,
          xp: ach.xp,
          icon: ach.icon,
          inspirational: ach.message
        });
      }
    });
  }

  // ============================================
  // MODAL SYSTEM
  // ============================================

  /**
   * Creates a standardized modal with consistent structure
   * @param {Object} options - Modal configuration
   * @returns {HTMLElement} Modal overlay element
   */
  createModal({ icon, title, content, onConfirm, cancelOnly = false }) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="neuro-modal">
        <div class="modal-header">
          <div class="modal-icon icon-small">${icon}</div>
          <h3 class="modal-title">${title}</h3>
        </div>
        ${content}
        <div class="modal-actions">
          <button class="btn modal-cancel">${cancelOnly ? 'Close' : 'Cancel'}</button>
          ${cancelOnly ? '' : '<button class="btn btn-primary modal-confirm">Confirm</button>'}
        </div>
      </div>`;

    document.body.appendChild(overlay);
    this.activeModals.push(overlay);

    // Cancel handler
    const cancel = () => this.closeModal(overlay);
    overlay.querySelector('.modal-cancel').onclick = cancel;

    // Confirm handler
    if (!cancelOnly && onConfirm) {
      overlay.querySelector('.modal-confirm').onclick = () => {
        const shouldClose = onConfirm(overlay);
        if (shouldClose !== false) {
          this.closeModal(overlay);
        }
      };
    }

    // Click outside to close
    overlay.onclick = (e) => {
      if (e.target === overlay) cancel();
    };

    // Escape key to close
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        cancel();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);

    return overlay;
  }

  /**
   * Closes and removes a modal with animation
   * @param {HTMLElement} modal - Modal overlay to close
   */
  closeModal(modal) {
    modal.style.opacity = '0';
    setTimeout(() => {
      modal.remove();
      this.activeModals = this.activeModals.filter(m => m !== modal);
    }, 200);
  }

  /**
   * Cleanup method - removes all active modals
   */
  cleanup() {
    this.activeModals.forEach(modal => modal.remove());
    this.activeModals = [];
  }

  // ============================================
  // HELPER METHODS
  // ============================================

  /**
   * Returns a random writing prompt
   * @returns {string} Random prompt text
   */
  getRandomPrompt() {
    return WRITING_PROMPTS[Math.floor(Math.random() * WRITING_PROMPTS.length)];
  }

  /**
   * Formats a date for display
   * @param {Date} date - Date object to format
   * @returns {string} Formatted date string
   */
  formatDate(date) {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Renders mood buttons HTML
   * @param {string|null} activeMood - Currently active mood ID
   * @returns {string} HTML string of mood buttons
   */
  renderMoodButtons(activeMood = null) {
    return MOOD_OPTIONS.map(m => 
      `<button class="mood-btn ${activeMood === m.id ? 'active' : ''}" 
              data-mood="${m.id}" 
              title="${m.title}">${m.emoji}</button>`
    ).join('');
  }

  /**
   * Gets emoji for a mood ID
   * @param {string} moodId - Mood identifier
   * @returns {string} Corresponding emoji
   */
  getMoodEmoji(moodId) {
    const mood = MOOD_OPTIONS.find(m => m.id === moodId);
    return mood ? mood.emoji : '';
  }

  /**
   * Escapes HTML to prevent XSS attacks
   * @param {string} text - Text to escape
   * @returns {string} HTML-safe text
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

export default JournalEngine;