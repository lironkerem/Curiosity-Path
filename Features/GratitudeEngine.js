// Features/GratitudeEngine.js

import { NeumorphicModal } from '../Core/Modal.js';

export default class GratitudeEngine {
  constructor(app) {
    this.app = app;
    this.currentEntries = [];
    this.maxEntries = 10;
    this.loadToday();
  }

  /* ----------  data helpers  ---------- */
  loadToday() {
    const today = this.app.state.getTodayEntries('gratitude');
    // Don't load today's entries - always start fresh
    this.currentEntries = [];
  }

  getAllEntries() {
    const all = this.app.state.data.gratitudeEntries || [];
    return all.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  getTodayTotal() {
    const today = this.app.state.getTodayEntries('gratitude');
    return today.reduce((sum, entry) => sum + entry.entries.length, 0);
  }

  /* ----------  render  ---------- */
  render() {
    const tab = document.getElementById('gratitude-tab');
    const allEntries = this.getAllEntries();
    const todayTotal = this.getTodayTotal();

tab.innerHTML = `
  <div style="padding:1.5rem;min-height:100vh;">
    <div class="universal-content">

      <!--  NEW UNIFIED HEADER  -->
      <header class="main-header project-curiosity">
        <h1>Gratitude Practice</h1>
        <h3>Log in your gratitudes, as much as possible, to open-up for abundance</h3>
      </header>

      <!-- Single column layout -->
      <div class="space-y-6">
        <!-- Today card -->
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

          <form onsubmit="window.featuresManager.engines.gratitude.addEntry(event)" style="margin-bottom: 2rem;">
            <div class="flex space-x-3">
              <input type="text" id="gratitude-input" class="form-input flex-1"
                     placeholder="Today, I am Grateful for..." required />
              <button type="submit" class="btn btn-primary">Add</button>
            </div>
          </form>

<!-- Need Inspiration -->
<div class="card inspiration-card">
  <p class="suggestion-label" style="margin:0 0 0.75rem 0;font-weight:600;color:var(--neuro-text);">💭 Need Inspiration?</p>
  <div class="gratitude-inspiration-grid">
    ${'A person who made you smile,A comfortable place you enjoy,Something in nature,A skill or talent you have,A recent act of kindness,A small win you had today'
      .split(',').map(prompt => `
        <button class="suggestion-btn" data-text="${prompt}"
                onclick="document.getElementById('gratitude-input').value='${prompt}'; document.getElementById('gratitude-input').focus();">
          ${prompt}
        </button>
      `).join('')}
  </div>
</div>

          <div class="space-y-3">
            ${this.currentEntries.map((entry, index) => `
              <div class="flex items-start gap-3 p-4 rounded-lg" style="background: rgba(0,0,0,.05);">
                <span class="text-green-400 text-xl flex-shrink-0">💚</span>
                <p class="flex-1" data-index="${index}" style="color: var(--neuro-text);">${entry}</p>
                <div class="flex gap-2" style="color: var(--neuro-text-light);">
                  <button onclick="window.featuresManager.engines.gratitude.editEntry(${index})" title="Edit" class="hover:text-white">✏️</button>
                  <button onclick="window.featuresManager.engines.gratitude.removeEntry(${index})" title="Delete" class="hover:text-red-400">🗑️</button>
                </div>
              </div>
            `).join('')}
          </div>

          ${this.currentEntries.length > 0 ? `
            <button onclick="window.featuresManager.engines.gratitude.save()" class="btn btn-primary w-full" style="margin-top: 1.5rem;">💾 Save Journal Entry</button>
          ` : ''}
        </div>

        <!-- History card -->
        <div class="card">
          <h3 class="text-2xl font-bold" style="color: var(--neuro-text);margin-bottom: 1.5rem;">📖 My Gratitude Lists</h3>
          ${allEntries.length === 0 ? `
            <div class="text-center py-12" style="color: var(--neuro-text-light);">
              <p class="text-4xl" style="margin-bottom: 1rem;">📖</p>
              <p>Your gratitude list will appear here</p>
            </div>
          ` : `
            <div class="space-y-6">
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
                          <p class="flex-1" style="color: var(--neuro-text);">${item}</p>
                          <div class="flex gap-2" style="color: var(--neuro-text-light);">
                            <button onclick="window.featuresManager.engines.gratitude.editHistoryEntry('${entry.timestamp}', ${idx})" title="Edit" class="hover:text-white">✏️</button>
                            <button onclick="window.featuresManager.engines.gratitude.deleteHistoryEntry('${entry.timestamp}', ${idx})" title="Delete" class="hover:text-red-400">🗑️</button>
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
    /* 2x3 grid for inspiration prompts */
    .gratitude-inspiration-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.75rem;
    }
  </style>
`;

    this.attachHandlers();
  }

  /* ----------  handlers  ---------- */
  attachHandlers() {
    const form = document.querySelector('#gratitude-tab form');
    form?.addEventListener('submit', e => this.addEntry(e));

    document.querySelector('#gratitude-input')?.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { 
        e.preventDefault(); 
        form.dispatchEvent(new Event('submit')); 
      }
    });
  }

  addEntry(event) {
    event.preventDefault();
    const input = document.querySelector('#gratitude-input');
    const entry = input.value.trim();
    if (entry) {
      this.currentEntries.push(entry);
      input.value = '';
      this.render();
    }
  }

  removeEntry(index) {
    this.currentEntries.splice(index, 1);
    this.render();
  }

  editEntry(index) {
    const original = this.currentEntries[index];
    NeumorphicModal.showPrompt(
      'Edit your gratitude entry:',
      original,
      (updated) => {
        this.currentEntries[index] = updated;
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
    
    // Save the entry
    this.app.state.addEntry('gratitude', { entries: this.currentEntries });
    this.app.showToast('✅ Gratitude journal saved!', 'success');

    // Quest integration
    if (this.app.gamification) {
      this.currentEntries.forEach(() => {
        this.app.gamification.progressQuest('daily', 'gratitude_entry', 1);
      });
    }

    // Achievements
    const total = this.app.state.data.gratitudeEntries?.length || 0;
    const gm = this.app.gamification;
    if (total === 1) gm.grantAchievement({ id: 'first_gratitude', name: 'Grateful Heart', xp: 50, icon: '💚', inspirational: 'You\'ve begun the journey of gratitude!' });
    if (total === 10) gm.grantAchievement({ id: 'gratitude_10', name: 'Gratitude Apprentice', xp: 100, icon: '🙏', inspirational: '10 gratitude entries - abundance flows to you!' });
    if (total === 50) gm.grantAchievement({ id: 'gratitude_50', name: 'Gratitude Master', xp: 250, icon: '🌟', inspirational: '50 entries! Your gratitude practice is transformative!' });

    // Clear current entries for fresh start
    this.currentEntries = [];
    this.render();
  }
}

// Export for ES6 modules and expose globally
if (typeof window !== 'undefined') window.GratitudeEngine = GratitudeEngine;