// Core/MatrixRain.js
/* global window, document, requestAnimationFrame, cancelAnimationFrame */

/**
 * MatrixRain - Animated cascading characters effect
 * Only activates when body has 'matrix-code' class
 * Automatically detects dark mode for red vs green theme
 */

const MATRIX_CONFIG = {
  CHARS: 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789',
  MOBILE_BREAKPOINT: 768,
  COLUMN_COUNT_DESKTOP: 25,
  COLUMN_COUNT_MOBILE: 12,
  CHAR_COUNT: 100,
  BASE_SPEED_MOBILE: 1.5,
  BASE_SPEED_DESKTOP: 3,
  RANDOM_SPEED_MOBILE: 2,
  RANDOM_SPEED_DESKTOP: 4,
  FONT_SIZE_MOBILE: 16,
  FONT_SIZE_DESKTOP: 24,
  LINE_HEIGHT_MOBILE: 20,
  LINE_HEIGHT_DESKTOP: 28,
  OPACITY_MOBILE: 0.5,
  OPACITY_DESKTOP: 0.6,
  Z_INDEX: 1,
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
    const isMobile = window.innerWidth <= MATRIX_CONFIG.MOBILE_BREAKPOINT;
    console.log(`✅ Matrix rain initialized (${mode}) with ${isMobile ? MATRIX_CONFIG.COLUMN_COUNT_MOBILE : MATRIX_CONFIG.COLUMN_COUNT_DESKTOP} columns at z-index ${MATRIX_CONFIG.Z_INDEX}`);
  }

  /**
   * Stop and cleanup the matrix rain effect
   */
  destroy() {
    this._stopAnimation();
    this._stopWatchingTheme();
    this._cleanup();
    console.log('🛑 Matrix rain destroyed');
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
    this.container.setAttribute('data-matrix-rain', 'true');
    this.container.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      z-index: 1 !important;
      pointer-events: none !important;
      overflow: hidden !important;
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
      -webkit-transform: translate3d(0,0,0) !important;
      transform: translate3d(0,0,0) !important;
      -webkit-backface-visibility: hidden !important;
      backface-visibility: hidden !important;
    `.replace(/\s+/g, ' ').trim();
    
    document.body.insertBefore(this.container, document.body.firstChild);
    console.log('✅ Matrix container created:', this.container);
  }

  /**
   * Create all column elements
   * @private
   */
  _createColumns() {
    const isMobile = window.innerWidth <= MATRIX_CONFIG.MOBILE_BREAKPOINT;
    const columnCount = isMobile ? MATRIX_CONFIG.COLUMN_COUNT_MOBILE : MATRIX_CONFIG.COLUMN_COUNT_DESKTOP;
    const baseSpeed = isMobile ? MATRIX_CONFIG.BASE_SPEED_MOBILE : MATRIX_CONFIG.BASE_SPEED_DESKTOP;
    const randomSpeed = isMobile ? MATRIX_CONFIG.RANDOM_SPEED_MOBILE : MATRIX_CONFIG.RANDOM_SPEED_DESKTOP;
    const fontSize = isMobile ? MATRIX_CONFIG.FONT_SIZE_MOBILE : MATRIX_CONFIG.FONT_SIZE_DESKTOP;
    const lineHeight = isMobile ? MATRIX_CONFIG.LINE_HEIGHT_MOBILE : MATRIX_CONFIG.LINE_HEIGHT_DESKTOP;
    const opacity = isMobile ? MATRIX_CONFIG.OPACITY_MOBILE : MATRIX_CONFIG.OPACITY_DESKTOP;
    const colors = this._getColors();

    console.log(`Creating ${columnCount} columns for ${isMobile ? 'MOBILE' : 'DESKTOP'}`);

    for (let i = 0; i < columnCount; i++) {
      const col = this._createColumn(i, colors, fontSize, lineHeight, opacity, columnCount);
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
  _createColumn(index, colors, fontSize, lineHeight, opacity, columnCount) {
    const col = document.createElement('div');
    col.className = 'matrix-column';
    col.setAttribute('data-column-index', index);
    
    // Calculate column spacing based on total columns
    const spacing = 100 / columnCount;
    const leftPosition = (index * spacing) + (spacing / 2);
    
    col.style.cssText = `
      font-family: 'Share Tech Mono', monospace !important;
      font-size: ${fontSize}px !important;
      line-height: ${lineHeight}px !important;
      color: ${colors.PRIMARY} !important;
      opacity: ${opacity} !important;
      white-space: pre !important;
      text-shadow: 0 0 10px ${colors.PRIMARY}, 0 0 20px ${colors.GLOW} !important;
      position: absolute !important;
      left: ${leftPosition}% !important;
      top: 0 !important;
      will-change: transform !important;
      transform: translateX(-50%) !important;
      display: block !important;
      visibility: visible !important;
      pointer-events: none !important;
    `.replace(/\s+/g, ' ').trim();
    
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
  // Expose constructor globally
  window.MatrixRain = MatrixRain;

  // Initialize function
  const startIfNeeded = () => {
    if (document.body.classList.contains('matrix-code')) {
      if (!window.matrixRain || !window.matrixRain.isRunning) {
        window.matrixRain = new MatrixRain();
        window.matrixRain.init();
        console.log('🎬 Matrix Rain started');
      }
    }
  };

  // Try multiple initialization points
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startIfNeeded);
  } else if (document.readyState === 'interactive' || document.readyState === 'complete') {
    // DOM already loaded, start immediately
    setTimeout(startIfNeeded, 100);
  }

  // Also try on window load as fallback
  window.addEventListener('load', () => {
    setTimeout(startIfNeeded, 100);
  });

  // Watch for class changes
  if (window.MutationObserver) {
    const matrixObserver = new MutationObserver(() => {
      if (document.body.classList.contains('matrix-code')) {
        startIfNeeded();
      } else {
        // Auto-destroy when leaving skin
        if (window.matrixRain) {
          window.matrixRain.destroy();
        }
      }
    });
    
    matrixObserver.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
  }
}