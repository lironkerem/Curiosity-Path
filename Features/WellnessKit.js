/**
 * =========================================================
 * WELLNESS KIT - UNIFIED 4-IN-1 SYSTEM
 * Production-Grade v2.1 (Optimized)
 * =========================================================
 * @module WellnessKit
 * @version 2.1
 * @description Integrated meditation and body awareness tool system
 *              providing breathing exercises, body scans, nervous system
 *              resets, and tension releases with gamification support
 */
(function () {
  'use strict';

  /* ==================== CONFIGURATION CONSTANTS ==================== */

  const SHARED_CONFIG = Object.freeze({
    PULSE_POOL_SIZE:    10,
    AUTO_TRIGGER:       false,
    AUTO_TRIGGER_ALIGN: true
  });

  const ANIMATION_TIMING = Object.freeze({
    BREATH_PULSE_INTERVAL: 1000,
    EXHALE_PULSE_INTERVAL:  900,
    RELAX_PULSE_INTERVAL:  1800,
    RELAX_TRANSITION:      2600,
    TEXT_FADE:              100,
    SCALE_BOUNCE:           240,
    ESCAPE_DEBOUNCE:        300
  });

  const BREATH_PHASE_TEXT = Object.freeze({
    inhale: 'Inhale deeply',
    hold:   'HOLD',
    exhale: 'Exhale slowly',
    relax:  'Now Relax'
  });

  /* ==================== TOOL CONFIGURATIONS ==================== */

  const TOOLS = Object.freeze({
    selfReset: Object.freeze({
      id:              'selfreset',
      title:           'Self Reset',
      duration:        60,
      type:            'breathing',
      breathIn:        7,
      breathHold:      3,
      breathOut:       7,
      completeRounds:  3,
      storagePrefix:   'pc_wellness_selfreset',
      gradient:        'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
    }),
    fullBodyScan: Object.freeze({
      id:            'fullbodyscan',
      title:         'Full Body Scan',
      duration:      120,
      type:          'zones',
      zones: Object.freeze([
        'Top of head', 'Back of head', 'Face', 'Throat and neck',
        'Shoulders', 'Arms and hands', 'Chest', 'Stomach',
        'Back (upper and lower)', 'Pelvic area', 'Legs', 'Feet'
      ]),
      storagePrefix: 'pc_wellness_fullbodyscan',
      gradient:      'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)'
    }),
    nervousSystem: Object.freeze({
      id:       'nervoussystem',
      title:    'Nervous System Reset',
      duration: 60,
      type:     'steps',
      steps: Object.freeze([
        'Shake your hands',
        'Roll your shoulders',
        'Stick out your tongue to relax the jaw',
        'Relax your face, especially around the eyes',
        'Take one long sigh',
        'Feel your feet on the ground',
        'Settle your breath naturally'
      ]),
      stepDurations: Object.freeze([9, 9, 9, 9, 8, 8, 8]),
      storagePrefix: 'pc_wellness_nervoussystem',
      gradient:      'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)'
    }),
    tensionSweep: Object.freeze({
      id:       'tensionsweep',
      title:    'Tension Sweep',
      duration: 120,
      type:     'zones',
      zones: Object.freeze([
        'Lift shoulders to your ears then drop',
        'Shake your arms loosely',
        'Shake your legs',
        'Twist your spine gently left and right',
        'Circle your hips slowly',
        'Open your chest, expand your ribcage',
        'Drop your head forward and roll gently',
        'Shake your whole body lightly'
      ]),
      storagePrefix: 'pc_wellness_tensionsweep',
      gradient:      'linear-gradient(135deg, #fff1eb 0%, #ace0f9 100%)'
    })
  });

  /* ==================== SHARED STYLES ==================== */

  if (!document.getElementById('wk-styles')) {
    const css = `
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

    .wk-box {
      width: 460px;
      max-width: calc(100% - 32px);
      border-radius: var(--radius-xl);
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

    .wk-box h2 {
      margin: 0 0 20px 0;
      font-size: 32px;
      font-weight: 800;
      color: #1a202c;
      letter-spacing: -0.5px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .wk-ring-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      width: 200px;
      height: 200px;
      margin: 12px auto 20px;
    }

    .wk-timer {
      position: absolute;
      z-index: 4;
      font-size: 44px;
      font-weight: 700;
      color: var(--neuro-text);
      user-select: none;
    }

    .wk-ring {
      width: 200px;
      height: 200px;
      transform: rotate(-90deg);
      z-index: 2;
    }

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
      background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(255, 215, 0, 0.3) 50%, transparent 70%);
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

    .wk-pulses {
      position: absolute;
      inset: 0;
      z-index: 0;
      pointer-events: none;
    }

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
      to { transform: translate(-50%, -50%) scale(3.2); opacity: 0; }
    }

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

    .wk-text.changing { opacity: 0.5; }

    .wk-mini-count {
      font-weight: 700;
      font-size: 18px;
      color: #2d3748;
      opacity: 0.9;
      margin-top: 8px;
      min-height: 24px;
    }

    .wk-stats { display: none; }

    .wk-footer {
      display: flex;
      gap: 10px;
      justify-content: center;
      margin-top: 20px;
    }

    .wk-btn {
      padding: 12px 24px;
      border-radius: 14px;
      border: none;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      color: var(--neuro-text);
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

    .wk-toast {
      position: fixed;
      right: 18px;
      bottom: 18px;
      background: var(--neuro-bg);
      box-shadow: var(--shadow-raised);
      padding: 10px 14px;
      border-radius: 12px;
      color: var(--neuro-text);
      font-weight: 700;
      z-index: 1000001;
      opacity: 0;
      transform: translateY(8px);
      transition: all 260ms ease;
    }

    .wk-toast.show { opacity: 1; transform: translateY(0); }

    .hidden { display: none !important; }

    @keyframes wk-fadeIn {
      from { opacity: 0; transform: translateY(12px) scale(0.95); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }

    :focus-visible {
      outline: 3px solid rgba(102, 126, 234, 0.3);
      outline-offset: 3px;
    }
    `;

    const styleEl = document.createElement('style');
    styleEl.id = 'wk-styles';
    styleEl.textContent = css;
    document.head.appendChild(styleEl);
  }

  /* ==================== SHARED UTILITIES ==================== */

  const sharedAudioCtx = { ctx: null };

  function playChime() {
    try {
      if (!sharedAudioCtx.ctx) {
        sharedAudioCtx.ctx = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx  = sharedAudioCtx.ctx;
      const now  = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.value = 660;
      osc2.frequency.value = 990;
      osc2.detune.value    = 6;

      filter.type           = 'lowpass';
      filter.frequency.value = 2600;

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.28,  now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

      osc1.connect(filter); osc2.connect(filter);
      filter.connect(gain); gain.connect(ctx.destination);
      osc1.start(now); osc2.start(now);
      osc1.stop(now + 1.5); osc2.stop(now + 1.5);
    } catch (e) {
      console.warn('WellnessKit: Audio playback failed', e);
    }
  }

  /* ==================== WELLNESS TOOL CLASS ==================== */

  class WellnessTool {
    constructor(config) {
      if (!config || !config.id || !config.duration || !config.type) {
        throw new Error('WellnessKit: Invalid tool configuration');
      }

      this.config = config;
      this.state  = {
        remaining:         config.duration,
        mainInterval:      null,
        phaseTimeout:      null,
        pulseInterval:     null,
        currentIndex:      0,
        isRunning:         false,
        countdownInterval: null
      };

      this.createUI();
      this.initPulsePool();
      this.attachEvents();
      this.resetState();
    }

    createUI() {
      const wrapper = document.createElement('div');
      // All user-visible text set via textContent in resetState(); title is static config.
      // SVG ring is decorative — aria-hidden="true".
      wrapper.innerHTML = `
        <div class="wk-overlay" id="wk-${this.config.id}-overlay"
             role="dialog"
             aria-labelledby="wk-${this.config.id}-title"
             aria-modal="true">
          <div class="wk-box" id="wk-${this.config.id}-box">
            <h2 id="wk-${this.config.id}-title"></h2>
            <div class="wk-ring-wrap">
              <div class="wk-anim" id="wk-${this.config.id}-anim" aria-hidden="true"></div>
              <svg class="wk-ring" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
                <defs>
                  <linearGradient id="wk-${this.config.id}-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%"   stop-color="#667eea"/>
                    <stop offset="100%" stop-color="#764ba2"/>
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="40" stroke="rgba(0,0,0,0.06)" stroke-width="8" fill="none"/>
                <circle id="wk-${this.config.id}-progress"
                        cx="50" cy="50" r="40"
                        stroke="url(#wk-${this.config.id}-grad)"
                        stroke-width="8" stroke-linecap="round"
                        fill="none"
                        stroke-dasharray="251.2" stroke-dashoffset="0"/>
              </svg>
              <div class="wk-pulses" id="wk-${this.config.id}-pulses" aria-hidden="true"></div>
              <div class="wk-timer" id="wk-${this.config.id}-timer" aria-live="polite" aria-atomic="true"></div>
            </div>
            <div class="wk-text" id="wk-${this.config.id}-text" aria-live="polite"></div>
            ${this.config.type === 'breathing'
              ? `<div class="wk-mini-count" id="wk-${this.config.id}-count" aria-live="polite" aria-atomic="true"></div>`
              : ''}
            <div class="wk-footer">
              <button type="button" class="wk-btn" id="wk-${this.config.id}-start" aria-label="Start session">Start</button>
              <button type="button" class="wk-btn hidden" id="wk-${this.config.id}-finish" aria-label="Mark as finished">Finished</button>
              <button type="button" class="wk-btn" id="wk-${this.config.id}-close" aria-label="Close session">Close</button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(wrapper);

      this.elements = {
        overlay:  document.getElementById(`wk-${this.config.id}-overlay`),
        box:      document.getElementById(`wk-${this.config.id}-box`),
        timer:    document.getElementById(`wk-${this.config.id}-timer`),
        progress: document.getElementById(`wk-${this.config.id}-progress`),
        pulses:   document.getElementById(`wk-${this.config.id}-pulses`),
        anim:     document.getElementById(`wk-${this.config.id}-anim`),
        text:     document.getElementById(`wk-${this.config.id}-text`),
        count:    document.getElementById(`wk-${this.config.id}-count`),
        btnStart: document.getElementById(`wk-${this.config.id}-start`),
        btnFinish:document.getElementById(`wk-${this.config.id}-finish`),
        btnClose: document.getElementById(`wk-${this.config.id}-close`)
      };

      // Set title via textContent — safe; config.title is a static string
      const titleEl = document.getElementById(`wk-${this.config.id}-title`);
      if (titleEl) titleEl.textContent = this.config.title;

      this.elements.box.style.background = this.config.gradient;
      this.R    = 40;
      this.CIRC = 2 * Math.PI * this.R;
      this.elements.progress.style.strokeDasharray = this.CIRC;
    }

    initPulsePool() {
      this.pulsePool  = [];
      this.pulseIndex = 0;
      for (let i = 0; i < SHARED_CONFIG.PULSE_POOL_SIZE; i++) {
        const pulse = document.createElement('div');
        pulse.className = 'wk-pulse';
        this.elements.pulses.appendChild(pulse);
        this.pulsePool.push(pulse);
      }
    }

    spawnPulse() {
      const pulse = this.pulsePool[this.pulseIndex];
      this.pulseIndex = (this.pulseIndex + 1) % SHARED_CONFIG.PULSE_POOL_SIZE;
      pulse.classList.remove('active');
      void pulse.offsetWidth; // force reflow to restart CSS animation
      pulse.classList.add('active');
    }

    spawnPulseWithInterval(intervalMs) {
      this.spawnPulse();
      if (this.state.pulseInterval) clearInterval(this.state.pulseInterval);
      this.state.pulseInterval = setInterval(() => this.spawnPulse(), intervalMs);
    }

    setProgress(rem, total) {
      const pct    = Math.max(0, Math.min(1, rem / total));
      const offset = this.CIRC * (1 - pct);
      this.elements.progress.style.strokeDashoffset = offset;
    }

    clearTimers() {
      [
        this.state.mainInterval,
        this.state.phaseTimeout,
        this.state.pulseInterval,
        this.state.countdownInterval
      ].forEach(t => { if (t) { clearInterval(t); clearTimeout(t); } });

      this.state.mainInterval      = null;
      this.state.phaseTimeout      = null;
      this.state.pulseInterval     = null;
      this.state.countdownInterval = null;
    }

    resetAnimationTransition() {
      this.elements.anim.style.transition = '';
    }

    resetState() {
      this.clearTimers();
      this.state.remaining     = this.config.duration;
      this.state.currentIndex  = 0;
      this.state.isRunning     = false;

      this.elements.timer.textContent = String(this.config.duration);
      this.setProgress(this.config.duration, this.config.duration);
      this.elements.btnFinish.classList.add('hidden');
      this.elements.btnStart.classList.remove('hidden');
      this.elements.btnStart.textContent = 'Start';
      this.elements.anim.style.transform = 'scale(1.0)';
      this.elements.anim.style.opacity   = '0.9';
      this.resetAnimationTransition();

      // All phase text is static config — safe to set via textContent
      if (this.config.type === 'breathing') {
        this.elements.text.textContent = BREATH_PHASE_TEXT.inhale;
        if (this.elements.count) this.elements.count.textContent = String(this.config.breathIn);
      } else if (this.config.type === 'zones') {
        this.elements.text.textContent = this.config.zones[0];
      } else if (this.config.type === 'steps') {
        this.elements.text.textContent = this.config.steps[0];
      }
    }

    startMainTimer() {
      if (this.state.mainInterval) return;
      this.state.isRunning = true;
      this.elements.btnStart.textContent = 'Stop';

      if (this.config.type === 'breathing') this.startBreathingCycle();
      else                                   this.startPhaseLoop();

      this.state.mainInterval = setInterval(() => {
        this.state.remaining -= 1;
        if (this.state.remaining < 0) this.state.remaining = 0;

        this.elements.timer.textContent = String(this.state.remaining);
        this.setProgress(this.state.remaining, this.config.duration);

        if (this.state.remaining <= 0) {
          this.clearTimers();
          this.finalizeSession();
        }
      }, 1000);
    }

    stopMainTimer() {
      this.clearTimers();
      this.state.isRunning = false;
      this.elements.btnStart.textContent = 'Start';
      this.resetAnimationTransition();
    }

    getCompletedCycles() {
      const elapsed      = this.config.duration - this.state.remaining;
      const cycleSeconds = this.config.breathIn + this.config.breathHold + this.config.breathOut;
      return Math.floor(elapsed / cycleSeconds);
    }

    startBreathingCycle() {
      const runInhale = () => {
        playChime();
        this.setBreathPhase('inhale', this.config.breathIn);
        this.elements.anim.style.transition = `transform ${this.config.breathIn}s linear`;
        this.elements.anim.style.transform  = 'scale(1.14)';
        this.spawnPulseWithInterval(ANIMATION_TIMING.BREATH_PULSE_INTERVAL);
        this.state.phaseTimeout = setTimeout(() => {
          this.resetAnimationTransition();
          runHold();
        }, this.config.breathIn * 1000);
      };

      const runHold = () => {
        if (this.state.remaining <= 0) return;
        this.setBreathPhase('hold', this.config.breathHold);
        if (this.state.pulseInterval) { clearInterval(this.state.pulseInterval); this.state.pulseInterval = null; }
        this.elements.anim.style.transition = `transform ${this.config.breathHold}s linear`;
        this.elements.anim.style.transform  = 'scale(1.18)';
        this.state.phaseTimeout = setTimeout(() => {
          this.resetAnimationTransition();
          runExhale();
        }, this.config.breathHold * 1000);
      };

      const runExhale = () => {
        if (this.state.remaining <= 0) return;
        this.setBreathPhase('exhale', this.config.breathOut);
        this.elements.anim.style.transition = `transform ${this.config.breathOut}s linear`;
        this.elements.anim.style.transform  = 'scale(0.94)';
        this.spawnPulseWithInterval(ANIMATION_TIMING.EXHALE_PULSE_INTERVAL);
        this.state.phaseTimeout = setTimeout(() => {
          this.resetAnimationTransition();
          afterCycle();
        }, this.config.breathOut * 1000);
      };

      const afterCycle = () => {
        if (this.state.remaining <= 0) return;
        if (this.state.pulseInterval) { clearInterval(this.state.pulseInterval); this.state.pulseInterval = null; }
        if (this.getCompletedCycles() >= this.config.completeRounds) runRelax();
        else runInhale();
      };

      const runRelax = () => {
        this.setBreathPhase('relax', null);
        if (this.state.pulseInterval) { clearInterval(this.state.pulseInterval); this.state.pulseInterval = null; }
        this.elements.anim.style.transition = `transform ${ANIMATION_TIMING.RELAX_TRANSITION}ms ease-in-out`;
        this.elements.anim.style.transform  = 'scale(1.0)';
        this.spawnPulseWithInterval(ANIMATION_TIMING.RELAX_PULSE_INTERVAL);
      };

      runInhale();
    }

    setBreathPhase(phase, seconds) {
      this.elements.text.textContent = BREATH_PHASE_TEXT[phase] || '';

      if (phase === 'relax') {
        if (this.elements.count) this.elements.count.textContent = '';
        return;
      }

      if (this.elements.count && seconds) {
        if (this.state.countdownInterval) clearInterval(this.state.countdownInterval);
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

    startPhaseLoop() {
      const items = this.config.zones || this.config.steps;

      const advance = () => {
        if (this.state.remaining <= 0) return;
        this.elements.text.classList.add('changing');
        setTimeout(() => {
          // Static config strings — textContent safe
          this.elements.text.textContent = items[this.state.currentIndex];
          this.elements.text.classList.remove('changing');
          this.spawnPulse();

          this.elements.anim.style.transition = 'transform 0.24s ease-out';
          this.elements.anim.style.transform  = 'scale(1.08)';
          setTimeout(() => {
            this.elements.anim.style.transform = 'scale(1.0)';
            setTimeout(() => this.resetAnimationTransition(), ANIMATION_TIMING.SCALE_BOUNCE);
          }, ANIMATION_TIMING.SCALE_BOUNCE);
        }, ANIMATION_TIMING.TEXT_FADE);

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

    completeSession() {
      playChime();
      try {
        if (window.app?.gamification) {
          window.app.gamification.incrementWellnessRuns();
          window.app.gamification.addBoth(10, 1, 'Wellness Practice');
        }
      } catch (error) {
        console.warn('WellnessKit: Gamification integration failed', error);
      }
    }

    finalizeSession() {
      this.completeSession();
      this.elements.btnStart.classList.add('hidden');
      this.elements.btnFinish.classList.remove('hidden');
      setTimeout(() => this.close(), 1200);
    }

    open() {
      this.resetState();
      this.elements.overlay.style.display = 'flex';
      setTimeout(() => this.elements.btnStart.focus(), 100);
    }

    close() {
      this.stopMainTimer();
      this.elements.overlay.style.display = 'none';
      this.resetState();
    }

    attachEvents() {
      this.elements.btnStart.addEventListener('click', () => {
        if (this.state.mainInterval) this.stopMainTimer();
        else {
          if (this.state.remaining <= 0) this.resetState();
          this.startMainTimer();
        }
      });

      this.elements.btnFinish.addEventListener('click', () => {
        this.completeSession();
        this.close();
      });

      this.elements.btnClose.addEventListener('click', () => this.close());

      this.elements.overlay.addEventListener('click', e => {
        if (e.target === this.elements.overlay) this.close();
      });
    }

    getStats() {
      return { autoTriggerEnabled: SHARED_CONFIG.AUTO_TRIGGER };
    }

    destroy() {
      this.clearTimers();
      if (this.elements.overlay?.parentNode) {
        this.elements.overlay.parentNode.removeChild(this.elements.overlay);
      }
    }
  }

  /* ==================== GLOBAL ESCAPE KEY HANDLER ==================== */

  const activeTools    = new Set();
  let escapeDebounce   = null;

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (escapeDebounce)   return;
    escapeDebounce = setTimeout(() => { escapeDebounce = null; }, ANIMATION_TIMING.ESCAPE_DEBOUNCE);
    activeTools.forEach(tool => {
      if (tool.elements.overlay.style.display === 'flex') tool.close();
    });
  });

  /* ==================== INITIALIZE ALL TOOLS ==================== */

  const tools = {
    selfReset:    new WellnessTool(TOOLS.selfReset),
    fullBodyScan: new WellnessTool(TOOLS.fullBodyScan),
    nervousSystem:new WellnessTool(TOOLS.nervousSystem),
    tensionSweep: new WellnessTool(TOOLS.tensionSweep)
  };

  Object.values(tools).forEach(tool => activeTools.add(tool));

  /* ==================== CLEANUP ON PAGE UNLOAD ==================== */

  // Use pagehide (bfcache-compatible) in addition to beforeunload.
  // beforeunload is kept for environments that still need it, but pagehide
  // fires reliably for both navigation-away and BFCache restore/discard.
  function _cleanup() {
    Object.values(tools).forEach(tool => { tool.clearTimers(); tool.destroy(); });
    if (sharedAudioCtx.ctx) {
      try { sharedAudioCtx.ctx.close(); sharedAudioCtx.ctx = null; }
      catch (e) { console.warn('WellnessKit: Audio context cleanup failed', e); }
    }
  }

  window.addEventListener('pagehide',     _cleanup);
  window.addEventListener('beforeunload', _cleanup);

  /* ==================== PUBLIC API ==================== */

  window.WellnessKit = Object.freeze({
    openSelfReset:    () => tools.selfReset.open(),
    openFullBodyScan: () => tools.fullBodyScan.open(),
    openNervousReset: () => tools.nervousSystem.open(),
    openTensionSweep: () => tools.tensionSweep.open(),

    closeSelfReset:    () => tools.selfReset.close(),
    closeFullBodyScan: () => tools.fullBodyScan.close(),
    closeNervousReset: () => tools.nervousSystem.close(),
    closeTensionSweep: () => tools.tensionSweep.close(),

    getSelfResetStats:    () => tools.selfReset.getStats(),
    getFullBodyScanStats: () => tools.fullBodyScan.getStats(),
    getNervousResetStats: () => tools.nervousSystem.getStats(),
    getTensionSweepStats: () => tools.tensionSweep.getStats(),

    getAllStats: () => ({
      selfReset:     tools.selfReset.getStats(),
      fullBodyScan:  tools.fullBodyScan.getStats(),
      nervousSystem: tools.nervousSystem.getStats(),
      tensionSweep:  tools.tensionSweep.getStats()
    }),

    playChime
  });

  /* ==================== BACKWARD COMPATIBILITY ==================== */

  ['SelfReset', 'FullBodyScan', 'NervousReset', 'TensionSweep'].forEach(name => {
    window[`open${name}`]     = window.WellnessKit[`open${name}`];
    window[`close${name}`]    = window.WellnessKit[`close${name}`];
    window[`get${name}Stats`] = window.WellnessKit[`get${name}Stats`];
  });

})();
