// Mini-Apps/SelfAnalysisPro/js/stepindicator.js
// FIXED: Connector draws after current step is completed

export class StepIndicator {
  constructor() {
    this.stepIndicator = document.getElementById('step-indicator');
    if (!this.stepIndicator) {
      console.warn('Step indicator not found');
      return;
    }

    this.completedSteps  = new Set();
    this.currentStep     = 0;
    this.step4Triggered  = false;

    this.init();
  }

  init() {
    this.setupStep1Watchers();
    this.setupStep2Watchers();
    this.setupStep3Watchers();
    this.setupStep4Watchers();
    this.setupClickNavigation();
    this.setupClearButton();
    this.updateStepIndicator();
  }

  updateStepIndicator() {
    const stepItems = this.stepIndicator.querySelectorAll('.step-item');

    stepItems.forEach((item, index) => {
      const stepNum   = index + 1;
      const connector = item.querySelector('.step-connector');

      item.classList.remove('active', 'completed');

      if (this.completedSteps.has(stepNum))    item.classList.add('completed');
      if (stepNum === this.currentStep)         item.classList.add('active');

      if (connector) {
        // Draw line only when the NEXT step is completed
        connector.style.background = this.completedSteps.has(stepNum + 1)
          ? 'var(--primary-color)'
          : '#ddd';
      }
    });
  }

  setupStep1Watchers() {
    const checkStep1 = () => {
      const firstName  = document.getElementById('first-name')?.value?.trim();
      const lastName   = document.getElementById('last-name')?.value?.trim();
      const dateOfBirth = document.getElementById('date-of-birth')?.value?.trim();

      if (firstName && lastName && dateOfBirth) {
        if (!this.completedSteps.has(1)) {
          this.completedSteps.add(1);
          this.currentStep = 1;
          this.updateStepIndicator();
        }
      } else {
        if (this.completedSteps.has(1)) {
          this.completedSteps.delete(1);
          this.currentStep = 0;
          this.updateStepIndicator();
        }
      }
    };

    ['first-name', 'last-name', 'date-of-birth'].forEach(id => {
      const field = document.getElementById(id);
      if (field) {
        field.addEventListener('input',  checkStep1);
        field.addEventListener('change', checkStep1);
      }
    });
  }

  setupStep2Watchers() {
    const analyzeBtn = document.getElementById('btn-analyze');
    if (analyzeBtn) {
      analyzeBtn.addEventListener('click', () => {
        if (this.completedSteps.has(1)) {
          this.completedSteps.add(2);
          this.currentStep = 2;
          this.updateStepIndicator();
        }
      });
    }
  }

  setupStep3Watchers() {
    document.addEventListener('click', e => {
      const card = e.target.closest('.expandable-card');
      if (!card) return;
      const isMainCard = card.dataset.section === 'numerology' ||
                         card.dataset.section === 'astrology'  ||
                         card.dataset.section === 'tree-of-life';
      if (isMainCard) {
        setTimeout(() => {
          if (card.classList.contains('expanded') && !this.completedSteps.has(3)) {
            this.completedSteps.add(3);
            this.currentStep = 3;
            this.updateStepIndicator();
          }
        }, 150);
      }
    });
  }

  setupStep4Watchers() {
    const step4Section = document.getElementById('step-4-section');
    if (step4Section) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            this.triggerStep4Animation();
          }
        });
      }, { threshold: 0.5 });
      observer.observe(step4Section);
    }

    document.addEventListener('click', e => {
      if (e.target.closest('.cta-welcome-link')) {
        this.triggerStep4Animation();
      }
    });
  }

  triggerStep4Animation() {
    if (this.step4Triggered)            return;
    if (!this.completedSteps.has(3))    return;

    this.step4Triggered = true;
    this.completedSteps.add(4);
    this.currentStep = 4;
    this.updateStepIndicator();

    const step4Item = this.stepIndicator.querySelector('[data-step="4"]');
    if (!step4Item) return;

    // Confetti container
    const container = document.createElement('div');
    container.setAttribute('aria-hidden', 'true');
    container.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:10000;overflow:hidden;';
    document.body.appendChild(container);

    const COLORS = Object.freeze(['#FF6B6B','#4ECDC4','#45B7D1','#FFA07A','#98D8C8','#F7DC6F','#BB8FCE','#85C1E2']);

    for (let i = 0; i < 80; i++) {
      const confetti  = document.createElement('div');
      const size      = Math.random() * 10 + 5;
      const startX    = Math.random() * 100;
      const duration  = Math.random() * 2 + 2;
      const delay     = Math.random() * 0.5;
      confetti.setAttribute('aria-hidden', 'true');
      confetti.style.cssText = [
        `position:absolute`,
        `width:${size}px`,
        `height:${size}px`,
        `background:${COLORS[Math.floor(Math.random() * COLORS.length)]}`,
        `top:-20px`,
        `left:${startX}vw`,
        `opacity:1`,
        `transform:rotate(${Math.random() * 360}deg)`,
        `border-radius:${Math.random() > 0.5 ? '50%' : '0'}`,
        `animation:confettiFall ${duration}s linear ${delay}s forwards`
      ].join(';');
      container.appendChild(confetti);
    }

    // Style injection with dedup guard
    if (!document.getElementById('confetti-animation')) {
      const style = document.createElement('style');
      style.id = 'confetti-animation';
      style.textContent = `
        @keyframes confettiFall {
          to { transform: translateY(100vh) translateX(${Math.random() * 100 - 50}px) rotate(${Math.random() * 720}deg); opacity: 0; }
        }
        @keyframes fireworkBurst {
          0%   { width: 0; height: 0; opacity: 1; }
          100% { width: 300px; height: 300px; opacity: 0; }
        }
        @keyframes celebrationPulse {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.5); box-shadow: 0 0 30px rgba(63,118,82,0.8); }
        }
      `;
      document.head.appendChild(style);
    }

    const step4Rect    = step4Item.getBoundingClientRect();
    const step4CenterX = step4Rect.left + step4Rect.width / 2;
    const step4CenterY = step4Rect.top  + step4Rect.height / 2;

    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const firework = document.createElement('div');
        firework.setAttribute('aria-hidden', 'true');
        firework.style.cssText = [
          `position:fixed`,
          `left:${step4CenterX}px`,
          `top:${step4CenterY}px`,
          `width:0`,
          `height:0`,
          `border:3px solid ${COLORS[Math.floor(Math.random() * COLORS.length)]}`,
          `border-radius:50%`,
          `transform:translate(-50%,-50%)`,
          `animation:fireworkBurst 0.8s ease-out forwards`,
          `pointer-events:none`,
          `z-index:10001`
        ].join(';');
        container.appendChild(firework);
        setTimeout(() => firework.remove(), 800);
      }, i * 300);
    }

    const step4Dot = step4Item.querySelector('.step-dot');
    if (step4Dot) {
      step4Dot.style.animation = 'celebrationPulse 0.5s ease-in-out 3';
    }

    setTimeout(() => {
      container.remove();
      if (step4Dot) step4Dot.style.animation = '';
    }, 4000);
  }

  setupClickNavigation() {
    this.stepIndicator.addEventListener('click', e => {
      const stepItem = e.target.closest('.step-item');
      if (!stepItem) return;
      const stepNum = parseInt(stepItem.dataset.step, 10);
      if (!Number.isInteger(stepNum) || !this.completedSteps.has(stepNum)) return;

      this.currentStep = stepNum;
      this.updateStepIndicator();

      const sectionIds = { 1: 'step-1-section', 3: 'step-3-section', 4: 'step-4-section' };
      const targetId = sectionIds[stepNum];
      if (targetId) {
        const target = document.getElementById(targetId);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  setupClearButton() {
    const clearBtn = document.getElementById('btn-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        setTimeout(() => this.reset(), 100);
      });
    }
  }

  reset() {
    this.completedSteps.clear();
    this.currentStep    = 0;
    this.step4Triggered = false;
    this.updateStepIndicator();
  }
}
