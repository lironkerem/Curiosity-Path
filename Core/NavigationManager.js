/**
 * NavigationManager.js
 * Manages app navigation, tab switching, mobile gestures, and UI state.
 */

import UserTab from './User-Tab.js';

// ─── Constants ────────────────────────────────────────────────────────────────

const SWIPE_ORDER = Object.freeze([
  'dashboard', 'energy', 'tarot', 'gratitude', 'happiness',
  'journal', 'meditations', 'flip-script', 'calculator',
  'shadow-alchemy', 'karma-shop'
]);

// Whitelist of valid tab names — used to sanitise data-tab values before
// passing to querySelector and localStorage.
const VALID_TABS = new Set(SWIPE_ORDER);
VALID_TABS.add('chatbot');
VALID_TABS.add('community-hub');

const CONSTANTS = Object.freeze({
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
});

// ─── Safe localStorage ────────────────────────────────────────────────────────

const ls = {
  get:    k       => { try { return localStorage.getItem(k); }  catch { return null; } },
  set:    (k, v)  => { try { localStorage.setItem(k, v); }      catch { /* noop */ } }
};

// ─── NavigationManager ────────────────────────────────────────────────────────

export default class NavigationManager {
  constructor(app) {
    this.app    = app;
    this.userTab = new UserTab(app);

    this.cachedElements        = {};
    this.listenersAttached     = false;
    this.sheetOpen             = false;
    this.arrowListenersAttached = false;
    this.arrowDebounce         = false;
    this.arrowObserver         = null;

    // Must be true before vibrate() is called — Chrome blocks vibrate without a prior user gesture
    this._userHasInteracted    = false;

    this.touchState = { startTime: 0, startX: 0, startY: 0 };

    this.eventHandlers = {
      touchStart:    null,
      touchEnd:      null,
      keydown:       null,
      resize:        null,
      sheetHandlers: []
    };
  }

  // ─── Rendering ─────────────────────────────────────────────────────────────

  render() {
    const appContainer = document.getElementById('app-container');
    if (!appContainer) { console.error('[Nav] App container not found'); return; }

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
      swipeArrows: document.getElementById('swipe-arrows'),
      leftArrow:  document.getElementById('swipe-left'),
      rightArrow: document.getElementById('swipe-right'),
      indicator:  document.getElementById('mobile-tab-indicator'),
      tabDots:    document.querySelectorAll('.tab-dot')
    };
  }

  // ─── Event setup ───────────────────────────────────────────────────────────

  setupEventListeners() {
    if (this.listenersAttached) return;

    this.cachedElements.navItems.forEach(tab => {
      const tabName = tab.dataset.tab;
      if (!VALID_TABS.has(tabName)) return; // skip unknown tabs

      const clickHandler = () => {
        this._userHasInteracted = true;
        this.switchTab(tabName, tab.dataset.label);
      };
      const keyHandler   = e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.switchTab(tabName, tab.dataset.label);
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
    const handler = e => {
      if (e.key === 'Escape' && this.sheetOpen) { this.closeSheets(); return; }
      if (!this.sheetOpen) return;

      const rows    = [...this.cachedElements.sheetRows];
      const current = document.activeElement;
      const idx     = rows.indexOf(current);
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
    document.addEventListener('keydown', handler);
    this.eventHandlers.keydown = handler;
  }

  setupMobileBottomBar() {
    if (window.innerWidth > 767) return;

    const { mobileBar, sheets, scrim } = this.cachedElements;
    if (!mobileBar) return;

    const openSheet = id => {
      const sheet = document.getElementById(id);
      if (!sheet) return;
      sheet.setAttribute('aria-hidden', 'false');
      scrim?.classList.add('visible');
      this.sheetOpen = true;
      document.body.classList.add('sheet-open');
      sheet.querySelector('.sheet-row')?.focus();
      this._vibrate(CONSTANTS.VIBRATION_MS);
    };

    mobileBar.querySelectorAll('.mobile-tab').forEach(btn => {
      const popup   = btn.dataset.popup;
      const tabName = btn.dataset.tab;

      if (popup === 'miniapps') {
        const h = e => { openSheet('sheet-miniapps'); e.currentTarget.setAttribute('aria-expanded', 'true'); };
        btn.addEventListener('click', h);
        btn._clickHandler = h;
      } else if (popup === 'features') {
        const h = e => { openSheet('sheet-features'); e.currentTarget.setAttribute('aria-expanded', 'true'); };
        btn.addEventListener('click', h);
        btn._clickHandler = h;
      } else if (tabName === 'dashboard') {
        const h = () => { this.closeSheets(); this.switchTab('dashboard', 'Main Dashboard'); };
        btn.addEventListener('click', h);
        btn._clickHandler = h;
      } else if (tabName === 'community-hub') {
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
      const h = e => {
        const row     = e.target.closest('.sheet-row');
        if (!row) return;
        const tabName = row.dataset.tab;
        if (!VALID_TABS.has(tabName)) return; // whitelist check
        this._userHasInteracted = true;
        this.closeSheets();
        const navItem = document.querySelector(`[data-tab="${tabName}"]`);
        const label   = navItem?.dataset.label || row.querySelector('span')?.textContent || tabName;
        this.switchTab(tabName, label);
      };
      sheet.addEventListener('click', h);
      this.eventHandlers.sheetHandlers.push({ element: sheet, handler: h });
    });
  }

  closeSheets() {
    const { sheets, scrim, mobileBar } = this.cachedElements;
    sheets?.forEach(s => s.setAttribute('aria-hidden', 'true'));
    scrim?.classList.remove('visible');
    mobileBar?.querySelectorAll('.mobile-tab').forEach(t => t.setAttribute('aria-expanded', 'false'));
    this.sheetOpen = false;
    document.body.classList.remove('sheet-open');
  }

  // ─── Swipe gestures ────────────────────────────────────────────────────────

  setupSwipeGestures() {
    if (this.eventHandlers.touchStart) window.removeEventListener('touchstart', this.eventHandlers.touchStart);
    if (this.eventHandlers.touchEnd)   window.removeEventListener('touchend',   this.eventHandlers.touchEnd);

    let startX = 0, startT = 0;

    const onStart = e => { startX = e.touches[0].clientX; startT = Date.now(); };
    const onEnd   = e => {
      const deltaX = startX - e.changedTouches[0].clientX;
      if (Math.abs(deltaX) < CONSTANTS.SWIPE_THRESHOLD || Date.now() - startT > CONSTANTS.SWIPE_TIME_MS) return;
      const active = ls.get('pc_active_tab') || 'dashboard';
      let idx      = SWIPE_ORDER.indexOf(active);
      idx          = (idx + (deltaX > 0 ? 1 : -1) + SWIPE_ORDER.length) % SWIPE_ORDER.length;
      const nav    = document.querySelector(`[data-tab="${SWIPE_ORDER[idx]}"]`);
      if (nav) this.switchTab(SWIPE_ORDER[idx], nav.dataset.label);
    };

    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchend',   onEnd,   { passive: true });
    this.eventHandlers.touchStart = onStart;
    this.eventHandlers.touchEnd   = onEnd;
  }

  setupSheetSwipeClose() {
    this.cachedElements.sheets?.forEach(sheet => {
      const scroller = sheet.querySelector('.sheet-scroller');
      if (!scroller) return;

      let startY = 0, startT = 0, isDragging = false;

      const onStart = e => { startY = e.touches[0].clientY; startT = Date.now(); isDragging = false; };
      const onMove  = e => {
        const deltaY = e.touches[0].clientY - startY;
        if (scroller.scrollTop === 0 && deltaY > CONSTANTS.MIN_DRAG_START) {
          isDragging = true;
          sheet.style.transform  = `translateY(${Math.min(deltaY * 0.5, 150)}px)`;
          sheet.style.transition = 'none';
        }
      };
      const onEnd   = e => {
        if (!isDragging) return;
        const deltaY   = e.changedTouches[0].clientY - startY;
        const velocity = deltaY / Math.max(1, Date.now() - startT);
        sheet.style.transition = 'transform 0.3s ease';
        sheet.style.transform  = '';
        if (deltaY > CONSTANTS.OVERSCROLL_THRESHOLD || velocity > CONSTANTS.VELOCITY_THRESHOLD) {
          this._vibrate(CONSTANTS.VIBRATION_SHEET_MS);
          this.closeSheets();
        }
        isDragging = false;
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
    if (window.innerWidth > 767 || this.arrowListenersAttached) return;

    const { leftArrow, rightArrow, swipeArrows } = this.cachedElements;
    if (!leftArrow || !rightArrow || !swipeArrows) return;

    leftArrow.tabIndex  = -1;
    rightArrow.tabIndex = -1;

    if (!leftArrow.querySelector('svg')) {
      leftArrow.innerHTML  = `<svg viewBox="0 0 200 180" style="transform:scale(0.5);pointer-events:none;" aria-hidden="true"><path d="M115 10 L100 90 L115 170" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round"/></svg>`;
    }
    if (!rightArrow.querySelector('svg')) {
      rightArrow.innerHTML = `<svg viewBox="0 0 200 180" style="transform:scaleX(-1) scale(0.5);pointer-events:none;" aria-hidden="true"><path d="M115 10 L100 90 L115 170" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round"/></svg>`;
    }

    leftArrow.style.padding  = '8px';
    rightArrow.style.padding = '8px';

    const navigate = dir => {
      if (this.arrowDebounce) return;
      this.arrowDebounce = true;
      const active = ls.get('pc_active_tab') || 'dashboard';
      let idx      = SWIPE_ORDER.indexOf(active);
      idx          = dir === 'left'
        ? (idx - 1 + SWIPE_ORDER.length) % SWIPE_ORDER.length
        : (idx + 1) % SWIPE_ORDER.length;
      const nav = document.querySelector(`[data-tab="${SWIPE_ORDER[idx]}"]`);
      if (nav) this.switchTab(SWIPE_ORDER[idx], nav.dataset.label);
      setTimeout(() => { this.arrowDebounce = false; }, CONSTANTS.ARROW_DEBOUNCE_MS);
    };

    const mkHandlers = (dir, btn) => {
      const start = e => {
        e.stopPropagation();
        this.touchState = { startTime: Date.now(), startX: e.touches[0].clientX, startY: e.touches[0].clientY };
      };
      const end = e => {
        e.stopPropagation();
        const dur  = Date.now() - this.touchState.startTime;
        const dist = Math.hypot(
          e.changedTouches[0].clientX - this.touchState.startX,
          e.changedTouches[0].clientY - this.touchState.startY
        );
        if (dur < CONSTANTS.MIN_TOUCH_DURATION || dist > CONSTANTS.MAX_TOUCH_MOVEMENT) return;
        this._userHasInteracted = true;
        navigate(dir);
        setTimeout(() => btn.blur(), 0);
      };
      return { start, end };
    };

    const lh = mkHandlers('left',  leftArrow);
    const rh = mkHandlers('right', rightArrow);

    leftArrow.addEventListener('touchstart',  lh.start, { capture: true, passive: true });
    leftArrow.addEventListener('touchend',    lh.end,   { capture: true, passive: true });
    rightArrow.addEventListener('touchstart', rh.start, { capture: true, passive: true });
    rightArrow.addEventListener('touchend',   rh.end,   { capture: true, passive: true });

    leftArrow._touchStart  = lh.start; leftArrow._touchEnd  = lh.end;
    rightArrow._touchStart = rh.start; rightArrow._touchEnd = rh.end;

    this.arrowObserver?.disconnect();
    this.arrowObserver = new MutationObserver(() => {
      swipeArrows.style.display = this.sheetOpen ? 'none' : 'flex';
    });
    this.arrowObserver.observe(document.body, { attributeFilter: ['class'] });

    this.arrowListenersAttached = true;
  }

  // ─── Tab switching ─────────────────────────────────────────────────────────

  switchTab(tabName, label) {
    // Whitelist check — prevents storage/DOM injection via untrusted data-tab
    if (!VALID_TABS.has(tabName)) {
      console.warn(`[Nav] switchTab: unknown tab "${tabName}"`);
      return;
    }

    const tabContents = document.querySelectorAll('.tab-content');

    this.cachedElements.navItems?.forEach(t => {
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

    const target = document.getElementById(`${tabName}-tab`);
    if (target) {
      target.classList.add('active');
      target.classList.remove('hidden');
      target.style.display = 'block';
      target.setAttribute('aria-hidden', 'false');
    }

    this.app.initializeTab(tabName);
    ls.set('pc_active_tab', tabName);
    window.scrollTo(0, 0);
    this._vibrate(CONSTANTS.VIBRATION_MS);

    this.cachedElements.mobileBar
      ?.querySelectorAll('.mobile-tab[data-tab]')
      .forEach(btn => {
        const active = btn.dataset.tab === tabName;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-selected', String(active));
      });

    this.updateTabIndicator(tabName);
  }

  updateTabIndicator(tabName) {
    if (window.innerWidth > 767) return;
    this.cachedElements.tabDots?.forEach(dot => {
      const active = dot.dataset.tab === tabName;
      dot.classList.toggle('active', active);
      Object.assign(dot.style, active ? {
        width: '28px', height: '28px', minWidth: '28px', minHeight: '28px',
        background:  'linear-gradient(135deg, var(--neuro-accent), var(--neuro-accent-light))',
        boxShadow:   '0 0 10px rgba(102,126,234,.5), 0 2px 6px rgba(102,126,234,.3), 4px 4px 8px var(--neuro-shadow-dark), -4px -4px 8px var(--neuro-shadow-light)',
        transform:   'scale(1.15)',
        opacity:     '1'
      } : {
        width: '24px', height: '24px', minWidth: '24px', minHeight: '24px',
        background:  'var(--neuro-shadow-dark)',
        boxShadow:   'inset 2px 2px 4px var(--neuro-shadow-dark), inset -2px -2px 4px var(--neuro-shadow-light)',
        transform:   'scale(1)',
        opacity:     '0.6'
      });
    });
  }

  // ─── Utilities ─────────────────────────────────────────────────────────────

  _vibrate(duration) {
    // Chrome (and other browsers) block vibrate until the user has produced a gesture.
    // We track this via _userHasInteracted, which is set on the first real click/touch.
    if (!this._userHasInteracted) return;
    if (navigator.vibrate) {
      try { navigator.vibrate(duration); } catch { /* non-critical */ }
    }
  }

  _renderMobileIndicator() {
    const indicatorHTML = this._getMobileIndicatorHTML();
    const headerEl      = document.querySelector('.app-header');
    if (!headerEl) return;

    headerEl.insertAdjacentHTML('afterend', indicatorHTML);

    const update = () => {
      const el = document.getElementById('mobile-tab-indicator');
      if (el) el.style.display = window.innerWidth <= 767 ? 'flex' : 'none';
    };
    update();
    this.eventHandlers.resize = update;
    window.addEventListener('resize', update);

    document.querySelectorAll('.tab-dot').forEach(dot => {
      const tabName = dot.dataset.tab;
      if (!VALID_TABS.has(tabName)) return;
      const h = () => this.switchTab(tabName, dot.title);
      dot.addEventListener('click', h);
      dot._clickHandler = h;
    });
  }

  _getNavHTML() {
    // Nav images: explicit width/height + aspect-ratio via object-fit prevents
    // the Lighthouse "image aspect ratio" warning (images are square, displayed square).
    return `
      <div class="app-header">
        <picture>
          <source srcset="/public/Tabs/Header.webp" type="image/webp">
          <img class="header-image" src="/public/Tabs/Header.png"
               alt="The Curiosity Path" width="1280" height="400"
               loading="eager" fetchpriority="high" decoding="async">
        </picture>
      </div>

      <nav class="main-nav desktop-nav" role="navigation" aria-label="Main navigation">
        <ul class="nav-tabs" id="nav-tabs" role="tablist">
          <li class="nav-item active" data-tab="dashboard"     data-label="Main Dashboard"    role="tab" aria-selected="true"  tabindex="0">  <picture><source srcset="/public/Tabs/NavDashboard.webp"  type="image/webp"><img class="nav-image" src="/public/Tabs/NavDashboard.png"  alt="Main Dashboard"    width="48" height="48" loading="lazy" decoding="async" style="aspect-ratio:1;object-fit:contain;"></picture></li>
          <li class="nav-item"        data-tab="energy"        data-label="Daily Energy Tracker" role="tab" aria-selected="false" tabindex="-1"><picture><source srcset="/public/Tabs/NavEnergy.webp"     type="image/webp"><img class="nav-image" src="/public/Tabs/NavEnergy.png"     alt="Daily Energy Tracker" width="48" height="48" loading="lazy" decoding="async" style="aspect-ratio:1;object-fit:contain;"></picture></li>
          <li class="nav-item"        data-tab="tarot"         data-label="Tarot Cards Guidance" role="tab" aria-selected="false" tabindex="-1"><picture><source srcset="/public/Tabs/NavTarot.webp"      type="image/webp"><img class="nav-image" src="/public/Tabs/NavTarot.png"      alt="Tarot Cards Guidance" width="48" height="48" loading="lazy" decoding="async" style="aspect-ratio:1;object-fit:contain;"></picture></li>
          <li class="nav-item"        data-tab="gratitude"     data-label="Gratitude Practice"   role="tab" aria-selected="false" tabindex="-1"><picture><source srcset="/public/Tabs/NavGratitude.webp"  type="image/webp"><img class="nav-image" src="/public/Tabs/NavGratitude.png"  alt="Gratitude Practice"   width="48" height="48" loading="lazy" decoding="async" style="aspect-ratio:1;object-fit:contain;"></picture></li>
          <li class="nav-item"        data-tab="happiness"     data-label="Happiness Booster"    role="tab" aria-selected="false" tabindex="-1"><picture><source srcset="/public/Tabs/NavHappiness.webp"  type="image/webp"><img class="nav-image" src="/public/Tabs/NavHappiness.png"  alt="Happiness Booster"    width="48" height="48" loading="lazy" decoding="async" style="aspect-ratio:1;object-fit:contain;"></picture></li>
          <li class="nav-item"        data-tab="journal"       data-label="My Private Journal"   role="tab" aria-selected="false" tabindex="-1"><picture><source srcset="/public/Tabs/NavJournal.webp"    type="image/webp"><img class="nav-image" src="/public/Tabs/NavJournal.png"    alt="My Private Journal"   width="48" height="48" loading="lazy" decoding="async" style="aspect-ratio:1;object-fit:contain;"></picture></li>
          <li class="nav-item"        data-tab="meditations"   data-label="Guided Meditations"   role="tab" aria-selected="false" tabindex="-1"><picture><source srcset="/public/Tabs/NavMeditations.webp" type="image/webp"><img class="nav-image" src="/public/Tabs/NavMeditations.png" alt="Guided Meditations"   width="48" height="48" loading="lazy" decoding="async" style="aspect-ratio:1;object-fit:contain;"></picture></li>
          <li class="nav-item"        data-tab="flip-script"   data-label="Flip The Script"      role="tab" aria-selected="false" tabindex="-1"><picture><source srcset="/public/Tabs/NavFlip.webp"       type="image/webp"><img class="nav-image" src="/public/Tabs/NavFlip.png"       alt="Flip The Script"      width="48" height="48" loading="lazy" decoding="async" style="aspect-ratio:1;object-fit:contain;"></picture></li>
          <li class="nav-item"        data-tab="calculator"    data-label="Self Analysis Pro"    role="tab" aria-selected="false" tabindex="-1"><picture><source srcset="/public/Tabs/NavAnalysis.webp"   type="image/webp"><img class="nav-image" src="/public/Tabs/NavAnalysis.png"   alt="Self Analysis Pro"    width="48" height="48" loading="lazy" decoding="async" style="aspect-ratio:1;object-fit:contain;"></picture></li>
          <li class="nav-item"        data-tab="shadow-alchemy" data-label="Shadow Alchemy Lab"  role="tab" aria-selected="false" tabindex="-1"><picture><source srcset="/public/Tabs/NavShadow.webp"     type="image/webp"><img class="nav-image" src="/public/Tabs/NavShadow.png"     alt="Shadow Alchemy Lab"   width="48" height="48" loading="lazy" decoding="async" style="aspect-ratio:1;object-fit:contain;"></picture><span class="premium-badge">PREMIUM</span></li>
          <li class="nav-item"        data-tab="karma-shop"    data-label="Karma Shop"           role="tab" aria-selected="false" tabindex="-1"><picture><source srcset="/public/Tabs/NavShop.webp"       type="image/webp"><img class="nav-image" src="/public/Tabs/NavShop.png"       alt="Karma Shop"           width="48" height="48" loading="lazy" decoding="async" style="aspect-ratio:1;object-fit:contain;"></picture></li>
          <li class="nav-item"        data-tab="chatbot"       data-label="AI Assistant"         role="tab" aria-selected="false" tabindex="-1"><picture><source srcset="/public/Tabs/Chat.webp"           type="image/webp"><img class="nav-image" src="/public/Tabs/Chat.png"           alt="AI Assistant"         width="48" height="48" loading="lazy" decoding="async" style="aspect-ratio:1;object-fit:contain;"></picture></li>
        </ul>
      </nav>

      <div id="cta-footer-wrapper"></div>

      <nav id="mobile-bottom-bar" class="mobile-bottom-bar mobile-bottom-bar-4" role="navigation" aria-label="Mobile navigation">
        <button type="button" class="mobile-tab" data-popup="miniapps"     aria-haspopup="true" aria-expanded="false"><picture><source srcset="/public/Tabs/MiniApps.webp"  type="image/webp"><img src="/public/Tabs/MiniApps.png"  alt="" aria-hidden="true" loading="lazy" decoding="async" width="48" height="48" style="aspect-ratio:1;object-fit:contain;"></picture><span>Mini Apps</span></button>
        <button type="button" class="mobile-tab" data-popup="features"     aria-haspopup="true" aria-expanded="false"><picture><source srcset="/public/Tabs/Features.webp"  type="image/webp"><img src="/public/Tabs/Features.png"  alt="" aria-hidden="true" loading="lazy" decoding="async" width="48" height="48" style="aspect-ratio:1;object-fit:contain;"></picture><span>Features</span></button>
        <button type="button" class="mobile-tab" data-tab="dashboard"      aria-selected="false"                    ><picture><source srcset="/public/Tabs/Dashboard.webp"  type="image/webp"><img src="/public/Tabs/Dashboard.png"  alt="" aria-hidden="true" loading="lazy" decoding="async" width="48" height="48" style="aspect-ratio:1;object-fit:contain;"></picture><span>Home</span></button>
        <button type="button" class="mobile-tab" data-tab="community-hub"  aria-selected="false"                    ><picture><source srcset="/public/Tabs/Community.webp"  type="image/webp"><img src="/public/Tabs/Community.png"  alt="" aria-hidden="true" loading="lazy" decoding="async" width="48" height="48" style="aspect-ratio:1;object-fit:contain;"></picture><span>Community</span></button>
      </nav>

      <div id="sheet-miniapps" class="mobile-sheet" role="dialog" aria-modal="true" aria-hidden="true" aria-label="Mini Apps">
        <div class="sheet-grip" aria-hidden="true"></div>
        <div class="sheet-header">Mini Apps</div>
        <div class="sheet-scroller">
          <div class="sheet-row" data-tab="flip-script"   role="button" tabindex="0" aria-label="Flip Your Thoughts"><picture><source srcset="/public/Tabs/NavFlip.webp"     type="image/webp"><img src="/public/Tabs/NavFlip.png"     alt="" aria-hidden="true" loading="lazy" decoding="async" width="48" height="48" style="aspect-ratio:1;object-fit:contain;"></picture><span>Flip Your Thoughts</span></div>
          <div class="sheet-row" data-tab="calculator"    role="button" tabindex="0" aria-label="Analyze your Self"> <picture><source srcset="/public/Tabs/NavAnalysis.webp"  type="image/webp"><img src="/public/Tabs/NavAnalysis.png"  alt="" aria-hidden="true" loading="lazy" decoding="async" width="48" height="48" style="aspect-ratio:1;object-fit:contain;"></picture><span>Analyze your 'Self'</span></div>
          <div class="sheet-row" data-tab="shadow-alchemy" role="button" tabindex="0" aria-label="Shadow Work">     <picture><source srcset="/public/Tabs/NavShadow.webp"    type="image/webp"><img src="/public/Tabs/NavShadow.png"    alt="" aria-hidden="true" loading="lazy" decoding="async" width="48" height="48" style="aspect-ratio:1;object-fit:contain;"></picture><span>Shadow Work</span></div>
          <div class="sheet-row" data-tab="chatbot"       role="button" tabindex="0" aria-label="AI Assistant">     <picture><source srcset="/public/Tabs/Chat.webp"          type="image/webp"><img src="/public/Tabs/Chat.png"          alt="" aria-hidden="true" loading="lazy" decoding="async" width="48" height="48" style="aspect-ratio:1;object-fit:contain;"></picture><span>Aanandoham's AI Assistant</span></div>
        </div>
      </div>

      <div id="sheet-features" class="mobile-sheet" role="dialog" aria-modal="true" aria-hidden="true" aria-label="Features">
        <div class="sheet-grip" aria-hidden="true"></div>
        <div class="sheet-header">Features</div>
        <div class="sheet-scroller">
          <div class="sheet-row" data-tab="happiness"   role="button" tabindex="0" aria-label="Happiness and Motivation"><picture><source srcset="/public/Tabs/NavHappiness.webp"  type="image/webp"><img src="/public/Tabs/NavHappiness.png"  alt="" aria-hidden="true" loading="lazy" decoding="async" width="48" height="48" style="aspect-ratio:1;object-fit:contain;"></picture><span>Happiness and Motivation</span></div>
          <div class="sheet-row" data-tab="gratitude"   role="button" tabindex="0" aria-label="Gratitude Enhancer">    <picture><source srcset="/public/Tabs/NavGratitude.webp"  type="image/webp"><img src="/public/Tabs/NavGratitude.png"  alt="" aria-hidden="true" loading="lazy" decoding="async" width="48" height="48" style="aspect-ratio:1;object-fit:contain;"></picture><span>Gratitude Enhancer</span></div>
          <div class="sheet-row" data-tab="journal"     role="button" tabindex="0" aria-label="Write To Yourself">    <picture><source srcset="/public/Tabs/NavJournal.webp"    type="image/webp"><img src="/public/Tabs/NavJournal.png"    alt="" aria-hidden="true" loading="lazy" decoding="async" width="48" height="48" style="aspect-ratio:1;object-fit:contain;"></picture><span>Write To Yourself</span></div>
          <div class="sheet-row" data-tab="energy"      role="button" tabindex="0" aria-label="Track Your Energies">  <picture><source srcset="/public/Tabs/NavEnergy.webp"     type="image/webp"><img src="/public/Tabs/NavEnergy.png"     alt="" aria-hidden="true" loading="lazy" decoding="async" width="48" height="48" style="aspect-ratio:1;object-fit:contain;"></picture><span>Track Your Energies</span></div>
          <div class="sheet-row" data-tab="tarot"       role="button" tabindex="0" aria-label="Tarot Cards">          <picture><source srcset="/public/Tabs/NavTarot.webp"      type="image/webp"><img src="/public/Tabs/NavTarot.png"      alt="" aria-hidden="true" loading="lazy" decoding="async" width="48" height="48" style="aspect-ratio:1;object-fit:contain;"></picture><span>Tarot Cards Divinations</span></div>
          <div class="sheet-row" data-tab="meditations" role="button" tabindex="0" aria-label="Guided Meditations">   <picture><source srcset="/public/Tabs/NavMeditations.webp" type="image/webp"><img src="/public/Tabs/NavMeditations.png" alt="" aria-hidden="true" loading="lazy" decoding="async" width="48" height="48" style="aspect-ratio:1;object-fit:contain;"></picture><span>Aanandoham's Meditations</span></div>
          <div class="sheet-row" data-tab="karma-shop"  role="button" tabindex="0" aria-label="Karma Shop">           <picture><source srcset="/public/Tabs/NavShop.webp"       type="image/webp"><img src="/public/Tabs/NavShop.png"       alt="" aria-hidden="true" loading="lazy" decoding="async" width="48" height="48" style="aspect-ratio:1;object-fit:contain;"></picture><span>Spend Your Karma</span></div>
        </div>
      </div>

      <div id="sheet-scrim" class="sheet-scrim"></div>

      <div id="swipe-arrows" class="swipe-arrows mobile-only">
        <button type="button" id="swipe-left"  class="swipe-arrow left"  aria-label="Previous feature"></button>
        <button type="button" id="swipe-right" class="swipe-arrow right" aria-label="Next feature"></button>
      </div>`;
  }

  _getMobileIndicatorHTML() {
    const baseStyle = 'display:inline-flex !important;align-items:center;justify-content:center;width:24px;height:24px;min-width:24px;min-height:24px;border-radius:50%;background:var(--neuro-shadow-dark);box-shadow:inset 2px 2px 4px var(--neuro-shadow-dark),inset -2px -2px 4px var(--neuro-shadow-light);opacity:0.6;flex-shrink:0;transition:all 300ms ease-in-out;cursor:pointer;overflow:hidden;padding:3px;';
    const imgStyle  = 'width:100%;height:100%;object-fit:contain;pointer-events:none;aspect-ratio:1;';

    const tabs = [
      { tab: 'dashboard',     title: 'Dashboard',     img: 'DashDot.png',       active: true },
      { tab: 'energy',        title: 'Energy',         img: 'EnergyDot.png'     },
      { tab: 'tarot',         title: 'Tarot',          img: 'TarotDot.png'      },
      { tab: 'gratitude',     title: 'Gratitude',      img: 'GratitudeDot.png'  },
      { tab: 'happiness',     title: 'Happiness',      img: 'HappinessDot.png'  },
      { tab: 'journal',       title: 'Journal',        img: 'JournalDot.png'    },
      { tab: 'meditations',   title: 'Meditations',    img: 'MeditationsDot.png'},
      { tab: 'flip-script',   title: 'Flip Script',    img: 'FlipDot.png'       },
      { tab: 'calculator',    title: 'Analysis',       img: 'AnalysisDot.png'   },
      { tab: 'shadow-alchemy', title: 'Shadow Alchemy', img: 'ShadowDot.png'   },
      { tab: 'karma-shop',    title: 'Karma Shop',     img: 'ShopDot.png'       }
    ];

    const dots = tabs.map(t =>
      `<span class="tab-dot${t.active ? ' active' : ''}" data-tab="${t.tab}" title="${t.title}" role="button" tabindex="0" aria-label="${t.title}" style="${baseStyle}"><picture><source srcset="/public/Tabs/Dots/${t.img.replace('.png', '.webp')}" type="image/webp"><img src="/public/Tabs/Dots/${t.img}" style="${imgStyle}" loading="lazy" decoding="async" width="48" height="48" alt=""></picture></span>`
    ).join('\n        ');

    return `
      <div id="mobile-tab-indicator" style="display:flex;justify-content:space-between !important;align-items:center;padding:0.5rem;width:100%;box-sizing:border-box;background:transparent;min-height:50px;gap:2px;" role="tablist" aria-label="Tab indicator">
        ${dots}
      </div>`;
  }

  // ─── Cleanup ───────────────────────────────────────────────────────────────

  destroy() {
    if (this.eventHandlers.touchStart) window.removeEventListener('touchstart', this.eventHandlers.touchStart);
    if (this.eventHandlers.touchEnd)   window.removeEventListener('touchend',   this.eventHandlers.touchEnd);
    if (this.eventHandlers.keydown)    document.removeEventListener('keydown',  this.eventHandlers.keydown);
    if (this.eventHandlers.resize)     window.removeEventListener('resize',     this.eventHandlers.resize);

    this.cachedElements.navItems?.forEach(tab => {
      if (tab._clickHandler) tab.removeEventListener('click',   tab._clickHandler);
      if (tab._keyHandler)   tab.removeEventListener('keydown', tab._keyHandler);
    });

    const { scrim } = this.cachedElements;
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
    if (leftArrow?._touchStart)  { leftArrow.removeEventListener('touchstart',  leftArrow._touchStart,  { capture: true }); leftArrow.removeEventListener('touchend',  leftArrow._touchEnd,  { capture: true }); }
    if (rightArrow?._touchStart) { rightArrow.removeEventListener('touchstart', rightArrow._touchStart, { capture: true }); rightArrow.removeEventListener('touchend', rightArrow._touchEnd, { capture: true }); }

    this.cachedElements.tabDots?.forEach(dot => {
      if (dot._clickHandler) dot.removeEventListener('click', dot._clickHandler);
    });

    this.arrowObserver?.disconnect();
    this.arrowObserver = null;

    this.eventHandlers = { sheetHandlers: [] };
    this.cachedElements = {};
    this.listenersAttached = false;
    this.arrowListenersAttached = false;
  }
}
