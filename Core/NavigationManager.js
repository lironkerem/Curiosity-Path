/**
 * NavigationManager.js - Complete Production Version (PATCHED FOR COMMUNITY HUB)
 * 
 * Manages app navigation, tab switching, mobile gestures, and UI state.
 * Handles both desktop and mobile navigation patterns.
 * 
 * CHANGES:
 * - Added 'community-hub' to SWIPE_ORDER
 * - Added Community Hub desktop nav item
 * - Changed mobile bottom bar from 3 to 4 buttons (Mini-Apps/Home/Community/Features)
 * - Added Community Hub mobile dot indicator
 */

import UserTab from './User-Tab.js';

/* =========================================================
   CONSTANTS
   ========================================================= */

const SWIPE_ORDER = [
  'dashboard', 'energy', 'tarot', 'gratitude', 'happiness',
  'journal', 'meditations', 'flip-script', 'calculator',
  'shadow-alchemy', 'community-hub', 'karma-shop'
];

const CONSTANTS = {
  SWIPE_THRESHOLD: 120,
  SWIPE_TIME_MS: 300,
  OVERSCROLL_THRESHOLD: 150,
  VELOCITY_THRESHOLD: 1.0,
  MIN_DRAG_START: 20,
  VIBRATION_MS: 10,
  VIBRATION_SHEET_MS: 8,
  MIN_TOUCH_DURATION: 200,
  MAX_TOUCH_MOVEMENT: 15,
  ARROW_DEBOUNCE_MS: 400
};

/* =========================================================
   NAVIGATION MANAGER CLASS
   ========================================================= */

export default class NavigationManager {
  constructor(app) {
    this.app = app;
    this.userTab = new UserTab(app);

    // Element cache
    this.cachedElements = {};

    // State flags
    this.listenersAttached = false;
    this.sheetOpen = false;
    this.arrowListenersAttached = false;

    // Stored event handlers for cleanup
    this.eventHandlers = {
      touchStart: null,
      touchEnd: null,
      keydown: null,
      resize: null,
      sheetHandlers: []
    };

    // Observers
    this.arrowObserver = null;

    // Arrow button state
    this.arrowDebounce = false;
    this.touchState = {
      startTime: 0,
      startX: 0,
      startY: 0
    };
  }

  /* =========================================================
     RENDERING
     ========================================================= */

  /**
   * Render navigation UI
   */
  render() {
    const appContainer = document.getElementById('app-container');
    if (!appContainer) {
      console.error('App container not found');
      return;
    }

    // Render navigation HTML (only if not already present)
    if (!document.querySelector('.app-header')) {
      appContainer.insertAdjacentHTML('afterbegin', this._getNavHTML());
    }

    // Render mobile indicator
    if (!document.getElementById('mobile-tab-indicator')) {
      this._renderMobileIndicator();
    }

    // Render user dropdown
    if (!document.getElementById('user-dropdown')) {
      appContainer.insertAdjacentHTML('afterbegin', this.userTab.render());
      this.userTab.init();
    }

    // Initialize
    this.cacheElements();
    this.setupEventListeners();
    this.setupSwipeGestures();
    this.setupKeyboardNavigation();
    this.setupMobileBottomBar();
    this.setupSwipeArrows();
    this.setupSheetSwipeClose();
  }

  /**
   * Cache DOM elements for performance
   */
  cacheElements() {
    this.cachedElements = {
      navItems: document.querySelectorAll('.nav-item'),
      sheets: document.querySelectorAll('.mobile-sheet'),
      sheetRows: document.querySelectorAll('.sheet-row'),
      scrim: document.getElementById('sheet-scrim'),
      mobileBar: document.getElementById('mobile-bottom-bar'),
      swipeArrows: document.getElementById('swipe-arrows'),
      leftArrow: document.getElementById('swipe-left'),
      rightArrow: document.getElementById('swipe-right'),
      indicator: document.getElementById('mobile-tab-indicator'),
      tabDots: document.querySelectorAll('.tab-dot')
    };
  }

  /* =========================================================
     EVENT SETUP
     ========================================================= */

  /**
   * Setup main navigation event listeners
   */
  setupEventListeners() {
    if (this.listenersAttached) return;

    this.cachedElements.navItems.forEach(tab => {
      const clickHandler = () => this.switchTab(tab.dataset.tab, tab.dataset.label);
      const keyHandler = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.switchTab(tab.dataset.tab, tab.dataset.label);
        }
      };

      tab.addEventListener('click', clickHandler);
      tab.addEventListener('keydown', keyHandler);

      // Store for cleanup
      tab._clickHandler = clickHandler;
      tab._keyHandler = keyHandler;
    });

    this.listenersAttached = true;
  }

  /**
   * Setup keyboard navigation
   */
  setupKeyboardNavigation() {
    const keydownHandler = (e) => {
      if (e.key === 'Escape' && this.sheetOpen) {
        this.closeSheets();
        return;
      }

      if (!this.sheetOpen) return;

      const rows = [...this.cachedElements.sheetRows];
      const current = document.activeElement;
      const idx = rows.indexOf(current);
      if (idx < 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        rows[(idx + 1) % rows.length].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        rows[(idx - 1 + rows.length) % rows.length].focus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        current.click();
      }
    };

    document.addEventListener('keydown', keydownHandler);
    this.eventHandlers.keydown = keydownHandler;
  }

  /**
   * Setup mobile bottom bar interactions
   */
  setupMobileBottomBar() {
    const { mobileBar, scrim } = this.cachedElements;
    if (!mobileBar) return;

    // Center button (Home)
    const centerBtn = mobileBar.querySelector('.mobile-tab.center');
    if (centerBtn) {
      const clickHandler = () => this.switchTab('dashboard', 'Dashboard');
      centerBtn.addEventListener('click', clickHandler);
      centerBtn._clickHandler = clickHandler;
    }

    // Community button
    const communityBtn = mobileBar.querySelector('.mobile-tab.community');
    if (communityBtn) {
      const clickHandler = () => this.switchTab('community-hub', 'Community Hub');
      communityBtn.addEventListener('click', clickHandler);
      communityBtn._clickHandler = clickHandler;
    }

    // Left button (Mini Apps)
    const leftBtn = mobileBar.querySelector('.left');
    if (leftBtn) {
      const clickHandler = () => this.openSheet('miniapps', leftBtn);
      leftBtn.addEventListener('click', clickHandler);
      leftBtn._clickHandler = clickHandler;
    }

    // Right button (Features)
    const rightBtn = mobileBar.querySelector('.right');
    if (rightBtn) {
      const clickHandler = () => this.openSheet('features', rightBtn);
      rightBtn.addEventListener('click', clickHandler);
      rightBtn._clickHandler = clickHandler;
    }

    // Scrim click to close
    if (scrim) {
      const clickHandler = () => this.closeSheets();
      scrim.addEventListener('click', clickHandler);
      scrim._clickHandler = clickHandler;
    }

    // Sheet row clicks
    this.cachedElements.sheetRows.forEach(row => {
      const handler = () => {
        const tab = row.dataset.tab;
        const img = row.querySelector('img');
        const alt = img ? img.alt : '';
        this.switchTab(tab, alt || tab);
        this.closeSheets();
      };
      row.addEventListener('click', handler);
      this.eventHandlers.sheetHandlers.push({ element: row, handler });
    });
  }

  /**
   * Setup swipe gestures for tab switching
   */
  setupSwipeGestures() {
    let startX = 0;
    let startY = 0;
    let startTime = 0;

    const touchStartHandler = (e) => {
      if (this.sheetOpen) return;
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      startTime = Date.now();
    };

    const touchEndHandler = (e) => {
      if (this.sheetOpen) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      const dt = Date.now() - startTime;

      if (Math.abs(dy) > Math.abs(dx)) return;
      if (Math.abs(dx) < CONSTANTS.SWIPE_THRESHOLD) return;
      if (dt > CONSTANTS.SWIPE_TIME_MS) return;

      const velocity = Math.abs(dx) / dt;
      if (velocity < CONSTANTS.VELOCITY_THRESHOLD) return;

      const currentTab = this.app.currentTab || 'dashboard';
      const currentIndex = SWIPE_ORDER.indexOf(currentTab);
      if (currentIndex === -1) return;

      let nextIndex;
      if (dx > 0) {
        nextIndex = Math.max(0, currentIndex - 1);
      } else {
        nextIndex = Math.min(SWIPE_ORDER.length - 1, currentIndex + 1);
      }

      if (nextIndex !== currentIndex) {
        this.switchTab(SWIPE_ORDER[nextIndex]);
        this.vibrate(CONSTANTS.VIBRATION_MS);
      }
    };

    window.addEventListener('touchstart', touchStartHandler, { passive: true });
    window.addEventListener('touchend', touchEndHandler, { passive: true });

    this.eventHandlers.touchStart = touchStartHandler;
    this.eventHandlers.touchEnd = touchEndHandler;
  }

  /**
   * Setup swipe-to-close for mobile sheets
   */
  setupSheetSwipeClose() {
    this.cachedElements.sheets.forEach(sheet => {
      let startY = 0;
      let currentY = 0;
      let isDragging = false;

      const touchStartHandler = (e) => {
        startY = e.touches[0].clientY;
        isDragging = true;
        sheet.style.transition = 'none';
      };

      const touchMoveHandler = (e) => {
        if (!isDragging) return;
        currentY = e.touches[0].clientY;
        const diff = currentY - startY;

        if (diff > 0) {
          sheet.style.transform = `translateY(${diff}px)`;
        }
      };

      const touchEndHandler = () => {
        if (!isDragging) return;
        isDragging = false;
        sheet.style.transition = '';

        const diff = currentY - startY;
        if (diff > CONSTANTS.OVERSCROLL_THRESHOLD) {
          this.closeSheets();
          this.vibrate(CONSTANTS.VIBRATION_SHEET_MS);
        } else {
          sheet.style.transform = '';
        }
      };

      sheet.addEventListener('touchstart', touchStartHandler, { passive: true });
      sheet.addEventListener('touchmove', touchMoveHandler, { passive: true });
      sheet.addEventListener('touchend', touchEndHandler, { passive: true });

      sheet._touchStartHandler = touchStartHandler;
      sheet._touchMoveHandler = touchMoveHandler;
      sheet._touchEndHandler = touchEndHandler;
    });
  }

  /**
   * Setup swipe arrow buttons
   */
  setupSwipeArrows() {
    if (this.arrowListenersAttached) return;

    const { leftArrow, rightArrow, swipeArrows } = this.cachedElements;
    if (!leftArrow || !rightArrow || !swipeArrows) return;

    // Left arrow
    const leftTouchStart = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (this.arrowDebounce) return;
      this.arrowDebounce = true;
      this.touchState.startTime = Date.now();
      this.touchState.startX = e.touches[0].clientX;
      this.touchState.startY = e.touches[0].clientY;
    };

    const leftTouchEnd = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const duration = Date.now() - this.touchState.startTime;
      const dx = e.changedTouches[0].clientX - this.touchState.startX;
      const dy = e.changedTouches[0].clientY - this.touchState.startY;

      if (duration < CONSTANTS.MIN_TOUCH_DURATION && 
          Math.abs(dx) < CONSTANTS.MAX_TOUCH_MOVEMENT && 
          Math.abs(dy) < CONSTANTS.MAX_TOUCH_MOVEMENT) {
        this.navigatePrevious();
        this.vibrate(CONSTANTS.VIBRATION_MS);
      }

      setTimeout(() => { this.arrowDebounce = false; }, CONSTANTS.ARROW_DEBOUNCE_MS);
    };

    leftArrow.addEventListener('touchstart', leftTouchStart, { capture: true, passive: false });
    leftArrow.addEventListener('touchend', leftTouchEnd, { capture: true, passive: false });
    leftArrow._touchStart = leftTouchStart;
    leftArrow._touchEnd = leftTouchEnd;

    // Right arrow
    const rightTouchStart = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (this.arrowDebounce) return;
      this.arrowDebounce = true;
      this.touchState.startTime = Date.now();
      this.touchState.startX = e.touches[0].clientX;
      this.touchState.startY = e.touches[0].clientY;
    };

    const rightTouchEnd = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const duration = Date.now() - this.touchState.startTime;
      const dx = e.changedTouches[0].clientX - this.touchState.startX;
      const dy = e.changedTouches[0].clientY - this.touchState.startY;

      if (duration < CONSTANTS.MIN_TOUCH_DURATION && 
          Math.abs(dx) < CONSTANTS.MAX_TOUCH_MOVEMENT && 
          Math.abs(dy) < CONSTANTS.MAX_TOUCH_MOVEMENT) {
        this.navigateNext();
        this.vibrate(CONSTANTS.VIBRATION_MS);
      }

      setTimeout(() => { this.arrowDebounce = false; }, CONSTANTS.ARROW_DEBOUNCE_MS);
    };

    rightArrow.addEventListener('touchstart', rightTouchStart, { capture: true, passive: false });
    rightArrow.addEventListener('touchend', rightTouchEnd, { capture: true, passive: false });
    rightArrow._touchStart = rightTouchStart;
    rightArrow._touchEnd = rightTouchEnd;

    // Observe arrows to update state
    this.arrowObserver = new MutationObserver(() => {
      const currentTab = this.app.currentTab || 'dashboard';
      const currentIndex = SWIPE_ORDER.indexOf(currentTab);

      if (currentIndex <= 0) {
        leftArrow.classList.add('disabled');
      } else {
        leftArrow.classList.remove('disabled');
      }

      if (currentIndex >= SWIPE_ORDER.length - 1) {
        rightArrow.classList.add('disabled');
      } else {
        rightArrow.classList.remove('disabled');
      }
    });

    this.arrowObserver.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true
    });

    this.arrowListenersAttached = true;
  }

  /* =========================================================
     NAVIGATION
     ========================================================= */

  /**
   * Switch to a specific tab
   * @param {string} tabId - Tab identifier
   * @param {string} [label] - Optional label for the tab
   */
  switchTab(tabId, label = '') {
    console.log(`🔄 Switching to tab: ${tabId}`);

    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
      tab.classList.add('hidden');
      tab.classList.remove('active');
    });

    // Show target tab
    const targetTab = document.getElementById(`${tabId}-tab`);
    if (targetTab) {
      targetTab.classList.remove('hidden');
      targetTab.classList.add('active');
    } else {
      console.error(`Tab not found: ${tabId}-tab`);
      return;
    }

    // Update desktop nav
    this.cachedElements.navItems?.forEach(item => {
      if (item.dataset.tab === tabId) {
        item.classList.add('active');
        item.setAttribute('aria-selected', 'true');
        item.setAttribute('tabindex', '0');
      } else {
        item.classList.remove('active');
        item.setAttribute('aria-selected', 'false');
        item.setAttribute('tabindex', '-1');
      }
    });

    // Update mobile bottom bar
    const mobileButtons = document.querySelectorAll('.mobile-tab');
    mobileButtons?.forEach(btn => {
      if (btn.dataset.tab === tabId) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      }
    });

    // Update mobile indicator dots
    this.cachedElements.tabDots?.forEach(dot => {
      if (dot.dataset.tab === tabId) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Update app state directly
    this.app.currentTab = tabId;

    // Initialize feature if needed
    this.app.features?.init(tabId);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Navigate to previous tab in swipe order
   */
  navigatePrevious() {
    const currentTab = this.app.currentTab || 'dashboard';
    const currentIndex = SWIPE_ORDER.indexOf(currentTab);
    if (currentIndex > 0) {
      this.switchTab(SWIPE_ORDER[currentIndex - 1]);
    }
  }

  /**
   * Navigate to next tab in swipe order
   */
  navigateNext() {
    const currentTab = this.app.currentTab || 'dashboard';
    const currentIndex = SWIPE_ORDER.indexOf(currentTab);
    if (currentIndex < SWIPE_ORDER.length - 1) {
      this.switchTab(SWIPE_ORDER[currentIndex + 1]);
    }
  }

  /* =========================================================
     SHEET MANAGEMENT
     ========================================================= */

  /**
   * Open a mobile sheet
   * @param {string} sheetId - Sheet identifier
   * @param {HTMLElement} btn - Button that triggered the sheet
   */
  openSheet(sheetId, btn) {
    const sheet = document.getElementById(`sheet-${sheetId}`);
    const { scrim } = this.cachedElements;

    if (!sheet || !scrim) return;

    // Close other sheets
    this.cachedElements.sheets?.forEach(s => {
      if (s !== sheet) {
        s.classList.remove('open');
        s.setAttribute('aria-hidden', 'true');
      }
    });

    // Open target sheet
    sheet.classList.add('open');
    sheet.setAttribute('aria-hidden', 'false');
    scrim.classList.add('active');
    this.sheetOpen = true;

    // Update button state
    if (btn) {
      btn.setAttribute('aria-expanded', 'true');
    }

    // Focus first row
    const firstRow = sheet.querySelector('.sheet-row');
    if (firstRow) {
      setTimeout(() => firstRow.focus(), 100);
    }

    this.vibrate(CONSTANTS.VIBRATION_SHEET_MS);
  }

  /**
   * Close all mobile sheets
   */
  closeSheets() {
    const { sheets, scrim, mobileBar } = this.cachedElements;

    sheets?.forEach(sheet => {
      sheet.classList.remove('open');
      sheet.setAttribute('aria-hidden', 'true');
      sheet.style.transform = '';
    });

    scrim?.classList.remove('active');
    this.sheetOpen = false;

    // Update button states
    const buttons = mobileBar?.querySelectorAll('[data-popup]');
    buttons?.forEach(btn => {
      btn.setAttribute('aria-expanded', 'false');
    });
  }

  /* =========================================================
     UTILITY
     ========================================================= */

  /**
   * Trigger haptic feedback
   * @param {number} ms - Vibration duration
   */
  vibrate(ms) {
    if ('vibrate' in navigator) {
      navigator.vibrate(ms);
    }
  }

  /**
   * Render mobile indicator
   * @private
   */
  _renderMobileIndicator() {
    const mobileBar = document.getElementById('mobile-bottom-bar');
    if (!mobileBar) return;

    mobileBar.insertAdjacentHTML('beforebegin', this._getMobileIndicatorHTML());

    // Setup dot click handlers
    const dots = document.querySelectorAll('.tab-dot');
    dots.forEach(dot => {
      const clickHandler = () => {
        const tab = dot.dataset.tab;
        this.switchTab(tab);
        this.vibrate(CONSTANTS.VIBRATION_MS);
      };
      dot.addEventListener('click', clickHandler);
      dot._clickHandler = clickHandler;
    });
  }

  /**
   * Get navigation HTML
   * @private
   * @returns {string} HTML string
   */
  _getNavHTML() {
    return `
      <!-- DESKTOP HEADER -->
      <header class="app-header" role="banner">
        <nav class="nav-tabs" role="tablist" aria-label="Main navigation">
          <li class="nav-item active" data-tab="dashboard" data-label="Dashboard" role="tab" aria-selected="true" tabindex="0">
            <img class="nav-image" src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/Dashboard.png" alt="Dashboard">
          </li>
          <li class="nav-item" data-tab="energy" data-label="Energy Tracker" role="tab" aria-selected="false" tabindex="-1">
            <img class="nav-image" src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/NavEnergy.png" alt="Energy Tracker">
          </li>
          <li class="nav-item" data-tab="tarot" data-label="Tarot Reading" role="tab" aria-selected="false" tabindex="-1">
            <img class="nav-image" src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/NavTarot.png" alt="Tarot Reading">
          </li>
          <li class="nav-item" data-tab="gratitude" data-label="Gratitude" role="tab" aria-selected="false" tabindex="-1">
            <img class="nav-image" src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/NavGratitude.png" alt="Gratitude">
          </li>
          <li class="nav-item" data-tab="happiness" data-label="Happiness" role="tab" aria-selected="false" tabindex="-1">
            <img class="nav-image" src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/NavHappiness.png" alt="Happiness">
          </li>
          <li class="nav-item" data-tab="journal" data-label="Journal" role="tab" aria-selected="false" tabindex="-1">
            <img class="nav-image" src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/NavJournal.png" alt="Journal">
          </li>
          <li class="nav-item" data-tab="meditations" data-label="Meditations" role="tab" aria-selected="false" tabindex="-1">
            <img class="nav-image" src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/NavMeditations.png" alt="Meditations">
          </li>
          <li class="nav-item" data-tab="flip-script" data-label="Flip Script" role="tab" aria-selected="false" tabindex="-1">
            <img class="nav-image" src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/NavFlip.png" alt="Flip Script">
          </li>
          <li class="nav-item" data-tab="calculator" data-label="Calculator" role="tab" aria-selected="false" tabindex="-1">
            <img class="nav-image" src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/NavAnalysis.png" alt="Calculator">
          </li>
          <li class="nav-item" data-tab="shadow-alchemy" data-label="Shadow Alchemy" role="tab" aria-selected="false" tabindex="-1">
            <img class="nav-image" src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/NavShadow.png" alt="Shadow Alchemy">
          </li>
          <li class="nav-item" data-tab="community-hub" data-label="Community Hub" role="tab" aria-selected="false" tabindex="-1">
            <img class="nav-image" src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/NavShadow.png" alt="Community Hub">
          </li>
          <li class="nav-item" data-tab="karma-shop" data-label="Karma Shop" role="tab" aria-selected="false" tabindex="-1">
            <img class="nav-image" src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/NavShop.png" alt="Karma Shop">
          </li>
          <li class="nav-item" data-tab="chatbot" data-label="AI Assistant" role="tab" aria-selected="false" tabindex="-1">
            <img class="nav-image" src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/Chat.png" alt="AI Assistant">
          </li>
        </ul>
      </nav>

      <!-- CTA FOOTER -->
      <div id="cta-footer-wrapper"></div>

      <!-- MOBILE 4-BUTTON BAR -->
      <nav id="mobile-bottom-bar" class="mobile-bottom-bar" role="navigation" aria-label="Mobile navigation">
        <button class="mobile-tab left" data-popup="miniapps" aria-haspopup="true" aria-expanded="false">
          <img src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/MiniApps.png" alt=""><span>Mini Apps</span>
        </button>
        <button class="mobile-tab center active" data-tab="dashboard" aria-selected="true">
          <img src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/Dashboard.png" alt=""><span>Home</span>
        </button>
        <button class="mobile-tab community" data-tab="community-hub" aria-selected="false">
          <img src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/Dashboard.png" alt=""><span>Community</span>
        </button>
        <button class="mobile-tab right" data-popup="features" aria-haspopup="true" aria-expanded="false">
          <img src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/Features.png" alt=""><span>Features</span>
        </button>
      </nav>

      <!-- SHEETS -->
      <div id="sheet-miniapps" class="mobile-sheet" role="dialog" aria-modal="true" aria-hidden="true">
        <div class="sheet-grip"></div><div class="sheet-header">Mini Apps</div>
        <div class="sheet-scroller">
          <div class="sheet-row" data-tab="flip-script" role="menuitem" tabindex="0"><img src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/NavFlip.png" alt=""><span>Flip Your Thoughts</span></div>
          <div class="sheet-row" data-tab="calculator" role="menuitem" tabindex="0"><img src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/NavAnalysis.png" alt=""><span>Analyze your 'Self'</span></div>
          <div class="sheet-row" data-tab="shadow-alchemy" role="menuitem" tabindex="0"><img src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/NavShadow.png" alt=""><span>Shadow Work</span></div>
          <div class="sheet-row" data-tab="chatbot" role="menuitem" tabindex="0"><img src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/Chat.png" alt=""><span>Aanandoham's AI Assistant</span></div>
        </div>
      </div>

      <div id="sheet-features" class="mobile-sheet" role="dialog" aria-modal="true" aria-hidden="true">
        <div class="sheet-grip"></div><div class="sheet-header">Features</div>
        <div class="sheet-scroller">
          <div class="sheet-row" data-tab="happiness" role="menuitem" tabindex="0"><img src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/NavHappiness.png" alt=""><span>Happiness and Motivation</span></div>
          <div class="sheet-row" data-tab="gratitude" role="menuitem" tabindex="0"><img src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/NavGratitude.png" alt=""><span>Gratitude Enhancer</span></div>
          <div class="sheet-row" data-tab="journal" role="menuitem" tabindex="0"><img src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/NavJournal.png" alt=""><span>Write To Yourself</span></div>
          <div class="sheet-row" data-tab="energy" role="menuitem" tabindex="0"><img src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/NavEnergy.png" alt=""><span>Track Your Energies</span></div>
          <div class="sheet-row" data-tab="tarot" role="menuitem" tabindex="0"><img src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/NavTarot.png" alt=""><span>Tarot Cards Divinations</span></div>
          <div class="sheet-row" data-tab="meditations" role="menuitem" tabindex="0"><img src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/NavMeditations.png" alt=""><span>Aanandoham's Meditations</span></div>
          <div class="sheet-row" data-tab="karma-shop" role="menuitem" tabindex="0"><img src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/NavShop.png" alt=""><span>Spend Your Karma</span></div>
        </div>
      </div>

      <div id="sheet-scrim" class="sheet-scrim"></div>

      <!-- FLOATING SWIPE ARROWS (MOBILE ONLY) -->
      <div id="swipe-arrows" class="swipe-arrows mobile-only">
        <button id="swipe-left" class="swipe-arrow left" aria-label="Previous feature" title="Swipe or click to go back"></button>
        <button id="swipe-right" class="swipe-arrow right" aria-label="Next feature" title="Swipe or click to go forward"></button>
      </div>
    `;
  }

  /**
   * Get mobile indicator HTML
   * @private  
   * @returns {string} HTML string
   */
  _getMobileIndicatorHTML() {
    const baseStyle = 'display: inline-flex !important; align-items: center; justify-content: center; width: 24px; height: 24px; min-width: 24px; min-height: 24px; border-radius: 50%; background: var(--neuro-shadow-dark); box-shadow: inset 2px 2px 4px var(--neuro-shadow-dark), inset -2px -2px 4px var(--neuro-shadow-light); opacity: 0.6; flex-shrink: 0; transition: all 300ms ease-in-out; cursor: pointer; overflow: hidden; padding: 3px;';
    const imgStyle = 'width: 100%; height: 100%; object-fit: contain; pointer-events: none;';

    const tabs = [
      { tab: 'dashboard', title: 'Dashboard', img: 'DashDot.png', active: true },
      { tab: 'energy', title: 'Energy', img: 'EnergyDot.png' },
      { tab: 'tarot', title: 'Tarot', img: 'TarotDot.png' },
      { tab: 'gratitude', title: 'Gratitude', img: 'GratitudeDot.png' },
      { tab: 'happiness', title: 'Happiness', img: 'HappinessDot.png' },
      { tab: 'journal', title: 'Journal', img: 'JournalDot.png' },
      { tab: 'meditations', title: 'Meditations', img: 'MeditationsDot.png' },
      { tab: 'flip-script', title: 'Flip Script', img: 'FlipDot.png' },
      { tab: 'calculator', title: 'Analysis', img: 'AnalysisDot.png' },
      { tab: 'shadow-alchemy', title: 'Shadow Alchemy', img: 'ShadowDot.png' },
      { tab: 'community-hub', title: 'Community Hub', img: 'DashDot.png' },
      { tab: 'karma-shop', title: 'Karma Shop', img: 'ShopDot.png' }
    ];

    const dots = tabs.map(t => 
      `<span class="tab-dot${t.active ? ' active' : ''}" data-tab="${t.tab}" title="${t.title}" style="${baseStyle}"><img src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/Dots/${t.img}" style="${imgStyle}"></span>`
    ).join('\n        ');

    return `
      <!-- MOBILE TAB POSITION INDICATOR -->
      <div id="mobile-tab-indicator" style="display: flex; justify-content: space-between !important; align-items: center; padding: 0.5rem 0.5rem; width: 100%; box-sizing: border-box; background: transparent; min-height: 50px; gap: 2px;">
        ${dots}
      </div>
    `;
  }

  /* =========================================================
     CLEANUP
     ========================================================= */

  /**
   * Cleanup and destroy
   */
  destroy() {
    // Remove window event listeners
    if (this.eventHandlers.touchStart) {
      window.removeEventListener('touchstart', this.eventHandlers.touchStart);
    }
    if (this.eventHandlers.touchEnd) {
      window.removeEventListener('touchend', this.eventHandlers.touchEnd);
    }
    if (this.eventHandlers.keydown) {
      document.removeEventListener('keydown', this.eventHandlers.keydown);
    }
    if (this.eventHandlers.resize) {
      window.removeEventListener('resize', this.eventHandlers.resize);
    }

    // Remove nav item listeners
    this.cachedElements.navItems?.forEach(tab => {
      if (tab._clickHandler) tab.removeEventListener('click', tab._clickHandler);
      if (tab._keyHandler) tab.removeEventListener('keydown', tab._keyHandler);
    });

    // Remove mobile bar listeners
    const { mobileBar, scrim } = this.cachedElements;
    if (mobileBar) {
      const centerBtn = mobileBar.querySelector('.mobile-tab.center');
      const communityBtn = mobileBar.querySelector('.mobile-tab.community');
      const leftBtn = mobileBar.querySelector('.left');
      const rightBtn = mobileBar.querySelector('.right');
      
      if (centerBtn?._clickHandler) centerBtn.removeEventListener('click', centerBtn._clickHandler);
      if (communityBtn?._clickHandler) communityBtn.removeEventListener('click', communityBtn._clickHandler);
      if (leftBtn?._clickHandler) leftBtn.removeEventListener('click', leftBtn._clickHandler);
      if (rightBtn?._clickHandler) rightBtn.removeEventListener('click', rightBtn._clickHandler);
    }

    if (scrim?._clickHandler) {
      scrim.removeEventListener('click', scrim._clickHandler);
    }

    // Remove sheet listeners
    this.eventHandlers.sheetHandlers.forEach(({ element, handler }) => {
      element.removeEventListener('click', handler);
    });

    // Remove touch handlers from sheets
    this.cachedElements.sheets?.forEach(sheet => {
      if (sheet._touchStartHandler) {
        sheet.removeEventListener('touchstart', sheet._touchStartHandler);
      }
      if (sheet._touchMoveHandler) {
        sheet.removeEventListener('touchmove', sheet._touchMoveHandler);
      }
      if (sheet._touchEndHandler) {
        sheet.removeEventListener('touchend', sheet._touchEndHandler);
      }
    });

    // Remove arrow button handlers
    const { leftArrow, rightArrow } = this.cachedElements;
    if (leftArrow?._touchStart) {
      leftArrow.removeEventListener('touchstart', leftArrow._touchStart, { capture: true });
      leftArrow.removeEventListener('touchend', leftArrow._touchEnd, { capture: true });
    }
    if (rightArrow?._touchStart) {
      rightArrow.removeEventListener('touchstart', rightArrow._touchStart, { capture: true });
      rightArrow.removeEventListener('touchend', rightArrow._touchEnd, { capture: true });
    }

    // Remove dot click handlers
    this.cachedElements.tabDots?.forEach(dot => {
      if (dot._clickHandler) dot.removeEventListener('click', dot._clickHandler);
    });

    // Disconnect observers
    if (this.arrowObserver) {
      this.arrowObserver.disconnect();
      this.arrowObserver = null;
    }

    // Clear references
    this.eventHandlers = { sheetHandlers: [] };
    this.cachedElements = {};
    this.listenersAttached = false;
    this.arrowListenersAttached = false;

    console.log('🧹 NavigationManager destroyed');
  }
}