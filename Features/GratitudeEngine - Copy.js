// Features/GratitudeEngine.js

import { NeumorphicModal } from '../Core/Modal.js';

export default class GratitudeEngine {
  static TYPE = 'gratitude';

  constructor(app) {
    this.app = app;
    this.maxEntries = 10;
    this.cachedEntries = null;
    this.gratitudeCount = 1;
  }

  /* ----------  data helpers  ---------- */
  getAllEntries() {
    const original = this.app.state.data.gratitudeEntries || [];
    const cleaned = original.filter(day => day.entries && day.entries.length > 0);

    // Only save if we actually removed something
    if (cleaned.length !== original.length) {
      this.app.state.data.gratitudeEntries = cleaned;
      this.app.state.saveAppData();
    }

    // Cache and return sorted
    this.cachedEntries = cleaned.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return this.cachedEntries;
  }

  getTodayTotal() {
    const today = this.app.state.getTodayEntries(GratitudeEngine.TYPE);
    return today.reduce((sum, entry) => sum + entry.entries.length, 0);
  }

  /* ----------  security  ---------- */
  escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, m => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[m]));
  }

  /* ----------  parse gratitudes from textarea  ---------- */
  parseGratitudes(text) {
    const lines = text.split('\n').filter(line => line.trim());
    const gratitudes = [];
    
    lines.forEach(line => {
      // Remove leading number and period (e.g., "1. " or "2. ")
      const cleaned = line.replace(/^\d+\.\s*/, '').trim();
      if (cleaned) {
        gratitudes.push(cleaned);
      }
    });
    
    return gratitudes;
  }

  /* ----------  count current gratitudes  ---------- */
  countCurrentGratitudes() {
    const textarea = document.getElementById('gratitude-input');
    if (!textarea) return 0;
    return this.parseGratitudes(textarea.value).length;
  }

  /* ----------  render  ---------- */
  render() {
    const tab = document.getElementById('gratitude-tab');
    const allEntries = this.getAllEntries();
    const todayTotal = this.getTodayTotal();

    tab.innerHTML = `
  <div style="padding:1.5rem;min-height:100vh;">
    <div class="universal-content">

      <header class="main-header project-curiosity"
              style="--header-img:url('https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/NavGratitude.png');
                     --header-title:'';
                     --header-tag:'Log in your gratitudes, as much as possible, to open-up for abundance'">
        <h1>Gratitude Practice</h1>
        <h3>Log in your gratitudes, as much as possible, to open-up for abundance</h3>
        <span class="header-sub"></span>
      </header>

      <div class="space-y-6">
        <div class="card">
          <div class="flex items-center justify-between" style="margin-bottom: 2rem;">
            <h3 class="text-2xl font-bold" style="color: var(--neuro-text);">My Gratitudes for Today</h3>
            <span class="badge ${todayTotal >= this.maxEntries ? 'badge-success' : 'badge-primary'}"><span id="today-counter">${todayTotal}</span> / ${this.maxEntries} (Quest)</span>
          </div>

          ${todayTotal >= this.maxEntries ? `
            <div style="margin-bottom: 2rem;padding:1rem;border-radius:0.5rem;background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.25);">
              <p class="text-center" style="color: #22c55e;">🎉 Daily quest complete! Keep going if you'd like!</p>
            </div>
          ` : ''}

          <form id="gratitude-form" style="margin-bottom: 1rem;">
            <textarea id="gratitude-input" class="form-input" rows="8" style="resize: vertical;font-family: monospace;"
             placeholder="Today, I am Grateful for..." required>1. </textarea>
            
            <div class="flex gap-3" style="margin-top: 1rem;">
              <button type="button" id="add-one-more-btn" class="btn btn-secondary flex-1">➕ Add 1 More</button>
              <button type="submit" class="btn btn-primary flex-1">💾 Save my Gratitudes</button>
            </div>
          </form>

          <div class="gratitude-inspiration-container">
            <p class="suggestion-label">💭 Need Inspiration?</p>
            <div class="gratitude-inspiration-grid" id="inspiration-grid">
              ${['A person who made you smile','A comfortable place you enjoy','Something in nature','A skill or talent you have','A recent act of kindness','A small win you had today']
                .map(prompt => `
                  <button class="suggestion-btn" data-text="${this.escapeHtml(prompt)}">
                    ${this.escapeHtml(prompt)}
                  </button>
                `).join('')}
            </div>
          </div>
        </div>

        <div class="card">
          <h3 class="text-2xl font-bold" style="color: var(--neuro-text);margin-bottom: 1.5rem;">📖 My Gratitude Lists</h3>
          ${allEntries.length === 0 ? `
            <div class="text-center py-12" style="color: var(--neuro-text-light);">
              <p class="text-4xl" style="margin-bottom: 1rem;">📖</p>
              <p>Your gratitude list will appear here</p>
            </div>
          ` : `
            <div class="space-y-6" id="history-entries">
              ${allEntries.slice(0, 30).map(entry => {
                const date = new Date(entry.timestamp);
                const dateStr = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                return `
                  <div class="journal-entry" style="background: rgba(102,126,234,0.05); border-radius: 12px; padding: 20px; border-left: 4px solid var(--neuro-success);">
                    <div class="text-sm" style="color: var(--neuro-text-light);margin-bottom: 0.75rem;">${dateStr}</div>
                    <div class="space-y-2">
                      ${entry.entries.map((item, idx) => `
                        <div class="flex items-start gap-2">
                          <span class="text-green-400" style="min-width: 20px;">${idx + 1}.</span>
                          <p class="flex-1" style="color: var(--neuro-text);">${this.escapeHtml(item)}</p>
                          <div class="flex gap-2" style="color: var(--neuro-text-light);">
                            <button data-action="edit-history" data-timestamp="${entry.timestamp}" data-index="${idx}" title="Edit" class="hover:text-white">✏️</button>
                            <button data-action="delete-history" data-timestamp="${entry.timestamp}" data-index="${idx}" title="Delete" class="hover:text-red-400">🗑️</button>
                          </div>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
            ${allEntries.length > 30 ? `
              <div class="text-center" style="margin-top: 1.5rem;">
                <p class="text-sm" style="color: var(--neuro-text-light);">Showing 30 most recent entries</p>
              </div>
            ` : ''}
          `}
        </div>
      </div>

    </div>
  </div>

  <style>
    .gratitude-inspiration-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.75rem;
    }
  </style>
`;

    this.attachHandlers();
    this.updateCounter();
  }

  /* ----------  handlers with event delegation  ---------- */
  attachHandlers() {
    const tab = document.getElementById('gratitude-tab');
    
    // Remove old listener if exists
    if (this._boundHandler) {
      tab.removeEventListener('click', this._boundHandler);
    }
    
    // Event delegation for all clicks
    this._boundHandler = (e) => {
      const target = e.target.closest('[data-action]');
      if (!target) return;

      const action = target.dataset.action;
      const index = parseInt(target.dataset.index);
      const timestamp = target.dataset.timestamp;

      switch(action) {
        case 'edit-history':
          this.editHistoryEntry(timestamp, index);
          break;
        case 'delete-history':
          this.deleteHistoryEntry(timestamp, index);
          break;
      }
    };
    
    tab.addEventListener('click', this._boundHandler);

    // Form submission
    const form = document.getElementById('gratitude-form');
    form?.addEventListener('submit', (e) => this.save(e));

    // Add one more button
    const addMoreBtn = document.getElementById('add-one-more-btn');
    addMoreBtn?.addEventListener('click', () => this.addOneMore());

    // Update counter on input
    const input = document.getElementById('gratitude-input');
    input?.addEventListener('input', () => this.updateCounter());

    // Inspiration buttons
    const grid = document.getElementById('inspiration-grid');
    grid?.addEventListener('click', (e) => {
      const btn = e.target.closest('.suggestion-btn');
      if (btn) {
        const text = btn.dataset.text;
        const textarea = document.getElementById('gratitude-input');
        const currentCount = this.countCurrentGratitudes();
        
        // Find the last numbered line
        const lines = textarea.value.split('\n');
        const lastLine = lines[lines.length - 1].trim();
        
        // If last line is empty or just a number, replace it
        if (lastLine === '' || /^\d+\.\s*$/.test(lastLine)) {
          lines[lines.length - 1] = `${currentCount + 1}. ${text}`;
          textarea.value = lines.join('\n');
        } else {
          // Otherwise add to current line
          textarea.value = textarea.value.trim() + ' ' + text;
        }
        
        textarea.focus();
        this.updateCounter();
      }
    });
  }

  /* ----------  add one more gratitude  ---------- */
  addOneMore() {
    const textarea = document.getElementById('gratitude-input');
    if (!textarea) return;
    
    const currentCount = this.countCurrentGratitudes();
    const nextNumber = currentCount + 1;
    
    // Add new numbered line
    const currentValue = textarea.value.trim();
    textarea.value = currentValue + (currentValue ? '\n' : '') + `${nextNumber}. `;
    
    // Focus and move cursor to end
    textarea.focus();
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    
    this.updateCounter();
  }

  /* ----------  update counter  ---------- */
  updateCounter() {
    const counterSpan = document.getElementById('today-counter');
    if (!counterSpan) return;
    
    const currentCount = this.countCurrentGratitudes();
    const todayTotal = this.getTodayTotal();
    counterSpan.textContent = todayTotal + currentCount;
  }

  editHistoryEntry(ts, idx) {
    const day = this.app.state.data.gratitudeEntries.find(e => e.timestamp === ts);
    if (!day) return;
    const original = day.entries[idx];
    NeumorphicModal.showPrompt(
      'Edit your gratitude entry:',
      original,
      (updated) => {
        day.entries[idx] = updated;
        this.app.state.saveAppData();
        this.cachedEntries = null;
        this.render();
      },
      {
        title: 'Edit Gratitude',
        icon: '💚',
        placeholder: 'I am grateful for...'
      }
    );
  }

  deleteHistoryEntry(ts, idx) {
    NeumorphicModal.showConfirm(
      'Are you sure you want to delete this gratitude entry? This action cannot be undone.',
      () => {
        const day = this.app.state.data.gratitudeEntries.find(e => e.timestamp === ts);
        if (!day) return;
        day.entries.splice(idx, 1);
        if (day.entries.length === 0) {
          this.app.state.data.gratitudeEntries = this.app.state.data.gratitudeEntries.filter(e => e.timestamp !== ts);
        }
        this.app.state.saveAppData();
        this.cachedEntries = null;
        this.render();
      },
      {
        title: 'Delete Gratitude',
        icon: '🗑️',
        confirmText: 'Delete',
        isDanger: true
      }
    );
  }

  /* ----------  save directly  ---------- */
  save(event) {
    event.preventDefault();
    
    const textarea = document.getElementById('gratitude-input');
    const gratitudes = this.parseGratitudes(textarea.value);
    
    if (gratitudes.length === 0) {
      this.app.showToast('⚠️ Please write at least one gratitude', 'warning');
      return;
    }
    
    this.app.state.addEntry(GratitudeEngine.TYPE, { entries: gratitudes });
    this.app.showToast(`✅ ${gratitudes.length} gratitude${gratitudes.length > 1 ? 's' : ''} saved!`, 'success');

    if (this.app.gamification) {
      this.app.gamification.progressQuest('daily', 'gratitude_entry', gratitudes.length);
    }

    // Badge checking happens automatically via gamification.checkBadgeCategory('gratitude')

    // Reset textarea
    textarea.value = '1. ';
    this.cachedEntries = null;
    this.render();
  }

  /* ----------  cleanup  ---------- */
  destroy() {
    const tab = document.getElementById('gratitude-tab');
    if (this._boundHandler) {
      tab?.removeEventListener('click', this._boundHandler);
    }
  }
}

if (typeof window !== 'undefined') window.GratitudeEngine = GratitudeEngine;