// Features/GratitudeEngine.js

import { NeumorphicModal } from '../Core/Modal.js';

export default class GratitudeEngine {
  static TYPE = 'gratitude';

  constructor(app) {
    this.app = app;
    this.currentEntries = [];
    this.maxEntries = 10;
    this.cachedEntries = null;
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
            <span class="badge ${todayTotal >= this.maxEntries ? 'badge-success' : 'badge-primary'}">${todayTotal} / ${this.maxEntries} (Quest)</span>
          </div>

          ${todayTotal >= this.maxEntries ? `
            <div style="margin-bottom: 2rem;padding:1rem;border-radius:0.5rem;background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.25);">
              <p class="text-center" style="color: #22c55e;">🎉 Daily quest complete! Keep going if you'd like!</p>
            </div>
          ` : ''}

          <form id="gratitude-form" style="margin-bottom: 2rem;">
            <div class="flex space-x-3">
              <textarea id="gratitude-input" class="form-input flex-1" rows="5" style="resize: none;"
               placeholder="Today, I am Grateful for..." required></textarea>
              <button type="submit" class="btn btn-primary">Add</button>
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

          <div class="space-y-3" id="current-entries">
            ${this.currentEntries.map((entry, index) => `
              <div class="flex items-start gap-3 p-4 rounded-lg" style="background: rgba(0,0,0,.05);">
                <span class="text-green-400 text-xl flex-shrink-0">💚</span>
                <p class="flex-1" style="color: var(--neuro-text);">${this.escapeHtml(entry)}</p>
                <div class="flex gap-2" style="color: var(--neuro-text-light);">
                  <button data-action="edit" data-index="${index}" title="Edit" class="hover:text-white">✏️</button>
                  <button data-action="delete" data-index="${index}" title="Delete" class="hover:text-red-400">🗑️</button>
                </div>
              </div>
            `).join('')}
          </div>

          ${this.currentEntries.length > 0 ? `
            <button id="save-journal-btn" class="btn btn-primary w-full" style="margin-top: 1.5rem;">💾 Save Journal Entry</button>
          ` : ''}
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
        case 'edit':
          this.editEntry(index);
          break;
        case 'delete':
          this.removeEntry(index);
          break;
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
    form?.addEventListener('submit', (e) => this.addEntry(e));

    // Enter key handling
    const input = document.getElementById('gratitude-input');
    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) { 
        e.preventDefault(); 
        form.dispatchEvent(new Event('submit', { cancelable: true })); 
      }
    });

    // Inspiration buttons
    const grid = document.getElementById('inspiration-grid');
    grid?.addEventListener('click', (e) => {
      const btn = e.target.closest('.suggestion-btn');
      if (btn) {
        const text = btn.dataset.text;
        input.value = text;
        input.focus();
      }
    });

    // Save button
    const saveBtn = document.getElementById('save-journal-btn');
    saveBtn?.addEventListener('click', () => this.save());
  }

  addEntry(event) {
    event.preventDefault();
    const input = document.getElementById('gratitude-input');
    const entry = input.value.trim();
    if (entry) {
      this.currentEntries.push(entry);
      input.value = '';
      this.cachedEntries = null; // Invalidate cache
      this.render();
    }
  }

  removeEntry(index) {
    this.currentEntries.splice(index, 1);
    this.cachedEntries = null;
    this.render();
  }

  editEntry(index) {
    const original = this.currentEntries[index];
    NeumorphicModal.showPrompt(
      'Edit your gratitude entry:',
      original,
      (updated) => {
        this.currentEntries[index] = updated;
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

  /* ----------  gamification save  ---------- */
  save() {
    if (this.currentEntries.length === 0) return;
    
    this.app.state.addEntry(GratitudeEngine.TYPE, { entries: this.currentEntries });
    this.app.showToast('✅ Gratitude journal saved!', 'success');

    if (this.app.gamification) {
    this.app.gamification.progressQuest('daily', 'gratitude_entry', this.currentEntries.length);
    }

    const total = this.app.state.data.gratitudeEntries?.length || 0;
    const gm = this.app.gamification;
    if (gm) {
      if (total === 1) gm.grantAchievement({ id: 'first_gratitude', name: 'Grateful Heart', xp: 50, icon: '💚', inspirational: 'You\'ve begun the journey of gratitude!' });
      if (total === 10) gm.grantAchievement({ id: 'gratitude_10', name: 'Gratitude Apprentice', xp: 100, icon: '🙏', inspirational: '10 gratitude entries - abundance flows to you!' });
      if (total === 50) gm.grantAchievement({ id: 'gratitude_50', name: 'Gratitude Master', xp: 250, icon: '🌟', inspirational: '50 entries! Your gratitude practice is transformative!' });
    }

    this.currentEntries = [];
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