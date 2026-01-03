// ============================================
// JOURNAL ENGINE - REDESIGNED
// ============================================
import { NeumorphicModal } from '../Core/Modal.js';

class JournalEngine {
  constructor(app) {
    this.app = app;
    this.currentPage = 0;
    this.viewMode = 'write'; // 'write' or 'read'
    this.isOpen = false; // Journal starts closed
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
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Kalam:wght@300;400;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
      
      .journal-container {
        min-height: 100vh;
        padding: 1.5rem;
      }
      
      .journal-book-wrapper {
        max-width: 900px;
        margin: 2rem auto;
        perspective: 2000px;
      }
      
      .journal-closed {
        background: linear-gradient(135deg, #8b4513 0%, #5d2e0f 100%);
        padding: 3rem 2rem;
        border-radius: 12px;
        box-shadow: 0 15px 50px rgba(0,0,0,0.4);
        cursor: pointer;
        transition: all 0.3s;
        position: relative;
        min-height: 500px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-image: 
          repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px),
          repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px);
      }
      
      .journal-closed:hover {
        transform: translateY(-5px);
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
      }
      
      .journal-closed::before {
        content: '';
        position: absolute;
        top: 15px;
        left: 15px;
        right: 15px;
        bottom: 15px;
        border: 3px solid rgba(139, 69, 19, 0.3);
        border-radius: 8px;
      }
      
      .journal-cover-title {
        font-family: 'Crimson Text', serif;
        font-size: 2.5rem;
        font-weight: 700;
        color: #d4af37;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        margin-bottom: 1rem;
        text-align: center;
      }
      
      .journal-cover-subtitle {
        font-family: 'Crimson Text', serif;
        font-size: 1.2rem;
        color: #c9a961;
        font-style: italic;
        text-align: center;
      }
      
      .journal-lock {
        width: 60px;
        height: 80px;
        background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%);
        border-radius: 8px;
        margin-top: 2rem;
        position: relative;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      }
      
      .journal-lock::before {
        content: '🔒';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 2rem;
      }
      
      .journal-book {
        background: linear-gradient(135deg, #8b7355 0%, #6b5444 100%);
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        position: relative;
        animation: bookOpen 0.6s ease-out;
      }
      
      @keyframes bookOpen {
        from {
          opacity: 0;
          transform: perspective(1000px) rotateY(-30deg) scale(0.9);
        }
        to {
          opacity: 1;
          transform: perspective(1000px) rotateY(0) scale(1);
        }
      }
      
      .journal-book::before {
        content: '';
        position: absolute;
        top: 10px;
        left: 10px;
        right: 10px;
        bottom: 10px;
        border: 2px solid rgba(139, 115, 85, 0.4);
        border-radius: 4px;
        pointer-events: none;
      }
      
      .journal-pages {
        background: #fefae8;
        border-radius: 4px;
        min-height: 500px;
        box-shadow: inset 0 2px 8px rgba(0,0,0,0.1);
        position: relative;
        overflow: hidden;
      }
      
      .journal-page {
        padding: 2.5rem 2.5rem 2.5rem 100px;
        background-image: 
          repeating-linear-gradient(
            transparent,
            transparent 31px,
            rgba(139, 115, 85, 0.1) 31px,
            rgba(139, 115, 85, 0.1) 32px
          );
        min-height: 500px;
        position: relative;
      }
      
      .journal-page::before {
        content: '';
        position: absolute;
        left: 80px;
        top: 0;
        bottom: 0;
        width: 2px;
        background: rgba(220, 53, 69, 0.3);
      }
      
      .write-mode .journal-textarea {
        width: 100%;
        background: transparent;
        border: none;
        font-family: 'Kalam', cursive;
        font-size: 1.1rem;
        color: #2c1810;
        line-height: 32px;
        resize: none;
        outline: none;
        min-height: 350px;
      }
      
      .write-mode .journal-textarea::placeholder {
        color: rgba(44, 24, 16, 0.3);
        font-style: italic;
      }
      
      .read-mode .entry-content {
        font-family: 'Kalam', cursive;
        font-size: 1.1rem;
        color: #2c1810;
        line-height: 32px;
        white-space: pre-wrap;
      }
      
      .journal-date {
        font-family: 'Crimson Text', serif;
        font-size: 0.95rem;
        color: #8b7355;
        font-style: italic;
        margin-bottom: 1.5rem;
      }
      
      .journal-mood {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
        margin-bottom: 1.5rem;
      }
      
      .mood-btn {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        border: 2px solid transparent;
        background: rgba(139, 115, 85, 0.1);
        cursor: pointer;
        font-size: 1.3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
      }
      
      .mood-btn:hover {
        transform: scale(1.15);
        background: rgba(139, 115, 85, 0.15);
      }
      
      .mood-btn.active {
        border-color: #8b7355;
        background: rgba(139, 115, 85, 0.25);
        transform: scale(1.2);
        box-shadow: 0 2px 8px rgba(139, 115, 85, 0.3);
      }
      
      .journal-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 1.5rem;
        padding: 0 1rem;
        flex-wrap: wrap;
        gap: 1rem;
      }
      
      .journal-nav {
        display: flex;
        gap: 1rem;
        align-items: center;
      }
      
      .nav-btn {
        background: rgba(139, 115, 85, 0.2);
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        font-family: 'Crimson Text', serif;
        color: #2c1810;
        transition: all 0.2s;
      }
      
      .nav-btn:hover:not(:disabled) {
        background: rgba(139, 115, 85, 0.3);
      }
      
      .nav-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }
      
      .page-indicator {
        font-family: 'Crimson Text', serif;
        color: #8b7355;
        font-size: 0.9rem;
      }
      
      .mode-toggle {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
      }
      
      .mode-btn {
        padding: 0.5rem 1.2rem;
        background: rgba(254, 250, 232, 0.5);
        border: 2px solid transparent;
        border-radius: 4px;
        cursor: pointer;
        font-family: 'Crimson Text', serif;
        color: #2c1810;
        transition: all 0.2s;
      }
      
      .mode-btn.active {
        background: #fefae8;
        border-color: #8b7355;
      }
      
      .save-btn {
        padding: 0.6rem 1.5rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        border-radius: 4px;
        color: white;
        font-family: 'Crimson Text', serif;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .save-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      }
      
      .close-book-btn {
        padding: 0.5rem 1.2rem;
        background: rgba(139, 69, 19, 0.3);
        border: none;
        border-radius: 4px;
        color: #2c1810;
        font-family: 'Crimson Text', serif;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .close-book-btn:hover {
        background: rgba(139, 69, 19, 0.4);
      }
      
      .empty-journal {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 400px;
        font-family: 'Crimson Text', serif;
        color: #8b7355;
      }
      
      .empty-journal-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
      }
      
      .quick-prompts {
        margin-top: 1rem;
        padding: 1rem;
        background: rgba(139, 115, 85, 0.05);
        border-radius: 4px;
        border-left: 3px solid #8b7355;
      }
      
      .prompt-text {
        font-family: 'Crimson Text', serif;
        font-style: italic;
        color: #8b7355;
        font-size: 0.95rem;
      }
      
      .entry-actions {
        position: absolute;
        top: 1rem;
        right: 1rem;
        display: flex;
        gap: 0.5rem;
      }
      
      .action-btn {
        background: rgba(139, 115, 85, 0.1);
        border: none;
        padding: 0.4rem 0.8rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.2s;
      }
      
      .action-btn:hover {
        background: rgba(139, 115, 85, 0.2);
      }
      
      .page-flip-left {
        animation: pageFlipLeft 0.5s ease-out;
      }
      
      .page-flip-right {
        animation: pageFlipRight 0.5s ease-out;
      }
      
      @keyframes pageFlipLeft {
        0% {
          opacity: 0;
          transform: perspective(1000px) rotateY(30deg);
        }
        100% {
          opacity: 1;
          transform: perspective(1000px) rotateY(0);
        }
      }
      
      @keyframes pageFlipRight {
        0% {
          opacity: 0;
          transform: perspective(1000px) rotateY(-30deg);
        }
        100% {
          opacity: 1;
          transform: perspective(1000px) rotateY(0);
        }
      }
    </style>

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
          <!-- Content will be rendered here -->
        </div>
      </div>
    </div>
    `;

    this.attachEventListeners();
    this.renderJournal();
  }

  renderJournal() {
    const wrapper = document.getElementById('journal-wrapper');
    
    if (!this.isOpen) {
      wrapper.innerHTML = `
        <div class="journal-closed" id="open-journal">
          <div class="journal-cover-title">My Personal Journal</div>
          <div class="journal-cover-subtitle">Click to open and begin writing</div>
          <div class="journal-lock"></div>
        </div>
      `;
      
      document.getElementById('open-journal').addEventListener('click', () => {
        this.isOpen = true;
        this.renderJournal();
      });
    } else {
      wrapper.innerHTML = `
        <div class="journal-book">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <div class="mode-toggle">
              <button class="mode-btn active" data-mode="write">✍️ Write</button>
              <button class="mode-btn" data-mode="read">📖 Read</button>
            </div>
            <button class="close-book-btn" id="close-journal">🔒 Close Journal</button>
          </div>
          
          <div class="journal-pages" id="journal-pages">
            <!-- Content will be rendered here -->
          </div>
          
          <div class="journal-controls">
            <div class="journal-nav">
              <button class="nav-btn" id="prev-page" disabled>← Previous</button>
              <span class="page-indicator" id="page-indicator"></span>
              <button class="nav-btn" id="next-page" disabled>Next →</button>
            </div>
            
            <button class="save-btn" id="save-entry" style="display:none;">Save Entry</button>
          </div>
        </div>
      `;
      
      this.attachOpenEventListeners();
      this.renderCurrentView();
    }
  }

  attachEventListeners() {
    // Initial render handles closed book
  }

  attachOpenEventListeners() {
    // Close journal button
    const closeBtn = document.getElementById('close-journal');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.isOpen = false;
        this.renderJournal();
      });
    }

    // Mode toggle
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.viewMode = e.target.dataset.mode;
        this.currentPage = 0;
        this.renderCurrentView();
      });
    });

    // Navigation
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    
    if (prevBtn) prevBtn.addEventListener('click', () => this.navigatePage(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => this.navigatePage(1));

    // Save button
    const saveBtn = document.getElementById('save-entry');
    if (saveBtn) saveBtn.addEventListener('click', () => this.saveEntry());
  }

  renderCurrentView() {
    if (this.viewMode === 'write') {
      this.renderWriteMode();
    } else {
      this.renderReadMode();
    }
  }

  renderWriteMode() {
    const pagesContainer = document.getElementById('journal-pages');
    const saveBtn = document.getElementById('save-entry');
    
    if (saveBtn) saveBtn.style.display = 'block';
    
    const prompts = [
      "What made you smile today?",
      "What are you grateful for right now?",
      "What's on your mind?",
      "How are you really feeling?",
      "What would you like to remember about today?",
      "What challenged you today?",
      "What did you learn about yourself?",
      "What are you looking forward to?"
    ];
    
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    
    // Extended mood emojis
    const moods = [
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
      { id: 'tired', emoji: '😴', title: 'Tired' },
      { id: 'sick', emoji: '🤒', title: 'Sick' },
      { id: 'confused', emoji: '😕', title: 'Confused' },
      { id: 'surprised', emoji: '😲', title: 'Surprised' },
      { id: 'shocked', emoji: '😱', title: 'Shocked' },
      { id: 'nervous', emoji: '😬', title: 'Nervous' },
      { id: 'embarrassed', emoji: '😳', title: 'Embarrassed' }
    ];
    
    pagesContainer.innerHTML = `
      <div class="journal-page write-mode">
        <div class="journal-date">${new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</div>
        
        <div class="journal-mood">
          ${moods.map(mood => `
            <button class="mood-btn" data-mood="${mood.id}" title="${mood.title}">${mood.emoji}</button>
          `).join('')}
        </div>
        
        <textarea 
          class="journal-textarea" 
          id="journal-entry-text"
          placeholder="Dear Journal, ${randomPrompt}"
        ></textarea>
        
        <div class="quick-prompts">
          <div class="prompt-text">💭 Writing prompt: ${randomPrompt}</div>
        </div>
      </div>
    `;
    
    // Mood selection
    document.querySelectorAll('.mood-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
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
            <p style="font-size:0.9rem;margin-top:0.5rem;">Switch to Write mode to create your first entry</p>
          </div>
        </div>
      `;
      this.updateNavigation();
      return;
    }
    
    const sortedEntries = [...entries].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    const entry = sortedEntries[this.currentPage];
    const originalIndex = entries.indexOf(entry);
    
    const moodEmojis = {
      happy: '😊', joyful: '😄', excited: '🤩', loved: '🥰', grateful: '🙏',
      peaceful: '😌', calm: '🧘', relaxed: '😎', proud: '😤', confident: '💪',
      hopeful: '🌟', inspired: '✨', sad: '😢', crying: '😭', lonely: '😔',
      disappointed: '😞', anxious: '😰', worried: '😟', stressed: '😫',
      overwhelmed: '🤯', angry: '😠', frustrated: '😤', annoyed: '😒',
      tired: '😴', sick: '🤒', confused: '😕', surprised: '😲', shocked: '😱',
      nervous: '😬', embarrassed: '😳'
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
          ${entry.date || new Date(entry.timestamp).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
          })}
        </div>
        
        <div class="entry-content">${this.escapeHtml(entry.situation || entry.feelings || '')}</div>
      </div>
    `;
    
    this.updateNavigation();
  }

  navigatePage(direction) {
    const entries = this.app.state.data.journalEntries || [];
    const maxPage = entries.length - 1;
    
    const newPage = this.currentPage + direction;
    if (newPage < 0 || newPage > maxPage) return;
    
    this.currentPage = newPage;
    
    // Add page flip animation based on direction
    const flipDirection = direction > 0 ? 'right' : 'left';
    this.renderReadMode(flipDirection);
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
      if (indicator) {
        indicator.textContent = entries.length > 0 ? `Entry ${this.currentPage + 1} of ${entries.length}` : '';
      }
    }
  }

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
      date: new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    
    this.app.state.addEntry('journal', entry);
    
    if (this.app.gamification) {
      this.app.gamification.progressQuest('daily', 'journal_entry', 1);
    }
    
    if (window.app?.gamification) {
      window.app.gamification.incrementJournalEntries();
    }
    
    this.app.showToast('✅ Journal entry saved!', 'success');
    
    if (textArea) textArea.value = '';
    document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
    
    this.checkAchievements();
    
    // Switch to read mode to show the new entry
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
      { id: 'happy', emoji: '😊' }, { id: 'joyful', emoji: '😄' }, { id: 'excited', emoji: '🤩' },
      { id: 'loved', emoji: '🥰' }, { id: 'grateful', emoji: '🙏' }, { id: 'peaceful', emoji: '😌' },
      { id: 'calm', emoji: '🧘' }, { id: 'relaxed', emoji: '😎' }, { id: 'proud', emoji: '😤' },
      { id: 'confident', emoji: '💪' }, { id: 'hopeful', emoji: '🌟' }, { id: 'inspired', emoji: '✨' },
      { id: 'sad', emoji: '😢' }, { id: 'crying', emoji: '😭' }, { id: 'lonely', emoji: '😔' },
      { id: 'disappointed', emoji: '😞' }, { id: 'anxious', emoji: '😰' }, { id: 'worried', emoji: '😟' },
      { id: 'stressed', emoji: '😫' }, { id: 'overwhelmed', emoji: '🤯' }, { id: 'angry', emoji: '😠' },
      { id: 'frustrated', emoji: '😤' }, { id: 'annoyed', emoji: '😒' }, { id: 'tired', emoji: '😴' },
      { id: 'sick', emoji: '🤒' }, { id: 'confused', emoji: '😕' }, { id: 'surprised', emoji: '😲' },
      { id: 'shocked', emoji: '😱' }, { id: 'nervous', emoji: '😬' }, { id: 'embarrassed', emoji: '😳' }
    ];
    
    overlay.innerHTML = `
      <div class="neuro-modal">
        <div class="modal-header">
          <div class="modal-icon icon-small">✏️</div>
          <h3 class="modal-title">Edit Journal Entry</h3>
        </div>
        <div class="modal-input-wrapper">
          <label class="form-label" style="color: var(--neuro-text); margin-bottom: 0.5rem; display: block;">How did you feel?</label>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
            ${moods.map(mood => `
              <button class="mood-btn ${entry.mood === mood.id ? 'active' : ''}" data-mood="${mood.id}">${mood.emoji}</button>
            `).join('')}
          </div>
          
          <label class="form-label" style="color: var(--neuro-text); margin-bottom: 0.5rem; display: block;">Entry</label>
          <textarea id="edit-entry" class="form-input" rows="8" placeholder="Write your thoughts...">${entry.situation || entry.feelings || ''}</textarea>
        </div>
        <div class="modal-actions">
          <button class="btn modal-cancel">Cancel</button>
          <button class="btn btn-primary modal-confirm">Save Changes</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const entryInput = overlay.querySelector('#edit-entry');
    
    overlay.querySelectorAll('.mood-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
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

      if (!newText) {
        this.app.showToast('⚠️ Please write something', 'warning');
        return;
      }
      
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
    overlay.onclick = (e) => {
      if (e.target === overlay) close();
    };

    const escHandler = (e) => {
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

  checkAchievements() {
    const total = this.app.state.data.journalEntries?.length || 0;
    const gm = this.app.gamification;

    if (!gm) return;

    if (total === 1) {
      gm.grantAchievement({ 
        id: 'first_journal', 
        name: 'First Reflection', 
        xp: 50, 
        icon: '📝', 
        inspirational: 'You\'ve begun your journey of self-reflection!' 
      });
    }

    if (total === 10) {
      gm.grantAchievement({ 
        id: 'journal_10', 
        name: 'Reflective Writer', 
        xp: 100, 
        icon: '✍️', 
        inspirational: '10 journal entries! Your self-awareness is growing!' 
      });
    }

    if (total === 50) {
      gm.grantAchievement({ 
        id: 'journal_50', 
        name: 'Master Journaler', 
        xp: 250, 
        icon: '📖', 
        inspirational: '50 entries! You are a master of introspection!' 
      });
    }

    if (total === 100) {
      gm.grantAchievement({ 
        id: 'journal_100', 
        name: 'Chronicle Keeper', 
        xp: 500, 
        icon: '📚', 
        inspirational: '100 journal entries! Your wisdom is documented!' 
      });
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

export default JournalEngine;