/**
 * CTA Footer Component
 * Handles the expandable footer with service offerings
 * Features: Neumorphic design, swipe-to-close gesture, scroll prevention when open
 * @author Aanandoham (Liron Kerem)
 * @copyright 2026
 */
export default class CTA {
  /** Swipe gesture configuration */
  static SWIPE_CONFIG = {
    Y_THRESHOLD:      60,
    VELOCITY_THRESHOLD: 0.5,
    HAPTIC_DURATION:  8,
    ANIMATION_DELAY:  300
  };

  /** Allowed external hostnames for card links (security whitelist) */
  static ALLOWED_HOSTS = new Set(['lironkerem.wixsite.com']);

  constructor() {
    this.isOpen         = false;
    this.scrollObserver = null;
    this.elements       = null;
    this.listeners      = [];
  }

  // ─── Public ────────────────────────────────────────────────────────────────

  /**
   * Renders the CTA footer into the DOM (idempotent).
   */
  render() {
    if (document.getElementById('cta-footer')) return;
    document.getElementById('app-container')?.insertAdjacentHTML('beforeend', this.markup());
    this.init();
  }

  /**
   * Cleans up event listeners and removes DOM element.
   */
  destroy() {
    this.scrollObserver?.disconnect();
    this.listeners.forEach(({ element, event, handler }) => {
      element?.removeEventListener(event, handler);
    });
    this.listeners = [];
    document.getElementById('cta-footer')?.remove();
  }

  // ─── Private ───────────────────────────────────────────────────────────────

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
    this.preventBackgroundScroll();
  }

  setupToggleButton() {
    const handler = () => this.togglePanel();
    this.elements.toggle.addEventListener('click', handler);
    this.listeners.push({ element: this.elements.toggle, event: 'click', handler });
  }

  togglePanel() {
    this.isOpen = !this.isOpen;
    const { toggle, panel, live } = this.elements;
    toggle.classList.toggle('open', this.isOpen);
    toggle.setAttribute('aria-expanded', String(this.isOpen));
    panel.classList.toggle('open', this.isOpen);
    panel.setAttribute('aria-hidden', String(!this.isOpen));
    live.textContent = this.isOpen ? 'Footer panel opened' : 'Footer panel closed';
  }

  setupAccordionSections() {
    document.querySelectorAll('.lux-section-header').forEach(btn => {
      const handler = () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        const body     = btn.parentElement.querySelector('.lux-section-body');
        btn.setAttribute('aria-expanded', String(!expanded));
        body.classList.toggle('open', !expanded);
      };
      btn.addEventListener('click', handler);
      this.listeners.push({ element: btn, event: 'click', handler });
    });
  }

  preventBackgroundScroll() {
    this.scrollObserver = new MutationObserver(() => {
      const isOpen = this.elements.toggle.classList.contains('open');
      document.body.style.overflow = isOpen ? 'hidden' : '';
      document.body.style.position = isOpen ? 'fixed'  : '';
      document.body.style.width    = isOpen ? '100%'   : '';
    });
    this.scrollObserver.observe(this.elements.toggle, {
      attributes: true, attributeFilter: ['class']
    });
  }

  setupCTASwipeClose() {
    const { panel, toggle } = this.elements;
    const { Y_THRESHOLD, VELOCITY_THRESHOLD, HAPTIC_DURATION, ANIMATION_DELAY } = CTA.SWIPE_CONFIG;

    let startY = 0, startT = 0, canSwipeClose = false;

    const handleTouchStart = e => {
      startY        = e.touches[0].clientY;
      startT        = Date.now();
      canSwipeClose = !e.target.closest('.lux-grid, .lux-section-body');
      if (canSwipeClose) {
        panel.style.transition  = 'none';
        toggle.style.transition = 'none';
      }
    };

    const handleTouchMove = e => {
      if (!canSwipeClose) return;
      const deltaY = Math.max(0, e.touches[0].clientY - startY);
      const capped = Math.min(deltaY, panel.offsetHeight);
      panel.style.transform  = `translateY(${capped}px)`;
      toggle.style.transform = `translateY(${capped}px)`;
    };

    const handleTouchEnd = e => {
      panel.style.transition  = '';
      toggle.style.transition = '';
      if (!canSwipeClose) {
        panel.style.transform  = '';
        toggle.style.transform = '';
        return;
      }
      const deltaY   = e.changedTouches[0].clientY - startY;
      const velocity = deltaY / Math.max(1, Date.now() - startT);

      if (deltaY > Y_THRESHOLD && velocity > VELOCITY_THRESHOLD) {
        // Guard vibrate behind user-gesture (already inside touch handler) and feature check
        if (navigator.vibrate) {
          try { navigator.vibrate(HAPTIC_DURATION); } catch { /* non-critical */ }
        }
        this.isOpen = false;
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        panel.classList.remove('open');
        panel.setAttribute('aria-hidden', 'true');
        this.elements.live.textContent = 'Footer panel closed';
        setTimeout(() => {
          panel.style.transform  = '';
          toggle.style.transform = '';
        }, ANIMATION_DELAY);
      } else {
        panel.style.transform  = '';
        toggle.style.transform = '';
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

  markup() {
    return `
      <footer id="cta-footer" class="lux-footer" role="contentinfo">
        <button id="cta-toggle" class="lux-toggle" aria-expanded="false" aria-controls="cta-panel" type="button">
          <img src="/public/Watermarks/Logo.svg"
               alt="Aanandoham logo" class="lux-logo" width="120" height="40"
               loading="lazy" decoding="async">
          <div class="lux-text-group" aria-hidden="true">
            <span class="lux-line1">Deepen your life experience with me</span>
            <span class="lux-line2">© 2026 Aanandoham (Liron Kerem)</span>
          </div>
          <span class="lux-chevron" aria-hidden="true"></span>
        </button>

        <div id="cta-panel" class="lux-panel" aria-hidden="true" style="touch-action:manipulation;">
          <div class="lux-scroll">
            <div class="lux-inner">
              <header class="lux-header">
                <h2 class="lux-title">Empower your <em>'Self'</em></h2>
                <p class="lux-intro">
                  Welcome to Project Curiosity - founded 2010.<br>
                  Explore my unique In-Person and Online offerings
                </p>

                <div class="lux-social-row" style="display:flex;gap:.9rem;justify-content:center;margin-top:1.5rem;flex-wrap:wrap;">
                  <a href="https://lironkerem.wixsite.com/project-curiosity"
                     target="_blank" rel="noopener noreferrer"
                     class="lux-social-chip"
                     style="display:inline-flex;flex-direction:column;align-items:center;gap:.3rem;padding:.65rem .9rem;background:var(--neuro-bg);border-radius:999px;box-shadow:var(--shadow-raised);color:var(--neuro-text);text-decoration:none;transition:all .2s;"
                     aria-label="Official Website (opens in new tab)">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                    <span style="font-weight:600;font-size:1rem">Website</span>
                  </a>

                  <a href="https://www.facebook.com/AanandohamsProjectCuriosity"
                     target="_blank" rel="noopener noreferrer"
                     class="lux-social-chip"
                     style="display:inline-flex;flex-direction:column;align-items:center;gap:.3rem;padding:.65rem .9rem;background:var(--neuro-bg);border-radius:999px;box-shadow:var(--shadow-raised);color:var(--neuro-text);text-decoration:none;transition:all .2s;"
                     aria-label="Facebook Page (opens in new tab)">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    <span style="font-weight:600;font-size:1rem">Facebook</span>
                  </a>

                  <a href="https://www.youtube.com/@Aanandoham-Project-Curiosity"
                     target="_blank" rel="noopener noreferrer"
                     class="lux-social-chip"
                     style="display:inline-flex;flex-direction:column;align-items:center;gap:.3rem;padding:.65rem .9rem;background:var(--neuro-bg);border-radius:999px;box-shadow:var(--shadow-raised);color:var(--neuro-text);text-decoration:none;transition:all .2s;"
                     aria-label="YouTube Channel (opens in new tab)">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    <span style="font-weight:600;font-size:1rem">YouTube</span>
                  </a>
                </div>
              </header>

              <section class="lux-section" aria-labelledby="sessions-heading">
                <button class="lux-section-header" aria-expanded="false" aria-controls="sessions-body" type="button" id="sessions-btn">
                  <h3 id="sessions-heading">Private Sessions &amp; Group Classes</h3>
                  <span class="lux-chevron" aria-hidden="true"></span>
                </button>
                <div class="lux-section-body" id="sessions-body" role="region" aria-labelledby="sessions-heading">
                  <div class="lux-grid" id="sessions-grid"></div>
                </div>
              </section>

              <section class="lux-section" aria-labelledby="workshops-heading">
                <button class="lux-section-header" aria-expanded="false" aria-controls="workshops-body" type="button" id="workshops-btn">
                  <h3 id="workshops-heading">Group Workshops, Courses &amp; Retreats</h3>
                  <span class="lux-chevron" aria-hidden="true"></span>
                </button>
                <div class="lux-section-body" id="workshops-body" role="region" aria-labelledby="workshops-heading">
                  <div class="lux-grid" id="workshops-grid"></div>
                </div>
              </section>
            </div>
          </div>
        </div>

        <span id="cta-aria-live" role="status" aria-live="polite" class="sr-only"></span>
      </footer>`;
  }

  populateGrids() {
    const base = '/public/CTA/';
    const sessions = [
      'https://lironkerem.wixsite.com/project-curiosity/tarot',
      'https://lironkerem.wixsite.com/project-curiosity/reiki',
      'https://lironkerem.wixsite.com/project-curiosity/meditation',
      'https://lironkerem.wixsite.com/project-curiosity/tarot',
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

    const sessionLabels  = ['Tarot', 'Reiki', 'Meditation', 'Advanced Tarot', 'Osho', 'Guided Visualization', 'EFT', 'Yoga', 'Tantra'];
    const workshopLabels = ['Tarot Workshop', 'Reiki Workshop', 'Meditation Workshop', 'Rainbow Body', 'Osho Workshop', 'Osho Intensive'];

    const sGrid = document.getElementById('sessions-grid');
    const wGrid = document.getElementById('workshops-grid');

    sessions.forEach((url, i) => sGrid.appendChild(
      this.createCard(`${base}Sessions/Sessions${i + 1}.jpg`, url, sessionLabels[i] || `Session ${i + 1}`)
    ));
    workshops.forEach((url, i) => wGrid.appendChild(
      this.createCard(`${base}Workshops/Workshops${i + 1}.jpg`, url, workshopLabels[i] || `Workshop ${i + 1}`)
    ));
  }

  /**
   * Creates a service card element.
   * Only allows links to whitelisted hostnames.
   */
  createCard(src, href, label) {
    // Security: validate link host
    let safeHref = '#';
    try {
      const parsed = new URL(href);
      if (CTA.ALLOWED_HOSTS.has(parsed.hostname)) safeHref = parsed.href;
    } catch { /* malformed URL — use fallback */ }

    const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');

    const a       = document.createElement('a');
    a.href        = safeHref;
    a.target      = '_blank';
    a.rel         = 'noopener noreferrer';
    a.className   = 'lux-card';
    a.setAttribute('aria-label', label);
    a.innerHTML   = `
      <div class="lux-img-wrap">
        <picture>
          <source srcset="${webpSrc}" type="image/webp">
          <img src="${src}" alt="${label}" loading="lazy" decoding="async"
               width="300" height="200" style="aspect-ratio:3/2;object-fit:cover;">
        </picture>
      </div>`;
    return a;
  }
}
