/**
 * NavigationManager.js - Complete Production Version
 * 
 * Manages app navigation, tab switching, mobile gestures, and UI state.
 * Handles both desktop and mobile navigation patterns.
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
   * Setup mobile bottom bar
   */
  setupMobileBottomBar() {
    if (window.innerWidth > 767) return;

    const { mobileBar, sheets, scrim } = this.cachedElements;
    if (!mobileBar) return;

    const openSheet = (id) => {
      const sheet = document.getElementById(id);
      if (!sheet) return;

      sheet.setAttribute('aria-hidden', 'false');
      scrim.classList.add('visible');
      this.sheetOpen = true;
      document.body.classList.add('sheet-open');

      const firstRow = sheet.querySelector('.sheet-row');
      if (firstRow) firstRow.focus();

      this.vibrate(CONSTANTS.VIBRATION_MS);
    };

    // Find all mobile buttons by data attribute
    const mobileButtons = mobileBar.querySelectorAll('.mobile-tab');
    
    mobileButtons.forEach(btn => {
      const popup = btn.dataset.popup;
      const tab = btn.dataset.tab;
      
      if (popup === 'miniapps') {
        // Mini Apps button
        const handler = (e) => {
          openSheet('sheet-miniapps');
          e.currentTarget.setAttribute('aria-expanded', 'true');
        };
        btn.addEventListener('click', handler);
        btn._clickHandler = handler;
      } else if (popup === 'features') {
        // Features button
        const handler = (e) => {
          openSheet('sheet-features');
          e.currentTarget.setAttribute('aria-expanded', 'true');
        };
        btn.addEventListener('click', handler);
        btn._clickHandler = handler;
      } else if (tab === 'dashboard') {
        // Home button
        const handler = () => {
          this.closeSheets();
          this.switchTab('dashboard', 'Main Dashboard');
        };
        btn.addEventListener('click', handler);
        btn._clickHandler = handler;
      } else if (tab === 'community-hub') {
        // Community button
        const handler = () => {
          this.closeSheets();
          this.switchTab('community-hub', 'Community Hub');
        };
        btn.addEventListener('click', handler);
        btn._clickHandler = handler;
      }
    });

    // Scrim click - close sheets
    const scrimHandler = () => this.closeSheets();
    if (scrim) {
      scrim.addEventListener('click', scrimHandler);
      scrim._clickHandler = scrimHandler;
    }

    // Sheet row clicks
    sheets.forEach(sheet => {
      const sheetHandler = (e) => {
        const row = e.target.closest('.sheet-row');
        if (!row) return;

        this.closeSheets();
        const tabName = row.dataset.tab;
        const navItem = document.querySelector(`[data-tab="${tabName}"]`);
        const label = navItem?.dataset.label || row.querySelector('span')?.textContent || tabName;
        this.switchTab(tabName, label);
      };

      sheet.addEventListener('click', sheetHandler);
      this.eventHandlers.sheetHandlers.push({ element: sheet, handler: sheetHandler });
    });
  }

  /**
   * Close bottom sheets
   */
  closeSheets() {
    const { sheets, scrim, mobileBar } = this.cachedElements;

    sheets.forEach(s => s.setAttribute('aria-hidden', 'true'));
    scrim.classList.remove('visible');

    if (mobileBar) {
      const tabs = mobileBar.querySelectorAll('.mobile-tab');
      tabs.forEach(t => t.setAttribute('aria-expanded', 'false'));
    }

    this.sheetOpen = false;
    document.body.classList.remove('sheet-open');
  }

  /* =========================================================
     SWIPE GESTURES
     ========================================================= */

  /**
   * Setup swipe gesture detection
   */
  setupSwipeGestures() {
    // Remove old listeners if they exist
    if (this.eventHandlers.touchStart) {
      window.removeEventListener('touchstart', this.eventHandlers.touchStart);
    }
    if (this.eventHandlers.touchEnd) {
      window.removeEventListener('touchend', this.eventHandlers.touchEnd);
    }

    let touchStartX = 0;
    let touchStartTime = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartTime = Date.now();
    };

    const handleTouchEnd = (e) => {
      const endX = e.changedTouches[0].clientX;
      const deltaX = touchStartX - endX;
      const deltaT = Date.now() - touchStartTime;

      if (Math.abs(deltaX) < CONSTANTS.SWIPE_THRESHOLD || deltaT > CONSTANTS.SWIPE_TIME_MS) {
        return;
      }

      const active = localStorage.getItem('pc_active_tab') || 'dashboard';
      let idx = SWIPE_ORDER.indexOf(active);
      const direction = deltaX > 0 ? 1 : -1;

      idx = (idx + direction + SWIPE_ORDER.length) % SWIPE_ORDER.length;

      const navItem = document.querySelector(`[data-tab="${SWIPE_ORDER[idx]}"]`);
      if (navItem) {
        this.switchTab(SWIPE_ORDER[idx], navItem.dataset.label);
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    this.eventHandlers.touchStart = handleTouchStart;
    this.eventHandlers.touchEnd = handleTouchEnd;
  }
/**
   * Setup sheet swipe-to-close
   */
  setupSheetSwipeClose() {
    const { sheets } = this.cachedElements;

    sheets.forEach(sheet => {
      const scroller = sheet.querySelector('.sheet-scroller');
      if (!scroller) return;

      let startY = 0, startT = 0, isDragging = false;

      const touchStartHandler = (e) => {
        startY = e.touches[0].clientY;
        startT = Date.now();
        isDragging = false;
      };

      const touchMoveHandler = (e) => {
        const currentY = e.touches[0].clientY;
        const deltaY = currentY - startY;

        if (scroller.scrollTop === 0 && deltaY > CONSTANTS.MIN_DRAG_START) {
          isDragging = true;
          const dragAmount = Math.min(deltaY * 0.5, 150);
          sheet.style.transform = `translateY(${dragAmount}px)`;
          sheet.style.transition = 'none';
        }
      };

      const touchEndHandler = (e) => {
        if (!isDragging) return;

        const endY = e.changedTouches[0].clientY;
        const deltaY = endY - startY;
        const deltaT = Date.now() - startT;
        const velocity = deltaY / deltaT;

        sheet.style.transition = 'transform 0.3s ease';
        sheet.style.transform = '';

        if (deltaY > CONSTANTS.OVERSCROLL_THRESHOLD || velocity > CONSTANTS.VELOCITY_THRESHOLD) {
          this.vibrate(CONSTANTS.VIBRATION_SHEET_MS);
          this.closeSheets();
        }

        isDragging = false;
      };

      sheet.addEventListener('touchstart', touchStartHandler, { passive: true });
      sheet.addEventListener('touchmove', touchMoveHandler, { passive: true });
      sheet.addEventListener('touchend', touchEndHandler, { passive: true });

      // Store for cleanup
      sheet._touchStartHandler = touchStartHandler;
      sheet._touchMoveHandler = touchMoveHandler;
      sheet._touchEndHandler = touchEndHandler;
    });
  }

  /**
   * Setup swipe arrow buttons
   */
  setupSwipeArrows() {
    if (window.innerWidth > 767) return;
    if (this.arrowListenersAttached) return;

    const { leftArrow, rightArrow, swipeArrows } = this.cachedElements;
    if (!leftArrow || !rightArrow || !swipeArrows) return;

    // Make non-focusable
    leftArrow.tabIndex = -1;
    rightArrow.tabIndex = -1;

    // Add SVG icons if not present
    if (!leftArrow.querySelector('svg')) {
      leftArrow.innerHTML = `<svg viewBox="0 0 200 180" style="transform:scale(0.5); pointer-events:none;"><path d="M115 10 L100 90 L115 170" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round"/></svg>`;
    }
    if (!rightArrow.querySelector('svg')) {
      rightArrow.innerHTML = `<svg viewBox="0 0 200 180" style="transform:scaleX(-1) scale(0.5); pointer-events:none;"><path d="M115 10 L100 90 L115 170" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round"/></svg>`;
    }

    leftArrow.style.padding = '8px';
    rightArrow.style.padding = '8px';

    // Navigate function
    const navigate = (direction) => {
      if (this.arrowDebounce) return;

      this.arrowDebounce = true;

      const active = localStorage.getItem('pc_active_tab') || 'dashboard';
      let idx = SWIPE_ORDER.indexOf(active);
      idx = direction === 'left'
        ? (idx - 1 + SWIPE_ORDER.length) % SWIPE_ORDER.length
        : (idx + 1) % SWIPE_ORDER.length;

      const navItem = document.querySelector(`[data-tab="${SWIPE_ORDER[idx]}"]`);
      if (navItem) {
        this.switchTab(SWIPE_ORDER[idx], navItem.dataset.label);
      }

      setTimeout(() => {
        this.arrowDebounce = false;
      }, CONSTANTS.ARROW_DEBOUNCE_MS);
    };

    // Touch handlers
    const createTouchHandlers = (direction, button) => {
      const start = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.touchState.startTime = Date.now();
        this.touchState.startX = e.touches[0].clientX;
        this.touchState.startY = e.touches[0].clientY;
      };

      const end = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const duration = Date.now() - this.touchState.startTime;
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const moveDistance = Math.sqrt(
          Math.pow(endX - this.touchState.startX, 2) +
          Math.pow(endY - this.touchState.startY, 2)
        );

        if (duration < CONSTANTS.MIN_TOUCH_DURATION || moveDistance > CONSTANTS.MAX_TOUCH_MOVEMENT) {
          return;
        }

        navigate(direction);
        setTimeout(() => button.blur(), 0);
      };

      return { start, end };
    };

    const leftHandlers = createTouchHandlers('left', leftArrow);
    const rightHandlers = createTouchHandlers('right', rightArrow);

    leftArrow.addEventListener('touchstart', leftHandlers.start, { capture: true });
    leftArrow.addEventListener('touchend', leftHandlers.end, { capture: true });
    rightArrow.addEventListener('touchstart', rightHandlers.start, { capture: true });
    rightArrow.addEventListener('touchend', rightHandlers.end, { capture: true });

    // Store for cleanup
    leftArrow._touchStart = leftHandlers.start;
    leftArrow._touchEnd = leftHandlers.end;
    rightArrow._touchStart = rightHandlers.start;
    rightArrow._touchEnd = rightHandlers.end;

    // Observe sheet open/close state
    if (this.arrowObserver) {
      this.arrowObserver.disconnect();
    }

    this.arrowObserver = new MutationObserver(() => {
      swipeArrows.style.display = this.sheetOpen ? 'none' : 'flex';
    });

    this.arrowObserver.observe(document.body, { attributeFilter: ['class'] });

    this.arrowListenersAttached = true;
  }

  /* =========================================================
     TAB SWITCHING
     ========================================================= */

  /**
   * Switch to tab
   * @param {string} tabName - Tab identifier
   * @param {string} label - Tab label for accessibility
   */
  switchTab(tabName, label) {
    if (tabName === 'calculator' && !window.calculatorChunk) {
      window.calculatorChunk = 'requested';
    }

    const { navItems } = this.cachedElements;
    const tabContents = document.querySelectorAll('.tab-content');

    // Update nav items
    navItems.forEach(t => {
      const isActive = t.dataset.tab === tabName;
      t.classList.toggle('active', isActive);
      t.setAttribute('aria-selected', isActive);
      t.tabIndex = isActive ? 0 : -1;
    });

    // Update tab contents
    tabContents.forEach(c => {
      c.classList.remove('active', 'hidden');
      c.style.display = 'none';
      c.setAttribute('aria-hidden', 'true');
    });

    const target = document.getElementById(`${tabName}-tab`);
    if (target) {
      target.classList.add('active');
      target.classList.remove('hidden');
      target.style.display = 'block';
      target.setAttribute('aria-hidden', 'false');
    }

    // Initialize tab in app
    this.app.initializeTab(tabName);

    // Update state
    localStorage.setItem('pc_active_tab', tabName);
    window.scrollTo(0, 0);
    this.vibrate(CONSTANTS.VIBRATION_MS);

    // Update mobile indicator
    this.updateTabIndicator(tabName);
  }

  /**
   * Update mobile tab indicator dots
   * @param {string} tabName - Active tab name
   */
  updateTabIndicator(tabName) {
    if (window.innerWidth > 767) return;

    const { tabDots } = this.cachedElements;
    if (!tabDots) return;

    tabDots.forEach(dot => {
      const isActive = dot.dataset.tab === tabName;

      if (isActive) {
        dot.classList.add('active');
        Object.assign(dot.style, {
          width: '28px',
          height: '28px',
          minWidth: '28px',
          minHeight: '28px',
          background: 'linear-gradient(135deg, var(--neuro-accent), var(--neuro-accent-light))',
          boxShadow: '0 0 10px rgba(102, 126, 234, 0.5), 0 2px 6px rgba(102, 126, 234, 0.3), 4px 4px 8px var(--neuro-shadow-dark), -4px -4px 8px var(--neuro-shadow-light)',
          transform: 'scale(1.15)',
          opacity: '1'
        });
      } else {
        dot.classList.remove('active');
        Object.assign(dot.style, {
          width: '24px',
          height: '24px',
          minWidth: '24px',
          minHeight: '24px',
          background: 'var(--neuro-shadow-dark)',
          boxShadow: 'inset 2px 2px 4px var(--neuro-shadow-dark), inset -2px -2px 4px var(--neuro-shadow-light)',
          transform: 'scale(1)',
          opacity: '0.6'
        });
      }
    });
  }

  /* =========================================================
     UTILITIES
     ========================================================= */

  /**
   * Trigger device vibration
   * @param {number} duration - Vibration duration in ms
   */
  vibrate(duration) {
    if (navigator.vibrate) {
      navigator.vibrate(duration);
    }
  }

  /**
   * Render mobile indicator
   * @private
   */
  _renderMobileIndicator() {
    const indicatorHTML = this._getMobileIndicatorHTML();
    const headerEl = document.querySelector('.app-header');

    if (headerEl) {
      headerEl.insertAdjacentHTML('afterend', indicatorHTML);

      const updateVisibility = () => {
        const indicator = document.getElementById('mobile-tab-indicator');
        if (indicator) {
          indicator.style.display = window.innerWidth <= 767 ? 'flex' : 'none';
        }
      };

      updateVisibility();
      this.eventHandlers.resize = updateVisibility;
      window.addEventListener('resize', updateVisibility);

      // Dot click handlers
      document.querySelectorAll('.tab-dot').forEach(dot => {
        const clickHandler = () => this.switchTab(dot.dataset.tab, dot.title);
        dot.addEventListener('click', clickHandler);
        dot._clickHandler = clickHandler;
      });
    }
  }
/**
   * Get navigation HTML template
   * @private
   * @returns {string} HTML string
   */
  _getNavHTML() {
    return `
      <!-- CENTERED HEADER -->
      <div class="app-header">
        <img class="header-image" 
             src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/Header.png" 
             alt="Aanandoham Header">
      </div>

      <!-- DESKTOP NAV TABS -->
      <nav class="main-nav desktop-nav" role="navigation" aria-label="Main navigation">
        <ul class="nav-tabs" id="nav-tabs" role="tablist">
          <li class="nav-item active" data-tab="dashboard" data-label="Main Dashboard" role="tab" aria-selected="true" tabindex="0">
            <img class="nav-image" src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/NavDashboard.png" alt="Main Dashboard">
          </li>
          <li class="nav-item" data-tab="energy" data-label="Daily Energy Tracker" role="tab" aria-selected="false" tabindex="-1">
            <img class="nav-image" src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/NavEnergy.png" alt="Daily Energy Tracker">
          </li>
          <li class="nav-item" data-tab="tarot" data-label="Tarot Cards Guidance" role="tab" aria-selected="false" tabindex="-1">
            <img class="nav-image" src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/NavTarot.png" alt="Tarot Cards Guidance">
          </li>
          <li class="nav-item" data-tab="gratitude" data-label="Gratitude Practice" role="tab" aria-selected="false" tabindex="-1">
            <img class="nav-image" src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/NavGratitude.png" alt="Gratitude Practice">
          </li>
          <li class="nav-item" data-tab="happiness" data-label="Happiness Booster" role="tab" aria-selected="false" tabindex="-1">
            <img class="nav-image" src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/NavHappiness.png" alt="Happiness Booster">
          </li>
          <li class="nav-item" data-tab="journal" data-label="My Private Journal" role="tab" aria-selected="false" tabindex="-1">
            <img class="nav-image" src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/NavJournal.png" alt="My Private Journal">
          </li>
          <li class="nav-item" data-tab="meditations" data-label="Guided Meditations" role="tab" aria-selected="false" tabindex="-1">
            <img class="nav-image" src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/NavMeditations.png" alt="Guided Meditations">
          </li>
          <li class="nav-item" data-tab="flip-script" data-label="Flip The Script" role="tab" aria-selected="false" tabindex="-1">
            <img class="nav-image" src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/NavFlip.png" alt="Flip The Script">
          </li>
          <li class="nav-item" data-tab="calculator" data-label="Self Analysis Pro" role="tab" aria-selected="false" tabindex="-1">
            <img class="nav-image" src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/NavAnalysis.png" alt="Self Analysis Pro">
          </li>
          <li class="nav-item" data-tab="shadow-alchemy" data-label="Shadow Alchemy Lab" role="tab" aria-selected="false" tabindex="-1">
            <img class="nav-image" src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/NavShadow.png" alt="Shadow Alchemy Lab">
            <span class="premium-badge">PREMIUM</span>
          </li>
          <li class="nav-item" data-tab="karma-shop" data-label="Karma Shop" role="tab" aria-selected="false" tabindex="-1">
            <img class="nav-image" src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/NavShop.png" alt="Karma Shop">
          </li>
          <li class="nav-item" data-tab="chatbot" data-label="AI Assistant" role="tab" aria-selected="false" tabindex="-1">
            <img class="nav-image" src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/Chat.png" alt="AI Assistant">
          </li>
          <li class="nav-item nav-item-full-width" data-tab="community-hub" data-label="Community Hub" role="tab" aria-selected="false" tabindex="-1">
            <img class="nav-image" src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/CommunityHub.png" alt="Community Hub">
            <span class="nav-label">Community Hub</span>
          </li>
        </ul>
      </nav>

      <!-- CTA FOOTER -->
      <div id="cta-footer-wrapper"></div>

      <!-- MOBILE 4-BUTTON BAR -->
      <nav id="mobile-bottom-bar" class="mobile-bottom-bar mobile-bottom-bar-4" role="navigation" aria-label="Mobile navigation">
        <button class="mobile-tab" data-popup="miniapps" aria-haspopup="true" aria-expanded="false">
          <img src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/MiniApps.png" alt=""><span>Mini Apps</span>
        </button>
        <button class="mobile-tab" data-popup="features" aria-haspopup="true" aria-expanded="false">
          <img src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/Features.png" alt=""><span>Features</span>
        </button>
        <button class="mobile-tab active" data-tab="dashboard" aria-selected="true">
          <img src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/Dashboard.png" alt=""><span>Home</span>
        </button>
        <button class="mobile-tab" data-tab="community-hub" aria-selected="false">
          <img src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/Community.png" alt=""><span>Community</span>
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
      const leftBtn = mobileBar.querySelector('.left');
      const rightBtn = mobileBar.querySelector('.right');
      
      if (centerBtn?._clickHandler) centerBtn.removeEventListener('click', centerBtn._clickHandler);
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