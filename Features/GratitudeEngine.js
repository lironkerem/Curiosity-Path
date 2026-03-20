// Features/GratitudeEngine.js

import { NeumorphicModal } from '../Core/Modal.js';

// XSS escape helper (also used for inline HTML rendering)
function esc(v) {
  return String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/**
 * GratitudeEngine - Manages gratitude journaling
 * Entry creation, editing, deletion, daily quest tracking
 */
export default class GratitudeEngine {
  static TYPE              = 'gratitude';
  static MAX_ENTRIES       = 10;
  static MAX_HISTORY_DISPLAY = 30;
  static MAX_ENTRY_LEN     = 500; // per-entry character cap

  static INSPIRATION_PROMPTS = Object.freeze([
    'A person who made you smile',
    'A comfortable place you enjoy',
    'Something in nature',
    'A skill or talent you have',
    'A recent act of kindness',
    'A small win you had today'
  ]);

  constructor(app) {
    this.app = app;
    this.cachedEntries = null;
    this._boundHandler = null;
  }

  /* ==================== DATA METHODS ==================== */

  getAllEntries() {
    const original = this.app.state.data.gratitudeEntries || [];
    const cleaned  = original.filter(day => day.entries && day.entries.length > 0);

    if (cleaned.length !== original.length) {
      this.app.state.data.gratitudeEntries = cleaned;
      this.app.state.saveAppData();
    }

    this.cachedEntries = cleaned.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return this.cachedEntries;
  }

  getTodayTotal() {
    const today = this.app.state.getTodayEntries(GratitudeEngine.TYPE);
    return today.reduce((sum, entry) => sum + entry.entries.length, 0);
  }

  isDailyQuestComplete() {
    return this.getTodayTotal() >= GratitudeEngine.MAX_ENTRIES;
  }

  /* ==================== PARSING & VALIDATION ==================== */

  parseGratitudes(text) {
    return text
      .split('\n')
      .map(line => line.replace(/^\d+\.\s*/, '').trim().slice(0, GratitudeEngine.MAX_ENTRY_LEN))
      .filter(line => line.length > 0);
  }

  countCurrentGratitudes() {
    const textarea = document.getElementById('gratitude-input');
    if (!textarea) return 0;
    return this.parseGratitudes(textarea.value).length;
  }

  /* ==================== RENDERING ==================== */

  buildCommunityCTA() {
    return `
      <div class="community-link-card" style="padding-top:0;">
        <div style="display:flex;flex-direction:column;align-items:center;gap:0;margin-bottom:0;">
          <picture>
            <source srcset="/public/Tabs/CommunityHub.webp" type="image/webp">
            <img src="/public/Tabs/CommunityHub.png" alt="Community Hub" width="480" height="360"
                 style="width:30rem;object-fit:contain;margin-top:1rem;margin-bottom:1rem;"
                 loading="lazy" decoding="async">
          </picture>
          <h3 style="margin:0 0 0.75rem;font-size:1.15rem;text-align:center;">
            Mingle &amp; Practice, Chat and Be one with the Community
          </h3>
        </div>
        <p style="margin:0 0 1.5rem;font-size:0.92rem;line-height:1.6;">
          Deepen your connection with the community. Join live practice rooms, Sync with the Sun and Moon, Learn and Evolve - all in one place.
        </p>
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
          <button type="button"
                  onclick="document.activeElement?.blur(); window.app.nav.switchTab('community-hub')"
                  class="btn btn-primary"
                  style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;flex:1 1 100%;white-space:nowrap;"
                  aria-label="Enter the Community Hub">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Enter the Community Hub
          </button>
        </div>
      </div>
    `;
  }

  render() {
    const tab = document.getElementById('gratitude-tab');
    if (!tab) { console.error('GratitudeEngine: gratitude-tab not found'); return; }

    const allEntries     = this.getAllEntries();
    const todayTotal     = this.getTodayTotal();
    const isQuestComplete = this.isDailyQuestComplete();

    tab.innerHTML = this._getHTML(allEntries, todayTotal, isQuestComplete);
    this.attachHandlers();
    this.updateCounter();
  }

  _getHTML(allEntries, todayTotal, isQuestComplete) {
    return `
      <div style="padding:1.5rem;min-height:100vh;">
        <div class="universal-content">
          ${this._getHeaderHTML()}
          <div class="space-y-6">
            ${this._getInputCardHTML(todayTotal, isQuestComplete)}
            ${this._getHistoryCardHTML(allEntries)}
            ${this.buildCommunityCTA()}
          </div>
        </div>
      </div>
      ${this._getStyles()}
    `;
  }

  _getHeaderHTML() {
    return `
      <header class="main-header project-curiosity"
              style="--header-img:url('/public/Tabs/NavGratitude.webp');
                     --header-title:'';
                     --header-tag:'Log in your gratitudes, as much as possible, to open-up for abundance'">
        <h1>Gratitude Practice</h1>
        <h3>Log in your gratitudes, as much as possible, to open-up for abundance</h3>
        <span class="header-sub"></span>
      </header>
    `;
  }

  _getInputCardHTML(todayTotal, isQuestComplete) {
    const badgeClass = isQuestComplete ? 'badge-success' : 'badge-primary';
    return `
      <div class="card">
        <div class="flex items-center justify-between" style="margin-bottom:2rem;">
          <h3 class="text-2xl font-bold" style="color:var(--neuro-text);">My Gratitudes for Today</h3>
          <span class="badge ${badgeClass}" aria-live="polite">
            <span id="today-counter">${todayTotal}</span> / ${GratitudeEngine.MAX_ENTRIES} (Quest)
          </span>
        </div>

        ${isQuestComplete ? this._getQuestCompleteHTML() : ''}

        <form id="gratitude-form" style="margin-bottom:1rem;">
          <textarea
            id="gratitude-input"
            class="form-input"
            rows="8"
            style="resize:vertical;font-family:monospace;"
            placeholder="Today, I am Grateful for…"
            maxlength="${GratitudeEngine.MAX_ENTRIES * (GratitudeEngine.MAX_ENTRY_LEN + 10)}"
            required
            aria-label="Gratitude entries"
          >1. </textarea>

          <div class="flex gap-3" style="margin-top:1rem;">
            <button type="button" id="add-one-more-btn" class="btn btn-secondary flex-1"
                    style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;"
                    aria-label="Add one more gratitude line">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              Add 1 More
            </button>
            <button type="submit" class="btn btn-primary flex-1"
                    style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;"
                    aria-label="Save my gratitudes">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></svg>
              Save my Gratitudes
            </button>
          </div>
        </form>

        ${this._getInspirationHTML()}
      </div>
    `;
  }

  _getQuestCompleteHTML() {
    return `
      <div style="margin-bottom:2rem;padding:1rem;border-radius:0.5rem;background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.25);" role="status">
        <p class="text-center" style="color:#22c55e;display:flex;align-items:center;justify-content:center;gap:0.5rem;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg>
          Daily quest complete! Keep going if you'd like!
        </p>
      </div>
    `;
  }

  _getInspirationHTML() {
    return `
      <div class="gratitude-inspiration-container">
        <p class="suggestion-label" style="display:flex;align-items:center;gap:0.4rem;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
          Need Inspiration?
        </p>
        <div class="gratitude-inspiration-grid" id="inspiration-grid">
          ${GratitudeEngine.INSPIRATION_PROMPTS.map(prompt => `
            <button type="button" class="suggestion-btn" data-text="${esc(prompt)}" aria-label="Use prompt: ${esc(prompt)}">
              ${esc(prompt)}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  _getHistoryCardHTML(allEntries) {
    return `
      <div class="card calc-expandable-card" id="gratitude-collapsible-card">
        <div class="calc-expandable-header" id="gratitude-collapsible-header"
             role="button" tabindex="0" aria-expanded="false" aria-controls="gratitude-collapsible-content"
             onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">
          <span class="chevron" aria-hidden="true">›</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--neuro-accent);flex-shrink:0;" aria-hidden="true" focusable="false">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
          <h3 style="color:var(--neuro-text);margin:0;font-size:1.5rem;font-weight:700;text-shadow:0 1px 2px rgba(0,0,0,0.1);letter-spacing:0.025em;">
            My Gratitudes
          </h3>
        </div>
        <div class="calc-expandable-content" id="gratitude-collapsible-content">
          ${allEntries.length === 0 ? this._getEmptyStateHTML() : this._getEntriesListHTML(allEntries)}
        </div>
      </div>
    `;
  }

  _getEmptyStateHTML() {
    return `
      <div class="text-center py-12" style="color:var(--neuro-text-light);">
        <div style="display:flex;justify-content:center;margin-bottom:1rem;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:48px;height:48px;" aria-hidden="true" focusable="false"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        </div>
        <p>Your gratitude list will appear here</p>
      </div>
    `;
  }

  _getEntriesListHTML(allEntries) {
    const display = allEntries.slice(0, GratitudeEngine.MAX_HISTORY_DISPLAY);
    return `
      <div class="space-y-6" id="history-entries">
        ${display.map(entry => this._getEntryHTML(entry)).join('')}
      </div>
      ${allEntries.length > GratitudeEngine.MAX_HISTORY_DISPLAY ? `
        <div class="text-center" style="margin-top:1.5rem;">
          <p class="text-sm" style="color:var(--neuro-text-light);">
            Showing ${GratitudeEngine.MAX_HISTORY_DISPLAY} most recent entries
          </p>
        </div>
      ` : ''}
    `;
  }

  _getEntryHTML(entry) {
    const date    = new Date(entry.timestamp);
    const dateStr = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    return `
      <div class="journal-entry" style="background:rgba(102,126,234,0.05);border-radius:12px;padding:20px;border-left:4px solid var(--neuro-success);">
        <div class="text-sm" style="color:var(--neuro-text-light);margin-bottom:0.75rem;">${esc(dateStr)}</div>
        <div class="space-y-2">
          ${entry.entries.map((item, idx) => this._getEntryItemHTML(item, idx, entry.timestamp)).join('')}
        </div>
      </div>
    `;
  }

  _getEntryItemHTML(item, idx, timestamp) {
    return `
      <div class="flex items-start gap-2">
        <span class="text-green-400" style="min-width:20px;">${idx + 1}.</span>
        <p class="flex-1" style="color:var(--neuro-text);">${esc(item)}</p>
        <div class="flex gap-2" style="color:var(--neuro-text-light);">
          <button type="button"
                  data-action="edit-history"
                  data-timestamp="${esc(String(timestamp))}"
                  data-index="${idx}"
                  title="Edit entry"
                  class="hover:text-white"
                  aria-label="Edit gratitude entry ${idx + 1}">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>
          </button>
          <button type="button"
                  data-action="delete-history"
                  data-timestamp="${esc(String(timestamp))}"
                  data-index="${idx}"
                  title="Delete entry"
                  class="hover:text-red-400"
                  aria-label="Delete gratitude entry ${idx + 1}">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
    `;
  }

  _getStyles() {
    return `
      <style>
        .gratitude-inspiration-grid {
          display:grid;grid-template-columns:repeat(3,1fr);gap:0.75rem;
        }
        .calc-expandable-header {
          padding:24px;cursor:pointer;display:flex;align-items:center;gap:12px;
        }
        .calc-expandable-header h3 { margin:0;font-size:1.1rem;color:var(--neuro-text); }
        .chevron { font-size:1.5rem;transition:transform var(--transition-normal);color:var(--neuro-accent); }
        .calc-expandable-card.expanded .chevron { transform:rotate(90deg); }
        .calc-expandable-content { max-height:0;overflow:hidden;transition:max-height var(--transition-slow); }
        .calc-expandable-card.expanded .calc-expandable-content { max-height:5000px;padding:0 24px 24px; }
        @media (max-width:768px) { .gratitude-inspiration-grid { grid-template-columns:repeat(2,1fr); } }
        @media (max-width:480px) { .gratitude-inspiration-grid { grid-template-columns:1fr; } }
      </style>
    `;
  }

  /* ==================== EVENT HANDLERS ==================== */

  attachHandlers() {
    const tab = document.getElementById('gratitude-tab');
    if (!tab) return;

    if (this._boundHandler) tab.removeEventListener('click', this._boundHandler);
    this._boundHandler = e => this._handleClick(e);
    tab.addEventListener('click', this._boundHandler);

    document.getElementById('gratitude-form')?.addEventListener('submit', e => this.save(e));
    document.getElementById('gratitude-input')?.addEventListener('input', () => this.updateCounter());
  }

  _handleClick(e) {
    const actionBtn = e.target.closest('[data-action]');
    if (actionBtn) { this._handleActionClick(actionBtn); return; }
    if (e.target.closest('#add-one-more-btn')) { this.addOneMore(); return; }
    const inspirationBtn = e.target.closest('.suggestion-btn');
    if (inspirationBtn) { this._handleInspirationClick(inspirationBtn); return; }
    if (e.target.closest('#gratitude-collapsible-header')) { this._toggleCollapsible(); return; }
  }

  _handleActionClick(button) {
    const action    = button.dataset.action;
    const index     = parseInt(button.dataset.index, 10);
    const timestamp = button.dataset.timestamp;

    if (action === 'edit-history')   this.editHistoryEntry(timestamp, index);
    if (action === 'delete-history') this.deleteHistoryEntry(timestamp, index);
  }

  _handleInspirationClick(button) {
    const text     = button.dataset.text; // already esc()-encoded in HTML; safe for textarea value
    const textarea = document.getElementById('gratitude-input');
    if (!textarea) return;

    // Decode HTML entities back to plain text for the textarea
    const plain  = text.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
    const count  = this.countCurrentGratitudes();
    const lines  = textarea.value.split('\n');
    const last   = lines[lines.length - 1].trim();

    if (last === '' || /^\d+\.\s*$/.test(last)) {
      lines[lines.length - 1] = `${count + 1}. ${plain}`;
      textarea.value = lines.join('\n');
    } else {
      textarea.value = textarea.value.trim() + ' ' + plain;
    }

    textarea.focus();
    this.updateCounter();
  }

  _toggleCollapsible() {
    const card   = document.getElementById('gratitude-collapsible-card');
    const header = document.getElementById('gratitude-collapsible-header');
    if (!card) return;
    card.classList.toggle('expanded');
    header?.setAttribute('aria-expanded', card.classList.contains('expanded') ? 'true' : 'false');
  }

  /* ==================== USER ACTIONS ==================== */

  addOneMore() {
    const textarea = document.getElementById('gratitude-input');
    if (!textarea) return;
    const nextNumber   = this.countCurrentGratitudes() + 1;
    const currentValue = textarea.value.trim();
    textarea.value     = currentValue + (currentValue ? '\n' : '') + `${nextNumber}. `;
    textarea.focus();
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    this.updateCounter();
  }

  updateCounter() {
    const counterSpan = document.getElementById('today-counter');
    if (!counterSpan) return;
    counterSpan.textContent = this.getTodayTotal() + this.countCurrentGratitudes();
  }

  editHistoryEntry(timestamp, index) {
    const day = this.app.state.data.gratitudeEntries.find(e => e.timestamp === timestamp);
    if (!day) return;
    NeumorphicModal.showPrompt(
      'Edit your gratitude entry:',
      day.entries[index],
      updated => {
        day.entries[index] = String(updated).slice(0, GratitudeEngine.MAX_ENTRY_LEN);
        this.app.state.saveAppData();
        this.cachedEntries = null;
        this.render();
      },
      {
        title:       'Edit Gratitude',
        icon:        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>',
        placeholder: 'I am grateful for…'
      }
    );
  }

  deleteHistoryEntry(timestamp, index) {
    NeumorphicModal.showConfirm(
      'Are you sure you want to delete this gratitude entry? This action cannot be undone.',
      () => {
        const day = this.app.state.data.gratitudeEntries.find(e => e.timestamp === timestamp);
        if (!day) return;
        day.entries.splice(index, 1);
        if (day.entries.length === 0) {
          this.app.state.data.gratitudeEntries =
            this.app.state.data.gratitudeEntries.filter(e => e.timestamp !== timestamp);
        }
        this.app.state.saveAppData();
        this.cachedEntries = null;
        this.render();
      },
      {
        title:       'Delete Gratitude',
        icon:        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',
        confirmText: 'Delete',
        isDanger:    true
      }
    );
  }

  save(event) {
    event.preventDefault();
    const textarea   = document.getElementById('gratitude-input');
    const gratitudes = this.parseGratitudes(textarea.value);

    if (!gratitudes.length) {
      this.app.showToast('Please write at least one gratitude', 'warning');
      return;
    }

    this.app.state.addEntry(GratitudeEngine.TYPE, { entries: gratitudes });

    const plural = gratitudes.length > 1 ? 's' : '';
    this.app.showToast(`${gratitudes.length} gratitude${plural} saved!`, 'success');

    textarea.value     = '1. ';
    this.cachedEntries = null;
    this.render();
  }

  /* ==================== CLEANUP ==================== */

  destroy() {
    const tab = document.getElementById('gratitude-tab');
    if (this._boundHandler && tab) {
      tab.removeEventListener('click', this._boundHandler);
      this._boundHandler = null;
    }
    this.cachedEntries = null;
  }
}

if (typeof window !== 'undefined') {
  window.GratitudeEngine = GratitudeEngine;
}
