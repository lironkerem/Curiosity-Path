/* CTA.js – neumorphic, skin-aware, images show when accordion opens */
export default class CTA {
  constructor() {
    this.isOpen = false;
  }

  render() {
    if (document.getElementById('cta-footer')) return;
    document.getElementById('app-container')?.insertAdjacentHTML('beforeend', this.markup());
    this.init();
  }

  init() {
    const toggle = document.getElementById('cta-toggle');
    const panel  = document.getElementById('cta-panel');
    const live   = document.getElementById('cta-aria-live');

    toggle.addEventListener('click', () => {
      this.isOpen = !this.isOpen;
      toggle.classList.toggle('open', this.isOpen);
      toggle.setAttribute('aria-expanded', this.isOpen);
      panel.classList.toggle('open', this.isOpen);
      live.textContent = this.isOpen ? 'Footer panel opened' : 'Footer panel closed';
    });

    /* ----  accordion handlers  ---- */
    document.querySelectorAll('.lux-section-header').forEach(btn => {
      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        const body = btn.parentElement.querySelector('.lux-section-body');
        btn.setAttribute('aria-expanded', !expanded);
        body.classList.toggle('open', !expanded);
      });
    });

    this.populateGrids();
    this.setupCTASwipeClose();   // NEW
  }

  /* -------------------------------------------------- */
  /*  swipe-down-to-close for CTA panel                 */
  /* -------------------------------------------------- */
  setupCTASwipeClose() {
    const panel = document.getElementById('cta-panel');
    const toggle = document.getElementById('cta-toggle');
    const SWIPE_Y_THRESHOLD = 60;   // px
    const VELOCITY_THRESHOLD = 0.5; // px/ms

    let startY = 0, startT = 0;

    panel.addEventListener('touchstart', e => {
      startY = e.touches[0].clientY;
      startT = Date.now();
    }, {passive: true});

    panel.addEventListener('touchmove', e => {
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;
      if (deltaY > 0) {                       // only downward
        panel.style.transform = `translateY(${deltaY}px)`;
      }
    }, {passive: true});

    panel.addEventListener('touchend', e => {
      const endY = e.changedTouches[0].clientY;
      const deltaY = endY - startY;
      const deltaT = Date.now() - startT;
      const velocity = deltaY / deltaT;

      panel.style.transform = '';             // reset

      if (deltaY > SWIPE_Y_THRESHOLD && velocity > VELOCITY_THRESHOLD) {
        if (navigator.vibrate) navigator.vibrate(8);
        // close the footer exactly like the toggle click does
        this.isOpen = false;
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        panel.classList.remove('open');
        document.getElementById('cta-aria-live').textContent = 'Footer panel closed';
      }
    }, {passive: true});
  }

  markup() {
    return `
      <footer id="cta-footer" class="lux-footer">
        <button id="cta-toggle" class="lux-toggle" aria-expanded="false">
          <img src="https://raw.githubusercontent.com/lironkerem/self-analysis-pro/main/assets/Watermarks/Logo.svg"
               alt="Aanandoham" class="lux-logo">
          <div class="lux-text-group">
            <span class="lux-line1">Deepen your life experience with me</span>
            <span class="lux-line2">© 2026 Aanandoham (Liron Kerem)</span>
          </div>
          <span class="lux-chevron"></span>
        </button>

        <div id="cta-panel" class="lux-panel">
          <div class="lux-scroll">
            <div class="lux-inner">
              <header class="lux-header">
                <h2 class="lux-title">Empower your <em>'Self'</em></h2>
                <p class="lux-intro">
                  Welcome to Project Curiosity – founded 2010.<br>
                  Explore my unique In-Person and Online offerings
                </p>

                <!--  10 % bigger + dead-centre alignment  -->
                <div class="lux-social-row" style="
                      display:flex;
                      gap:.9rem;
                      justify-content:center;
                      margin-top:1.1rem;
                      flex-wrap:wrap;
                    ">
                  
                  <!--  1. Website  -->
                  <a href="https://lironkerem.wixsite.com/project-curiosity"
                     target="_blank" rel="noopener"
                     class="lux-social-chip"
                     style="
                        display:inline-flex;
                        flex-direction:column;
                        align-items:center;
                        gap:.3rem;
                        padding:.65rem .9rem;
                        background:var(--neuro-bg);
                        border-radius:999px;
                        box-shadow:var(--shadow-raised);
                        color:var(--neuro-text);
                        text-decoration:none;
                        transition:all .2s;
                     "
                     aria-label="Official Website">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                    <span style="font-weight:600;font-size:1rem">Website</span>
                  </a>

                  <!--  2. Facebook  -->
                  <a href="https://www.facebook.com/AanandohamsProjectCuriosity"
                     target="_blank" rel="noopener"
                     class="lux-social-chip"
                     style="
                        display:inline-flex;
                        flex-direction:column;
                        align-items:center;
                        gap:.3rem;
                        padding:.65rem .9rem;
                        background:var(--neuro-bg);
                        border-radius:999px;
                        box-shadow:var(--shadow-raised);
                        color:var(--neuro-text);
                        text-decoration:none;
                        transition:all .2s;
                     "
                     aria-label="Facebook Page">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    <span style="font-weight:600;font-size:1rem">Facebook</span>
                  </a>

                  <!--  3. YouTube  -->
                  <a href="https://www.youtube.com/@Aanandoham-Project-Curiosity"
                     target="_blank" rel="noopener"
                     class="lux-social-chip"
                     style="
                        display:inline-flex;
                        flex-direction:column;
                        align-items:center;
                        gap:.3rem;
                        padding:.65rem .9rem;
                        background:var(--neuro-bg);
                        border-radius:999px;
                        box-shadow:var(--shadow-raised);
                        color:var(--neuro-text);
                        text-decoration:none;
                        transition:all .2s;
                     "
                     aria-label="YouTube Channel">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    <span style="font-weight:600;font-size:1rem">YouTube</span>
                  </a>
                </div>
              </header>

              <section class="lux-section" data-section="sessions">
                <button class="lux-section-header" aria-expanded="false">
                  <h3>Private and Groups Sessions & Classes (In-Person and Online)</h3>
                  <span class="lux-chevron"></span>
                </button>
                <div class="lux-section-body">
                  <div class="lux-grid" id="sessions-grid"></div>
                </div>
              </section>

              <section class="lux-section" data-section="workshops">
                <button class="lux-section-header" aria-expanded="false">
                  <h3>Groups Workshops & Retreats (In-Person)</h3>
                  <span class="lux-chevron"></span>
                </button>
                <div class="lux-section-body">
                  <div class="lux-grid" id="workshops-grid"></div>
                </div>
              </section>
            </div>
          </div>
        </div>

        <span id="cta-aria-live" aria-live="polite" class="sr-only"></span>
      </footer>`;
  }

  populateGrids() {
    const base = 'https://raw.githubusercontent.com/lironkerem/self-analysis-pro/main/assets/CTA/';
    const sessions = [
      'https://lironkerem.wixsite.com/project-curiosity/tarot',
      'https://lironkerem.wixsite.com/project-curiosity/reiki',
      'https://lironkerem.wixsite.com/project-curiosity/meditation',
      'https://lironkerem.wixsite.com/project-curiosity/osho',
      'https://lironkerem.wixsite.com/project-curiosity/guided-visualizations',
      'https://lironkerem.wixsite.com/project-curiosity/eft',
      'https://lironkerem.wixsite.com/project-curiosity/yoga',
      'https://lironkerem.wixsite.com/project-curiosity/tantra'
    ];
    const workshops = [
      'https://lironkerem.wixsite.com/project-curiosity/tarot',
      'https://lironkerem.wixsite.com/project-curiosity/reiki',
      'https://lironkerem.wixsite.com/project-curiosity/meditation',
      'https://lironkerem.wixsite.com/project-curiosity/rainbow-body',
      'https://lironkerem.wixsite.com/project-curiosity/osho',
      'https://lironkerem.wixsite.com/project-curiosity/osho'
    ];

    const sGrid = document.getElementById('sessions-grid');
    const wGrid = document.getElementById('workshops-grid');
    sessions.forEach((url, i) => sGrid.appendChild(this.card(`${base}Sessions/sessions${i + 1}.jpg`, url, `Session ${i + 1}`)));
    workshops.forEach((url, i) => wGrid.appendChild(this.card(`${base}Workshops/workshops${i + 1}.jpg`, url, `Workshop ${i + 1}`)));
  }

  card(src, href, alt) {
    const a = document.createElement('a');
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener';
    a.className = 'lux-card';
    a.innerHTML = `<div class="lux-img-wrap"><img src="${src}" alt="${alt}" loading="lazy"></div>`;
    return a;
  }
}