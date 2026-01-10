// Core/MatrixRain.js
/* global window, document, requestAnimationFrame, cancelAnimationFrame */

/**
 * MatrixRain - Animated cascading characters effect
 * Only activates when body has 'matrix-code' class
 * Automatically detects dark mode for red vs green theme
 */

const MATRIX_CONFIG = {
  CHARS: '\uff8a\uff86\uff8b\uff70\uff73\uff7c\uff85\uff94\uff86\uff7b\uff9c\uff82\uff75\uff98\uff71\uff8e\uff83\uff8f\uff79\uff92\uff74\uff76\uff77\uff92\uff95\uff97\uff7e\uff88\uff7d\uff80\uff87\uff8e0123456789',
  MOBILE_BREAKPOINT: 768,
  COLUMN_COUNT: 25,
  CHAR_COUNT: 100,
  BASE_SPEED_MOBILE: 0.8,
  BASE_SPEED_DESKTOP: 3,
  RANDOM_SPEED_MOBILE: 1.2,
  RANDOM_SPEED_DESKTOP: 4,
  Z_INDEX: -1,
  COLORS: {
    DARK: {
      PRIMARY: '#ff0041',
      GLOW: 'rgba(255,0,65,.6)'
    },
    LIGHT: {
      PRIMARY: '#00ff41',
      GLOW: 'rgba(0,255,65,.6)'
    }
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

  /**
   * Initialize the matrix rain effect
   * Auto-detects theme changes and updates colors
   */
  init() {
    this._cleanup();
    
    if (!document.body.classList.contains('matrix-code')) {
      console.log('Matrix code theme not active, skipping initialization');
      return;
    }

    this._createContainer();
    this._createColumns();
    this._startAnimation();
    this._watchThemeChanges();
    
    const mode = this._isDarkMode() ? 'RED' : 'GREEN';
    console.log(`\u{2705} Matrix rain initialized (${mode}) with ${MATRIX_CONFIG.COLUMN_COUNT} columns at z-index ${MATRIX_CONFIG.Z_INDEX}`);
  }

  /**
   * Stop and cleanup the matrix rain effect
   */
  destroy() {
    this._stopAnimation();
    this._stopWatchingTheme();
    this._cleanup();
    console.log('\u{1F6D1} Matrix rain destroyed');
  }

  /**
   * Watch for theme changes (dark mode toggle)
   * @private
   */
  _watchThemeChanges() {
    if (!window.MutationObserver) return;

    this.themeObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const hasMatrixCode = document.body.classList.contains('matrix-code');
          const hasDarkMode = document.body.classList.contains('dark-mode');
          
          if (!hasMatrixCode) {
            this.destroy();
            return;
          }
          
          // Theme changed, update colors
          this._updateColumnColors();
        }
      });
    });

    this.themeObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  /**
   * Stop watching theme changes
   * @private
   */
  _stopWatchingTheme() {
    if (this.themeObserver) {
      this.themeObserver.disconnect();
      this.themeObserver = null;
    }
  }

  /**
   * Update all column colors based on current theme
   * @private
   */
  _updateColumnColors() {
    const colors = this._getColors();
    this.columns.forEach(col => {
      col.el.style.color = colors.PRIMARY;
      col.el.style.textShadow = `0 0 10px ${colors.PRIMARY},0 0 20px ${colors.GLOW}`;
    });
  }

  /**
   * Check if dark mode is active
   * @private
   */
  _isDarkMode() {
    return document.body.classList.contains('dark-mode');
  }

  /**
   * Get current color scheme based on theme
   * @private
   */
  _getColors() {
    const isDark = this._isDarkMode();
    return isDark ? MATRIX_CONFIG.COLORS.DARK : MATRIX_CONFIG.COLORS.LIGHT;
  }

  /**
   * Create the container element
   * @private
   */
  _createContainer() {
    this.container = document.createElement('div');
    this.container.className = 'matrix-rain-container';
    this.container.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;z-index:${MATRIX_CONFIG.Z_INDEX};pointer-events:none;overflow:hidden`;
    document.body.insertBefore(this.container, document.body.firstChild);
  }

  /**
   * Create all column elements
   * @private
   */
  _createColumns() {
    const isMobile = window.innerWidth <= MATRIX_CONFIG.MOBILE_BREAKPOINT;
    const baseSpeed = isMobile ? MATRIX_CONFIG.BASE_SPEED_MOBILE : MATRIX_CONFIG.BASE_SPEED_DESKTOP;
    const randomSpeed = isMobile ? MATRIX_CONFIG.RANDOM_SPEED_MOBILE : MATRIX_CONFIG.RANDOM_SPEED_DESKTOP;
    const colors = this._getColors();

    for (let i = 0; i < MATRIX_CONFIG.COLUMN_COUNT; i++) {
      const col = this._createColumn(i, colors);
      this.container.appendChild(col);
      
      this.columns.push({
        el: col,
        y: -Math.random() * 4000,
        speed: baseSpeed + Math.random() * randomSpeed
      });
    }
  }

  /**
   * Create a single column element
   * @private
   */
  _createColumn(index, colors) {
    const col = document.createElement('div');
    col.className = 'matrix-column';
    col.style.cssText = `font-family:'Share Tech Mono',monospace;font-size:24px;line-height:28px;color:${colors.PRIMARY};opacity:.6;white-space:pre;text-shadow:0 0 10px ${colors.PRIMARY},0 0 20px ${colors.GLOW};position:absolute;left:${4 * index}%;top:0;will-change:transform`;
    
    const chars = Array.from(
      { length: MATRIX_CONFIG.CHAR_COUNT },
      () => MATRIX_CONFIG.CHARS[Math.random() * MATRIX_CONFIG.CHARS.length | 0]
    ).join('\n');
    
    col.textContent = chars;
    return col;
  }

  /**
   * Start the animation loop
   * @private
   */
  _startAnimation() {
    this.isRunning = true;
    this._animate();
  }

  /**
   * Stop the animation loop
   * @private
   */
  _stopAnimation() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Animation loop
   * @private
   */
  _animate() {
    if (!this.isRunning) return;
    
    // Check if theme changed and cleanup if needed
    if (!document.body.classList.contains('matrix-code')) {
      this.destroy();
      return;
    }

    this._updateColumns();
    this.animationId = requestAnimationFrame(() => this._animate());
  }

  /**
   * Update all column positions
   * @private
   */
  _updateColumns() {
    const windowHeight = window.innerHeight;
    
    this.columns.forEach(col => {
      col.y += col.speed;
      
      if (col.y > windowHeight + 2000) {
        col.y = -2000;
      }
      
      col.el.style.transform = `translateY(${col.y}px)`;
    });
  }

  /**
   * Cleanup DOM elements
   * @private
   */
  _cleanup() {
    const existing = document.querySelector('.matrix-rain-container');
    if (existing) {
      existing.remove();
    }
    
    this.container = null;
    this.columns = [];
  }
}

/**
 * Auto-initialize when matrix-code class is detected
 * Can be manually controlled via window.matrixRain
 */
if (typeof window !== 'undefined') {
  // expose constructor globally
  window.MatrixRain = MatrixRain;

  // initial start (page load)
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

  // re-start whenever <body> receives the class (even long after load)
  const matrixObserver = new MutationObserver(() => {
    if (document.body.classList.contains('matrix-code')) {
      startIfNeeded();
    } else {
      // auto-destroy when leaving skin
      if (window.matrixRain) window.matrixRain.destroy();
    }
  });
  matrixObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
}