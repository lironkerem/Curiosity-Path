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
  'shadow-alchemy', 'karma-shop'
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

    this.cachedElements = {};
    this.listenersAttached = false;
    this.sheetOpen = false;
    this.arrowListenersAttached = false;

    this.eventHandlers = {
      touchStart: null,
      touchEnd: null,
      keydown: null,
      resize: null,
      sheetHandlers: []
    };

    this.arrowObserver = null;
    this._userGestured = false;
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

  render() {
    const appContainer = document.getElementById('app-container');
    if (!appContainer) {
      console.error('App container not found');
      return;
    }

    if (!document.querySelector('.app-header')) {
      appContainer.insertAdjacentHTML('afterbegin', this._getNavHTML());
    }

    if (!document.getElementById('mobile-tab-indicator')) {
      this._renderMobileIndicator();
    }

    if (!document.getElementById('user-dropdown')) {
      appContainer.insertAdjacentHTML('afterbegin', this.userTab.render());
      this.userTab.init();
    }

    this.cacheElements();
    this.setupEventListeners();
    this.setupSwipeGestures();
    this.setupKeyboardNavigation();
    this.setupMobileBottomBar();
    this.setupSwipeArrows();
    this.setupSheetSwipeClose();
  }

  cacheElements() {
    this.cachedElements = {
      navItems:   document.querySelectorAll('.nav-item'),
      sheets:     document.querySelectorAll('.mobile-sheet'),
      sheetRows:  document.querySelectorAll('.sheet-row'),
      scrim:      document.getElementById('sheet-scrim'),
      mobileBar:  document.getElementById('mobile-bottom-bar'),
      swipeArrows:document.getElementById('swipe-arrows'),
      leftArrow:  document.getElementById('swipe-left'),
      rightArrow: document.getElementById('swipe-right'),
      indicator:  document.getElementById('mobile-tab-indicator'),
      tabDots:    document.querySelectorAll('.tab-dot')
    };
  }

  /* =========================================================
     EVENT SETUP
     ========================================================= */

  setupEventListeners() {
    if (this.listenersAttached) return;

    this.cachedElements.navItems.forEach(tab => {
      const clickHandler = () => {
        this._userGestured = true;
        this.switchTab(tab.dataset.tab, tab.dataset.label);
      };
      const keyHandler = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.switchTab(tab.dataset.tab, tab.dataset.label);
        }
      };
      tab.addEventListener('click', clickHandler);
      tab.addEventListener('keydown', keyHandler);
      tab._clickHandler = clickHandler;
      tab._keyHandler   = keyHandler;
    });

    this.listenersAttached = true;
  }

  setupKeyboardNavigation() {
    const keydownHandler = (e) => {
      if (e.key === 'Escape' && this.sheetOpen) {
        this.closeSheets();
        return;
      }
      if (!this.sheetOpen) return;

      const rows = [...this.cachedElements.sheetRows];
      const idx  = rows.indexOf(document.activeElement);
      if (idx < 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        rows[(idx + 1) % rows.length].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        rows[(idx - 1 + rows.length) % rows.length].focus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        document.activeElement.click();
      }
    };

    document.addEventListener('keydown', keydownHandler);
    this.eventHandlers.keydown = keydownHandler;
  }

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
      sheet.querySelector('.sheet-row')?.focus();
      this.vibrate(CONSTANTS.VIBRATION_MS);
    };

    mobileBar.querySelectorAll('.mobile-tab').forEach(btn => {
      const { popup, tab } = btn.dataset;

      if (popup === 'miniapps') {
        const h = (e) => { openSheet('sheet-miniapps'); e.currentTarget.setAttribute('aria-expanded', 'true'); };
        btn.addEventListener('click', h);
        btn._clickHandler = h;
      } else if (popup === 'features') {
        const h = (e) => { openSheet('sheet-features'); e.currentTarget.setAttribute('aria-expanded', 'true'); };
        btn.addEventListener('click', h);
        btn._clickHandler = h;
      } else if (tab === 'dashboard') {
        const h = () => { this.closeSheets(); this.switchTab('dashboard', 'Main Dashboard'); };
        btn.addEventListener('click', h);
        btn._clickHandler = h;
      } else if (tab === 'community-hub') {
        const h = () => { this.closeSheets(); this.switchTab('community-hub', 'Community Hub'); };
        btn.addEventListener('click', h);
        btn._clickHandler = h;
      }
    });

    if (scrim) {
      const h = () => this.closeSheets();
      scrim.addEventListener('click', h);
      scrim._clickHandler = h;
    }

    sheets.forEach(sheet => {
      const h = (e) => {
        const row = e.target.closest('.sheet-row');
        if (!row) return;
        this.closeSheets();
        const navItem = document.querySelector(`[data-tab="${row.dataset.tab}"]`);
        const label   = navItem?.dataset.label || row.querySelector('span')?.textContent || row.dataset.tab;
        this.switchTab(row.dataset.tab, label);
      };
      sheet.addEventListener('click', h);
      this.eventHandlers.sheetHandlers.push({ element: sheet, handler: h });
    });
  }

  closeSheets() {
    const { sheets, scrim, mobileBar } = this.cachedElements;
    sheets.forEach(s => s.setAttribute('aria-hidden', 'true'));
    scrim.classList.remove('visible');
    mobileBar?.querySelectorAll('.mobile-tab').forEach(t => t.setAttribute('aria-expanded', 'false'));
    this.sheetOpen = false;
    document.body.classList.remove('sheet-open');
  }

  /* =========================================================
     SWIPE GESTURES
     ========================================================= */

  setupSwipeGestures() {
    if (this.eventHandlers.touchStart) {
      window.removeEventListener('touchstart', this.eventHandlers.touchStart);
    }
    if (this.eventHandlers.touchEnd) {
      window.removeEventListener('touchend', this.eventHandlers.touchEnd);
    }

    let touchStartX = 0, touchStartTime = 0;

    const handleTouchStart = (e) => {
      this._userGestured = true;
      touchStartX    = e.touches[0].clientX;
      touchStartTime = Date.now();
    };

    const handleTouchEnd = (e) => {
      const deltaX = touchStartX - e.changedTouches[0].clientX;
      const deltaT = Date.now() - touchStartTime;
      if (Math.abs(deltaX) < CONSTANTS.SWIPE_THRESHOLD || deltaT > CONSTANTS.SWIPE_TIME_MS) return;

      const active = localStorage.getItem('pc_active_tab') || 'dashboard';
      let idx = SWIPE_ORDER.indexOf(active);
      idx = (idx + (deltaX > 0 ? 1 : -1) + SWIPE_ORDER.length) % SWIPE_ORDER.length;

      const navItem = document.querySelector(`[data-tab="${SWIPE_ORDER[idx]}"]`);
      if (navItem) this.switchTab(SWIPE_ORDER[idx], navItem.dataset.label);
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend',   handleTouchEnd,   { passive: true });

    this.eventHandlers.touchStart = handleTouchStart;
    this.eventHandlers.touchEnd   = handleTouchEnd;
  }

  setupSheetSwipeClose() {
    this.cachedElements.sheets.forEach(sheet => {
      const scroller = sheet.querySelector('.sheet-scroller');
      if (!scroller) return;

      let startY = 0, startT = 0, isDragging = false;

      const touchStartHandler = (e) => {
        startY = e.touches[0].clientY;
        startT = Date.now();
        isDragging = false;
      };

      const touchMoveHandler = (e) => {
        const deltaY = e.touches[0].clientY - startY;
        if (scroller.scrollTop === 0 && deltaY > CONSTANTS.MIN_DRAG_START) {
          isDragging = true;
          sheet.style.transform  = `translateY(${Math.min(deltaY * 0.5, 150)}px)`;
          sheet.style.transition = 'none';
        }
      };

      const touchEndHandler = (e) => {
        if (!isDragging) return;
        const deltaY   = e.changedTouches[0].clientY - startY;
        const velocity = deltaY / (Date.now() - startT);
        sheet.style.transition = 'transform 0.3s ease';
        sheet.style.transform  = '';
        if (deltaY > CONSTANTS.OVERSCROLL_THRESHOLD || velocity > CONSTANTS.VELOCITY_THRESHOLD) {
          this.vibrate(CONSTANTS.VIBRATION_SHEET_MS);
          this.closeSheets();
        }
        isDragging = false;
      };

      sheet.addEventListener('touchstart', touchStartHandler, { passive: true });
      sheet.addEventListener('touchmove',  touchMoveHandler,  { passive: true });
      sheet.addEventListener('touchend',   touchEndHandler,   { passive: true });

      sheet._touchStartHandler = touchStartHandler;
      sheet._touchMoveHandler  = touchMoveHandler;
      sheet._touchEndHandler   = touchEndHandler;
    });
  }

  setupSwipeArrows() {
    if (window.innerWidth > 767) return;
    if (this.arrowListenersAttached) return;

    const { leftArrow, rightArrow, swipeArrows } = this.cachedElements;
    if (!leftArrow || !rightArrow || !swipeArrows) return;

    leftArrow.tabIndex  = -1;
    rightArrow.tabIndex = -1;

    if (!leftArrow.querySelector('svg')) {
      leftArrow.innerHTML  = `<svg viewBox="0 0 200 180" style="transform:scale(0.5);pointer-events:none;"><path d="M115 10 L100 90 L115 170" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round"/></svg>`;
    }
    if (!rightArrow.querySelector('svg')) {
      rightArrow.innerHTML = `<svg viewBox="0 0 200 180" style="transform:scaleX(-1) scale(0.5);pointer-events:none;"><path d="M115 10 L100 90 L115 170" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round"/></svg>`;
    }

    leftArrow.style.padding  = '8px';
    rightArrow.style.padding = '8px';

    const navigate = (direction) => {
      if (this.arrowDebounce) return;
      this.arrowDebounce = true;

      const active = localStorage.getItem('pc_active_tab') || 'dashboard';
      let idx = SWIPE_ORDER.indexOf(active);
      idx = direction === 'left'
        ? (idx - 1 + SWIPE_ORDER.length) % SWIPE_ORDER.length
        : (idx + 1) % SWIPE_ORDER.length;

      const navItem = document.querySelector(`[data-tab="${SWIPE_ORDER[idx]}"]`);
      if (navItem) this.switchTab(SWIPE_ORDER[idx], navItem.dataset.label);

      setTimeout(() => { this.arrowDebounce = false; }, CONSTANTS.ARROW_DEBOUNCE_MS);
    };

    const makeTouchHandlers = (direction, btn) => ({
      start: (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.touchState.startTime = Date.now();
        this.touchState.startX    = e.touches[0].clientX;
        this.touchState.startY    = e.touches[0].clientY;
      },
      end: (e) => {
        e.preventDefault();
        e.stopPropagation();
        const dur  = Date.now() - this.touchState.startTime;
        const dist = Math.hypot(
          e.changedTouches[0].clientX - this.touchState.startX,
          e.changedTouches[0].clientY - this.touchState.startY
        );
        if (dur < CONSTANTS.MIN_TOUCH_DURATION || dist > CONSTANTS.MAX_TOUCH_MOVEMENT) return;
        navigate(direction);
        setTimeout(() => btn.blur(), 0);
      }
    });

    const lh = makeTouchHandlers('left',  leftArrow);
    const rh = makeTouchHandlers('right', rightArrow);

    leftArrow.addEventListener('touchstart',  lh.start, { capture: true, passive: true });
    leftArrow.addEventListener('touchend',    lh.end,   { capture: true, passive: true });
    rightArrow.addEventListener('touchstart', rh.start, { capture: true, passive: true });
    rightArrow.addEventListener('touchend',   rh.end,   { capture: true, passive: true });

    leftArrow._touchStart  = lh.start;
    leftArrow._touchEnd    = lh.end;
    rightArrow._touchStart = rh.start;
    rightArrow._touchEnd   = rh.end;

    if (this.arrowObserver) this.arrowObserver.disconnect();
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
   * Switch to a tab.
   * All DOM writes are batched inside a single requestAnimationFrame
   * to prevent forced reflows from interleaved reads and writes.
   */
  switchTab(tabName, label) {
    if (tabName === 'calculator' && !window.calculatorChunk) {
      window.calculatorChunk = 'requested';
    }

    // ── Read phase (before RAF — no layout queries, just ID lookup) ──
    const target = document.getElementById(`${tabName}-tab`);

    // ── Write phase (batched — zero forced reflows) ──
    requestAnimationFrame(() => {
      const { navItems, mobileBar } = this.cachedElements;
      const tabContents = document.querySelectorAll('.tab-content');

      // Nav items
      navItems.forEach(t => {
        const isActive = t.dataset.tab === tabName;
        t.classList.toggle('active', isActive);
        t.setAttribute('aria-selected', String(isActive));
        t.tabIndex = isActive ? 0 : -1;
      });

      // Tab contents
      tabContents.forEach(c => {
        c.classList.remove('active', 'hidden');
        c.style.display = 'none';
        c.setAttribute('aria-hidden', 'true');
      });

      // Activate target
      if (target) {
        target.classList.add('active');
        target.classList.remove('hidden');
        target.style.display = 'block';
        target.setAttribute('aria-hidden', 'false');
      }

      // App init for this tab
      this.app.initializeTab(tabName);

      // Mobile bottom bar
      mobileBar?.querySelectorAll('.mobile-tab[data-tab]').forEach(btn => {
        const isActive = btn.dataset.tab === tabName;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', String(isActive));
      });

      // Indicator dots
      this.updateTabIndicator(tabName);
    });

    // These are safe outside RAF — no layout impact
    localStorage.setItem('pc_active_tab', tabName);
    window.scrollTo(0, 0);
    this.vibrate(CONSTANTS.VIBRATION_MS);
  }

  /**
   * Update mobile tab indicator dots.
   * CSS class toggle only — no geometry reads, no forced reflow.
   */
  updateTabIndicator(tabName) {
    if (window.innerWidth > 767) return;
    this.cachedElements.tabDots?.forEach(dot => {
      dot.classList.toggle('active', dot.dataset.tab === tabName);
    });
  }

  /* =========================================================
     UTILITIES
     ========================================================= */

  vibrate(duration) {
    if (this._userGestured && navigator.vibrate) navigator.vibrate(duration);
  }

  _renderMobileIndicator() {
    const headerEl = document.querySelector('.app-header');
    if (!headerEl) return;

    headerEl.insertAdjacentHTML('afterend', this._getMobileIndicatorHTML());

    const updateVisibility = () => {
      const indicator = document.getElementById('mobile-tab-indicator');
      if (indicator) indicator.style.display = window.innerWidth <= 767 ? 'flex' : 'none';
    };

    updateVisibility();
    this.eventHandlers.resize = updateVisibility;
    window.addEventListener('resize', updateVisibility);

    document.querySelectorAll('.tab-dot').forEach(dot => {
      const h = () => this.switchTab(dot.dataset.tab, dot.title);
      dot.addEventListener('click', h);
      dot._clickHandler = h;
    });
  }

  _getNavHTML() {
    return `
      <!-- CENTERED HEADER -->
      <div class="app-header">
        <picture>
          <source
            media="(max-width: 768px)"
            srcset="/Tabs/Header-mobile.webp"
            type="image/webp"
            width="512" height="134">
          <source
            srcset="/Tabs/Header-desktop.webp"
            type="image/webp"
            width="1200" height="314">
          <img class="header-image"
               src="/Tabs/Header-desktop.webp"
               alt="Aanandoham Header"
               width="1200" height="314"
               loading="eager"
               fetchpriority="high"
               decoding="async"
               sizes="(max-width: 768px) 100vw, 1200px">
        </picture>
      </div>

      <!-- DESKTOP NAV TABS -->
      <nav class="main-nav desktop-nav" role="navigation" aria-label="Main navigation">
        <ul class="nav-tabs" id="nav-tabs" role="tablist">
          <li class="nav-item active" data-tab="dashboard" data-label="Main Dashboard" role="tab" aria-selected="true" tabindex="0">
            <picture><source srcset="/Tabs/NavDashboard.webp" type="image/webp"><img class="nav-image" src="/Tabs/NavDashboard.png" alt="Main Dashboard" width="48" height="48" loading="lazy" decoding="async"></picture>
          </li>
          <li class="nav-item" data-tab="energy" data-label="Daily Energy Tracker" role="tab" aria-selected="false" tabindex="-1">
            <picture><source srcset="/Tabs/NavEnergy.webp" type="image/webp"><img class="nav-image" src="/Tabs/NavEnergy.png" alt="Daily Energy Tracker" width="48" height="48" loading="lazy" decoding="async"></picture>
          </li>
          <li class="nav-item" data-tab="tarot" data-label="Tarot Cards Guidance" role="tab" aria-selected="false" tabindex="-1">
            <picture><source srcset="/Tabs/NavTarot.webp" type="image/webp"><img class="nav-image" src="/Tabs/NavTarot.png" alt="Tarot Cards Guidance" width="48" height="48" loading="lazy" decoding="async"></picture>
          </li>
          <li class="nav-item" data-tab="gratitude" data-label="Gratitude Practice" role="tab" aria-selected="false" tabindex="-1">
            <picture><source srcset="/Tabs/NavGratitude.webp" type="image/webp"><img class="nav-image" src="/Tabs/NavGratitude.png" alt="Gratitude Practice" width="48" height="48" loading="lazy" decoding="async"></picture>
          </li>
          <li class="nav-item" data-tab="happiness" data-label="Happiness Booster" role="tab" aria-selected="false" tabindex="-1">
            <picture><source srcset="/Tabs/NavHappiness.webp" type="image/webp"><img class="nav-image" src="/Tabs/NavHappiness.png" alt="Happiness Booster" width="48" height="48" loading="lazy" decoding="async"></picture>
          </li>
          <li class="nav-item" data-tab="journal" data-label="My Private Journal" role="tab" aria-selected="false" tabindex="-1">
            <picture><source srcset="/Tabs/NavJournal.webp" type="image/webp"><img class="nav-image" src="/Tabs/NavJournal.png" alt="My Private Journal" width="48" height="48" loading="lazy" decoding="async"></picture>
          </li>
          <li class="nav-item" data-tab="meditations" data-label="Guided Meditations" role="tab" aria-selected="false" tabindex="-1">
            <picture><source srcset="/Tabs/NavMeditations.webp" type="image/webp"><img class="nav-image" src="/Tabs/NavMeditations.png" alt="Guided Meditations" width="48" height="48" loading="lazy" decoding="async"></picture>
          </li>
          <li class="nav-item" data-tab="flip-script" data-label="Flip The Script" role="tab" aria-selected="false" tabindex="-1">
            <picture><source srcset="/Tabs/NavFlip.webp" type="image/webp"><img class="nav-image" src="/Tabs/NavFlip.png" alt="Flip The Script" width="48" height="48" loading="lazy" decoding="async"></picture>
          </li>
          <li class="nav-item" data-tab="calculator" data-label="Self Analysis Pro" role="tab" aria-selected="false" tabindex="-1">
            <picture><source srcset="/Tabs/NavAnalysis.webp" type="image/webp"><img class="nav-image" src="/Tabs/NavAnalysis.png" alt="Self Analysis Pro" width="48" height="48" loading="lazy" decoding="async"></picture>
            <span class="premium-badge">PREMIUM</span>
          </li>
          <li class="nav-item" data-tab="shadow-alchemy" data-label="Shadow Alchemy Lab" role="tab" aria-selected="false" tabindex="-1">
            <picture><source srcset="/Tabs/NavShadow.webp" type="image/webp"><img class="nav-image" src="/Tabs/NavShadow.png" alt="Shadow Alchemy Lab" width="48" height="48" loading="lazy" decoding="async"></picture>
            <span class="premium-badge">PREMIUM</span>
          </li>
          <li class="nav-item" data-tab="karma-shop" data-label="Karma Shop" role="tab" aria-selected="false" tabindex="-1">
            <picture><source srcset="/Tabs/NavShop.webp" type="image/webp"><img class="nav-image" src="/Tabs/NavShop.png" alt="Karma Shop" width="48" height="48" loading="lazy" decoding="async"></picture>
          </li>
          <li class="nav-item" data-tab="chatbot" data-label="AI Assistant" role="tab" aria-selected="false" tabindex="-1">
            <picture><source srcset="/Tabs/Chat.webp" type="image/webp"><img class="nav-image" src="/Tabs/Chat.png" alt="AI Assistant" width="48" height="48" loading="lazy" decoding="async"></picture>
          </li>
        </ul>
      </nav>

      <!-- CTA FOOTER -->
      <div id="cta-footer-wrapper"></div>

      <!-- MOBILE 4-BUTTON BAR -->
      <nav id="mobile-bottom-bar" class="mobile-bottom-bar mobile-bottom-bar-4" aria-label="Mobile navigation">
        <div aria-label="Main navigation" style="display:contents">
          <button class="mobile-tab" data-popup="miniapps" aria-haspopup="dialog" aria-expanded="false" aria-label="Mini Apps">
            <picture><source srcset="/Tabs/MiniApps.webp" type="image/webp"><img src="/Tabs/MiniApps.png" alt="" loading="lazy" decoding="async" width="48" height="48"></picture><span aria-hidden="true">Mini Apps</span>
          </button>
          <button class="mobile-tab" data-popup="features" aria-haspopup="dialog" aria-expanded="false" aria-label="Features">
            <picture><source srcset="/Tabs/Features.webp" type="image/webp"><img src="/Tabs/Features.png" alt="" loading="lazy" decoding="async" width="48" height="48"></picture><span aria-hidden="true">Features</span>
          </button>
          <button class="mobile-tab" role="tab" data-tab="dashboard" aria-selected="false" aria-label="Home">
            <picture><source srcset="/Tabs/Dashboard.webp" type="image/webp"><img src="/Tabs/Dashboard.png" alt="" loading="lazy" decoding="async" width="48" height="48"></picture><span aria-hidden="true">Home</span>
          </button>
          <button class="mobile-tab" role="tab" data-tab="community-hub" aria-selected="false" aria-label="Community">
            <picture><source srcset="/Tabs/Community.webp" type="image/webp"><img src="/Tabs/Community.png" alt="" loading="lazy" decoding="async" width="48" height="48"></picture><span aria-hidden="true">Community</span>
          </button>
        </div>
      </nav>

      <!-- SHEETS -->
      <div id="sheet-miniapps" class="mobile-sheet" role="dialog" aria-modal="true" aria-hidden="true">
        <div class="sheet-grip"></div><div class="sheet-header">Mini Apps</div>
        <div class="sheet-scroller">
          <div class="sheet-row" data-tab="flip-script"    role="menuitem" tabindex="0"><picture><source srcset="/Tabs/NavFlip.webp"      type="image/webp"><img src="/Tabs/NavFlip.png"      alt="" loading="lazy" decoding="async" width="48" height="48"></picture><span>Flip Your Thoughts</span></div>
          <div class="sheet-row" data-tab="calculator"     role="menuitem" tabindex="0"><picture><source srcset="/Tabs/NavAnalysis.webp"  type="image/webp"><img src="/Tabs/NavAnalysis.png"  alt="" loading="lazy" decoding="async" width="48" height="48"></picture><span>Analyze your 'Self'</span></div>
          <div class="sheet-row" data-tab="shadow-alchemy" role="menuitem" tabindex="0"><picture><source srcset="/Tabs/NavShadow.webp"    type="image/webp"><img src="/Tabs/NavShadow.png"    alt="" loading="lazy" decoding="async" width="48" height="48"></picture><span>Shadow Work</span></div>
          <div class="sheet-row" data-tab="chatbot"        role="menuitem" tabindex="0"><picture><source srcset="/Tabs/Chat.webp"         type="image/webp"><img src="/Tabs/Chat.png"         alt="" loading="lazy" decoding="async" width="48" height="48"></picture><span>Aanandoham's AI Assistant</span></div>
        </div>
      </div>

      <div id="sheet-features" class="mobile-sheet" role="dialog" aria-modal="true" aria-hidden="true">
        <div class="sheet-grip"></div><div class="sheet-header">Features</div>
        <div class="sheet-scroller">
          <div class="sheet-row" data-tab="happiness"   role="menuitem" tabindex="0"><picture><source srcset="/Tabs/NavHappiness.webp"   type="image/webp"><img src="/Tabs/NavHappiness.png"   alt="" loading="lazy" decoding="async" width="48" height="48"></picture><span>Happiness and Motivation</span></div>
          <div class="sheet-row" data-tab="gratitude"   role="menuitem" tabindex="0"><picture><source srcset="/Tabs/NavGratitude.webp"   type="image/webp"><img src="/Tabs/NavGratitude.png"   alt="" loading="lazy" decoding="async" width="48" height="48"></picture><span>Gratitude Enhancer</span></div>
          <div class="sheet-row" data-tab="journal"     role="menuitem" tabindex="0"><picture><source srcset="/Tabs/NavJournal.webp"     type="image/webp"><img src="/Tabs/NavJournal.png"     alt="" loading="lazy" decoding="async" width="48" height="48"></picture><span>Write To Yourself</span></div>
          <div class="sheet-row" data-tab="energy"      role="menuitem" tabindex="0"><picture><source srcset="/Tabs/NavEnergy.webp"      type="image/webp"><img src="/Tabs/NavEnergy.png"      alt="" loading="lazy" decoding="async" width="48" height="48"></picture><span>Track Your Energies</span></div>
          <div class="sheet-row" data-tab="tarot"       role="menuitem" tabindex="0"><picture><source srcset="/Tabs/NavTarot.webp"       type="image/webp"><img src="/Tabs/NavTarot.png"       alt="" loading="lazy" decoding="async" width="48" height="48"></picture><span>Tarot Cards Divinations</span></div>
          <div class="sheet-row" data-tab="meditations" role="menuitem" tabindex="0"><picture><source srcset="/Tabs/NavMeditations.webp" type="image/webp"><img src="/Tabs/NavMeditations.png" alt="" loading="lazy" decoding="async" width="48" height="48"></picture><span>Aanandoham's Meditations</span></div>
          <div class="sheet-row" data-tab="karma-shop"  role="menuitem" tabindex="0"><picture><source srcset="/Tabs/NavShop.webp"        type="image/webp"><img src="/Tabs/NavShop.png"        alt="" loading="lazy" decoding="async" width="48" height="48"></picture><span>Spend Your Karma</span></div>
        </div>
      </div>

      <div id="sheet-scrim" class="sheet-scrim"></div>

      <!-- FLOATING SWIPE ARROWS (MOBILE ONLY) -->
      <div id="swipe-arrows" class="swipe-arrows mobile-only">
        <button id="swipe-left"  class="swipe-arrow left"  aria-label="Previous feature" title="Swipe or click to go back"></button>
        <button id="swipe-right" class="swipe-arrow right" aria-label="Next feature"     title="Swipe or click to go forward"></button>
      </div>
    `;
  }

  /**
   * Mobile indicator HTML.
   * No inline styles — all layout rules live in main-styles.css (#mobile-tab-indicator).
   */
  _getMobileIndicatorHTML() {
    const tabs = [
      { tab: 'dashboard',      title: 'Dashboard',      img: 'DashDot.png',        active: true },
      { tab: 'energy',         title: 'Energy',          img: 'EnergyDot.png'                    },
      { tab: 'tarot',          title: 'Tarot',           img: 'TarotDot.png'                     },
      { tab: 'gratitude',      title: 'Gratitude',       img: 'GratitudeDot.png'                 },
      { tab: 'happiness',      title: 'Happiness',       img: 'HappinessDot.png'                 },
      { tab: 'journal',        title: 'Journal',         img: 'JournalDot.png'                   },
      { tab: 'meditations',    title: 'Meditations',     img: 'MeditationsDot.png'               },
      { tab: 'flip-script',    title: 'Flip Script',     img: 'FlipDot.png'                      },
      { tab: 'calculator',     title: 'Analysis',        img: 'AnalysisDot.png'                  },
      { tab: 'shadow-alchemy', title: 'Shadow Alchemy',  img: 'ShadowDot.png'                    },
      { tab: 'karma-shop',     title: 'Karma Shop',      img: 'ShopDot.png'                      }
    ];

    const dots = tabs.map(t =>
      `<span class="tab-dot${t.active ? ' active' : ''}" role="button" data-tab="${t.tab}" title="${t.title}" aria-label="${t.title}">` +
      `<picture><source srcset="/Tabs/Dots/${t.img.replace('.png', '.webp')}" type="image/webp">` +
      `<img src="/Tabs/Dots/${t.img}" alt="" role="presentation" loading="lazy" decoding="async" width="48" height="48">` +
      `</picture></span>`
    ).join('\n      ');

    return `
      <!-- MOBILE TAB POSITION INDICATOR -->
      <div id="mobile-tab-indicator" class="mobile-tab-indicator">
        ${dots}
      </div>
    `;
  }

  /* =========================================================
     CLEANUP
     ========================================================= */

  destroy() {
    if (this.eventHandlers.touchStart) window.removeEventListener('touchstart', this.eventHandlers.touchStart);
    if (this.eventHandlers.touchEnd)   window.removeEventListener('touchend',   this.eventHandlers.touchEnd);
    if (this.eventHandlers.keydown)    document.removeEventListener('keydown',  this.eventHandlers.keydown);
    if (this.eventHandlers.resize)     window.removeEventListener('resize',     this.eventHandlers.resize);

    this.cachedElements.navItems?.forEach(tab => {
      if (tab._clickHandler) tab.removeEventListener('click',   tab._clickHandler);
      if (tab._keyHandler)   tab.removeEventListener('keydown', tab._keyHandler);
    });

    const { mobileBar, scrim } = this.cachedElements;
    mobileBar?.querySelectorAll('.mobile-tab').forEach(btn => {
      if (btn._clickHandler) btn.removeEventListener('click', btn._clickHandler);
    });
    if (scrim?._clickHandler) scrim.removeEventListener('click', scrim._clickHandler);

    this.eventHandlers.sheetHandlers.forEach(({ element, handler }) => {
      element.removeEventListener('click', handler);
    });

    this.cachedElements.sheets?.forEach(sheet => {
      if (sheet._touchStartHandler) sheet.removeEventListener('touchstart', sheet._touchStartHandler);
      if (sheet._touchMoveHandler)  sheet.removeEventListener('touchmove',  sheet._touchMoveHandler);
      if (sheet._touchEndHandler)   sheet.removeEventListener('touchend',   sheet._touchEndHandler);
    });

    const { leftArrow, rightArrow } = this.cachedElements;
    if (leftArrow?._touchStart) {
      leftArrow.removeEventListener('touchstart',  leftArrow._touchStart,  { capture: true });
      leftArrow.removeEventListener('touchend',    leftArrow._touchEnd,    { capture: true });
    }
    if (rightArrow?._touchStart) {
      rightArrow.removeEventListener('touchstart', rightArrow._touchStart, { capture: true });
      rightArrow.removeEventListener('touchend',   rightArrow._touchEnd,   { capture: true });
    }

    this.cachedElements.tabDots?.forEach(dot => {
      if (dot._clickHandler) dot.removeEventListener('click', dot._clickHandler);
    });

    if (this.arrowObserver) {
      this.arrowObserver.disconnect();
      this.arrowObserver = null;
    }

    this.eventHandlers  = { sheetHandlers: [] };
    this.cachedElements = {};
    this.listenersAttached      = false;
    this.arrowListenersAttached = false;
  }
}