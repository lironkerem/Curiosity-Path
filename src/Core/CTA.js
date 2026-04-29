/**
 * CTA Footer Component
 * Expandable footer with service offerings, swipe-to-close, scroll lock.
 * @author Aanandoham (Liron Kerem)
 * @copyright 2026
 */
export default class CTA {
  static SWIPE_CONFIG = {
    Y_THRESHOLD: 60,
    VELOCITY_THRESHOLD: 0.5,
    HAPTIC_DURATION: 8,
    ANIMATION_DELAY: 300
  };

  constructor() {
    this.isOpen = false;
    this.elements = null;
    this.listeners = [];
    /** @type {number} Saved scrollY before lock */
    this._scrollY = 0;
  }

  render() {
    if (document.getElementById('cta-footer')) return;
    document.getElementById('app-container')?.insertAdjacentHTML('beforeend', this.markup());
    this.init();
  }

  /** @private */
  init() {
    this.elements = {
      toggle: document.getElementById('cta-toggle'),
      panel:  document.getElementById('cta-panel'),
      live:   document.getElementById('cta-aria-live')
    };
    this.setupToggleButton();
    this.setupAccordionSections();
    this.populateGrids();
    this.setupCTASwipeClose();
  }

  /** @private */
  setupToggleButton() {
    const handler = () => this.togglePanel();
    this.elements.toggle.addEventListener('click', handler);
    this.listeners.push({ element: this.elements.toggle, event: 'click', handler });
  }

  /** @private */
  togglePanel() {
    this.isOpen = !this.isOpen;
    const { toggle, panel, live } = this.elements;
    toggle.classList.toggle('open', this.isOpen);
    toggle.setAttribute('aria-expanded', this.isOpen);
    panel.classList.toggle('open', this.isOpen);
    live.textContent = this.isOpen ? 'Footer panel opened' : 'Footer panel closed';
    // Scroll lock without layout shift
    if (this.isOpen) {
      this._scrollY = window.scrollY;
      document.body.style.cssText += ';overflow:hidden;position:fixed;top:-' + this._scrollY + 'px;width:100%';
    } else {
      document.body.style.cssText = document.body.style.cssText
        .replace(/overflow:[^;]+;?/g, '')
        .replace(/position:[^;]+;?/g, '')
        .replace(/top:[^;]+;?/g, '')
        .replace(/width:100%;?/g, '');
      window.scrollTo(0, this._scrollY);
    }
  }

  /** @private */
  setupAccordionSections() {
    document.querySelectorAll('.lux-section-header').forEach(btn => {
      const handler = () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', !expanded);
        btn.parentElement.querySelector('.lux-section-body').classList.toggle('open', !expanded);
      };
      btn.addEventListener('click', handler);
      this.listeners.push({ element: btn, event: 'click', handler });
    });
  }

  /** @private */
  setupCTASwipeClose() {
    const { panel, toggle } = this.elements;
    const { Y_THRESHOLD, VELOCITY_THRESHOLD, HAPTIC_DURATION, ANIMATION_DELAY } = CTA.SWIPE_CONFIG;
    let startY = 0, startT = 0, canSwipeClose = false;

    const handleTouchStart = e => {
      startY = e.touches[0].clientY;
      startT = Date.now();
      canSwipeClose = !e.target.closest('.lux-grid, .lux-section-body');
      if (canSwipeClose) {
        panel.style.transition = 'none';
        toggle.style.transition = 'none';
      }
    };

    const handleTouchMove = e => {
      if (!canSwipeClose) return;
      const deltaY = e.touches[0].clientY - startY;
      if (deltaY > 0) {
        panel.style.transform  = `translateY(${Math.min(deltaY, panel.offsetHeight)}px)`;
        toggle.style.transform = `translateY(${Math.min(deltaY, panel.offsetHeight)}px)`;
      }
    };

    const handleTouchEnd = e => {
      panel.style.transition  = '';
      toggle.style.transition = '';
      if (!canSwipeClose) {
        panel.style.transform = toggle.style.transform = '';
        return;
      }
      const deltaY   = e.changedTouches[0].clientY - startY;
      const velocity = deltaY / (Date.now() - startT);
      if (deltaY > Y_THRESHOLD && velocity > VELOCITY_THRESHOLD) {
        if (navigator.vibrate) navigator.vibrate(HAPTIC_DURATION);
        this.isOpen = false;
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        panel.classList.remove('open');
        this.elements.live.textContent = 'Footer panel closed';
        // Release scroll lock
        document.body.style.cssText = document.body.style.cssText
          .replace(/overflow:[^;]+;?/g, '')
          .replace(/position:[^;]+;?/g, '')
          .replace(/top:[^;]+;?/g, '')
          .replace(/width:100%;?/g, '');
        window.scrollTo(0, this._scrollY);
        setTimeout(() => { panel.style.transform = toggle.style.transform = ''; }, ANIMATION_DELAY);
      } else {
        panel.style.transform = toggle.style.transform = '';
      }
    };

    panel.addEventListener('touchstart', handleTouchStart, { passive: true });
    panel.addEventListener('touchmove',  handleTouchMove,  { passive: true });
    panel.addEventListener('touchend',   handleTouchEnd,   { passive: true });
    this.listeners.push(
      { element: panel, event: 'touchstart', handler: handleTouchStart },
      { element: panel, event: 'touchmove',  handler: handleTouchMove  },
      { element: panel, event: 'touchend',   handler: handleTouchEnd   }
    );
  }

  /** @private */
  markup() {
    return `
      <footer id="cta-footer" class="lux-footer">
        <button id="cta-toggle" class="lux-toggle" aria-expanded="false">
          <img src="/Watermarks/Logo.svg" alt="Aanandoham" class="lux-logo" width="120" height="40">
          <div class="lux-text-group">
            <span class="lux-line1">Deepen your life experience with me</span>
            <span class="lux-line2">© 2026 Aanandoham (Liron Kerem)</span>
          </div>
          <span class="lux-chevron"></span>
        </button>

        <div id="cta-panel" class="lux-panel" style="touch-action:manipulation;">
          <div class="lux-scroll"><div class="lux-inner">
            <header class="lux-header">
              <h2 class="lux-title">Empower your <em>'Self'</em></h2>
              <p class="lux-intro">Welcome to Project Curiosity - founded 2010.<br>Explore my unique In-Person and Online offerings</p>
              <div class="lux-social-row" style="display:flex;gap:.9rem;justify-content:center;margin-top:1.5rem;flex-wrap:wrap;">
                ${[
                  ['https://lironkerem.wixsite.com/project-curiosity','Official Website','Website',
                   '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>'],
                  ['https://www.facebook.com/AanandohamsProjectCuriosity','Facebook Page','Facebook',
                   '<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>'],
                  ['https://www.youtube.com/@Aanandoham-Project-Curiosity','YouTube Channel','YouTube',
                   '<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>']
                ].map(([href, label, text, path]) =>
                  `<a href="${href}" target="_blank" rel="noopener" class="lux-social-chip"
                      style="display:inline-flex;flex-direction:column;align-items:center;gap:.3rem;padding:.65rem .9rem;background:var(--neuro-bg);border-radius:999px;box-shadow:var(--shadow-raised);color:var(--neuro-text);text-decoration:none;transition:all .2s;"
                      aria-label="${label}">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">${path}</svg>
                    <span style="font-weight:600;font-size:1rem">${text}</span>
                  </a>`
                ).join('')}
              </div>
            </header>

            <section class="lux-section" data-section="sessions">
              <button class="lux-section-header" aria-expanded="false">
                <h3>Private Sessions &amp; Group Classes</h3><span class="lux-chevron"></span>
              </button>
              <div class="lux-section-body"><div class="lux-grid" id="sessions-grid"></div></div>
            </section>

            <section class="lux-section" data-section="workshops">
              <button class="lux-section-header" aria-expanded="false">
                <h3>Group Workshops, Courses &amp; Retreats</h3><span class="lux-chevron"></span>
              </button>
              <div class="lux-section-body"><div class="lux-grid" id="workshops-grid"></div></div>
            </section>
          </div></div>
        </div>

        <span id="cta-aria-live" aria-live="polite" class="sr-only"></span>
      </footer>`;
  }

  /** @private */
  populateGrids() {
    const base = '/CTA/';
    const BASE_URL = 'https://lironkerem.wixsite.com/project-curiosity/';
    const sessions = [
      'tarot','reiki','meditation','tarot','osho',
      'guided-visualizations','eft','yoga','tantra'
    ];
    const workshops = ['tarot','reiki','meditation','rainbow-body','osho','osho'];

    const sGrid = document.getElementById('sessions-grid');
    const wGrid = document.getElementById('workshops-grid');
    sessions.forEach((slug, i) =>
      sGrid.appendChild(this.createCard(`${base}Sessions/Sessions${i+1}.jpg`, BASE_URL + slug, `Session ${i+1}`))
    );
    workshops.forEach((slug, i) =>
      wGrid.appendChild(this.createCard(`${base}Workshops/Workshops${i+1}.jpg`, BASE_URL + slug, `Workshop ${i+1}`))
    );
  }

  /** @private */
  createCard(src, href, alt) {
    const a = document.createElement('a');
    a.href      = href;
    a.target    = '_blank';
    a.rel       = 'noopener';
    a.className = 'lux-card';
    const webp  = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    a.innerHTML = `<div class="lux-img-wrap"><picture><source srcset="${webp}" type="image/webp"><img src="${src}" alt="${alt}" loading="lazy" decoding="async" width="300" height="200"></picture></div>`;
    return a;
  }

  destroy() {
    this.listeners.forEach(({ element, event, handler }) =>
      element?.removeEventListener(event, handler)
    );
    this.listeners = [];
    // Release scroll lock if destroyed while open
    if (this.isOpen) {
      document.body.style.overflow = document.body.style.position = document.body.style.width = document.body.style.top = '';
      window.scrollTo(0, this._scrollY);
    }
    document.getElementById('cta-footer')?.remove();
  }
}