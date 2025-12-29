// NavigationManager.js  (mobile 3-button bar + swipe arrows + all fixes)
import UserTab from './User-Tab.js';

export default class NavigationManager {
  constructor(app) {
    this.app = app;
    this.userTab = new UserTab(app);
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.swipeDebounceTimer = null;
    this.currentBubbleIndex = 0;
    this.bubbleElements = [];
    this.sheetOpen = false;
  }

  render() {
    const navHTML = `
      <!-- CENTRED HEADER -->
      <div class="app-header">
        <img class="header-image" 
             src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/Header.png" 
             alt="Aanandoham Header">
      </div>

      <!-- DESKTOP NAV TABS (unchanged) -->
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
            <img class="nav-image" src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/NavFlip.png"    alt="Flip The Script">
          </li>
          <li class="nav-item" data-tab="calculator" data-label="Self Analysis Pro" role="tab" aria-selected="false" tabindex="-1">
            <img class="nav-image" src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/NavAnalysis.png" alt="Self Analysis Pro">
          </li>
          <li class="nav-item" data-tab="shadow-alchemy" data-label="Shadow Alchemy Lab" role="tab" aria-selected="false" tabindex="-1">
            <img class="nav-image" src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/NavShadow.png"  alt="Shadow Alchemy Lab">
            <span class="premium-badge">PREMIUM</span>
          </li>
          <li class="nav-item" data-tab="karma-shop" data-label="Karma Shop" role="tab" aria-selected="false" tabindex="-1">
            <img class="nav-image" src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/NavShop.png"     alt="Karma Shop">
          </li>
        </ul>
      </nav>

      <!-- CTA FOOTER -->
      <div id="cta-footer-wrapper"></div>

      <!-- MOBILE 3-BUTTON BAR -->
      <nav id="mobile-bottom-bar" class="mobile-bottom-bar" role="navigation" aria-label="Mobile navigation">
        <button class="mobile-tab left"  data-popup="miniapps" aria-haspopup="true" aria-expanded="false">
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
            <div class="sheet-row" data-tab="flip-script" role="menuitem" tabindex="0"><img src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/NavFlip.png" alt=""><span>Flip the Script</span></div>
            <div class="sheet-row" data-tab="calculator" role="menuitem" tabindex="0"><img src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/NavAnalysis.png" alt=""><span>Self-Analysis</span></div>
            <div class="sheet-row" data-tab="shadow-alchemy" role="menuitem" tabindex="0"><img src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/NavShadow.png" alt=""><span>Shadow Lab</span></div>
            <div class="sheet-row" data-tab="chatbot" role="menuitem" tabindex="0"><img src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/Chat.png" alt=""><span>Aanandoham's AI Assistant</span></div>
            <div class="sheet-row" data-tab="karma-shop" role="menuitem" tabindex="0"><img src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/NavShop.png" alt=""><span>Karma Shop</span></div>
          </div>
        </div>

        <div id="sheet-features" class="mobile-sheet" role="dialog" aria-modal="true" aria-hidden="true">
          <div class="sheet-grip"></div><div class="sheet-header">Features</div>
          <div class="sheet-scroller">
            <div class="sheet-row" data-tab="energy" role="menuitem" tabindex="0"><img src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/NavEnergy.png" alt=""><span>Energy Tracker</span></div>
            <div class="sheet-row" data-tab="happiness" role="menuitem" tabindex="0"><img src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/NavHappiness.png" alt=""><span>Happiness and Motivation</span></div>
            <div class="sheet-row" data-tab="gratitude" role="menuitem" tabindex="0"><img src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/NavGratitude.png" alt=""><span>Gratitude Practice</span></div>
            <div class="sheet-row" data-tab="journal" role="menuitem" tabindex="0"><img src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/NavJournal.png" alt=""><span>My Private Journal</span></div>
            <div class="sheet-row" data-tab="tarot" role="menuitem" tabindex="0"><img src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/NavTarot.png" alt=""><span>Tarot Cards Spreads</span></div>
            <div class="sheet-row" data-tab="meditations" role="menuitem" tabindex="0"><img src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/NavMeditations.png" alt=""><span>Guided Meditations</span></div>
          </div>
        </div>

        <div id="sheet-scrim" class="sheet-scrim"></div>

        <!-- FLOATING SWIPE ARROWS (MOBILE ONLY) -->
        <div id="swipe-arrows" class="swipe-arrows mobile-only">
          <button id="swipe-left"  class="swipe-arrow left"  aria-label="Previous feature" title="Swipe or click to go back">&lt;</button>
          <button id="swipe-right" class="swipe-arrow right" aria-label="Next feature"   title="Swipe or click to go forward">&gt;</button>
        </div>
      `;

      const appContainer = document.getElementById('app-container');
      if (appContainer) {
        if (!document.querySelector('.app-header')) {
          appContainer.insertAdjacentHTML('afterbegin', navHTML);
        }
        if (!document.querySelector('#swipe-arrows')) {
          appContainer.insertAdjacentHTML('beforeend', arrowsHTML);
        }
        if (!document.getElementById('user-dropdown')) {
          appContainer.insertAdjacentHTML('afterbegin', this.userTab.render());
          this.userTab.init();
        }
      }
      this.setupEventListeners();
      this.setupSwipeGestures();
      this.setupKeyboardNavigation();
      this.setupMobileBottomBar();
      this.setupSwipeArrows();   
      this.setupSheetSwipeClose();     // NEW
    }

    /* -------------------------------------------------- */
    /*  desktop + common                                  */
    /* -------------------------------------------------- */
    setupEventListeners() {
      document.querySelectorAll('.nav-item').forEach(tab => {
        tab.addEventListener('click', () => this.switchTab(tab.dataset.tab, tab.dataset.label));
        tab.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.switchTab(tab.dataset.tab, tab.dataset.label);
          }
        });
      });
    }

    setupKeyboardNavigation() {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          if (this.sheetOpen) this.closeSheets();
          return;
        }
        if (!this.sheetOpen) return;
        const rows = [...document.querySelectorAll('.sheet-row')];
        const current = document.activeElement;
        const idx = rows.indexOf(current);
        if (idx < 0) return;
        if (e.key === 'ArrowDown') { e.preventDefault(); rows[(idx + 1) % rows.length].focus(); }
        if (e.key === 'ArrowUp')   { e.preventDefault(); rows[(idx - 1 + rows.length) % rows.length].focus(); }
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); current.click(); }
      });
    }

    /* -------------------------------------------------- */
    /*  mobile 3-button bar                               */
    /* -------------------------------------------------- */
    setupMobileBottomBar(){
      if(window.innerWidth > 767) return;
      const bar   = document.getElementById('mobile-bottom-bar');
      const scrim = document.getElementById('sheet-scrim');
      const tabs  = [...bar.querySelectorAll('.mobile-tab')];
      const sheets= [...document.querySelectorAll('.mobile-sheet')];

      const openSheet = (id) => {
        const sheet = document.getElementById(id);
        if(!sheet) return;
        sheet.setAttribute('aria-hidden','false');
        scrim.classList.add('visible');
        this.sheetOpen = true;
        document.body.classList.add('sheet-open');
        sheet.querySelector('.sheet-row').focus();
        if(navigator.vibrate) navigator.vibrate(10);
      };
      const closeSheets = () => {
        sheets.forEach(s=>s.setAttribute('aria-hidden','true'));
        scrim.classList.remove('visible');
        tabs.forEach(t=>t.setAttribute('aria-expanded','false'));
        this.sheetOpen = false;
        document.body.classList.remove('sheet-open');
      };
      this.closeSheets = closeSheets;

      bar.querySelector('.mobile-tab.center').addEventListener('click',()=>{
        closeSheets(); this.switchTab('dashboard','Main Dashboard');
      });
      bar.querySelector('.left').addEventListener('click',(e)=>{
        openSheet('sheet-miniapps'); e.currentTarget.setAttribute('aria-expanded','true');
      });
      bar.querySelector('.right').addEventListener('click',(e)=>{
        openSheet('sheet-features'); e.currentTarget.setAttribute('aria-expanded','true');
      });
      scrim.addEventListener('click',closeSheets);
      sheets.forEach(sheet=>{
        sheet.addEventListener('click',(e)=>{
          const row = e.target.closest('.sheet-row');
          if(!row) return;
          closeSheets();
          const navItem = document.querySelector(`[data-tab="${row.dataset.tab}"]`);
          this.switchTab(row.dataset.tab, navItem?.dataset.label);
        });
      });
    }

    /* -------------------------------------------------- */
    /*  floating swipe arrows (NEW)                       */
    /* -------------------------------------------------- */
setupSwipeArrows(){
  if(window.innerWidth > 767) return;
  const leftBtn  = document.getElementById('swipe-left');
  const rightBtn = document.getElementById('swipe-right');
  const arrows   = document.getElementById('swipe-arrows');
  if(!leftBtn || !rightBtn) return;

  /* ----- NEW: make them non-focusable ----- */
  leftBtn.tabIndex  = -1;
  rightBtn.tabIndex = -1;
  /* ----------------------------------------- */

  /*  NEW: inject wide-angle SVGs  */
leftBtn.innerHTML  = `<svg viewBox="0 0 200 180" style="transform:scaleX(-1) scale(0.5);">
  <path d="M115 10 L100 90 L115 170" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
</svg>`;

rightBtn.innerHTML = `<svg viewBox="0 0 200 180" style="transform:scale(0.5);">
  <path d="M115 10 L100 90 L115 170" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
</svg>`;

const goto = (dir) => {
  const order = [
    'dashboard','energy','tarot','gratitude','happiness',
    'journal','meditations','flip-script','calculator',
    'shadow-alchemy','karma-shop'
  ];
  const active = localStorage.getItem('pc_active_tab') || 'dashboard';
  let idx = order.indexOf(active);
  idx = (idx + dir + order.length) % order.length;
  const navItem = document.querySelector(`[data-tab="${order[idx]}"]`);
  if(navItem) this.switchTab(order[idx], navItem.dataset.label);
};

/* ----- bind the clicks ----- */
leftBtn.addEventListener('click',  e => { 
  e.preventDefault(); 
  goto(-1); 
  setTimeout(() => e.currentTarget.blur(), 0);
});
rightBtn.addEventListener('click', e => { 
  e.preventDefault(); 
  goto(1);
  setTimeout(() => e.currentTarget.blur(), 0);
});

/* ----- add touchend blur for mobile ----- */
leftBtn.addEventListener('touchend', e => { 
  setTimeout(() => e.currentTarget.blur(), 10);
});
rightBtn.addEventListener('touchend', e => { 
  setTimeout(() => e.currentTarget.blur(), 10);
});

  // hide while sheet open
  const observer = new MutationObserver(()=>{
    arrows.style.display = this.sheetOpen ? 'none' : 'flex';
  });
  observer.observe(document.body,{attributeFilter:['class']});
}

    /* -------------------------------------------------- */
    /*  swipe gestures (left/right)                       */
    /* -------------------------------------------------- */
    setupSwipeGestures(){
      const swipeOrder = [
        'dashboard','energy','tarot','gratitude','happiness',
        'journal','meditations','flip-script','calculator',
        'shadow-alchemy','karma-shop'
      ];
      let startX = 0, startT = 0;
      const SWIPE_THRESHOLD = 120;
      const SWIPE_TIME = 300;

      window.addEventListener('touchstart', e=>{
        startX = e.touches[0].clientX;
        startT = Date.now();
      },{passive:true});

      window.addEventListener('touchend', e=>{
        const endX = e.changedTouches[0].clientX;
        const deltaX = startX - endX;
        const deltaT = Date.now() - startT;
        if(Math.abs(deltaX) < SWIPE_THRESHOLD || deltaT > SWIPE_TIME) return;
        const active = localStorage.getItem('pc_active_tab') || 'dashboard';
        let idx = swipeOrder.indexOf(active);
        idx = (idx + (deltaX > 0 ? 1 : -1) + swipeOrder.length) % swipeOrder.length;
        const navItem = document.querySelector(`[data-tab="${swipeOrder[idx]}"]`);
        if(navItem) this.switchTab(swipeOrder[idx], navItem.dataset.label);
      },{passive:true});
    }

/* -------------------------------------------------- */
/*  swipe-down-to-close for open sheets               */
/* -------------------------------------------------- */
setupSheetSwipeClose() {
  const sheets = document.querySelectorAll('.mobile-sheet');
  const SWIPE_Y_THRESHOLD = 60;   // px
  const VELOCITY_THRESHOLD = 0.5; // px/ms

  sheets.forEach(sheet => {          // ← added parentheses
    let startY = 0, startT = 0;

    sheet.addEventListener('touchstart', e => {
      startY = e.touches[0].clientY;
      startT = Date.now();
    }, {passive: true});

    sheet.addEventListener('touchmove', e => {
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;
      if (deltaY > 0) {
        sheet.style.transform = `translateY(${deltaY}px)`;
      }
    }, {passive: true});

    sheet.addEventListener('touchend', e => {
      const endY = e.changedTouches[0].clientY;
      const deltaY = endY - startY;
      const deltaT = Date.now() - startT;
      const velocity = deltaY / deltaT;

      sheet.style.transform = '';

      if (deltaY > SWIPE_Y_THRESHOLD && velocity > VELOCITY_THRESHOLD) {
        if (navigator.vibrate) navigator.vibrate(8);
        this.closeSheets();
      }
    }, {passive: true});
  });
}

    /* -------------------------------------------------- */
    /*  tab switching helper                              */
    /* -------------------------------------------------- */
    switchTab(tabName, label){
      if(tabName==='calculator' && !window.calculatorChunk) window.calculatorChunk='requested';
      document.querySelectorAll('.nav-item').forEach(t=>{
        t.classList.toggle('active',t.dataset.tab===tabName);
        t.setAttribute('aria-selected',t.dataset.tab===tabName);
        t.setAttribute('tabindex',t.dataset.tab===tabName?'0':'-1');
      });
      document.querySelectorAll('.tab-content').forEach(c=>{
        c.classList.remove('active','hidden');
        c.style.display='none';
        c.setAttribute('aria-hidden','true');
      });
      const target=document.getElementById(`${tabName}-tab`);
      if(target){
        target.classList.add('active');
        target.style.display='block';
        target.setAttribute('aria-hidden','false');
      }
      this.app.initializeTab(tabName);
      localStorage.setItem('pc_active_tab',tabName);
      if(navigator.vibrate) navigator.vibrate(10);
    }
}