/**
 * NavigationManager.js
 * Manages app navigation, tab switching, mobile gestures, and UI state.
 */

import UserTab from './User-Tab.js';

// ─── Constants ────────────────────────────────────────────────────────────────

const SWIPE_ORDER = [
  'dashboard', 'energy', 'tarot', 'gratitude', 'happiness',
  'journal', 'meditations', 'flip-script', 'calculator',
  'shadow-alchemy', 'karma-shop'
];

const C = {
  SWIPE_THRESHOLD:      120,
  SWIPE_TIME_MS:        300,
  OVERSCROLL_THRESHOLD: 150,
  VELOCITY_THRESHOLD:   1.0,
  MIN_DRAG_START:       20,
  VIBRATION_MS:         10,
  VIBRATION_SHEET_MS:   8,
  MIN_TOUCH_DURATION:   200,
  MAX_TOUCH_MOVEMENT:   15,
  ARROW_DEBOUNCE_MS:    400
};

// ─── NavigationManager ────────────────────────────────────────────────────────

export default class NavigationManager {
  constructor(app) {
    this.app    = app;
    this.userTab = new UserTab(app);

    this.cachedElements         = {};
    this.listenersAttached      = false;
    this.sheetOpen              = false;
    this.arrowListenersAttached = false;
    this.arrowDebounce          = false;
    this._userGestured          = false;

    this.eventHandlers = {
      touchStart: null, touchEnd: null,
      keydown: null, resize: null,
      sheetHandlers: []
    };

    this.arrowObserver = null;
    this.touchState    = { startTime: 0, startX: 0, startY: 0 };

    // ⚠️ FLAG: setupMobileBottomBar() checks window.innerWidth once at render time.
    // If the user resizes from desktop→mobile after init the bar won't be wired up.
    // Mitigated below with a resize listener that re-runs setup on breakpoint cross.
    this._mobileSetupDone = false;
    this._onResize = this._handleResize.bind(this);
    window.addEventListener('resize', this._onResize);
  }

  // ─── Resize guard ─────────────────────────────────────────────────────────

  _handleResize() {
    if (window.innerWidth <= 767 && !this._mobileSetupDone) {
      this.setupMobileBottomBar();
      this.setupSwipeArrows();
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  render() {
    const appContainer = document.getElementById('app-container');
    if (!appContainer) { console.error('App container not found'); return; }

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
      navItems:    document.querySelectorAll('.nav-item'),
      sheets:      document.querySelectorAll('.mobile-sheet'),
      sheetRows:   document.querySelectorAll('.sheet-row'),
      scrim:       document.getElementById('sheet-scrim'),
      mobileBar:   document.getElementById('mobile-bottom-bar'),
      swipeArrows: document.getElementById('swipe-arrows'),
      leftArrow:   document.getElementById('swipe-left'),
      rightArrow:  document.getElementById('swipe-right'),
      indicator:   document.getElementById('mobile-tab-indicator'),
      tabDots:     document.querySelectorAll('.tab-dot')
    };
  }

  // ─── Event setup ──────────────────────────────────────────────────────────

  setupEventListeners() {
    if (this.listenersAttached) return;
    this.cachedElements.navItems.forEach(tab => {
      const click = () => { this._userGestured = true; this.switchTab(tab.dataset.tab, tab.dataset.label); };
      const key   = e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.switchTab(tab.dataset.tab, tab.dataset.label); }
      };
      tab.addEventListener('click',   click);
      tab.addEventListener('keydown', key);
      tab._clickHandler = click;
      tab._keyHandler   = key;
    });
    this.listenersAttached = true;
  }

  setupKeyboardNavigation() {
    const handler = e => {
      if (e.key === 'Escape' && this.sheetOpen) { this.closeSheets(); return; }
      if (!this.sheetOpen) return;
      const rows = [...this.cachedElements.sheetRows];
      const idx  = rows.indexOf(document.activeElement);
      if (idx < 0) return;
      if (e.key === 'ArrowDown')                     { e.preventDefault(); rows[(idx + 1) % rows.length].focus(); }
      else if (e.key === 'ArrowUp')                  { e.preventDefault(); rows[(idx - 1 + rows.length) % rows.length].focus(); }
      else if (e.key === 'Enter' || e.key === ' ')   { e.preventDefault(); document.activeElement.click(); }
    };
    document.addEventListener('keydown', handler);
    this.eventHandlers.keydown = handler;
  }

  setupMobileBottomBar() {
    if (window.innerWidth > 767) return;
    if (this._mobileSetupDone) return;
    this._mobileSetupDone = true;

    const { mobileBar, sheets, scrim } = this.cachedElements;
    if (!mobileBar) return;

    const openSheet = id => {
      const sheet = document.getElementById(id);
      if (!sheet) return;
      sheet.setAttribute('aria-hidden', 'false');
      scrim.classList.add('visible');
      this.sheetOpen = true;
      document.body.classList.add('sheet-open');
      sheet.querySelector('.sheet-row')?.focus();
      this.vibrate(C.VIBRATION_MS);
    };

    mobileBar.querySelectorAll('.mobile-tab').forEach(btn => {
      const { popup, tab } = btn.dataset;
      let h;
      if (popup === 'miniapps')        h = e => { openSheet('sheet-miniapps'); e.currentTarget.setAttribute('aria-expanded','true'); };
      else if (popup === 'features')   h = e => { openSheet('sheet-features'); e.currentTarget.setAttribute('aria-expanded','true'); };
      else if (tab === 'dashboard')    h = () => { this.closeSheets(); this.switchTab('dashboard', 'Main Dashboard'); };
      else if (tab === 'community-hub')h = () => { this.closeSheets(); this.switchTab('community-hub', 'Community Hub'); };
      if (h) { btn.addEventListener('click', h); btn._clickHandler = h; }
    });

    if (scrim) {
      const h = () => this.closeSheets();
      scrim.addEventListener('click', h);
      scrim._clickHandler = h;
    }

    sheets.forEach(sheet => {
      const h = e => {
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
    scrim?.classList.remove('visible');
    mobileBar?.querySelectorAll('.mobile-tab').forEach(t => t.setAttribute('aria-expanded', 'false'));
    this.sheetOpen = false;
    document.body.classList.remove('sheet-open');
  }

  // ─── Swipe gestures ───────────────────────────────────────────────────────

  setupSwipeGestures() {
    if (this.eventHandlers.touchStart) window.removeEventListener('touchstart', this.eventHandlers.touchStart);
    if (this.eventHandlers.touchEnd)   window.removeEventListener('touchend',   this.eventHandlers.touchEnd);

    let startX = 0, startT = 0;

    const handleTouchStart = e => { this._userGestured = true; startX = e.touches[0].clientX; startT = Date.now(); };
    const handleTouchEnd   = e => {
      const dx = startX - e.changedTouches[0].clientX;
      if (Math.abs(dx) < C.SWIPE_THRESHOLD || Date.now() - startT > C.SWIPE_TIME_MS) return;
      const active = localStorage.getItem('pc_active_tab') || 'dashboard';
      let idx = SWIPE_ORDER.indexOf(active);
      idx = (idx + (dx > 0 ? 1 : -1) + SWIPE_ORDER.length) % SWIPE_ORDER.length;
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
      let startY = 0, startT = 0, dragging = false;

      const onStart = e => { startY = e.touches[0].clientY; startT = Date.now(); dragging = false; };
      const onMove  = e => {
        const dy = e.touches[0].clientY - startY;
        if (scroller.scrollTop === 0 && dy > C.MIN_DRAG_START) {
          dragging = true;
          sheet.style.transform  = `translateY(${Math.min(dy * 0.5, 150)}px)`;
          sheet.style.transition = 'none';
        }
      };
      const onEnd = e => {
        if (!dragging) return;
        const dy  = e.changedTouches[0].clientY - startY;
        const vel = dy / (Date.now() - startT);
        sheet.style.transition = 'transform .3s ease';
        sheet.style.transform  = '';
        if (dy > C.OVERSCROLL_THRESHOLD || vel > C.VELOCITY_THRESHOLD) { this.vibrate(C.VIBRATION_SHEET_MS); this.closeSheets(); }
        dragging = false;
      };

      sheet.addEventListener('touchstart', onStart, { passive: true });
      sheet.addEventListener('touchmove',  onMove,  { passive: true });
      sheet.addEventListener('touchend',   onEnd,   { passive: true });
      sheet._touchStartHandler = onStart;
      sheet._touchMoveHandler  = onMove;
      sheet._touchEndHandler   = onEnd;
    });
  }

  setupSwipeArrows() {
    if (window.innerWidth > 767) return;
    if (this.arrowListenersAttached) return;

    const { leftArrow, rightArrow, swipeArrows } = this.cachedElements;
    if (!leftArrow || !rightArrow || !swipeArrows) return;

    leftArrow.tabIndex  = -1;
    rightArrow.tabIndex = -1;
    leftArrow.style.padding  = '8px';
    rightArrow.style.padding = '8px';

    if (!leftArrow.querySelector('svg'))
      leftArrow.innerHTML  = `<svg viewBox="0 0 200 180" style="transform:scale(.5);pointer-events:none;"><path d="M115 10 L100 90 L115 170" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round"/></svg>`;
    if (!rightArrow.querySelector('svg'))
      rightArrow.innerHTML = `<svg viewBox="0 0 200 180" style="transform:scaleX(-1) scale(.5);pointer-events:none;"><path d="M115 10 L100 90 L115 170" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round"/></svg>`;

    const navigate = dir => {
      if (this.arrowDebounce) return;
      this.arrowDebounce = true;
      const active = localStorage.getItem('pc_active_tab') || 'dashboard';
      let idx = SWIPE_ORDER.indexOf(active);
      idx = dir === 'left'
        ? (idx - 1 + SWIPE_ORDER.length) % SWIPE_ORDER.length
        : (idx + 1) % SWIPE_ORDER.length;
      const navItem = document.querySelector(`[data-tab="${SWIPE_ORDER[idx]}"]`);
      if (navItem) this.switchTab(SWIPE_ORDER[idx], navItem.dataset.label);
      setTimeout(() => { this.arrowDebounce = false; }, C.ARROW_DEBOUNCE_MS);
    };

    const makeTouchHandlers = (dir, btn) => ({
      start: e => { e.preventDefault(); e.stopPropagation(); this.touchState = { startTime: Date.now(), startX: e.touches[0].clientX, startY: e.touches[0].clientY }; },
      end:   e => {
        e.preventDefault(); e.stopPropagation();
        const dur  = Date.now() - this.touchState.startTime;
        const dist = Math.hypot(e.changedTouches[0].clientX - this.touchState.startX, e.changedTouches[0].clientY - this.touchState.startY);
        if (dur < C.MIN_TOUCH_DURATION || dist > C.MAX_TOUCH_MOVEMENT) return;
        navigate(dir);
        setTimeout(() => btn.blur(), 0);
      }
    });

    const lh = makeTouchHandlers('left',  leftArrow);
    const rh = makeTouchHandlers('right', rightArrow);

    leftArrow.addEventListener('touchstart',  lh.start, { capture: true, passive: true });
    leftArrow.addEventListener('touchend',    lh.end,   { capture: true, passive: true });
    rightArrow.addEventListener('touchstart', rh.start, { capture: true, passive: true });
    rightArrow.addEventListener('touchend',   rh.end,   { capture: true, passive: true });
    leftArrow._touchStart  = lh.start; leftArrow._touchEnd  = lh.end;
    rightArrow._touchStart = rh.start; rightArrow._touchEnd = rh.end;

    if (this.arrowObserver) this.arrowObserver.disconnect();
    this.arrowObserver = new MutationObserver(() => {
      swipeArrows.style.display = this.sheetOpen ? 'none' : 'flex';
    });
    this.arrowObserver.observe(document.body, { attributeFilter: ['class'] });

    this.arrowListenersAttached = true;
  }

  // ─── Tab switching ────────────────────────────────────────────────────────

  /**
   * All DOM reads happen before RAF; all writes are batched inside RAF
   * to prevent forced reflows from interleaved read/write.
   */
  switchTab(tabName, label) {
    if (tabName === 'calculator' && !window.calculatorChunk) window.calculatorChunk = 'requested';

    const target = document.getElementById(`${tabName}-tab`);

    requestAnimationFrame(() => {
      const { navItems, mobileBar } = this.cachedElements;
      const tabContents = document.querySelectorAll('.tab-content');

      navItems.forEach(t => {
        const active = t.dataset.tab === tabName;
        t.classList.toggle('active', active);
        t.setAttribute('aria-selected', String(active));
        t.tabIndex = active ? 0 : -1;
      });

      tabContents.forEach(c => {
        c.classList.remove('active', 'hidden');
        c.style.display = 'none';
        c.setAttribute('aria-hidden', 'true');
      });

      if (target) {
        target.classList.add('active');
        target.classList.remove('hidden');
        target.style.display = 'block';
        target.setAttribute('aria-hidden', 'false');
      }

      this.app.initializeTab(tabName);

      mobileBar?.querySelectorAll('.mobile-tab[data-tab]').forEach(btn => {
        const active = btn.dataset.tab === tabName;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-selected', String(active));
      });

      this.updateTabIndicator(tabName);
    });

    localStorage.setItem('pc_active_tab', tabName);
    window.scrollTo(0, 0);
    this.vibrate(C.VIBRATION_MS);
  }

  updateTabIndicator(tabName) {
    if (window.innerWidth > 767) return;
    this.cachedElements.tabDots?.forEach(dot =>
      dot.classList.toggle('active', dot.dataset.tab === tabName)
    );
  }

  // ─── Utilities ────────────────────────────────────────────────────────────

  vibrate(ms) { if (this._userGestured && navigator.vibrate) navigator.vibrate(ms); }

  _renderMobileIndicator() {
    const headerEl = document.querySelector('.app-header');
    if (!headerEl) return;
    headerEl.insertAdjacentHTML('afterend', this._getMobileIndicatorHTML());

    const update = () => {
      const el = document.getElementById('mobile-tab-indicator');
      if (el) el.style.display = window.innerWidth <= 767 ? 'flex' : 'none';
    };
    update();
    // Reuse the class-level resize listener rather than adding another
    this.eventHandlers.resize = update;

    document.querySelectorAll('.tab-dot').forEach(dot => {
      const h = () => this.switchTab(dot.dataset.tab, dot.title);
      dot.addEventListener('click', h);
      dot._clickHandler = h;
    });
  }

  // ─── HTML builders ────────────────────────────────────────────────────────

  _getNavHTML() {
    return `
      <div class="app-header">
        <picture>
          <source media="(max-width: 768px)" srcset="/Tabs/Header-mobile.webp" type="image/webp" width="512" height="134">
          <source srcset="/Tabs/Header-desktop.webp" type="image/webp" width="1200" height="314">
          <img class="header-image" src="/Tabs/Header-desktop.webp" alt="Aanandoham Header"
               width="1200" height="314" loading="eager" fetchpriority="high" decoding="async"
               sizes="(max-width: 768px) 100vw, 1200px">
        </picture>
      </div>

      <nav class="main-nav desktop-nav" role="navigation" aria-label="Main navigation">
        <ul class="nav-tabs" id="nav-tabs" role="tablist">
          ${[
            ['dashboard',     'NavDashboard', 'Main Dashboard'],
            ['energy',        'NavEnergy',    'Daily Energy Tracker'],
            ['tarot',         'NavTarot',     'Tarot Cards Guidance'],
            ['gratitude',     'NavGratitude', 'Gratitude Practice'],
            ['happiness',     'NavHappiness', 'Happiness Booster'],
            ['journal',       'NavJournal',   'My Private Journal'],
            ['meditations',   'NavMeditations','Guided Meditations'],
            ['flip-script',   'NavFlip',      'Flip The Script'],
            ['calculator',    'NavAnalysis',  'Self Analysis Pro',    'PREMIUM'],
            ['shadow-alchemy','NavShadow',    'Shadow Alchemy Lab',   'PREMIUM'],
            ['karma-shop',    'NavShop',      'Karma Shop'],
            ['chatbot',       'Chat',         'AI Assistant']
          ].map(([tab, img, label, badge]) => `
            <li class="nav-item${tab === 'dashboard' ? ' active' : ''}" data-tab="${tab}" data-label="${label}"
                role="tab" aria-selected="${tab === 'dashboard'}" tabindex="${tab === 'dashboard' ? 0 : -1}">
              <picture><source srcset="/Tabs/${img}.webp" type="image/webp"><img class="nav-image" src="/Tabs/${img}.png" alt="${label}" width="48" height="48" loading="lazy" decoding="async"></picture>
              ${badge ? `<span class="premium-badge">${badge}</span>` : ''}
            </li>`).join('')}
        </ul>
      </nav>

      <div id="cta-footer-wrapper"></div>

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

      <div id="sheet-miniapps" class="mobile-sheet" role="dialog" aria-modal="true" aria-hidden="true">
        <div class="sheet-grip"></div><div class="sheet-header">Mini Apps</div>
        <div class="sheet-scroller">
          ${[
            ['flip-script',    'NavFlip',     'Flip Your Thoughts'],
            ['calculator',     'NavAnalysis', 'Analyze your \'Self\''],
            ['shadow-alchemy', 'NavShadow',   'Shadow Work'],
            ['chatbot',        'Chat',        'Aanandoham\'s AI Assistant']
          ].map(([tab, img, label]) => `
            <div class="sheet-row" data-tab="${tab}" role="menuitem" tabindex="0">
              <picture><source srcset="/Tabs/${img}.webp" type="image/webp"><img src="/Tabs/${img}.png" alt="" loading="lazy" decoding="async" width="48" height="48"></picture>
              <span>${label}</span>
            </div>`).join('')}
        </div>
      </div>

      <div id="sheet-features" class="mobile-sheet" role="dialog" aria-modal="true" aria-hidden="true">
        <div class="sheet-grip"></div><div class="sheet-header">Features</div>
        <div class="sheet-scroller">
          ${[
            ['happiness',   'NavHappiness',   'Happiness and Motivation'],
            ['gratitude',   'NavGratitude',   'Gratitude Enhancer'],
            ['journal',     'NavJournal',     'Write To Yourself'],
            ['energy',      'NavEnergy',      'Track Your Energies'],
            ['tarot',       'NavTarot',       'Tarot Cards Divinations'],
            ['meditations', 'NavMeditations', 'Aanandoham\'s Meditations'],
            ['karma-shop',  'NavShop',        'Spend Your Karma']
          ].map(([tab, img, label]) => `
            <div class="sheet-row" data-tab="${tab}" role="menuitem" tabindex="0">
              <picture><source srcset="/Tabs/${img}.webp" type="image/webp"><img src="/Tabs/${img}.png" alt="" loading="lazy" decoding="async" width="48" height="48"></picture>
              <span>${label}</span>
            </div>`).join('')}
        </div>
      </div>

      <div id="sheet-scrim" class="sheet-scrim"></div>

      <div id="swipe-arrows" class="swipe-arrows mobile-only">
        <button id="swipe-left"  class="swipe-arrow left"  aria-label="Previous feature" title="Swipe or click to go back"></button>
        <button id="swipe-right" class="swipe-arrow right" aria-label="Next feature"     title="Swipe or click to go forward"></button>
      </div>`;
  }

  _getMobileIndicatorHTML() {
    const tabs = [
      ['dashboard',      'Dashboard',     'DashDot',       true],
      ['energy',         'Energy',        'EnergyDot'],
      ['tarot',          'Tarot',         'TarotDot'],
      ['gratitude',      'Gratitude',     'GratitudeDot'],
      ['happiness',      'Happiness',     'HappinessDot'],
      ['journal',        'Journal',       'JournalDot'],
      ['meditations',    'Meditations',   'MeditationsDot'],
      ['flip-script',    'Flip Script',   'FlipDot'],
      ['calculator',     'Analysis',      'AnalysisDot'],
      ['shadow-alchemy', 'Shadow Alchemy','ShadowDot'],
      ['karma-shop',     'Karma Shop',    'ShopDot']
    ];
    return `
      <div id="mobile-tab-indicator" class="mobile-tab-indicator">
        ${tabs.map(([tab, title, img, active]) =>
          `<span class="tab-dot${active ? ' active' : ''}" role="button" data-tab="${tab}" title="${title}" aria-label="${title}">
            <picture><source srcset="/Tabs/Dots/${img}.webp" type="image/webp"><img src="/Tabs/Dots/${img}.png" alt="" role="presentation" loading="lazy" decoding="async" width="48" height="48"></picture>
          </span>`
        ).join('\n        ')}
      </div>`;
  }

  // ─── Cleanup ──────────────────────────────────────────────────────────────

  destroy() {
    window.removeEventListener('resize', this._onResize);

    if (this.eventHandlers.touchStart) window.removeEventListener('touchstart', this.eventHandlers.touchStart);
    if (this.eventHandlers.touchEnd)   window.removeEventListener('touchend',   this.eventHandlers.touchEnd);
    if (this.eventHandlers.keydown)    document.removeEventListener('keydown',  this.eventHandlers.keydown);

    this.cachedElements.navItems?.forEach(tab => {
      if (tab._clickHandler) tab.removeEventListener('click',   tab._clickHandler);
      if (tab._keyHandler)   tab.removeEventListener('keydown', tab._keyHandler);
    });

    const { mobileBar, scrim } = this.cachedElements;
    mobileBar?.querySelectorAll('.mobile-tab').forEach(btn => {
      if (btn._clickHandler) btn.removeEventListener('click', btn._clickHandler);
    });
    if (scrim?._clickHandler) scrim.removeEventListener('click', scrim._clickHandler);

    this.eventHandlers.sheetHandlers.forEach(({ element, handler }) =>
      element.removeEventListener('click', handler)
    );

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

    if (this.arrowObserver) { this.arrowObserver.disconnect(); this.arrowObserver = null; }

    this.eventHandlers    = { sheetHandlers: [] };
    this.cachedElements   = {};
    this.listenersAttached      = false;
    this.arrowListenersAttached = false;
    this._mobileSetupDone       = false;
  }
}