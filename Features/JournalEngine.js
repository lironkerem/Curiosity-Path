// ============================================
// JOURNAL ENGINE
// ============================================
import { NeumorphicModal } from '../Core/Modal.js';

class JournalEngine {
  constructor(app) {
    this.app = app;
  }

render() {
  let tab = document.getElementById('journal-tab');

  // create tab if it doesn't exist
  if (!tab) {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;
    tab = document.createElement('div');
    tab.id = 'journal-tab';
    tab.className = 'tab-content';
    mainContent.appendChild(tab);
  }

  tab.innerHTML = `
  <div style="padding:1.5rem;min-height:100vh;">
    <div class="universal-content">

<!--  MOBILE-ONLY IMAGE + SUBTITLE HEADER  -->
      <header class="main-header project-curiosity"
              style="--header-img:url('https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/NavJournal.png');
                     --header-title:'';
                     --header-tag:'Your safe, private, secret space, to open up, vent and write down your emotions and thoughts'">
        <h1>My Personal Journal</h1>
        <h3>Your safe, private, secret space, to open up, vent and write down your emotions and thoughts</h3>
        <span class="header-sub"></span>
      </header>
      
      <div class="card">
        <h3 style="color: var(--neuro-text); font-size: 1.5rem; font-weight: bold; margin-bottom: 1.5rem;">📝 My Personal, Private Journal</h3>
        
        <div class="space-y-4">
          <div>
            <label class="form-label">What happened today?</label>
            <textarea 
              id="flip-journal-situation" 
              class="form-input w-full min-h-[140px]"
              placeholder="Describe the situation..."
            ></textarea>
          </div>

          <div>
            <label class="form-label">How did it make you feel?</label>
            <textarea 
              id="flip-journal-feelings" 
              class="form-input w-full min-h-[140px]"
              placeholder="Express your emotions..."
            ></textarea>
          </div>

          <button id="flip-journal-btn" class="btn btn-primary w-full">
            Save This Journal Entry
          </button>
        </div>

        <!-- Journal Entries List -->
        <div style="margin-top: 2rem;">
          <h3 class="text-xl font-bold" style="color: var(--neuro-text);margin-bottom: 1rem;">My Saved Entries</h3>
          <ul id="flip-journal-list" class="space-y-3"></ul>
        </div>
      </div>

    </div>
  </div>
`;

    this.attachEventListeners();
    this.loadJournalEntries();
  }

  attachEventListeners() {
    const addBtn = document.getElementById('flip-journal-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.saveEntry());
    }
  }

  saveEntry() {
    const situationInput = document.getElementById('flip-journal-situation');
    const feelingsInput = document.getElementById('flip-journal-feelings');
    
    const situation = situationInput?.value.trim();
    const feelings = feelingsInput?.value.trim();

    // Validation
    if (!situation && !feelings) {
      this.app.showToast('⚠️ Please write something in your journal', 'warning');
      return;
    }

    // Create journal entry
    const entry = {
      situation: situation || '',
      feelings: feelings || '',
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    };

    // Save to app state
    this.app.state.addEntry('journal', entry);

    // Quest integration
    if (this.app.gamification) {
      this.app.gamification.progressQuest('daily', 'journal_entry', 1);
    }

// count this new entry in the gamification engine
if (window.app?.gamification) window.app.gamification.incrementJournalEntries();
 
   // Show success message
    this.app.showToast('✅ Journal entry saved!', 'success');

    // Clear inputs
    if (situationInput) situationInput.value = '';
    if (feelingsInput) feelingsInput.value = '';

    // Reload entries display
    this.loadJournalEntries();

    // Check for achievements
    this.checkAchievements();
  }

  loadJournalEntries() {
    const listContainer = document.getElementById('flip-journal-list');
    if (!listContainer) return;

    // Get all journal entries from state
    const entries = this.app.state.data.journalEntries || [];
    
    if (entries.length === 0) {
      listContainer.innerHTML = `
        <li class="text-center py-8" style="color: var(--neuro-text-light);">
          <p class="text-4xl" style="margin-bottom: 0.5rem;">📓</p>
          <p>No journal entries yet. Start writing, sharing, venting, saving...</p>
        </li>
      `;
      return;
    }

    // Sort by most recent first
    const sortedEntries = [...entries].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );

    // Display entries (show latest 20)
    listContainer.innerHTML = sortedEntries.slice(0, 20).map((entry, index) => {
      const originalIndex = entries.indexOf(entry);
      return `
        <li class="card p-4" style="background: rgba(102, 126, 234, 0.05); border-left: 4px solid var(--neuro-accent);">
          <div class="flex justify-between items-start" style="margin-bottom: 0.5rem;">
            <span class="text-sm font-semibold" style="color: var(--neuro-accent);">
              ${entry.date || new Date(entry.timestamp).toLocaleDateString()}
            </span>
            <div class="flex gap-2">
              <button onclick="window.featuresManager.engines.journal.editEntry(${originalIndex})" 
                      class="text-sm hover:text-blue-400" 
                      title="Edit">
                ✏️
              </button>
              <button onclick="window.featuresManager.engines.journal.deleteEntry(${originalIndex})" 
                      class="text-sm hover:text-red-400" 
                      title="Delete">
                🗑️
              </button>
            </div>
          </div>
          ${entry.situation ? `
            <div style="margin-bottom: 0.5rem;">
              <p class="text-xs font-semibold" style="color: var(--neuro-text-light);margin-bottom: 0.25rem;">Situation:</p>
              <p style="color: var(--neuro-text);">${this.escapeHtml(entry.situation)}</p>
            </div>
          ` : ''}
          ${entry.feelings ? `
            <div>
              <p class="text-xs font-semibold" style="color: var(--neuro-text-light);margin-bottom: 0.25rem;">Feelings:</p>
              <p style="color: var(--neuro-text);">${this.escapeHtml(entry.feelings)}</p>
            </div>
          ` : ''}
        </li>
      `;
    }).join('');

    if (entries.length > 20) {
      listContainer.innerHTML += `
        <li class="text-center py-4" style="color: var(--neuro-text-light);">
          <p class="text-sm">Showing 20 most recent entries (${entries.length} total)</p>
        </li>
      `;
    }
  }

  editEntry(index) {
    const entries = this.app.state.data.journalEntries || [];
    const entry = entries[index];
    
    if (!entry) return;

    // Create a modal with both fields
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    overlay.innerHTML = `
      <div class="neuro-modal">
        <div class="modal-header">
          <div class="modal-icon icon-small">✏️</div>
          <h3 class="modal-title">Edit Journal Entry</h3>
        </div>
        <div class="modal-input-wrapper">
          <label class="form-label" style="color: var(--neuro-text); margin-bottom: 0.5rem; display: block;">What happened?</label>
          <textarea id="edit-situation" class="form-input" rows="4" placeholder="Describe the situation...">${entry.situation || ''}</textarea>
          
          <label class="form-label" style="color: var(--neuro-text); margin-top: 1rem; margin-bottom: 0.5rem; display: block;">How did you feel?</label>
          <textarea id="edit-feelings" class="form-input" rows="4" placeholder="Express your emotions...">${entry.feelings || ''}</textarea>
        </div>
        <div class="modal-actions">
          <button class="btn modal-cancel">Cancel</button>
          <button class="btn btn-primary modal-confirm">Save Changes</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const situationInput = overlay.querySelector('#edit-situation');
    const feelingsInput = overlay.querySelector('#edit-feelings');

    const close = () => {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 200);
    };

    const save = () => {
      const newSituation = situationInput.value.trim();
      const newFeelings = feelingsInput.value.trim();

      if (!newSituation && !newFeelings) {
        this.app.showToast('⚠️ Please write something', 'warning');
        return;
      }

      // Update entry
      entries[index].situation = newSituation;
      entries[index].feelings = newFeelings;
      
      this.app.state.data.journalEntries = entries;
      this.app.state.saveAppData();
      
      this.app.showToast('✅ Journal entry updated!', 'success');
      this.loadJournalEntries();
      close();
    };

    overlay.querySelector('.modal-cancel').onclick = close;
    overlay.querySelector('.modal-confirm').onclick = save;
    overlay.onclick = (e) => {
      if (e.target === overlay) close();
    };

    // Escape key to close
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        close();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);

    // Focus first input
    setTimeout(() => situationInput.focus(), 100);
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
        this.loadJournalEntries();
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

    // First journal entry
    if (total === 1) {
      gm.grantAchievement({ 
        id: 'first_journal', 
        name: 'First Reflection', 
        xp: 50, 
        icon: '📝', 
        inspirational: 'You\'ve begun your journey of self-reflection!' 
      });
    }

    // 10 journal entries
    if (total === 10) {
      gm.grantAchievement({ 
        id: 'journal_10', 
        name: 'Reflective Writer', 
        xp: 100, 
        icon: '✍️', 
        inspirational: '10 journal entries! Your self-awareness is growing!' 
      });
    }

    // 50 journal entries
    if (total === 50) {
      gm.grantAchievement({ 
        id: 'journal_50', 
        name: 'Master Journaler', 
        xp: 250, 
        icon: '📖', 
        inspirational: '50 entries! You are a master of introspection!' 
      });
    }

    // 100 journal entries
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