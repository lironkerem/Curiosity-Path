/**
 * WellnessKit.js - Unified 4-in-1 Wellness System
 * Provides breathing exercises, body scans, nervous system resets, and tension sweeps
 * Production-Grade v2.1
 */

(function () {
  'use strict';

  /* ==================== SHARED CONFIGURATION ==================== */
  
  const SHARED_CONFIG = {
    PULSE_POOL_SIZE: 10,              // Number of pulse elements to pool
    AUTO_TRIGGER: false,              // Auto-trigger on inactivity (future feature)
    AUTO_TRIGGER_ALIGN: true          // Align auto-trigger to the hour
  };

  /* ==================== TOOL CONFIGURATIONS ==================== */
  
  /**
   * Configuration for all wellness tools
   * Each tool has: id, title, duration, type, specific settings, storage prefix, gradient
   */
  const TOOLS = {
    selfReset: {
      id: 'selfreset',
      title: 'Self Reset',
      duration: 60,                   // 1 minute
      type: 'breathing',
      breathIn: 7,                    // Seconds to inhale
      breathHold: 3,                  // Seconds to hold
      breathOut: 7,                   // Seconds to exhale
      completeRounds: 3,              // Breathing cycles before relax phase
      storagePrefix: 'pc_wellness_selfreset',
      gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
    },
    
    fullBodyScan: {
      id: 'fullbodyscan',
      title: 'Full Body Scan',
      duration: 120,                  // 2 minutes
      type: 'zones',
      zones: [
        "Top of head", 
        "Back of head", 
        "Face", 
        "Throat and neck",
        "Shoulders", 
        "Arms and hands", 
        "Chest", 
        "Stomach",
        "Back (upper and lower)", 
        "Pelvic area", 
        "Legs", 
        "Feet"
      ],
      storagePrefix: 'pc_wellness_fullbodyscan',
      gradient: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)'
    },
    
    nervousSystem: {
      id: 'nervoussystem',
      title: 'Nervous System Reset',
      duration: 60,                   // 1 minute
      type: 'steps',
      steps: [
        "Shake your hands",
        "Roll your shoulders",
        "Stick out your tongue to relax the jaw",
        "Relax your face, especially around the eyes",
        "Take one long sigh",
        "Feel your feet on the ground",
        "Settle your breath naturally"
      ],
      stepDurations: [9, 9, 9, 9, 8, 8, 8],  // Custom duration per step (seconds)
      storagePrefix: 'pc_wellness_nervoussystem',
      gradient: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)'
    },
    
    tensionSweep: {
      id: 'tensionsweep',
      title: 'Tension Sweep',
      duration: 120,                  // 2 minutes
      type: 'zones',
      zones: [
        "Lift shoulders to your ears then drop",
        "Shake your arms loosely",
        "Shake your legs",
        "Twist your spine gently left and right",
        "Circle your hips slowly",
        "Open your chest, expand your ribcage",
        "Drop your head forward and roll gently",
        "Shake your whole body lightly"
      ],
      storagePrefix: 'pc_wellness_tensionsweep',
      gradient: 'linear-gradient(135deg, #fff1eb 0%, #ace0f9 100%)'
    }
  };

  /* ==================== SHARED STYLES ==================== */
  
  const css = `
    /* Wellness Kit Styles - inherits CSS variables from main app */

    /* Overlay */
    .wk-overlay {
      position: fixed;
      inset: 0;
      display: none;
      align-items: center;
      justify-content: center;
      background: rgba(224, 229, 236, 0.72);
      backdrop-filter: blur(6px);
      z-index: 999995;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    /* Main Card */
    .wk-box {
      width: 460px;
      max-width: calc(100% - 32px);
      border-radius: var(--radius-xl, 16px);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
      padding: 32px;
      text-align: center;
      animation: wk-fadeIn 400ms ease;
      position: relative;
      overflow: hidden;
    }

    .wk-box::before {
      content: '';
      position: absolute;
      inset: 0;
      opacity: 0.95;
      z-index: -1;
    }

    /* Title */
    .wk-box h2 {
      margin: 0 0 20px 0;
      font-size: 32px;
      font-weight: 800;
      color: #1a202c;
      letter-spacing: -0.5px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    /* Ring Container */
    .wk-ring-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      width: 200px;
      height: 200px;
      margin: 12px auto 20px;
    }

    /* Timer Display */
    .wk-timer {
      position: absolute;
      z-index: 4;
      font-size: 44px;
      font-weight: 700;
      color: var(--neuro-text, #1a202c);
      user-select: none;
    }

    /* Progress Ring */
    .wk-ring {
      width: 200px;
      height: 200px;
      transform: rotate(-90deg);
      z-index: 2;
    }

    /* Breathing Animation */
    .wk-anim {
      position: absolute;
      width: 150px;
      height: 150px;
      border-radius: 50%;
      z-index: 1;
      pointer-events: none;
      box-shadow: 0 0 40px rgba(255, 215, 0, 0.4),
                  0 0 80px rgba(255, 215, 0, 0.2),
                  inset 0 0 60px rgba(255, 255, 255, 0.3);
      background: radial-gradient(
        circle at 30% 30%, 
        rgba(255, 255, 255, 0.8), 
        rgba(255, 215, 0, 0.3) 50%, 
        transparent 70%
      );
      animation: wk-breathePulse 3s ease-in-out infinite;
      will-change: transform;
    }

    @keyframes wk-breathePulse {
      0%, 100% { 
        transform: scale(1); 
        box-shadow: 0 0 40px rgba(255, 215, 0, 0.4),
                    0 0 80px rgba(255, 215, 0, 0.2),
                    inset 0 0 60px rgba(255, 255, 255, 0.3);
      }
      50% { 
        transform: scale(1.15); 
        box-shadow: 0 0 60px rgba(255, 215, 0, 0.6),
                    0 0 120px rgba(255, 215, 0, 0.4),
                    inset 0 0 80px rgba(255, 255, 255, 0.5);
      }
    }

    /* Pulse Effects Container */
    .wk-pulses {
      position: absolute;
      inset: 0;
      z-index: 0;
      pointer-events: none;
    }

    /* Individual Pulse */
    .wk-pulse {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      transform: translate(-50%, -50%) scale(0.2);
      background: radial-gradient(circle, rgba(102, 126, 234, 0.18), transparent 60%);
      opacity: 0;
      will-change: transform, opacity;
    }

    .wk-pulse.active {
      animation: wk-pulseGrow 1100ms ease-out forwards;
    }

    @keyframes wk-pulseGrow {
      to { 
        transform: translate(-50%, -50%) scale(3.2); 
        opacity: 0; 
      }
    }

    /* Instruction Text */
    .wk-text {
      margin-top: 12px;
      font-weight: 700;
      color: #1a202c;
      font-size: 22px;
      min-height: 32px;
      transition: opacity 200ms ease;
      line-height: 1.3;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    .wk-text.changing {
      opacity: 0.5;
    }

    /* Mini Counter (for breathing phases) */
    .wk-mini-count {
      font-weight: 700;
      font-size: 18px;
      color: #2d3748;
      opacity: 0.9;
      margin-top: 8px;
      min-height: 24px;
    }

    /* Stats Display (currently hidden) */
    .wk-stats {
      display: none;
    }

    /* Button Container */
    .wk-footer {
      display: flex;
      gap: 10px;
      justify-content: center;
      margin-top: 20px;
    }

    /* Buttons */
    .wk-btn {
      padding: 12px 24px;
      border-radius: 14px;
      border: none;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      color: var(--neuro-text, #1a202c);
      font-weight: 700;
      cursor: pointer;
      transition: all 180ms ease-in-out;
      min-width: 90px;
      font-size: 15px;
    }

    .wk-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    }

    .wk-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Toast Notification */
    .wk-toast {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(26, 32, 44, 0.95);
      color: #fff;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      z-index: 999999;
      opacity: 0;
      transition: opacity 200ms ease;
    }

    /* Utility Classes */
    .hidden {
      display: none !important;
    }

    @keyframes wk-fadeIn {
      from { 
        opacity: 0; 
        transform: scale(0.95); 
      }
      to { 
        opacity: 1; 
        transform: scale(1); 
      }
    }

    /* Mobile Responsive */
    @media (max-width: 480px) {
      .wk-box {
        padding: 24px;
      }
      
      .wk-box h2 {
        font-size: 28px;
      }
      
      .wk-ring-wrap {
        width: 180px;
        height: 180px;
      }
      
      .wk-ring {
        width: 180px;
        height: 180px;
      }
      
      .wk-anim {
        width: 130px;
        height: 130px;
      }
      
      .wk-timer {
        font-size: 38px;
      }
      
      .wk-text {
        font-size: 20px;
      }
    }
  `;

  // Inject styles once
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ==================== SHARED AUDIO CONTEXT ==================== */
  
  /**
   * Shared Web Audio API context for chime sound
   * Reused across all wellness tools to prevent multiple contexts
   */
  const sharedAudioCtx = {
    ctx: null,
    
    /**
     * Get or create audio context
     * @returns {AudioContext} Audio context instance
     */
    getContext() {
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      }
      return this.ctx;
    }
  };

  /**
   * Play completion chime sound
   * Uses Web Audio API to synthesize a pleasant tone
   */
  function playChime() {
    try {
      const ctx = sharedAudioCtx.getContext();
      const now = ctx.currentTime;
      
      // Create oscillator for tone
      const osc = ctx.createOscillator();
      osc.frequency.value = 528; // 528 Hz (C5 note)
      
      // Create gain node for volume control
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
      
      // Connect nodes
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      // Play tone
      osc.start(now);
      osc.stop(now + 0.8);
    } catch (error) {
      console.error('Audio playback failed:', error);
    }
  }

  /* ==================== WELLNESS TOOL CLASS ==================== */
  
  /**
   * Main wellness tool class
   * Handles timer, animations, breathing cycles, zone progressions
   */
  class WellnessTool {
    /**
     * @param {Object} config - Tool configuration from TOOLS object
     */
    constructor(config) {
      this.config = config;
      
      // Initialize state
      this.state = {
        remaining: config.duration,
        mainInterval: null,
        phaseTimeout: null,
        pulseInterval: null,
        countdownInterval: null,
        currentIndex: 0
      };
      
      // Create and cache DOM elements
      this.elements = this.createDom();
      
      // Create pulse pool for performance
      this.pulsePool = this.createPulsePool();
      
      // Setup event listeners
      this.attachEvents();
    }

    /**
     * Create DOM structure for the tool
     * @returns {Object} Object containing element references
     */
    createDom() {
      const overlay = document.createElement('div');
      overlay.className = 'wk-overlay';
      overlay.innerHTML = `
        <div class="wk-box">
          <h2>${this.config.title}</h2>
          
          <div class="wk-ring-wrap">
            <div class="wk-timer">${this.formatTime(this.config.duration)}</div>
            
            <svg class="wk-ring" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(0,0,0,0.1)" stroke-width="8"/>
              <circle class="wk-progress" cx="100" cy="100" r="90" fill="none" 
                      stroke="rgba(102,126,234,0.8)" stroke-width="8" 
                      stroke-linecap="round" 
                      stroke-dasharray="565.48" 
                      stroke-dashoffset="565.48"
                      style="transition: stroke-dashoffset 0.5s linear;"/>
            </svg>
            
            <div class="wk-anim"></div>
            <div class="wk-pulses"></div>
          </div>

          <div class="wk-text"></div>
          <div class="wk-mini-count"></div>
          
          <div class="wk-stats hidden">
            <p>Sessions Completed: <span class="wk-stat-count">0</span></p>
          </div>

          <div class="wk-footer">
            <button class="wk-btn wk-btn-start">Start</button>
            <button class="wk-btn wk-btn-finish hidden">Finish</button>
            <button class="wk-btn wk-btn-close">Close</button>
          </div>
        </div>
      `;

      // Apply gradient background
      const box = overlay.querySelector('.wk-box');
      box.querySelector('.wk-box::before, .wk-box').style.background = this.config.gradient;
      box.style.setProperty('--gradient', this.config.gradient);
      const before = box.querySelector('.wk-box::before') || box;
      if (box.querySelector('::before')) {
        // Can't directly style pseudo-elements, so we set a CSS variable
        box.style.setProperty('background', this.config.gradient);
      }
      box.style.background = this.config.gradient;

      document.body.appendChild(overlay);

      // Cache element references
      return {
        overlay,
        box,
        timer: overlay.querySelector('.wk-timer'),
        progress: overlay.querySelector('.wk-progress'),
        text: overlay.querySelector('.wk-text'),
        count: overlay.querySelector('.wk-mini-count'),
        anim: overlay.querySelector('.wk-anim'),
        pulses: overlay.querySelector('.wk-pulses'),
        btnStart: overlay.querySelector('.wk-btn-start'),
        btnFinish: overlay.querySelector('.wk-btn-finish'),
        btnClose: overlay.querySelector('.wk-btn-close')
      };
    }

    /**
     * Create pool of pulse elements for reuse
     * @returns {Array} Array of pulse DOM elements
     */
    createPulsePool() {
      const pool = [];
      for (let i = 0; i < SHARED_CONFIG.PULSE_POOL_SIZE; i++) {
        const pulse = document.createElement('div');
        pulse.className = 'wk-pulse';
        this.elements.pulses.appendChild(pulse);
        pool.push(pulse);
      }
      return pool;
    }

    /**
     * Format seconds into MM:SS display
     * @param {number} sec - Seconds to format
     * @returns {string} Formatted time string
     */
    formatTime(sec) {
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      return `${m}:${s.toString().padStart(2, '0')}`;
    }

    /**
     * Update progress ring based on remaining time
     */
    updateProgressRing() {
      const fraction = this.state.remaining / this.config.duration;
      const circumference = 565.48;
      const offset = circumference * (1 - fraction);
      this.elements.progress.style.strokeDashoffset = offset;
    }

    /**
     * Spawn a pulse animation from the pool
     */
    spawnPulse() {
      const available = this.pulsePool.find(p => !p.classList.contains('active'));
      if (!available) return;

      available.classList.add('active');
      
      // Remove active class after animation completes
      setTimeout(() => {
        available.classList.remove('active');
      }, 1100);
    }

    /**
     * Reset tool state to initial values
     */
    resetState() {
      this.clearTimers();
      this.state.remaining = this.config.duration;
      this.state.currentIndex = 0;
      this.elements.timer.textContent = this.formatTime(this.config.duration);
      this.elements.text.textContent = '';
      this.elements.count.textContent = '';
      this.elements.btnStart.textContent = 'Start';
      this.elements.btnStart.classList.remove('hidden');
      this.elements.btnFinish.classList.add('hidden');
      this.updateProgressRing();
    }

    /**
     * Clear all active timers and intervals
     */
    clearTimers() {
      if (this.state.mainInterval) {
        clearInterval(this.state.mainInterval);
        this.state.mainInterval = null;
      }
      if (this.state.phaseTimeout) {
        clearTimeout(this.state.phaseTimeout);
        this.state.phaseTimeout = null;
      }
      if (this.state.pulseInterval) {
        clearInterval(this.state.pulseInterval);
        this.state.pulseInterval = null;
      }
      if (this.state.countdownInterval) {
        clearInterval(this.state.countdownInterval);
        this.state.countdownInterval = null;
      }
    }

    /**
     * Start main countdown timer
     */
    startMainTimer() {
      this.elements.btnStart.textContent = 'Pause';
      
      // Start type-specific animation/guidance
      if (this.config.type === 'breathing') {
        this.startBreathingCycle();
      } else {
        this.startPhaseLoop();
      }

      // Main timer countdown
      this.state.mainInterval = setInterval(() => {
        this.state.remaining -= 1;
        this.elements.timer.textContent = this.formatTime(this.state.remaining);
        this.updateProgressRing();

        if (this.state.remaining <= 0) {
          this.stopMainTimer();
          this.finalizeSession();
        }
      }, 1000);
    }

    /**
     * Stop main timer
     */
    stopMainTimer() {
      this.clearTimers();
      this.elements.btnStart.textContent = 'Resume';
    }

    /**
     * Start breathing cycle animation (inhale, hold, exhale, relax)
     */
    startBreathingCycle() {
      const runInhale = () => {
        if (this.state.remaining <= 0) return;
        
        this.setBreathPhase('inhale', this.config.breathIn);
        this.elements.anim.style.transition = `transform ${this.config.breathIn}s ease-in-out`;
        this.elements.anim.style.transform = 'scale(1.12)';
        this.spawnPulse();
        this.state.pulseInterval = setInterval(() => this.spawnPulse(), 700);
        
        this.state.phaseTimeout = setTimeout(() => {
          this.elements.anim.style.transition = '';
          runHold();
        }, this.config.breathIn * 1000);
      };

      const runHold = () => {
        if (this.state.remaining <= 0) return;
        
        this.setBreathPhase('hold', this.config.breathHold);
        
        if (this.state.pulseInterval) {
          clearInterval(this.state.pulseInterval);
          this.state.pulseInterval = null;
        }
        
        this.state.phaseTimeout = setTimeout(() => {
          runExhale();
        }, this.config.breathHold * 1000);
      };

      const runExhale = () => {
        if (this.state.remaining <= 0) return;
        
        this.setBreathPhase('exhale', this.config.breathOut);
        this.elements.anim.style.transition = `transform ${this.config.breathOut}s ease-in-out`;
        this.elements.anim.style.transform = 'scale(0.94)';
        this.spawnPulse();
        this.state.pulseInterval = setInterval(() => this.spawnPulse(), 900);
        
        this.state.phaseTimeout = setTimeout(() => {
          this.elements.anim.style.transition = '';
          afterCycle();
        }, this.config.breathOut * 1000);
      };

      const afterCycle = () => {
        if (this.state.remaining <= 0) return;
        
        if (this.state.pulseInterval) {
          clearInterval(this.state.pulseInterval);
          this.state.pulseInterval = null;
        }
        
        // Check if we've completed required rounds
        const elapsed = this.config.duration - this.state.remaining;
        const cycleSeconds = this.config.breathIn + this.config.breathHold + this.config.breathOut;
        const completedCycles = Math.floor(elapsed / cycleSeconds);
        
        if (completedCycles >= this.config.completeRounds) {
          runRelax();
        } else {
          runInhale();
        }
      };

      const runRelax = () => {
        this.setBreathPhase('relax', null);
        
        if (this.state.pulseInterval) {
          clearInterval(this.state.pulseInterval);
          this.state.pulseInterval = null;
        }
        
        this.elements.anim.style.transition = 'transform 2.6s ease-in-out';
        this.elements.anim.style.transform = 'scale(1.0)';
        this.spawnPulse();
        this.state.pulseInterval = setInterval(() => this.spawnPulse(), 1800);
      };

      // Start with inhale
      runInhale();
    }

    /**
     * Set breathing phase text and countdown
     * @param {string} phase - Phase name (inhale, hold, exhale, relax)
     * @param {number|null} seconds - Duration in seconds (null for no countdown)
     */
    setBreathPhase(phase, seconds) {
      const phaseText = {
        inhale: 'Inhale deeply',
        hold: 'HOLD',
        exhale: 'Exhale slowly',
        relax: 'Now Relax'
      };

      this.elements.text.textContent = phaseText[phase] || '';

      // Clear countdown for relax phase
      if (phase === 'relax') {
        if (this.elements.count) {
          this.elements.count.textContent = '';
        }
        return;
      }

      // Start countdown if seconds provided
      if (this.elements.count && seconds) {
        if (this.state.countdownInterval) {
          clearInterval(this.state.countdownInterval);
        }
        
        let remaining = seconds;
        this.elements.count.textContent = String(remaining);
        
        this.state.countdownInterval = setInterval(() => {
          remaining -= 1;
          if (remaining <= 0) {
            this.elements.count.textContent = '0';
            clearInterval(this.state.countdownInterval);
            this.state.countdownInterval = null;
          } else {
            this.elements.count.textContent = String(remaining);
          }
        }, 1000);
      }
    }

    /**
     * Start zone/step progression loop
     * Used for body scans, nervous system reset, tension sweep
     */
    startPhaseLoop() {
      const items = this.config.zones || this.config.steps;
      
      /**
       * Advance to next item with animation
       */
      const advance = () => {
        if (this.state.remaining <= 0) return;

        // Fade transition
        this.elements.text.classList.add('changing');
        
        setTimeout(() => {
          this.elements.text.textContent = items[this.state.currentIndex];
          this.elements.text.classList.remove('changing');
          
          // Pulse animation
          this.spawnPulse();
          this.elements.anim.style.transition = 'transform 0.24s ease-out';
          this.elements.anim.style.transform = 'scale(1.08)';
          
          setTimeout(() => {
            this.elements.anim.style.transform = 'scale(1.0)';
            setTimeout(() => {
              this.elements.anim.style.transition = '';
            }, 240);
          }, 240);
        }, 100);

        // Schedule next item if not at end
        if (this.state.currentIndex < items.length - 1) {
          const duration = this.config.stepDurations
            ? this.config.stepDurations[this.state.currentIndex] * 1000
            : (this.config.duration / items.length) * 1000;

          this.state.phaseTimeout = setTimeout(() => {
            this.state.currentIndex++;
            advance();
          }, duration);
        }
      };

      // Start with first item
      this.elements.text.textContent = items[0];
      this.spawnPulse();

      const duration = this.config.stepDurations
        ? this.config.stepDurations[0] * 1000
        : (this.config.duration / items.length) * 1000;

      this.state.phaseTimeout = setTimeout(() => {
        this.state.currentIndex++;
        advance();
      }, duration);
    }

    /**
     * Mark session as complete and award rewards
     */
    completeSession() {
      playChime();
      
      // Integrate with gamification system if available
      if (window.app?.gamification) {
        window.app.gamification.incrementWellnessRuns();
        window.app.gamification.addBoth(10, 1, 'Wellness Practice');
      }
    }

    /**
     * Finalize session and auto-close
     */
    finalizeSession() {
      this.completeSession();
      this.elements.btnStart.classList.add('hidden');
      this.elements.btnFinish.classList.remove('hidden');
      setTimeout(() => this.close(), 1200);
    }

    /**
     * Open the tool overlay
     */
    open() {
      this.resetState();
      this.elements.overlay.style.display = 'flex';
      setTimeout(() => this.elements.btnStart.focus(), 100);
    }

    /**
     * Close the tool overlay
     */
    close() {
      this.stopMainTimer();
      this.elements.overlay.style.display = 'none';
      this.resetState();
    }

    /**
     * Attach event listeners to buttons
     */
    attachEvents() {
      // Start/Pause button
      this.elements.btnStart.addEventListener('click', () => {
        if (this.state.mainInterval) {
          this.stopMainTimer();
        } else {
          if (this.state.remaining <= 0) {
            this.resetState();
          }
          this.startMainTimer();
        }
      });

      // Finish button
      this.elements.btnFinish.addEventListener('click', () => {
        this.completeSession();
        this.close();
      });

      // Close button
      this.elements.btnClose.addEventListener('click', () => this.close());

      // Click outside to close
      this.elements.overlay.addEventListener('click', (e) => {
        if (e.target === this.elements.overlay) {
          this.close();
        }
      });
    }

    /**
     * Get tool statistics
     * @returns {Object} Statistics object
     */
    getStats() {
      return {
        autoTriggerEnabled: SHARED_CONFIG.AUTO_TRIGGER
      };
    }

    /**
     * Destroy tool and cleanup
     */
    destroy() {
      this.clearTimers();
      if (this.elements.overlay && this.elements.overlay.parentNode) {
        this.elements.overlay.parentNode.removeChild(this.elements.overlay);
      }
    }
  }

  /* ==================== GLOBAL ESCAPE KEY HANDLER ==================== */
  
  const activeTools = new Set();
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      activeTools.forEach(tool => {
        if (tool.elements.overlay.style.display === 'flex') {
          tool.close();
        }
      });
    }
  });

  /* ==================== INITIALIZE ALL TOOLS ==================== */
  
  const tools = {
    selfReset: new WellnessTool(TOOLS.selfReset),
    fullBodyScan: new WellnessTool(TOOLS.fullBodyScan),
    nervousSystem: new WellnessTool(TOOLS.nervousSystem),
    tensionSweep: new WellnessTool(TOOLS.tensionSweep)
  };

  // Track all tools for escape key handler
  Object.values(tools).forEach(tool => activeTools.add(tool));

  /* ==================== CLEANUP ON PAGE UNLOAD ==================== */
  
  window.addEventListener('beforeunload', () => {
    Object.values(tools).forEach(tool => {
      tool.clearTimers();
      tool.destroy();
    });
    
    // Close audio context
    if (sharedAudioCtx.ctx) {
      sharedAudioCtx.ctx.close();
      sharedAudioCtx.ctx = null;
    }
  });

  /* ==================== PUBLIC API ==================== */
  
  /**
   * Public API for accessing wellness tools
   * Provides open, close, and stats methods for each tool
   */
  window.WellnessKit = {
    // Open methods
    openSelfReset: () => tools.selfReset.open(),
    openFullBodyScan: () => tools.fullBodyScan.open(),
    openNervousReset: () => tools.nervousSystem.open(),
    openTensionSweep: () => tools.tensionSweep.open(),

    // Close methods
    closeSelfReset: () => tools.selfReset.close(),
    closeFullBodyScan: () => tools.fullBodyScan.close(),
    closeNervousReset: () => tools.nervousSystem.close(),
    closeTensionSweep: () => tools.tensionSweep.close(),

    // Stats methods
    getSelfResetStats: () => tools.selfReset.getStats(),
    getFullBodyScanStats: () => tools.fullBodyScan.getStats(),
    getNervousResetStats: () => tools.nervousSystem.getStats(),
    getTensionSweepStats: () => tools.tensionSweep.getStats(),

    // Get all stats at once
    getAllStats: () => ({
      selfReset: tools.selfReset.getStats(),
      fullBodyScan: tools.fullBodyScan.getStats(),
      nervousSystem: tools.nervousSystem.getStats(),
      tensionSweep: tools.tensionSweep.getStats()
    }),

    // Utility methods
    playChime
  };

  /* ==================== BACKWARD COMPATIBILITY ==================== */
  
  // Expose individual functions for legacy code
  window.openSelfReset = window.WellnessKit.openSelfReset;
  window.closeSelfReset = window.WellnessKit.closeSelfReset;
  window.getSelfResetStats = window.WellnessKit.getSelfResetStats;

  window.openFullBodyScan = window.WellnessKit.openFullBodyScan;
  window.closeFullBodyScan = window.WellnessKit.closeFullBodyScan;
  window.getFullBodyScanStats = window.WellnessKit.getFullBodyScanStats;

  window.openNervousReset = window.WellnessKit.openNervousReset;
  window.closeNervousReset = window.WellnessKit.closeNervousReset;
  window.getNervousResetStats = window.WellnessKit.getNervousResetStats;

  window.openTensionSweep = window.WellnessKit.openTensionSweep;
  window.closeTensionSweep = window.WellnessKit.closeTensionSweep;
  window.getTensionSweepStats = window.WellnessKit.getTensionSweepStats;

})();