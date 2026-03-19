// Core/MatrixRain.js
/* global window, document, requestAnimationFrame, cancelAnimationFrame */

/**
 * MatrixRain - Animated cascading characters effect
 * Only activates when body has 'matrix-code' class
 */

(function() {
  const CONFIG = {
    CHARS: 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789',
    COLUMNS_MOBILE: 12,
    COLUMNS_DESKTOP: 25,
    CHAR_COUNT: 100,
    SPEED_MOBILE: 3,
    SPEED_DESKTOP: 3,
    RANDOM_MOBILE: 4,
    RANDOM_DESKTOP: 4,
    FONT_MOBILE: 16,
    FONT_DESKTOP: 24,
    LINE_MOBILE: 20,
    LINE_DESKTOP: 28
  };

  class MatrixRain {
    constructor() {
      this.container = null;
      this.columns = [];
      this.animationId = null;
      this.isRunning = false;
    }

    init() {
      if (!document.body.classList.contains('matrix-code')) return;
      
      this.createContainer();
      this.createColumns();
      this.isRunning = true;
      this.animate();
    }

    createContainer() {
      this.container = document.createElement('div');
      this.container.style.cssText = 'position:fixed!important;top:0!important;left:0!important;width:100%!important;height:100%!important;z-index:1!important;pointer-events:none!important;overflow:hidden!important;';
      document.body.insertBefore(this.container, document.body.firstChild);
    }

    createColumns() {
      const isMobile = window.innerWidth <= 768;
      const count = isMobile ? CONFIG.COLUMNS_MOBILE : CONFIG.COLUMNS_DESKTOP;
      const speed = isMobile ? CONFIG.SPEED_MOBILE : CONFIG.SPEED_DESKTOP;
      const random = isMobile ? CONFIG.RANDOM_MOBILE : CONFIG.RANDOM_DESKTOP;
      const fontSize = isMobile ? CONFIG.FONT_MOBILE : CONFIG.FONT_DESKTOP;
      const lineHeight = isMobile ? CONFIG.LINE_MOBILE : CONFIG.LINE_DESKTOP;
      const isDark = document.body.classList.contains('dark-mode');
      const color = isDark ? '#ff0041' : '#00ff41';

      for (let i = 0; i < count; i++) {
        const col = document.createElement('div');
        const left = ((i / count) * 100) + (50 / count);
        col.style.cssText = `font-family:monospace;font-size:${fontSize}px;line-height:${lineHeight}px;color:${color};opacity:0.5;white-space:pre;text-shadow:0 0 10px ${color};position:absolute;left:${left}%;top:0;transform:translateX(-50%)`;
        
        let chars = '';
        for (let j = 0; j < CONFIG.CHAR_COUNT; j++) {
          chars += CONFIG.CHARS[Math.floor(Math.random() * CONFIG.CHARS.length)] + '\n';
        }
        col.textContent = chars;
        
        this.container.appendChild(col);
        this.columns.push({
          el: col,
          y: -Math.random() * 4000,
          speed: speed + Math.random() * random
        });
      }
    }

    animate() {
      if (!this.isRunning) return;
      
      const h = window.innerHeight;
      this.columns.forEach(col => {
        col.y += col.speed;
        if (col.y > h + 2000) col.y = -2000;
        col.el.style.transform = `translateX(-50%) translateY(${col.y}px)`;
      });
      
      this.animationId = requestAnimationFrame(() => this.animate());
    }

destroy() {
      this.isRunning = false;
      if (this.animationId) cancelAnimationFrame(this.animationId);
      if (this.container) this.container.remove();
    }

    updateColors() {
      const isDark = document.body.classList.contains('dark-mode');
      const color = isDark ? '#ff0041' : '#00ff41';
      
      this.columns.forEach(col => {
        col.el.style.color = color;
        col.el.style.textShadow = `0 0 10px ${color}`;
      });
      
    }
  } 

  // Initialize
  window.MatrixRain = MatrixRain;
  window.matrixRain = new MatrixRain();
  
  function start() {
    if (document.body.classList.contains('matrix-code')) {
      window.matrixRain.init();
    }
  }

  // Watch for dark mode changes
  if (window.MutationObserver) {
    const observer = new MutationObserver(() => {
      if (window.matrixRain && window.matrixRain.isRunning) {
        window.matrixRain.updateColors();
      }
    });
    
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  }
  setTimeout(start, 100);
  setTimeout(start, 500);
  setTimeout(start, 1000);
})();