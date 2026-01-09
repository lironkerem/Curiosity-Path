// NavigationManager.js - Fixed swipe arrows
import UserTab from './User-Tab.js';

// Global flag to prevent duplicate swipe listeners across instances
let globalSwipeListenersAttached = false;
let globalSwipeHandlers = null;
let arrowClickInProgress = false;

export default class NavigationManager {
  constructor(app) {
    this.app = app;
    this.userTab = new UserTab(app);
    
    // Cache
    this.cachedElements = {};
    this.listenersAttached = false;
    this.arrowObserver = null;
    
    // Swipe state
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchStartTime = 0;
    this.sheetOpen = false;
    this.swipeListenersAttached = false;
    this.swipeHandlers = null;
    this.arrowListenersAttached = false;
    
    // Constants
    this.SWIPE_ORDER = [
      'dashboard', 'energy', 'tarot', 'gratitude', 'happiness',
      'journal', 'meditations', 'flip-script', 'calculator',
      'shadow-alchemy', 'karma-shop'
    ];
    
    this.CONSTANTS = {
      SWIPE_THRESHOLD: 120,
      SWIPE_TIME_MS: 300,
      OVERSCROLL_THRESHOLD: 150,
      VELOCITY_THRESHOLD: 1.0,
      MIN_DRAG_START: 20,
      VIBRATION_MS: 10,
      VIBRATION_SHEET_MS: 8
    };
  }

  render() {
    const navHTML = `
      <!-- CENTRED HEADER -->
      <div class="app-header">
        <img class="header-image" 
             src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/Header.png" 
             alt="Aanandoham Header">
      </div>

      <!-- DESKTOP NAV TABS -->
      <nav class="main-nav desktop-nav" role="navigation" aria-label="Main navigation">
        <ul class="nav-tabs" id="nav-tabs" role="tablist">
          <li class="nav-item active" data-tab="dashboard" data-label="Main Dashboard" role="tab" aria-selected="true" tabindex="0">
            <img class="nav-image" src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/NavDashboard.png" alt="Main Dashboard">
          </li>
          <li class="nav-item" data-tab="energy" data-label="Daily Energy Tracker" role="tab" aria-selected="false" tabindex="-1">
            <img class="nav-image" src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/NavEnergy.png" alt="Daily Energy Tracker">
          </li>
          <li class="nav-item" data-tab="tarot" data-label="Tarot Cards Guidance" role="tab" aria-selected="false" tabindex="-1">
            <img class="nav-image" src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/NavTarot.png" alt="Tarot Cards Guidance">
          </li>
          <li class="nav-item" data-tab="gratitude" data-label="Gratitude Practice" role="tab" aria-selected="false" tabindex="-1">
            <img class="nav-image" src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/NavGratitude.png" alt="Gratitude Practice">
          </li>
          <li class="nav-item" data-tab="happiness" data-label="Happiness Booster" role="tab" aria-selected="false" tabindex="-1">
            <img class="nav-image" src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/NavHappiness.png" alt="Happiness Booster">
          </li>
          <li class="nav-item" data-tab="journal" data-label="My Private Journal" role="tab" aria-selected="false" tabindex="-1">
            <img class="nav-image" src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/NavJournal.png" alt="My Private Journal">
          </li>
          <li class="nav-item" data-tab="meditations" data-label="Guided Meditations" role="tab" aria-selected="false" tabindex="-1">
            <img class="nav-image" src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/NavMeditations.png" alt="Guided Meditations">
          </li>
          <li class="nav-item" data-tab="flip-script" data-label="Flip The Script" role="tab" aria-selected="false" tabindex="-1">
            <img class="nav-image" src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/NavFlip.png" alt="Flip The Script">
          </li>
          <li class="nav-item" data-tab="calculator" data-label="Self Analysis Pro" role="tab" aria-selected="false" tabindex="-1">
            <img class="nav-image" src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/NavAnalysis.png" alt="Self Analysis Pro">
          </li>
          <li class="nav-item" data-tab="shadow-alchemy" data-label="Shadow Alchemy Lab" role="tab" aria-selected="false" tabindex="-1">
            <img class="nav-image" src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/NavShadow.png" alt="Shadow Alchemy Lab">
            <span class="premium-badge">PREMIUM</span>
          </li>
          <li class="nav-item" data-tab="karma-shop" data-label="Karma Shop" role="tab" aria-selected="false" tabindex="-1">
            <img class="nav-image" src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/NavShop.png" alt="Karma Shop">
          </li>
          <li class="nav-item" data-tab="chatbot" data-label="AI Assistant" role="tab" aria-selected="false" tabindex="-1">
            <img class="nav-image" src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/Chat.png" alt="AI Assistant">
          </li>
        </ul>
      </nav>

      <!-- CTA FOOTER -->
      <div id="cta-footer-wrapper"></div>

      <!-- MOBILE 3-BUTTON BAR -->
      <nav id="mobile-bottom-bar" class="mobile-bottom-bar" role="navigation" aria-label="Mobile navigation">
        <button class="mobile-tab left" data-popup="miniapps" aria-haspopup="true" aria-expanded="false">
          <img src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/MiniApps.png" alt=""><span>Mini Apps</span>
        </button>
        <button class="mobile-tab center active" data-tab="dashboard" aria-selected="true">
          <img src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/Dashboard.png" alt=""><span>Home</span>
        </button>
        <button class="mobile-tab right" data-popup="features" aria-haspopup="true" aria-expanded="false">
          <img src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/Features.png" alt=""><span>Features</span>
        </button>
      </nav>

      <!-- SHEETS -->
      <div id="sheet-miniapps" class="mobile-sheet" role="dialog" aria-modal="true" aria-hidden="true">
        <div class="sheet-grip"></div><div class="sheet-header">Mini Apps</div>
        <div class="sheet-scroller">
          <div class="sheet-row" data-tab="flip-script" role="menuitem" tabindex="0"><img src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/NavFlip.png" alt=""><span>Flip Your Thoughts</span></div>
          <div class="sheet-row" data-tab="calculator" role="menuitem" tabindex="0"><img src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/NavAnalysis.png" alt=""><span>Analyze your 'Self'</span></div>
          <div class="sheet-row" data-tab="shadow-alchemy" role="menuitem" tabindex="0"><img src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/NavShadow.png" alt=""><span>Shadow Work</span></div>
          <div class="sheet-row" data-tab="karma-shop" role="menuitem" tabindex="0"><img src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/NavShop.png" alt=""><span>Spend Your Karma</span></div>
          <div class="sheet-row" data-tab="chatbot" role="menuitem" tabindex="0"><img src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/Chat.png" alt=""><span>Aanandoham's AI Assistant</span></div>
        </div>
      </div>

      <div id="sheet-features" class="mobile-sheet" role="dialog" aria-modal="true" aria-hidden="true">
        <div class="sheet-grip"></div><div class="sheet-header">Features</div>
        <div class="sheet-scroller">
          <div class="sheet-row" data-tab="energy" role="menuitem" tabindex="0"><img src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/NavEnergy.png" alt=""><span>Track Your Energies</span></div>
          <div class="sheet-row" data-tab="happiness" role="menuitem" tabindex="0"><img src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/NavHappiness.png" alt=""><span>Happiness and Motivation</span></div>
          <div class="sheet-row" data-tab="gratitude" role="menuitem" tabindex="0"><img src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/NavGratitude.png" alt=""><span>Gratitude Enhancer</span></div>
          <div class="sheet-row" data-tab="journal" role="menuitem" tabindex="0"><img src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/NavJournal.png" alt=""><span>Write To Yourself</span></div>
          <div class="sheet-row" data-tab="tarot" role="menuitem" tabindex="0"><img src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/NavTarot.png" alt=""><span>Tarot Cards Divinations</span></div>
          <div class="sheet-row" data-tab="meditations" role="menuitem" tabindex="0"><img src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/NavMeditations.png" alt=""><span>Aanandoham's Meditations</span></div>
        </div>
      </div>

      <div id="sheet-scrim" class="sheet-scrim"></div>

      <!-- FLOATING SWIPE ARROWS (MOBILE ONLY) -->
      <div id="swipe-arrows" class="swipe-arrows mobile-only">
        <button id="swipe-left" class="swipe-arrow left" aria-label="Previous feature" title="Swipe or click to go back">&lt;</button>
        <button id="swipe-right" class="swipe-arrow right" aria-label="Next feature" title="Swipe or click to go forward">&gt;</button>
      </div>
    `;

    const appContainer = document.getElementById('app-container');
    if (!appContainer) return;

    if (!document.querySelector('.app-header')) {
      appContainer.insertAdjacentHTML('afterbegin', navHTML);
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
      navItems: document.querySelectorAll('.nav-item'),
      sheets: document.querySelectorAll('.mobile-sheet'),
      sheetRows: document.querySelectorAll('.sheet-row'),
      scrim: document.getElementById('sheet-scrim'),
      mobileBar: document.getElementById('mobile-bottom-bar'),
      swipeArrows: document.getElementById('swipe-arrows')
    };
  }

  setupEventListeners() {
    if (this.listenersAttached) return;

    this.cachedElements.navItems.forEach(tab => {
      tab.addEventListener('click', () => this.switchTab(tab.dataset.tab, tab.dataset.label));
      tab.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.switchTab(tab.dataset.tab, tab.dataset.label);
        }
      });
    });

    this.listenersAttached = true;
  }

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
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
    });
  }

  setupMobileBottomBar() {
    if (window.innerWidth > 767) return;

    const { mobileBar, sheets, scrim } = this.cachedElements;
    if (!mobileBar) return;

    const tabs = [...mobileBar.querySelectorAll('.mobile-tab')];

    const openSheet = (id) => {
      const sheet = document.getElementById(id);
      if (!sheet) return;
      
      sheet.setAttribute('aria-hidden', 'false');
      scrim.classList.add('visible');
      this.sheetOpen = true;
      document.body.classList.add('sheet-open');
      
      const firstRow = sheet.querySelector('.sheet-row');
      if (firstRow) firstRow.focus();
      
      this.vibrate(this.CONSTANTS.VIBRATION_MS);
    };

    mobileBar.querySelector('.mobile-tab.center')?.addEventListener('click', () => {
      this.closeSheets();
      this.switchTab('dashboard', 'Main Dashboard');
    });

    mobileBar.querySelector('.left')?.addEventListener('click', (e) => {
      openSheet('sheet-miniapps');
      e.currentTarget.setAttribute('aria-expanded', 'true');
    });

    mobileBar.querySelector('.right')?.addEventListener('click', (e) => {
      openSheet('sheet-features');
      e.currentTarget.setAttribute('aria-expanded', 'true');
    });

    scrim?.addEventListener('click', () => this.closeSheets());

    sheets.forEach(sheet => {
      sheet.addEventListener('click', (e) => {
        const row = e.target.closest('.sheet-row');
        if (!row) return;
        
        this.closeSheets();
        const tabName = row.dataset.tab;
        const navItem = document.querySelector(`[data-tab="${tabName}"]`);
        const label = navItem?.dataset.label || row.querySelector('span')?.textContent || tabName;
        this.switchTab(tabName, label);
      });
    });
  }

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

  setupSwipeArrows() {
    if (window.innerWidth > 767) return;
    
    if (this.arrowListenersAttached) {
      return;
    }

    const leftBtn = document.getElementById('swipe-left');
    const rightBtn = document.getElementById('swipe-right');
    const { swipeArrows } = this.cachedElements;
    
    if (!leftBtn || !rightBtn || !swipeArrows) return;
    
    leftBtn.tabIndex = -1;
    rightBtn.tabIndex = -1;

    // Only set innerHTML if not already set (to preserve event listeners)
    if (!leftBtn.querySelector('svg')) {
      leftBtn.innerHTML = `<svg viewBox="0 0 200 180" style="transform:scale(0.5); pointer-events:none;"><path d="M115 10 L100 90 L115 170" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>`;
    }
    if (!rightBtn.querySelector('svg')) {
      rightBtn.innerHTML = `<svg viewBox="0 0 200 180" style="transform:scaleX(-1) scale(0.5); pointer-events:none;"><path d="M115 10 L100 90 L115 170" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>`;
    }

    const blurButton = (btn) => setTimeout(() => btn.blur(), 0);

    // Use touchstart instead of click for mobile
    leftBtn.addEventListener('touchstart', (e) => { 
      e.preventDefault(); 
      e.stopPropagation();
      
      arrowClickInProgress = true;
      
      const active = localStorage.getItem('pc_active_tab') || 'dashboard';
      let idx = this.SWIPE_ORDER.indexOf(active);
      idx = (idx - 1 + this.SWIPE_ORDER.length) % this.SWIPE_ORDER.length;
      
      const navItem = document.querySelector(`[data-tab="${this.SWIPE_ORDER[idx]}"]`);
      if (navItem) {
        this.switchTab(this.SWIPE_ORDER[idx], navItem.dataset.label);
      }
      
      setTimeout(() => { arrowClickInProgress = false; }, 100);
      blurButton(leftBtn); 
    });
    
    rightBtn.addEventListener('touchstart', (e) => { 
      e.preventDefault(); 
      e.stopPropagation();
      
      arrowClickInProgress = true;
      
      const active = localStorage.getItem('pc_active_tab') || 'dashboard';
      let idx = this.SWIPE_ORDER.indexOf(active);
      idx = (idx + 1) % this.SWIPE_ORDER.length;
      
      const navItem = document.querySelector(`[data-tab="${this.SWIPE_ORDER[idx]}"]`);
      if (navItem) {
        this.switchTab(this.SWIPE_ORDER[idx], navItem.dataset.label);
      }
      
      setTimeout(() => { arrowClickInProgress = false; }, 100);
      blurButton(rightBtn); 
    });
    
    leftBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      e.stopPropagation();
      blurButton(leftBtn);
    });
    
    rightBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      e.stopPropagation();
      blurButton(rightBtn);
    });

    // Clean up old observer
    if (this.arrowObserver) {
      this.arrowObserver.disconnect();
    }

    this.arrowObserver = new MutationObserver(() => {
      swipeArrows.style.display = this.sheetOpen ? 'none' : 'flex';
    });
    
    this.arrowObserver.observe(document.body, { attributeFilter: ['class'] });
    
    this.arrowListenersAttached = true;
  }

  setupSwipeGestures() {
    if (globalSwipeListenersAttached) {
      return;
    }
    
    const { SWIPE_THRESHOLD, SWIPE_TIME_MS } = this.CONSTANTS;

    // Remove old listeners if they exist
    if (globalSwipeHandlers) {
      window.removeEventListener('touchstart', globalSwipeHandlers.start);
      window.removeEventListener('touchend', globalSwipeHandlers.end);
    }

    let touchStartX = 0;
    let touchStartTime = 0;
    let touchStartTarget = null;

    const handleTouchStart = (e) => {
      // Ignore if arrow click in progress
      if (arrowClickInProgress) {
        return;
      }
      touchStartTarget = e.target;
      // Ignore touches on arrow buttons
      if (touchStartTarget.closest('.swipe-arrow')) {
        return;
      }
      touchStartX = e.touches[0].clientX;
      touchStartTime = Date.now();
    };

    const handleTouchEnd = (e) => {
      // Ignore if arrow click in progress
      if (arrowClickInProgress) {
        return;
      }
      // Ignore if started on arrow button
      if (touchStartTarget && touchStartTarget.closest('.swipe-arrow')) {
        return;
      }
      
      const endX = e.changedTouches[0].clientX;
      const deltaX = touchStartX - endX;
      const deltaT = Date.now() - touchStartTime;

      if (Math.abs(deltaX) < SWIPE_THRESHOLD || deltaT > SWIPE_TIME_MS) {
        return;
      }

      const active = localStorage.getItem('pc_active_tab') || 'dashboard';
      let idx = this.SWIPE_ORDER.indexOf(active);
      const direction = deltaX > 0 ? 1 : -1;
      
      idx = (idx + direction + this.SWIPE_ORDER.length) % this.SWIPE_ORDER.length;

      const navItem = document.querySelector(`[data-tab="${this.SWIPE_ORDER[idx]}"]`);
      if (navItem) {
        this.switchTab(this.SWIPE_ORDER[idx], navItem.dataset.label);
      }
    };

    globalSwipeHandlers = {
      start: handleTouchStart,
      end: handleTouchEnd
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    globalSwipeListenersAttached = true;
  }

  setupSheetSwipeClose() {
    const { sheets } = this.cachedElements;
    const { OVERSCROLL_THRESHOLD, VELOCITY_THRESHOLD, MIN_DRAG_START, VIBRATION_SHEET_MS } = this.CONSTANTS;

    sheets.forEach(sheet => {
      const scroller = sheet.querySelector('.sheet-scroller');
      if (!scroller) return;

      let startY = 0, startT = 0, isDragging = false;

      sheet.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
        startT = Date.now();
        isDragging = false;
      }, { passive: true });

      sheet.addEventListener('touchmove', (e) => {
        const currentY = e.touches[0].clientY;
        const deltaY = currentY - startY;

        if (scroller.scrollTop === 0 && deltaY > MIN_DRAG_START) {
          isDragging = true;
          const dragAmount = Math.min(deltaY * 0.5, 150);
          sheet.style.transform = `translateY(${dragAmount}px)`;
          sheet.style.transition = 'none';
        }
      }, { passive: true });

      sheet.addEventListener('touchend', (e) => {
        if (!isDragging) return;

        const endY = e.changedTouches[0].clientY;
        const deltaY = endY - startY;
        const deltaT = Date.now() - startT;
        const velocity = deltaY / deltaT;

        sheet.style.transition = 'transform 0.3s ease';
        sheet.style.transform = '';

        if (deltaY > OVERSCROLL_THRESHOLD || velocity > VELOCITY_THRESHOLD) {
          this.vibrate(VIBRATION_SHEET_MS);
          this.closeSheets();
        }

        isDragging = false;
      }, { passive: true });
    });
  }

  switchTab(tabName, label) {
    if (tabName === 'calculator' && !window.calculatorChunk) {
      window.calculatorChunk = 'requested';
    }

    const { navItems } = this.cachedElements;
    
    // Query fresh each time since tabs are dynamically created
    const tabContents = document.querySelectorAll('.tab-content');

    navItems.forEach(t => {
      const isActive = t.dataset.tab === tabName;
      t.classList.toggle('active', isActive);
      t.setAttribute('aria-selected', isActive);
      t.tabIndex = isActive ? 0 : -1;
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
    localStorage.setItem('pc_active_tab', tabName);
    window.scrollTo(0, 0);
    this.vibrate(this.CONSTANTS.VIBRATION_MS);
  }

  vibrate(duration) {
    navigator.vibrate?.(duration);
  }

  destroy() {
    if (this.arrowObserver) {
      this.arrowObserver.disconnect();
      this.arrowObserver = null;
    }
    this.listenersAttached = false;
    this.swipeListenersAttached = false;
    this.cachedElements = {};
  }
}