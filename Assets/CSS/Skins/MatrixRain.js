// Core/MatrixRain.js
/* global window, document, requestAnimationFrame, cancelAnimationFrame */

/**
 * MatrixRain - Animated cascading characters effect
 * Only activates when body has 'matrix-code' class
 * Automatically detects dark mode for red vs green theme
 * Mobile-forced visible: z-index 0, min-width, higher opacity, bigger font
 */

const MATRIX_CONFIG = {
  CHARS: '\uff8a\uff86\uff8b\uff70\uff73\uff7c\uff85\uff94\uff86\uff7b\uff9c\uff82\uff75\uff98\uff71\uff8e\uff83\uff8f\uff79\uff92\uff74\uff76\uff77\uff92\uff95\uff97\uff7e\uff88\uff7d\uff80\uff87\uff8e0123456789',
  MOBILE_BREAKPOINT: 768,
  COLUMN_COUNT: window.innerWidth <= 768 ? 12 : 25,
  CHAR_COUNT: window.innerWidth <= 768 ? 40 : 100,
  BASE_SPEED_MOBILE: 0.8,
  BASE_SPEED_DESKTOP: 3,
  RANDOM_SPEED_MOBILE: 1.2,
  RANDOM_SPEED_DESKTOP: 4,
  Z_INDEX: -1,
  COLORS: {
    DARK: { PRIMARY: '#ff0041', GLOW: 'rgba(255,0,65,.6)' },
    LIGHT: { PRIMARY: '#00ff41', GLOW: 'rgba(0,255,65,.6)' }
  }
};

export class MatrixRain {
  constructor() {
    this.container = null;
    this.columns = [];
    this.animationId = null;
    this.isRunning = false;
    this.themeObserver = null;
  }

  init() {
    this._cleanup();
    if (!document.body.classList.contains('matrix-code')) return;

    this._createContainer();
    this._createColumns();
    this._startAnimation();
    this._watchThemeChanges();

    const mode = this._isDarkMode() ? 'RED' : 'GREEN';
    console.log(`✅ Matrix rain initialized (${mode}) with ${MATRIX_CONFIG.COLUMN_COUNT} columns at z-index ${this._zIndex()}`);
  }

  destroy() {
    this._stopAnimation();
    this._stopWatchingTheme();
    this._cleanup();
    console.log('🛑 Matrix rain destroyed');
  }

  _zIndex() {
    return window.innerWidth <= MATRIX_CONFIG.MOBILE_BREAKPOINT ? 0 : MATRIX_CONFIG.Z_INDEX;
  }

  _isDarkMode() {
    return document.body.classList.contains('dark-mode');
  }

  _getColors() {
    return this._isDarkMode() ? MATRIX_CONFIG.COLORS.DARK : MATRIX_CONFIG.COLORS.LIGHT;
  }

  _createContainer() {
    this.container = document.createElement('div');
    this.container.className = 'matrix-rain-container';
    this.container.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;z-index:${this._zIndex()};pointer-events:none;overflow:hidden`;
    document.body.insertBefore(this.container, document.body.firstChild);
  }

  _createColumns() {
    const colors = this._getColors();
    const isMobile = this._isMobile();
    for (let i = 0; i < MATRIX_CONFIG.COLUMN_COUNT; i++) {
      const col = document.createElement('div');
      col.className = 'matrix-column';

      // MOBILE VISIBILITY FIXES
      col.style.cssText = `
        font-family:'Share Tech Mono',monospace;
        font-size:${isMobile ? '28px' : '24px'};
        line-height:28px;
        color:${colors.PRIMARY};
        opacity:${isMobile ? '0.9' : '0.6'};
        white-space:pre;
        text-shadow:0 0 10px ${colors.PRIMARY},0 0 20px ${colors.GLOW};
        position:absolute;
        left:${4 * i}%;
        top:0;
        will-change:transform;
        transform:translateZ(0);
        min-width:18px;
        background:transparent;
      `;

      const chars = Array.from({ length: MATRIX_CONFIG.CHAR_COUNT }, () =>
        MATRIX_CONFIG.CHARS[Math.random() * MATRIX_CONFIG.CHARS.length | 0]
      ).join('\n');
      col.textContent = chars;
      this.container.appendChild(col);

      this.columns.push({
        el: col,
        y: -Math.random() * 4000,
        speed: (isMobile ? MATRIX_CONFIG.BASE_SPEED_MOBILE : MATRIX_CONFIG.BASE_SPEED_DESKTOP) +
               Math.random() * (isMobile ? MATRIX_CONFIG.RANDOM_SPEED_MOBILE : MATRIX_CONFIG.RANDOM_SPEED_DESKTOP)
      });
    }
  }

  _isMobile() {
    return window.innerWidth <= MATRIX_CONFIG.MOBILE_BREAKPOINT;
  }

  _startAnimation() {
    this.isRunning = true;
    this._animate();
  }

  _stopAnimation() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  _animate() {
    if (!this.isRunning) return;
    if (!document.body.classList.contains('matrix-code')) {
      this.destroy();
      return;
    }
    this._updateColumns();
    this.animationId = requestAnimationFrame(() => this._animate());
  }

  _updateColumns() {
    const h = window.innerHeight;
    this.columns.forEach(col => {
      col.y += col.speed;
      if (col.y > h + 2000) col.y = -2000;
      col.el.style.transform = `translateY(${col.y}px)`;
    });
  }

  _cleanup() {
    const existing = document.querySelector('.matrix-rain-container');
    if (existing) existing.remove();
    this.container = null;
    this.columns = [];
  }

  _watchThemeChanges() {
    if (!window.MutationObserver) return;
    this.themeObserver = new MutationObserver(() => {
      if (document.body.classList.contains('matrix-code')) {
        if (!window.matrixRain || !window.matrixRain.isRunning) this.init();
      } else {
        if (window.matrixRain) this.destroy();
      }
    });
    this.themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  _stopWatchingTheme() {
    if (this.themeObserver) {
      this.themeObserver.disconnect();
      this.themeObserver = null;
    }
  }
}

/* ----------  auto-start / expose  ---------- */
if (typeof window !== 'undefined') {
  window.MatrixRain = MatrixRain;

  const startIfNeeded = () => {
    if (document.body.classList.contains('matrix-code')) {
      if (!window.matrixRain || !window.matrixRain.isRunning) {
        window.matrixRain = new MatrixRain();
        window.matrixRain.init();
      }
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startIfNeeded);
  } else {
    startIfNeeded();
  }

  /* pause while tab hidden (battery save) */
  document.addEventListener('visibilitychange', () => {
    if (!window.matrixRain) return;
    document.hidden ? window.matrixRain._stopAnimation() : window.matrixRain._startAnimation();
  });

  /* watch for class changes later */
  const mo = new MutationObserver(() => startIfNeeded());
  mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });
}