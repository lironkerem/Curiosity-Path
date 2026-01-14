/* =========================================================
   WELLNESS AUTOMATION MANAGER (OPTIMIZED)
   Production-Grade v2.0
   ========================================================= */

class WellnessAutomationManager {
  constructor(app) {
    this.app = app;
    this.timers = {};
    this.lastTriggered = {};
    this.activeNotifications = new Set();
    this.styleInjected = false;
    this.init();
  }

  init() {
    this.injectStyles();
    this.startAutomations();
    
    // Expose restart method globally
    if (window.app) {
      window.app.restartAutomations = () => this.restartAutomations();
    }
  }

  injectStyles() {
    if (this.styleInjected || document.getElementById('automation-notification-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'automation-notification-styles';
    style.textContent = `
      .automation-notification {
        position: fixed;
        top: 80px;
        right: 20px;
        z-index: 999999;
        animation: slideInRight 0.3s ease;
      }
      
      .automation-notification-content {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 16px;
        padding: 16px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 320px;
        max-width: 400px;
        color: white;
      }
      
      .automation-notification-icon {
        font-size: 2rem;
        flex-shrink: 0;
        animation: bell-ring 0.5s ease;
      }
      
      .automation-notification-text {
        flex: 1;
        min-width: 0;
      }
      
      .automation-notification-text strong {
        display: block;
        font-size: 1rem;
        margin-bottom: 4px;
        font-weight: 700;
      }
      
      .automation-notification-text p {
        font-size: 0.85rem;
        opacity: 0.9;
        margin: 0;
      }
      
      .automation-notification-actions {
        display: flex;
        flex-direction: column;
        gap: 6px;
        flex-shrink: 0;
      }
      
      .automation-btn-start,
      .automation-btn-dismiss {
        padding: 6px 12px;
        border: none;
        border-radius: 8px;
        font-size: 0.85rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
      }
      
      .automation-btn-start {
        background: white;
        color: #667eea;
      }
      
      .automation-btn-start:hover {
        background: #f0f0f0;
        transform: scale(1.05);
      }
      
      .automation-btn-start:active {
        transform: scale(0.98);
      }
      
      .automation-btn-dismiss {
        background: rgba(255, 255, 255, 0.2);
        color: white;
      }
      
      .automation-btn-dismiss:hover {
        background: rgba(255, 255, 255, 0.3);
      }
      
      .automation-btn-dismiss:active {
        transform: scale(0.98);
      }
      
      @keyframes slideInRight {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes bell-ring {
        0%, 100% { transform: rotate(0deg); }
        10%, 30% { transform: rotate(-10deg); }
        20%, 40% { transform: rotate(10deg); }
        50% { transform: rotate(0deg); }
      }
      
      @keyframes slideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
      
      .automation-notification.dismissing {
        animation: slideOutRight 0.3s ease forwards;
      }
      
      @media (max-width: 480px) {
        .automation-notification {
          top: 20px;
          right: 10px;
          left: 10px;
        }
        
        .automation-notification-content {
          min-width: auto;
          max-width: none;
        }
      }
    `;
    document.head.appendChild(style);
    this.styleInjected = true;
  }

  startAutomations() {
    const automations = this.loadAutomations();
    const toolMap = this.getToolMap();

    Object.keys(automations).forEach(toolKey => {
      const config = automations[toolKey];
      const tool = toolMap[toolKey];
      
      if (config.enabled && tool && typeof tool.open === 'function') {
        this.scheduleAutomation(toolKey, tool, config.interval);
      }
    });
  }

  getToolMap() {
    return {
      selfReset: { 
        name: 'Self Reset', 
        open: () => window.WellnessKit?.openSelfReset?.() || window.openSelfReset?.()
      },
      fullBodyScan: { 
        name: 'Full Body Scan', 
        open: () => window.WellnessKit?.openFullBodyScan?.() || window.openFullBodyScan?.()
      },
      nervousSystem: { 
        name: 'Nervous System Reset', 
        open: () => window.WellnessKit?.openNervousReset?.() || window.openNervousReset?.()
      },
      tensionSweep: { 
        name: 'Tension Sweep', 
        open: () => window.WellnessKit?.openTensionSweep?.() || window.openTensionSweep?.()
      }
    };
  }

  scheduleAutomation(toolKey, tool, intervalMinutes) {
    // Clear existing timer if any
    if (this.timers[toolKey]) {
      clearInterval(this.timers[toolKey]);
      delete this.timers[toolKey];
    }

    // Validate interval
    if (!intervalMinutes || intervalMinutes < 1) {
      console.warn(`Invalid interval for ${toolKey}: ${intervalMinutes}`);
      return;
    }

    const intervalMs = intervalMinutes * 60 * 1000;
    
    // Set up recurring timer
    this.timers[toolKey] = setInterval(() => {
      this.triggerTool(toolKey, tool);
    }, intervalMs);

    console.log(`⚙️ Automation scheduled: ${tool.name} every ${intervalMinutes} minutes`);
  }

  triggerTool(toolKey, tool) {
    const now = Date.now();
    const lastTime = this.lastTriggered[toolKey] || 0;
    
    // Prevent triggering too frequently (safety check)
    const MIN_INTERVAL = 30000; // 30 seconds
    if (now - lastTime < MIN_INTERVAL) {
      console.log(`⏭️ Skipping ${tool.name} - triggered too recently`);
      return;
    }
    
    this.lastTriggered[toolKey] = now;
    
    // Show notification
    this.showAutomationNotification(tool.name, () => {
      if (typeof tool.open === 'function') {
        tool.open();
      }
    });
  }

  showAutomationNotification(toolName, onOpen) {
    // Limit simultaneous notifications
    if (this.activeNotifications.size >= 3) {
      console.log('⚠️ Too many active notifications, skipping');
      return;
    }

    const notification = document.createElement('div');
    notification.className = 'automation-notification';
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    notification.innerHTML = `
      <div class="automation-notification-content">
        <div class="automation-notification-icon" aria-hidden="true">🔔</div>
        <div class="automation-notification-text">
          <strong>Time for ${this.escapeHtml(toolName)}</strong>
          <p>Ready for your wellness practice?</p>
        </div>
        <div class="automation-notification-actions">
          <button class="automation-btn-start" aria-label="Start ${this.escapeHtml(toolName)} now">Start Now</button>
          <button class="automation-btn-dismiss" aria-label="Dismiss notification">Dismiss</button>
        </div>
      </div>
    `;

    this.activeNotifications.add(notification);
    document.body.appendChild(notification);

    const dismiss = () => {
      notification.classList.add('dismissing');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
        this.activeNotifications.delete(notification);
      }, 300);
    };

    // Event handlers
    const startBtn = notification.querySelector('.automation-btn-start');
    const dismissBtn = notification.querySelector('.automation-btn-dismiss');

    startBtn.addEventListener('click', () => {
      if (typeof onOpen === 'function') {
        onOpen();
      }
      dismiss();
    });

    dismissBtn.addEventListener('click', dismiss);

    // Auto-dismiss after 30 seconds
    const autoDismissTimer = setTimeout(() => {
      if (notification.parentNode) {
        dismiss();
      }
    }, 30000);

    // Store timer for cleanup
    notification._autoDismissTimer = autoDismissTimer;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  loadAutomations() {
    const defaults = {
      selfReset: { enabled: false, interval: 60 },
      fullBodyScan: { enabled: false, interval: 180 },
      nervousSystem: { enabled: false, interval: 120 },
      tensionSweep: { enabled: false, interval: 120 }
    };

    try {
      const stored = localStorage.getItem('wellness_automations');
      if (!stored) return defaults;
      
      const parsed = JSON.parse(stored);
      
      // Validate and merge with defaults
      return Object.keys(defaults).reduce((acc, key) => {
        acc[key] = {
          enabled: typeof parsed[key]?.enabled === 'boolean' ? parsed[key].enabled : defaults[key].enabled,
          interval: typeof parsed[key]?.interval === 'number' && parsed[key].interval > 0 
            ? parsed[key].interval 
            : defaults[key].interval
        };
        return acc;
      }, {});
    } catch (e) {
      console.error('Error loading automations:', e);
      return defaults;
    }
  }

  saveAutomations(automations) {
    try {
      localStorage.setItem('wellness_automations', JSON.stringify(automations));
      return true;
    } catch (e) {
      console.error('Error saving automations:', e);
      return false;
    }
  }

  restartAutomations() {
    // Clear all existing timers
    Object.keys(this.timers).forEach(key => {
      clearInterval(this.timers[key]);
      delete this.timers[key];
    });
    
    this.lastTriggered = {};
    
    // Restart with new settings
    this.startAutomations();
    
    console.log('⚙️ Automations restarted with new settings');
  }

  destroy() {
    // Clean up all timers
    Object.keys(this.timers).forEach(key => {
      clearInterval(this.timers[key]);
    });
    this.timers = {};
    this.lastTriggered = {};
    
    // Clean up active notifications
    this.activeNotifications.forEach(notification => {
      if (notification._autoDismissTimer) {
        clearTimeout(notification._autoDismissTimer);
      }
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    });
    this.activeNotifications.clear();
  }
}

// Auto-initialize when DOM is ready
if (typeof window !== 'undefined') {
  const initAutomation = () => {
    if (window.app && !window.app.wellnessAutomation) {
      window.app.wellnessAutomation = new WellnessAutomationManager(window.app);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAutomation);
  } else {
    // DOM already loaded
    initAutomation();
  }
}

// Export for ES6 modules (RECOMMENDED - Professional standard)
export { WellnessAutomationManager };

// Backward compatibility for CommonJS (Node.js)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { WellnessAutomationManager };
  module.exports.default = WellnessAutomationManager; // For mixed environments
}

// Backward compatibility for AMD (RequireJS)
if (typeof define === 'function' && define.amd) {
  define([], function() { return WellnessAutomationManager; });
}