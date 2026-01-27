// ============================================
// JOURNAL ENGINE – Secure Personal Journaling
// ============================================
import { NeumorphicModal } from '../Core/Modal.js';

/**
 * JournalEngine: Manages personal journaling functionality with mood tracking,
 * entry management, and lock/unlock features for privacy.
 */
class JournalEngine {
  // ===== CONSTANTS =====
  static ANIMATION_DURATION = 400;
  static ANIMATION_SHORT = 200;
  
  static MOODS = [
    {id:'happy',emoji:'😊',title:'Happy'}, {id:'joyful',emoji:'😄',title:'Joyful'}, 
    {id:'excited',emoji:'🤩',title:'Excited'}, {id:'loved',emoji:'🥰',title:'Loved'}, 
    {id:'grateful',emoji:'🙏',title:'Grateful'}, {id:'peaceful',emoji:'😌',title:'Peaceful'},
    {id:'calm',emoji:'🧘',title:'Calm'}, {id:'relaxed',emoji:'😎',title:'Relaxed'}, 
    {id:'proud',emoji:'😤',title:'Proud'}, {id:'confident',emoji:'💪',title:'Confident'}, 
    {id:'hopeful',emoji:'🌟',title:'Hopeful'}, {id:'inspired',emoji:'✨',title:'Inspired'},
    {id:'sad',emoji:'😢',title:'Sad'}, {id:'crying',emoji:'😭',title:'Crying'}, 
    {id:'lonely',emoji:'😔',title:'Lonely'}, {id:'disappointed',emoji:'😞',title:'Disappointed'}, 
    {id:'anxious',emoji:'😰',title:'Anxious'}, {id:'worried',emoji:'😟',title:'Worried'},
    {id:'stressed',emoji:'😫',title:'Stressed'}, {id:'overwhelmed',emoji:'🤯',title:'Overwhelmed'}, 
    {id:'angry',emoji:'😠',title:'Angry'}, {id:'frustrated',emoji:'😤',title:'Frustrated'}, 
    {id:'annoyed',emoji:'😒',title:'Annoyed'}, {id:'tired',emoji:'😴',title:'Tired'},
    {id:'sick',emoji:'🤒',title:'Sick'}, {id:'confused',emoji:'😕',title:'Confused'}, 
    {id:'surprised',emoji:'😲',title:'Surprised'}, {id:'shocked',emoji:'😱',title:'Shocked'}, 
    {id:'nervous',emoji:'😬',title:'Nervous'}, {id:'embarrassed',emoji:'😳',title:'Embarrassed'}
  ];

  static PROMPTS = [
    "What made you smile today?", 
    "What are you grateful for right now?", 
    "What's on your mind?",
    "How are you really feeling?", 
    "What would you like to remember about today?", 
    "What challenged you today?",
    "What did you learn about yourself?", 
    "What are you looking forward to?"
  ];

  constructor(app) {
    if (!app) throw new Error('JournalEngine requires app instance');
    this.app = app;
    this.currentPage = 0;
    this.viewMode = 'write'; // 'write' | 'read'
    this.isOpen = false;
    this.isLocked = false;
  }

  // ===== MAIN RENDER =====
  /**
   * Initializes and renders the journal tab structure
   */
  render() {
    const tab = this.getOrCreateTab();
    if (!tab) return;

    tab.innerHTML = `
    <div class="journal-container">
      <div class="universal-content">
        <header class="main-header project-curiosity"
                style="--header-img:url('https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/NavJournal.png');
                       --header-title:'';
                       --header-tag:'Your safe, private, secret space, to open up, vent and write down your emotions and thoughts'">
          <h1>My Personal Journal</h1>
          <h3>Your safe, private, secret space, to open up, vent and write down your emotions and thoughts</h3>
          <span class="header-sub"></span>
        </header>
        
        <div class="journal-book-wrapper" id="journal-wrapper">
          <!-- Dynamic content injected here -->
        </div>
      </div>
    </div>
    `;

    this.attachEventListeners();
    this.renderJournal();
  }

  /**
   * Gets existing tab or creates new one
   */
  getOrCreateTab() {
    let tab = document.getElementById('journal-tab');
    if (tab) return tab;

    const mainContent = document.getElementById('main-content');
    if (!mainContent) {
      console.error('JournalEngine: main-content element not found');
      return null;
    }

    tab = document.createElement('div');
    tab.id = 'journal-tab';
    tab.className = 'tab-content';
    mainContent.appendChild(tab);
    return tab;
  }

  // ===== JOURNAL STATE RENDERING =====
  /**
   * Renders closed or open journal state based on current state
   */
  renderJournal() {
    const wrapper = document.getElementById('journal-wrapper');
    if (!wrapper) return;

    this.isOpen ? this.renderOpenBook(wrapper) : this.renderClosedBook(wrapper);
  }

  /**
   * Renders the closed book cover with lock indicator
   */
  renderClosedBook(wrapper) {
    const hasPin = !!this.app.state?.data?.journalPin;
    const userName = this.app.state?.currentUser?.name || 'My';
    const lockIcon = hasPin && this.isLocked ? '🔒' : '';
    
    wrapper.innerHTML = `
      <div class="journal-closed" id="open-journal" style="opacity: 0; transform: scale(0.95);">
        <div class="journal-cover-title">${this.escapeHtml(userName)}'s<br>Personal Journal</div>
        <div class="journal-cover-subtitle">Tap to open and begin writing</div>
        <div class="journal-lock">${lockIcon}</div>
      </div>`;
    
    // Smooth fade-in animation
    const coverEl = wrapper.querySelector('.journal-closed');
    if (coverEl) {
      requestAnimationFrame(() => {
        coverEl.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        coverEl.style.opacity = '1';
        coverEl.style.transform = 'scale(1)';
      });
      
      coverEl.addEventListener('click', () => {
        hasPin && this.isLocked ? this.promptUnlock() : this.openBook();
      });
    }
  }

  /**
   * Renders the open journal interface with controls
   */
  renderOpenBook(wrapper) {
    const hasPin = !!this.app.state?.data?.journalPin;
    
    wrapper.innerHTML = `
      <div class="journal-book" style="opacity: 0; transform: scale(0.95);">
        <!-- Top Controls -->
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
          <div class="mode-toggle">
            <button class="journal-btn-neuro mode-btn active" data-mode="write">✏️ Write</button>
            <button class="journal-btn-neuro mode-btn" data-mode="read">📖 Read</button>
          </div>
          <div style="display:flex;gap:.5rem;align-items:center;">
            <button class="journal-btn-neuro lock-toggle-btn" id="lock-toggle">
              ${hasPin ? (this.isLocked ? '🔒 Lock Journal' : '🔓 Lock Journal') : '🔓 Lock Journal'}
            </button>
            ${hasPin ? '<button class="journal-btn-neuro" id="pin-settings" title="PIN Settings">⚙️</button>' : ''}
            <button class="journal-btn-neuro close-book-btn" id="close-journal">📕 Close</button>
          </div>
        </div>

        <!-- Pages Container -->
        <div class="journal-pages" id="journal-pages"></div>

        <!-- Navigation Controls -->
        <div class="journal-controls">
          <div class="journal-nav">
            <button class="journal-btn-neuro" id="prev-page" disabled>← Previous</button>
            <span class="page-indicator" id="page-indicator"></span>
            <button class="journal-btn-neuro" id="next-page" disabled>Next →</button>
          </div>
          <div style="display:flex;justify-content:center;margin-top:1rem;">
            <button class="journal-btn-neuro save-btn" id="save-entry" style="display:none;">💾 Save Entry</button>
          </div>
        </div>
      </div>`;

    // Smooth fade-in animation
    const bookEl = wrapper.querySelector('.journal-book');
    if (bookEl) {
      requestAnimationFrame(() => {
        bookEl.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        bookEl.style.opacity = '1';
        bookEl.style.transform = 'scale(1)';
      });
    }

    this.attachOpenEventListeners();
    this.renderCurrentView();
  }

  /**
   * Animates transition from closed to open state
   */
  openBook() {
    const coverEl = document.querySelector('.journal-closed');
    if (!coverEl) {
      this.isOpen = true;
      this.renderJournal();
      return;
    }

    // Animate cover closing
    coverEl.style.transition = 'opacity 0.4s ease-in, transform 0.4s ease-in';
    coverEl.style.opacity = '0';
    coverEl.style.transform = 'scale(0.9)';

    setTimeout(() => {
      this.isOpen = true;
      this.renderJournal();
    }, JournalEngine.ANIMATION_DURATION);
  }

  // ===== VIEW MODES =====
  /**
   * Renders the appropriate view based on current mode
   */
  renderCurrentView() {
    this.viewMode === 'write' ? this.renderWriteMode() : this.renderReadMode();
    this.updateNavigation();
  }

  /**
   * Renders write mode with mood selector and text area
   */
  renderWriteMode() {
    const pagesContainer = document.getElementById('journal-pages');
    const saveBtn = document.getElementById('save-entry');
    if (!pagesContainer) return;
    if (saveBtn) saveBtn.style.display = 'block';

    const randomPrompt = this.getRandomPrompt();

    pagesContainer.innerHTML = `
      <div class="journal-page write-mode">
        <div class="journal-date">${this.getFormattedDate()}</div>

        <textarea class="journal-textarea" id="journal-entry-text" 
                  placeholder="Dear Journal, ${randomPrompt}"></textarea>

        <div class="prompt-box">
          <div class="prompt-text">💭 Writing prompt: ${randomPrompt}</div>
        </div>

        <div class="mood-selector">
          <div class="mood-title">How are you feeling?</div>
          <div class="mood-grid">
            ${JournalEngine.MOODS.map(m => 
              `<button class="mood-btn" data-mood="${m.id}" title="${m.title}">
                ${m.emoji}
              </button>`
            ).join('')}
          </div>
        </div>
      </div>`;

    // Attach mood selector event listeners
    pagesContainer.querySelectorAll('.mood-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        pagesContainer.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
      });
    });
  }

  /**
   * Renders read mode showing existing entries with pagination
   */
  renderReadMode(animDirection = 'none') {
    const pagesContainer = document.getElementById('journal-pages');
    const saveBtn = document.getElementById('save-entry');
    if (!pagesContainer) return;
    if (saveBtn) saveBtn.style.display = 'none';

    const entries = this.app.state?.data?.journalEntries || [];
    
    if (entries.length === 0) {
      pagesContainer.innerHTML = `
        <div class="journal-page empty-state">
          <div class="empty-icon">📖</div>
          <div class="empty-title">No Journal Entries Yet</div>
          <div class="empty-text">Start writing to create your first entry!</div>
        </div>`;
      return;
    }

    const entry = entries[this.currentPage];
    if (!entry) return;

    const moodEmoji = this.getMoodEmoji(entry.mood);
    
    // Apply page-turn animation
    const animClass = animDirection !== 'none' ? `page-turn-${animDirection}` : '';
    
    pagesContainer.innerHTML = `
      <div class="journal-page read-mode ${animClass}">
        <div class="entry-header">
          <div class="entry-date">${entry.date || 'Unknown date'}</div>
          ${moodEmoji ? `<div class="entry-mood">${moodEmoji}</div>` : ''}
        </div>
        <div class="entry-text">${this.escapeHtml(entry.situation || entry.feelings || 'No content')}</div>
        <div class="entry-actions">
          <button class="journal-btn-neuro edit-entry-btn" data-index="${this.currentPage}">✏️ Edit</button>
          <button class="journal-btn-neuro delete-entry-btn" data-index="${this.currentPage}">🗑️ Delete</button>
        </div>
      </div>`;

    // Attach action buttons
    const editBtn = pagesContainer.querySelector('.edit-entry-btn');
    const deleteBtn = pagesContainer.querySelector('.delete-entry-btn');
    
    if (editBtn) editBtn.addEventListener('click', () => this.editEntry(this.currentPage));
    if (deleteBtn) deleteBtn.addEventListener('click', () => this.deleteEntry(this.currentPage));
  }

  // ===== EVENT LISTENERS =====
  /**
   * Attaches base event listeners (called once during render)
   */
  attachEventListeners() {
    // Event delegation handled in renderJournal
  }

  /**
   * Attaches event listeners for open book state
   */
  attachOpenEventListeners() {
    // Mode toggle
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = e.currentTarget.dataset.mode;
        if (mode === this.viewMode) return;
        
        this.viewMode = mode;
        this.currentPage = 0;
        
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.renderCurrentView();
      });
    });

    // Close button
    const closeBtn = document.getElementById('close-journal');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.isOpen = false;
        this.renderJournal();
      });
    }

    // Lock toggle
    const lockBtn = document.getElementById('lock-toggle');
    if (lockBtn) {
      lockBtn.addEventListener('click', () => {
        const hasPin = !!this.app.state?.data?.journalPin;
        if (!hasPin) {
          this.setupPin();
        } else {
          this.toggleLock();
        }
      });
    }

    // PIN settings
    const pinSettingsBtn = document.getElementById('pin-settings');
    if (pinSettingsBtn) {
      pinSettingsBtn.addEventListener('click', () => this.pinSettings());
    }

    // Save button
    const saveBtn = document.getElementById('save-entry');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => this.saveEntry());
    }

    // Navigation
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    
    if (prevBtn) prevBtn.addEventListener('click', () => this.prevPage());
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextPage());
  }

  // ===== LOCK SYSTEM =====
  /**
   * Sets up a new PIN for journal protection
   */
  setupPin() {
    NeumorphicModal.showInput(
      'Create a 4-digit PIN to protect your journal',
      (pin) => {
        if (!/^\d{4}$/.test(pin)) {
          this.app.showToast('⚠️ PIN must be exactly 4 digits', 'warning');
          return false;
        }
        
        NeumorphicModal.showInput(
          'Please confirm your PIN',
          (confirmPin) => {
            if (pin !== confirmPin) {
              this.app.showToast('⚠️ PINs do not match', 'warning');
              return false;
            }
            
            this.app.state.data.journalPin = pin;
            this.app.state.saveAppData();
            this.isLocked = false;
            this.app.showToast('🔒 Journal PIN created successfully', 'success');
            this.renderJournal();
            return true;
          },
          { 
            title: 'Confirm PIN', 
            icon: '🔒', 
            inputType: 'password',
            placeholder: 'Re-enter PIN'
          }
        );
        return true;
      },
      { 
        title: 'Set Journal PIN', 
        icon: '🔒', 
        inputType: 'password',
        placeholder: 'Enter 4-digit PIN'
      }
    );
  }

  /**
   * Prompts for PIN to unlock journal
   */
  promptUnlock() {
    NeumorphicModal.showInput(
      'Enter your PIN to unlock your journal',
      (pin) => {
        if (pin === this.app.state.data.journalPin) {
          this.isLocked = false;
          this.openBook();
          this.app.showToast('🔓 Journal unlocked', 'success');
          return true;
        } else {
          this.app.showToast('❌ Incorrect PIN', 'error');
          return false;
        }
      },
      { 
        title: 'Unlock Journal', 
        icon: '🔒', 
        inputType: 'password',
        placeholder: 'Enter PIN'
      }
    );
  }

  /**
   * Toggles lock state when journal is open
   */
  toggleLock() {
    if (this.isLocked) {
      // Unlock
      this.promptUnlock();
    } else {
      // Lock
      this.isLocked = true;
      this.isOpen = false;
      this.app.showToast('🔒 Journal locked', 'info');
      this.renderJournal();
    }
  }

  /**
   * Opens PIN management settings
   */
  pinSettings() {
    NeumorphicModal.showConfirm(
      'Do you want to change or remove your journal PIN?',
      () => {
        NeumorphicModal.showInput(
          'Enter your current PIN to continue',
          (pin) => {
            if (pin !== this.app.state.data.journalPin) {
              this.app.showToast('❌ Incorrect PIN', 'error');
              return false;
            }
            
            this.showPinOptions();
            return true;
          },
          { 
            title: 'Verify Identity', 
            icon: '🔒', 
            inputType: 'password',
            placeholder: 'Current PIN'
          }
        );
      },
      { 
        title: 'PIN Settings', 
        icon: '⚙️', 
        confirmText: 'Continue' 
      }
    );
  }

  /**
   * Shows change/remove PIN options after verification
   */
  showPinOptions() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="neuro-modal">
        <div class="modal-header">
          <div class="modal-icon icon-small">⚙️</div>
          <h3 class="modal-title">PIN Settings</h3>
        </div>
        <div class="modal-actions" style="flex-direction:column;gap:0.5rem;">
          <button class="btn btn-primary" id="change-pin">Change PIN</button>
          <button class="btn btn-danger" id="remove-pin">Remove PIN</button>
          <button class="btn modal-cancel">Cancel</button>
        </div>
      </div>`;
    
    document.body.appendChild(overlay);

    const close = () => {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), JournalEngine.ANIMATION_SHORT);
    };

    overlay.querySelector('#change-pin').onclick = () => {
      close();
      this.changePin();
    };

    overlay.querySelector('#remove-pin').onclick = () => {
      close();
      this.removePin();
    };

    overlay.querySelector('.modal-cancel').onclick = close;
    overlay.onclick = (e) => { if (e.target === overlay) close(); };
  }

  /**
   * Changes existing PIN to new one
   */
  changePin() {
    NeumorphicModal.showInput(
      'Enter your new 4-digit PIN',
      (newPin) => {
        if (!/^\d{4}$/.test(newPin)) {
          this.app.showToast('⚠️ PIN must be exactly 4 digits', 'warning');
          return false;
        }
        
        NeumorphicModal.showInput(
          'Confirm your new PIN',
          (confirmPin) => {
            if (newPin !== confirmPin) {
              this.app.showToast('⚠️ PINs do not match', 'warning');
              return false;
            }
            
            this.app.state.data.journalPin = newPin;
            this.app.state.saveAppData();
            this.app.showToast('✅ PIN changed successfully', 'success');
            return true;
          },
          { 
            title: 'Confirm New PIN', 
            icon: '🔒', 
            inputType: 'password',
            placeholder: 'Re-enter new PIN'
          }
        );
        return true;
      },
      { 
        title: 'Change PIN', 
        icon: '🔒', 
        inputType: 'password',
        placeholder: 'Enter new 4-digit PIN'
      }
    );
  }

  /**
   * Removes PIN protection from journal
   */
  removePin() {
    NeumorphicModal.showConfirm(
      'Are you sure you want to remove PIN protection? Your journal will be accessible without a PIN.',
      () => {
        delete this.app.state.data.journalPin;
        this.app.state.saveAppData();
        this.isLocked = false;
        this.app.showToast('🔓 PIN removed', 'info');
        this.renderJournal();
      },
      { 
        title: 'Remove PIN', 
        icon: '🔓', 
        confirmText: 'Remove', 
        isDanger: true 
      }
    );
  }

  // ===== PAGINATION =====
  /**
   * Navigates to previous entry
   */
  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.renderReadMode('left');
    }
  }

  /**
   * Navigates to next entry
   */
  nextPage() {
    const entries = this.app.state?.data?.journalEntries || [];
    if (this.currentPage < entries.length - 1) {
      this.currentPage++;
      this.renderReadMode('right');
    }
  }

  /**
   * Updates navigation button states
   */
  updateNavigation() {
    const entries = this.app.state?.data?.journalEntries || [];
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const indicator = document.getElementById('page-indicator');

    if (this.viewMode === 'write') {
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
      if (indicator) indicator.textContent = '';
    } else {
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

  // ===== ENTRY MANAGEMENT =====
  /**
   * Saves new journal entry with mood and timestamp
   */
  saveEntry() {
    const textArea = document.getElementById('journal-entry-text');
    const text = textArea?.value.trim();
    
    if (!text) {
      this.app.showToast('⚠️ Please write something in your journal', 'warning');
      return;
    }

    const activeMood = document.querySelector('.mood-btn.active');
    const mood = activeMood?.dataset.mood || null;

    const entry = {
      situation: text,
      feelings: '',
      mood: mood,
      timestamp: new Date().toISOString(),
      date: this.getFormattedDate()
    };

    // Save to state
    this.app.state.addEntry('journal', entry);
    
    // Update gamification
    if (this.app.gamification) {
      this.app.gamification.progressQuest('daily', 'journal_entry', 1);
      this.app.gamification.incrementJournalEntries();
    }
    
    this.app.showToast('✅ Journal entry saved!', 'success');

    // Clear form
    textArea.value = '';
    document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
    
    this.checkAchievements();

    // Auto-switch to read mode to show the new entry
    this.viewMode = 'read';
    this.currentPage = 0;
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-mode="read"]')?.classList.add('active');
    this.renderCurrentView();
  }

  /**
   * Opens edit modal for existing entry
   */
  editEntry(index) {
    const entries = this.app.state?.data?.journalEntries || [];
    const entry = entries[index];
    if (!entry) return;

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    overlay.innerHTML = `
      <div class="neuro-modal">
        <div class="modal-header">
          <div class="modal-icon icon-small">✏️</div>
          <h3 class="modal-title">Edit Journal Entry</h3>
        </div>
        <div class="modal-input-wrapper">
          <label class="form-label" style="color:var(--neuro-text);margin-bottom:.5rem;display:block;">
            How did you feel?
          </label>
          <div style="display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:1rem;">
            ${JournalEngine.MOODS.map(m => 
              `<button class="mood-btn ${entry.mood === m.id ? 'active' : ''}" data-mood="${m.id}">
                ${m.emoji}
              </button>`
            ).join('')}
          </div>
          <label class="form-label" style="color:var(--neuro-text);margin-bottom:.5rem;display:block;">
            Entry
          </label>
          <textarea id="edit-entry" class="form-input" rows="8" 
                    placeholder="Write your thoughts...">${this.escapeHtml(entry.situation || entry.feelings || '')}</textarea>
        </div>
        <div class="modal-actions">
          <button class="btn modal-cancel">Cancel</button>
          <button class="btn btn-primary modal-confirm">Save Changes</button>
        </div>
      </div>`;

    document.body.appendChild(overlay);
    const entryInput = overlay.querySelector('#edit-entry');

    // Mood selector
    overlay.querySelectorAll('.mood-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        overlay.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
      });
    });

    const close = () => {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), JournalEngine.ANIMATION_SHORT);
    };

    const save = () => {
      const newText = entryInput.value.trim();
      if (!newText) {
        this.app.showToast('⚠️ Please write something', 'warning');
        return;
      }
      
      const activeMood = overlay.querySelector('.mood-btn.active');
      const newMood = activeMood?.dataset.mood || null;

      // Update entry
      entries[index].situation = newText;
      entries[index].feelings = '';
      entries[index].mood = newMood;

      this.app.state.data.journalEntries = entries;
      this.app.state.saveAppData();
      this.app.showToast('✅ Journal entry updated!', 'success');
      this.renderCurrentView();
      close();
    };

    overlay.querySelector('.modal-cancel').onclick = close;
    overlay.querySelector('.modal-confirm').onclick = save;
    overlay.onclick = (e) => { if (e.target === overlay) close(); };

    // Escape key handler
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        close();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);

    setTimeout(() => entryInput.focus(), 100);
  }

  /**
   * Deletes an entry after confirmation
   */
  deleteEntry(index) {
    NeumorphicModal.showConfirm(
      'Are you sure you want to delete this journal entry? This action cannot be undone.',
      () => {
        const entries = this.app.state?.data?.journalEntries || [];
        entries.splice(index, 1);
        this.app.state.data.journalEntries = entries;
        this.app.state.saveAppData();
        this.app.showToast('🗑️ Journal entry deleted', 'info');
        
        // Adjust current page if needed
        if (this.currentPage >= entries.length) {
          this.currentPage = Math.max(0, entries.length - 1);
        }
        
        this.renderCurrentView();
      },
      { 
        title: 'Delete Journal Entry', 
        icon: '🗑️', 
        confirmText: 'Delete', 
        isDanger: true 
      }
    );
  }

  // ===== ACHIEVEMENTS =====
  /**
   * Checks and grants journal-related achievements
   */
  checkAchievements() {
    const total = this.app.state?.data?.journalEntries?.length || 0;
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

    achievements.forEach(achievement => {
      if (total === achievement.count) {
        gm.grantAchievement({
          id: achievement.id,
          name: achievement.name,
          xp: achievement.xp,
          icon: achievement.icon,
          inspirational: achievement.message
        });
      }
    });
  }

  // ===== UTILITY METHODS =====
  /**
   * Escapes HTML to prevent XSS attacks
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Gets a random writing prompt
   */
  getRandomPrompt() {
    return JournalEngine.PROMPTS[Math.floor(Math.random() * JournalEngine.PROMPTS.length)];
  }

  /**
   * Gets formatted current date
   */
  getFormattedDate() {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Gets emoji for mood ID
   */
  getMoodEmoji(moodId) {
    if (!moodId) return null;
    const mood = JournalEngine.MOODS.find(m => m.id === moodId);
    return mood?.emoji || null;
  }
}

export default JournalEngine;