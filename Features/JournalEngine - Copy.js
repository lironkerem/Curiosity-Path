// ============================================
// JOURNAL ENGINE – OPTIMIZED (Styles moved to CSS)
// ============================================
import { NeumorphicModal } from '../Core/Modal.js';

class JournalEngine {
  constructor(app) {
    this.app = app;
    this.currentPage = 0;
    this.viewMode = 'write'; // 'write' | 'read'
    this.isOpen = false; // book starts closed
  }

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
                style="--header-img:url('https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/NavJournal.png');
                       --header-title:'';
                       --header-tag:'Your safe, private, secret space, to open up, vent and write down your emotions and thoughts'">
          <h1>My Personal Journal</h1>
          <h3>Your safe, private, secret space, to open up, vent and write down your emotions and thoughts</h3>
          <span class="header-sub"></span>
        </header>
        
        <div class="journal-book-wrapper" id="journal-wrapper">
          <!-- content injected here -->
        </div>
      </div>
    </div>
    `;

    this.attachEventListeners();
    this.renderJournal();
  }

  /* --------------------------------------------------
     RENDERERS
  -------------------------------------------------- */
  renderJournal() {
    const wrapper = document.getElementById('journal-wrapper');
    if (!this.isOpen) {
      const userName = this.app.state.currentUser?.name || 'My';
      wrapper.innerHTML = `
        <div class="journal-closed" id="open-journal">
          <div class="journal-cover-title">${userName}'s<br>Personal Journal</div>
          <div class="journal-cover-subtitle">Tap to open and begin writing</div>
          <div class="journal-lock"></div>
        </div>`;
      wrapper.querySelector('#open-journal').addEventListener('click', () => {
        this.isOpen = true;
        this.renderJournal();
      });
    } else {
      wrapper.innerHTML = `
        <div class="journal-book">
          <!-- top bar -->
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
            <div class="mode-toggle">
              <button class="journal-btn mode-btn active" data-mode="write">✏️ Write</button>
              <button class="journal-btn mode-btn" data-mode="read">📖 Read</button>
            </div>
            <button class="journal-btn close-book-btn" id="close-journal">🔒 Close</button>
          </div>

          <div class="journal-pages" id="journal-pages"></div>

          <!-- controls -->
          <div class="journal-controls">
            <div class="journal-nav">
              <button class="nav-btn" id="prev-page" disabled>← Previous</button>
              <span class="page-indicator" id="page-indicator"></span>
              <button class="nav-btn" id="next-page" disabled>Next →</button>
            </div>
            <button class="journal-btn save-btn" id="save-entry" style="display:none;">Save Entry</button>
          </div>
        </div>`;

      const bookEl = wrapper.querySelector('.journal-book');
      bookEl.classList.add('book-opening');
      bookEl.addEventListener('animationend', () => bookEl.classList.remove('book-opening'), { once: true });

      this.attachOpenEventListeners();
      this.renderCurrentView();
    }
  }

  renderWriteMode() {
    const pagesContainer = document.getElementById('journal-pages');
    const saveBtn = document.getElementById('save-entry');
    if (saveBtn) saveBtn.style.display = 'block';

    const prompts = [
      "What made you smile today?", "What are you grateful for right now?", "What's on your mind?",
      "How are you really feeling?", "What would you like to remember about today?", "What challenged you today?",
      "What did you learn about yourself?", "What are you looking forward to?"
    ];
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];

    const moods = [
      {id:'happy',emoji:'😊',title:'Happy'}, {id:'joyful',emoji:'😄',title:'Joyful'}, {id:'excited',emoji:'🤩',title:'Excited'},
      {id:'loved',emoji:'🥰',title:'Loved'}, {id:'grateful',emoji:'🙏',title:'Grateful'}, {id:'peaceful',emoji:'😌',title:'Peaceful'},
      {id:'calm',emoji:'🧘',title:'Calm'}, {id:'relaxed',emoji:'😎',title:'Relaxed'}, {id:'proud',emoji:'😤',title:'Proud'},
      {id:'confident',emoji:'💪',title:'Confident'}, {id:'hopeful',emoji:'🌟',title:'Hopeful'}, {id:'inspired',emoji:'✨',title:'Inspired'},
      {id:'sad',emoji:'😢',title:'Sad'}, {id:'crying',emoji:'😭',title:'Crying'}, {id:'lonely',emoji:'😔',title:'Lonely'},
      {id:'disappointed',emoji:'😞',title:'Disappointed'}, {id:'anxious',emoji:'😰',title:'Anxious'}, {id:'worried',emoji:'😟',title:'Worried'},
      {id:'stressed',emoji:'😫',title:'Stressed'}, {id:'overwhelmed',emoji:'🤯',title:'Overwhelmed'}, {id:'angry',emoji:'😠',title:'Angry'},
      {id:'frustrated',emoji:'😤',title:'Frustrated'}, {id:'annoyed',emoji:'😒',title:'Annoyed'}, {id:'tired',emoji:'😴',title:'Tired'},
      {id:'sick',emoji:'🤒',title:'Sick'}, {id:'confused',emoji:'😕',title:'Confused'}, {id:'surprised',emoji:'😲',title:'Surprised'},
      {id:'shocked',emoji:'😱',title:'Shocked'}, {id:'nervous',emoji:'😬',title:'Nervous'}, {id:'embarrassed',emoji:'😳',title:'Embarrassed'}
    ];

    pagesContainer.innerHTML = `
      <div class="journal-page write-mode">
        <div class="journal-date">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>

        <textarea class="journal-textarea" id="journal-entry-text" placeholder="Dear Journal, ${randomPrompt}"></textarea>

        <div class="prompt-box">
          <div class="prompt-text">💭 Writing prompt: ${randomPrompt}</div>
        </div>

        <div class="prompt-box">
          <div class="prompt-text">Your Mood</div>
          <div class="journal-mood" style="margin-top:.6rem;">
            ${moods.map(m => `<button class="mood-btn" data-mood="${m.id}" title="${m.title}">${m.emoji}</button>`).join('')}
          </div>
        </div>
      </div>`;

    pagesContainer.querySelectorAll('.mood-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        pagesContainer.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
      });
    });
    this.updateNavigation();
  }

  renderReadMode(direction = 'none') {
    const pagesContainer = document.getElementById('journal-pages');
    const saveBtn = document.getElementById('save-entry');
    if (saveBtn) saveBtn.style.display = 'none';

    const entries = this.app.state.data.journalEntries || [];
    if (entries.length === 0) {
      pagesContainer.innerHTML = `
        <div class="journal-page">
          <div class="empty-journal">
            <div class="empty-journal-icon">📔</div>
            <p>Your journal is empty</p>
            <p style="font-size:.9rem;margin-top:.5rem;">Switch to Write mode to create your first entry</p>
          </div>
        </div>`;
      this.updateNavigation();
      return;
    }

    const sorted = [...entries].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const entry = sorted[this.currentPage];
    const originalIndex = entries.indexOf(entry);

    const moodEmojis = {
      happy:'😊', joyful:'😄', excited:'🤩', loved:'🥰', grateful:'🙏', peaceful:'😌', calm:'🧘', relaxed:'😎', proud:'😤', confident:'💪', hopeful:'🌟', inspired:'✨',
      sad:'😢', crying:'😭', lonely:'😔', disappointed:'😞', anxious:'😰', worried:'😟', stressed:'😫', overwhelmed:'🤯', angry:'😠', frustrated:'😤', annoyed:'😒',
      tired:'😴', sick:'🤒', confused:'😕', surprised:'😲', shocked:'😱', nervous:'😬', embarrassed:'😳'
    };

    const flipClass = direction === 'left' ? 'page-flip-left' : direction === 'right' ? 'page-flip-right' : '';
    pagesContainer.innerHTML = `
      <div class="journal-page read-mode ${flipClass}">
        <div class="entry-actions">
          <button class="action-btn" onclick="window.featuresManager.engines.journal.editEntry(${originalIndex})">✏️ Edit</button>
          <button class="action-btn" onclick="window.featuresManager.engines.journal.deleteEntry(${originalIndex})">🗑️ Delete</button>
        </div>
        <div class="journal-date">
          ${entry.mood ? moodEmojis[entry.mood] + ' ' : ''}
          ${entry.date || new Date(entry.timestamp).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        <div class="entry-content">${this.escapeHtml(entry.situation || entry.feelings || '')}</div>
      </div>`;
    this.updateNavigation();
  }

  /* --------------------------------------------------
     SMALL HELPERS
  -------------------------------------------------- */
  attachEventListeners() {}
  attachOpenEventListeners() {
    const closeBtn = document.getElementById('close-journal');
    if (closeBtn) closeBtn.addEventListener('click', () => this.closeBook());

    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.viewMode = e.target.dataset.mode;
        this.currentPage = 0;
        this.renderCurrentView();
      });
    });

    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    if (prevBtn) prevBtn.addEventListener('click', () => this.navigatePage(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => this.navigatePage(1));

    const saveBtn = document.getElementById('save-entry');
    if (saveBtn) saveBtn.addEventListener('click', () => this.saveEntry());
  }

  closeBook() {
    const bookEl = document.querySelector('.journal-book');
    if (!bookEl) { this.isOpen = false; this.renderJournal(); return; }
    bookEl.classList.add('book-closing');
    bookEl.addEventListener('animationend', () => {
      this.isOpen = false;
      this.renderJournal();
    }, { once: true });
  }

  renderCurrentView() {
    this.viewMode === 'write' ? this.renderWriteMode() : this.renderReadMode();
  }

  navigatePage(direction) {
    const entries = this.app.state.data.journalEntries || [];
    const maxPage = entries.length - 1;
    const newPage = this.currentPage + direction;
    if (newPage < 0 || newPage > maxPage) return;
    this.currentPage = newPage;
    this.renderReadMode(direction > 0 ? 'right' : 'left');
  }

  updateNavigation() {
    const entries = this.app.state.data.journalEntries || [];
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
      if (indicator) indicator.textContent = entries.length ? `Entry ${this.currentPage + 1} of ${entries.length}` : '';
    }
  }

  saveEntry() {
    const textArea = document.getElementById('journal-entry-text');
    const text = textArea?.value.trim();
    if (!text) { this.app.showToast('⚠️ Please write something in your journal', 'warning'); return; }

    const activeMood = document.querySelector('.mood-btn.active');
    const mood = activeMood?.dataset.mood || null;

    const entry = {
      situation: text,
      feelings: '',
      mood: mood,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    this.app.state.addEntry('journal', entry);
    if (this.app.gamification) {
      this.app.gamification.progressQuest('daily', 'journal_entry', 1);
      this.app.gamification.incrementJournalEntries();
    }
    this.app.showToast('✅ Journal entry saved!', 'success');

    textArea.value = '';
    document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
    this.checkAchievements();

    // auto-switch to read mode to show the new entry
    this.viewMode = 'read';
    this.currentPage = 0;
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-mode="read"]')?.classList.add('active');
    this.renderCurrentView();
  }

  editEntry(index) {
    const entries = this.app.state.data.journalEntries || [];
    const entry = entries[index];
    if (!entry) return;

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    const moods = [
      {id:'happy',emoji:'😊'}, {id:'joyful',emoji:'😄'}, {id:'excited',emoji:'🤩'}, {id:'loved',emoji:'🥰'}, {id:'grateful',emoji:'🙏'}, {id:'peaceful',emoji:'😌'},
      {id:'calm',emoji:'🧘'}, {id:'relaxed',emoji:'😎'}, {id:'proud',emoji:'😤'}, {id:'confident',emoji:'💪'}, {id:'hopeful',emoji:'🌟'}, {id:'inspired',emoji:'✨'},
      {id:'sad',emoji:'😢'}, {id:'crying',emoji:'😭'}, {id:'lonely',emoji:'😔'}, {id:'disappointed',emoji:'😞'}, {id:'anxious',emoji:'😰'}, {id:'worried',emoji:'😟'},
      {id:'stressed',emoji:'😫'}, {id:'overwhelmed',emoji:'🤯'}, {id:'angry',emoji:'😠'}, {id:'frustrated',emoji:'😤'}, {id:'annoyed',emoji:'😒'}, {id:'tired',emoji:'😴'},
      {id:'sick',emoji:'🤒'}, {id:'confused',emoji:'😕'}, {id:'surprised',emoji:'😲'}, {id:'shocked',emoji:'😱'}, {id:'nervous',emoji:'😬'}, {id:'embarrassed',emoji:'😳'}
    ];

    overlay.innerHTML = `
      <div class="neuro-modal">
        <div class="modal-header">
          <div class="modal-icon icon-small">✏️</div>
          <h3 class="modal-title">Edit Journal Entry</h3>
        </div>
        <div class="modal-input-wrapper">
          <label class="form-label" style="color:var(--neuro-text);margin-bottom:.5rem;display:block;">How did you feel?</label>
          <div style="display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:1rem;">
            ${moods.map(m => `<button class="mood-btn ${entry.mood === m.id ? 'active' : ''}" data-mood="${m.id}">${m.emoji}</button>`).join('')}
          </div>
          <label class="form-label" style="color:var(--neuro-text);margin-bottom:.5rem;display:block;">Entry</label>
          <textarea id="edit-entry" class="form-input" rows="8" placeholder="Write your thoughts...">${entry.situation || entry.feelings || ''}</textarea>
        </div>
        <div class="modal-actions">
          <button class="btn modal-cancel">Cancel</button>
          <button class="btn btn-primary modal-confirm">Save Changes</button>
        </div>
      </div>`;

    document.body.appendChild(overlay);
    const entryInput = overlay.querySelector('#edit-entry');

    overlay.querySelectorAll('.mood-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        overlay.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
      });
    });

    const close = () => {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 200);
    };
    const save = () => {
      const newText = entryInput.value.trim();
      if (!newText) { this.app.showToast('⚠️ Please write something', 'warning'); return; }
      const activeMood = overlay.querySelector('.mood-btn.active');
      const newMood = activeMood?.dataset.mood || null;

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
    overlay.onclick = e => { if (e.target === overlay) close(); };

    const escHandler = e => {
      if (e.key === 'Escape') {
        close();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
    setTimeout(() => entryInput.focus(), 100);
  }

  deleteEntry(index) {
    NeumorphicModal.showConfirm(
      'Are you sure you want to delete this journal entry? This action cannot be undone.',
      () => {
        const entries = this.app.state.data.journalEntries || [];
        entries.splice(index, 1);
        this.app.state.data.journalEntries = entries;
        this.app.state.saveAppData();
        this.app.showToast('🗑️ Journal entry deleted', 'info');
        if (this.currentPage >= entries.length) this.currentPage = Math.max(0, entries.length - 1);
        this.renderCurrentView();
      },
      { title: 'Delete Journal Entry', icon: '🗑️', confirmText: 'Delete', isDanger: true }
    );
  }

  checkAchievements() {
    const total = this.app.state.data.journalEntries?.length || 0;
    const gm = this.app.gamification;
    if (!gm) return;

    if (total === 1) gm.grantAchievement({ id: 'first_journal', name: 'First Reflection', xp: 50, icon: '📔', inspirational: 'You\'ve begun your journey of self-reflection!' });
    if (total === 10) gm.grantAchievement({ id: 'journal_10', name: 'Reflective Writer', xp: 100, icon: '✏️', inspirational: '10 journal entries! Your self-awareness is growing!' });
    if (total === 50) gm.grantAchievement({ id: 'journal_50', name: 'Master Journaler', xp: 250, icon: '📖', inspirational: '50 entries! You are a master of introspection!' });
    if (total === 100) gm.grantAchievement({ id: 'journal_100', name: 'Chronicle Keeper', xp: 500, icon: '📚', inspirational: '100 journal entries! Your wisdom is documented!' });
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

export default JournalEngine;