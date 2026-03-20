/**
 * TarotVisionAI.js - AI-Powered Tarot Card Reading via Camera/Upload
 * Popup interface for capturing/uploading tarot card images and analysing with AI
 */

(() => {
  'use strict';

  /* ==================== CONFIGURATION ==================== */

  const CONFIG = Object.freeze({
    MAX_FILE_SIZE:      4 * 1024 * 1024,               // 4 MB
    ALLOWED_TYPES:      Object.freeze(['image/jpeg', 'image/png']),
    API_ROUTE:          '/api/tarot-vision',
    RETRY_COUNT:        3,
    TIMEOUT_MS:         25000,
    CAMERA_CONSTRAINTS: Object.freeze({
      video: Object.freeze({ facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }),
      audio: false
    }),
    IMAGE_QUALITY: 0.92
  });

  /* ==================== STATE ==================== */

  let state = {
    imageBase64: null,
    stream:      null,
    isAnalyzing: false
  };

  /* ==================== DOM ELEMENTS ==================== */

  let elements = {
    video:        null,
    canvas:       null,
    preview:      null,
    placeholder:  null,
    captureBtn:   null,
    uploadBtn:    null,
    uploadInput:  null,
    analyzeBtn:   null,
    resetBtn:     null,
    result:       null,
    loader:       null
  };

  /* ==================== INITIALIZATION ==================== */

  async function init() {
    await Promise.resolve(); // wait for DOM tick

    const $ = sel => document.querySelector(sel);
    elements.video       = $('#tvai-video');
    elements.canvas      = $('#tvai-canvas');
    elements.preview     = $('#tvai-image-preview');
    elements.placeholder = $('#tvai-upload-placeholder');
    elements.captureBtn  = $('#tvai-capture-btn');
    elements.uploadBtn   = $('#tvai-upload-btn');
    elements.uploadInput = $('#tvai-upload-input');
    elements.analyzeBtn  = $('#tvai-analyze-btn');
    elements.resetBtn    = $('#tvai-reset-btn');
    elements.result      = $('#tvai-result');
    elements.loader      = $('#tvai-loading-spinner');

    bindEventListeners();
  }

  function bindEventListeners() {
    elements.uploadInput.addEventListener('change',  handleFileUpload,                  { passive: true });
    elements.captureBtn.addEventListener('click',    toggleCamera,                      { passive: true });
    elements.uploadBtn.addEventListener('click',     () => elements.uploadInput.click(),{ passive: true });
    elements.analyzeBtn.addEventListener('click',    analyzeImage,                      { passive: true });
    elements.resetBtn.addEventListener('click',      resetInterface,                    { passive: true });
  }

  /* ==================== POPUP MANAGEMENT ==================== */

  function buildPopup() {
    if (document.getElementById('tarot-vision-popup')) return;

    const overlay = document.createElement('div');
    overlay.id = 'tarot-vision-popup';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Tarot Vision AI');

    // Build popup using DOM API to avoid any innerHTML XSS risk from external data
    overlay.innerHTML = `
      <div class="vision-popup-overlay">
        <div class="vision-popup-card">

          <!-- Header -->
          <header class="vision-popup-header">
            <h3 class="vision-popup-title" style="display:flex;align-items:center;gap:0.5rem;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:1.25rem;height:1.25rem;flex-shrink:0;" aria-hidden="true" focusable="false"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
              Tarot Vision AI
            </h3>
            <button type="button" id="tvai-vision-close" class="vision-close-btn" aria-label="Close Tarot Vision AI">&times;</button>
          </header>

          <!-- Body -->
          <section class="vision-popup-body">

            <video id="tvai-video" class="hidden" playsinline autoplay muted aria-label="Camera feed"></video>
            <canvas id="tvai-canvas" class="hidden"></canvas>
            <img id="tvai-image-preview" class="hidden" alt="Captured or uploaded card preview"
                 width="400" height="400" loading="lazy" decoding="async">

            <div id="tvai-upload-placeholder" class="placeholder-box">
              <span class="placeholder-icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:2rem;height:2rem;" aria-hidden="true" focusable="false"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
              </span>
              <p>Take a photo or upload an image of your cards</p>
            </div>

            <div class="vision-controls">
              <button id="tvai-capture-btn" type="button" class="vision-btn btn" aria-label="Open camera">
                ${getIcon('camera')} Camera
              </button>
              <button id="tvai-upload-btn" type="button" class="vision-btn btn" aria-label="Upload image">
                ${getIcon('photo')} Upload
              </button>
              <button id="tvai-analyze-btn" type="button" class="vision-btn btn btn-primary" disabled aria-label="Analyze card">
                ${getIcon('search')} Analyze
              </button>
            </div>

            <!-- Hidden file input — accept attribute restricts MIME on the browser side -->
            <input id="tvai-upload-input" type="file" accept="image/jpeg,image/png" class="hidden"
                   aria-label="Upload card image">

            <button id="tvai-reset-btn" type="button" class="vision-btn btn hidden" aria-label="Reset and start over">
              🔄 Reset
            </button>

            <div id="tvai-result" class="vision-result" aria-live="polite">
              <p class="placeholder-text">Your tarot reading will appear here...</p>
            </div>

            <div id="tvai-loading-spinner" class="hidden" role="status" aria-label="Analyzing cards, please wait">
              <div class="spinner"></div>
              <p>Analyzing cards...</p>
            </div>

          </section>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    setupPopupEventListeners(overlay);
  }

  function setupPopupEventListeners(overlay) {
    // Close on overlay click or close button
    overlay.addEventListener('click', e => {
      if (e.target === overlay || e.target.id === 'tvai-vision-close') closePopup();
    });

    // Close on Escape — scoped to this popup being open
    const escHandler = e => {
      if (e.key === 'Escape' && document.getElementById('tarot-vision-popup')?.classList.contains('active')) {
        closePopup();
      }
    };
    document.addEventListener('keydown', escHandler);
    // Store for cleanup
    overlay._escHandler = escHandler;
  }

  async function openPopup() {
    buildPopup();
    const popup = document.getElementById('tarot-vision-popup');
    popup.classList.add('active');
    document.body.style.overflow = 'hidden';
    await init();
  }

  function closePopup() {
    const popup = document.getElementById('tarot-vision-popup');
    if (!popup) return;
    if (popup._escHandler) document.removeEventListener('keydown', popup._escHandler);
    popup.classList.remove('active');
    document.body.style.overflow = '';
    resetInterface();
    stopCameraStream();
  }

  /* ==================== CAMERA ==================== */

  async function toggleCamera() {
    if (state.stream) { capturePhoto(); return; }

    try {
      showLoader(true);
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('Camera API not supported in this browser');

      state.stream = await navigator.mediaDevices.getUserMedia(CONFIG.CAMERA_CONSTRAINTS);
      elements.video.srcObject = state.stream;
      elements.video.muted     = true;
      elements.video.setAttribute('playsinline', '');
      await elements.video.play();

      elements.video.classList.remove('hidden');
      elements.placeholder.classList.add('hidden');
      elements.preview.classList.add('hidden');
      elements.captureBtn.innerHTML = `${getIcon('photo')} Take Photo`;
    } catch (error) {
      handleCameraError(error);
    } finally {
      showLoader(false);
    }
  }

  function capturePhoto() {
    const ctx = elements.canvas.getContext('2d');
    elements.canvas.width  = elements.video.videoWidth;
    elements.canvas.height = elements.video.videoHeight;
    ctx.drawImage(elements.video, 0, 0);
    state.imageBase64 = elements.canvas.toDataURL('image/jpeg', CONFIG.IMAGE_QUALITY);

    // Set preview src — data URL from canvas, not from untrusted external input
    elements.preview.src = state.imageBase64;

    stopCameraStream();
    showPreview();
    enableAnalyzeButton();
    elements.captureBtn.innerHTML = `${getIcon('camera')} Use Camera`;
  }

  function stopCameraStream() {
    if (state.stream) {
      state.stream.getTracks().forEach(t => t.stop());
      state.stream          = null;
      elements.video.srcObject = null;
    }
  }

  function handleCameraError(error) {
    console.error('TarotVisionAI: Camera error:', error);
    let message = 'Unable to access camera. ';
    if      (error.name === 'NotAllowedError')   message += 'Please grant camera permissions and try again.';
    else if (error.name === 'NotFoundError')     message += 'No camera found on this device.';
    else if (error.name === 'NotReadableError')  message += 'Camera is already in use by another application.';
    else                                          message += error.message || 'Please try again.';
    showToast(message, 'error');
  }

  /* ==================== FILE UPLOAD ==================== */

  function handleFileUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate MIME type against whitelist
    if (!CONFIG.ALLOWED_TYPES.includes(file.type)) {
      showToast('Only JPEG and PNG images are allowed.', 'warning');
      event.target.value = '';
      return;
    }

    // Validate file size
    if (file.size > CONFIG.MAX_FILE_SIZE) {
      showToast('Image must be 4 MB or smaller.', 'warning');
      event.target.value = '';
      return;
    }

    const reader    = new FileReader();
    reader.onload   = e => processUploadedImage(e.target.result);
    reader.onerror  = ()  => showToast('Failed to read image file.', 'error');
    reader.readAsDataURL(file);
  }

  function processUploadedImage(dataUrl) {
    // Validate it's actually an image data URL before using as src
    if (!dataUrl.startsWith('data:image/')) {
      showToast('Invalid image data.', 'error');
      return;
    }

    const img    = new Image();
    img.onload   = () => {
      state.imageBase64   = dataUrl;
      elements.preview.src = dataUrl;
      showPreview();
      enableAnalyzeButton();
    };
    img.onerror  = ()  => showToast('Failed to load image.', 'error');
    img.src      = dataUrl;
  }

  /* ==================== IMAGE ANALYSIS ==================== */

  async function analyzeImage() {
    if (!state.imageBase64) { showToast('No image to analyze.', 'warning'); return; }
    if (state.isAnalyzing)  return;

    state.isAnalyzing         = true;
    showLoader(true);
    elements.analyzeBtn.disabled = true;

    // Show "working" message via textContent — safe
    const workingP = document.createElement('p');
    workingP.className   = 'placeholder-text';
    workingP.textContent = 'Interpreting the cards...';
    elements.result.innerHTML = '';
    elements.result.appendChild(workingP);

    for (let attempt = 1; attempt <= CONFIG.RETRY_COUNT; attempt++) {
      try {
        const result = await sendAnalysisRequest();
        displayResult(result.text || 'No interpretation returned.');
        showResetUI();
        return;
      } catch (error) {
        console.error(`TarotVisionAI: Analysis attempt ${attempt} failed:`, error);
        if (attempt === CONFIG.RETRY_COUNT) {
          displayResult('Sorry, we could not complete the reading. Please try again later.');
          elements.analyzeBtn.disabled = false;
        }
      }
    }

    showLoader(false);
    state.isAnalyzing = false;
  }

  async function sendAnalysisRequest() {
    const controller = new AbortController();
    const timeoutId  = setTimeout(() => controller.abort(), CONFIG.TIMEOUT_MS);

    try {
      // Extract base64 — remove data URL prefix
      const base64Data = state.imageBase64.split(',')[1];
      if (!base64Data) throw new Error('Invalid image data');

      const response = await fetch(CONFIG.API_ROUTE, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ image: base64Data }),
        signal:  controller.signal
      });

      clearTimeout(timeoutId);
      if (!response.ok) throw new Error(`Network error: ${response.status} ${response.statusText}`);
      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /* ==================== UI UPDATES ==================== */

  function showPreview() {
    elements.video.classList.add('hidden');
    elements.preview.classList.remove('hidden');
    elements.placeholder.classList.add('hidden');
  }

  function displayResult(text) {
    showLoader(false);
    // Escape AI response before injecting into DOM
    const div         = document.createElement('div');
    div.className     = 'result-content';
    div.textContent   = text; // textContent — safe; no XSS
    elements.result.innerHTML = '';
    elements.result.appendChild(div);
    state.isAnalyzing = false;
  }

  function showResetUI() {
    [elements.captureBtn, elements.uploadBtn, elements.analyzeBtn].forEach(btn => btn.classList.add('hidden'));
    elements.resetBtn.classList.remove('hidden');
  }

  function enableAnalyzeButton() { elements.analyzeBtn.disabled = false; }

  function showLoader(show) {
    if (show) elements.loader.classList.remove('hidden');
    else      elements.loader.classList.add('hidden');
  }

  function resetInterface() {
    state.imageBase64 = null;
    state.isAnalyzing = false;

    if (elements.uploadInput) elements.uploadInput.value = '';
    stopCameraStream();

    if (elements.preview) {
      elements.preview.src = '';
      elements.preview.classList.add('hidden');
    }
    if (elements.placeholder) elements.placeholder.classList.remove('hidden');

    // Reset result safely
    if (elements.result) {
      const p       = document.createElement('p');
      p.className   = 'placeholder-text';
      p.textContent = 'Your tarot reading will appear here...';
      elements.result.innerHTML = '';
      elements.result.appendChild(p);
    }

    if (elements.captureBtn && elements.uploadBtn && elements.analyzeBtn) {
      [elements.captureBtn, elements.uploadBtn, elements.analyzeBtn].forEach(btn => {
        btn.classList.remove('hidden');
        btn.disabled = false;
      });
      elements.analyzeBtn.disabled = true;
      elements.captureBtn.innerHTML = `${getIcon('camera')} Camera`;
    }
    if (elements.resetBtn) elements.resetBtn.classList.add('hidden');
  }

  /* ==================== UTILITIES ==================== */

  /**
   * Get SVG icon by name — static markup, no user data
   */
  function getIcon(name) {
    const icons = {
      camera: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0-10c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/></svg>`,
      photo:  `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h4.05l1.83-2h4.24l1.83 2H20v12zM12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z"/></svg>`,
      search: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>`
    };
    return icons[name] || '';
  }

  function showToast(message, type = 'info') {
    if (window.app?.showToast) window.app.showToast(message, type);
    else alert(message);
  }

  /* ==================== STYLES ==================== */

  function injectStyles() {
    if (document.getElementById('vision-popup-styles')) return;
    const style    = document.createElement('style');
    style.id       = 'vision-popup-styles';
    style.textContent = `
      #tarot-vision-popup {
        position:fixed;inset:0;z-index:10000;display:none;align-items:center;justify-content:center;
        background:rgba(196,173,145,0.85);backdrop-filter:blur(4px);padding:var(--spacing-md);animation:fadeIn 0.3s ease;
      }
      #tarot-vision-popup.active { display:flex; }
      .vision-popup-card {
        background:var(--neuro-bg);border-radius:var(--radius-2xl);width:90%;max-width:600px;max-height:90vh;
        display:flex;flex-direction:column;box-shadow:var(--shadow-raised-lg);overflow:hidden;
        margin:auto;animation:slideUpShadow 0.4s ease;position:relative;z-index:10001;
      }
      .vision-popup-header {
        display:flex;align-items:center;justify-content:space-between;
        padding:var(--spacing-md) var(--spacing-lg);border-bottom:1px solid var(--neuro-shadow-dark);background:var(--neuro-bg);
      }
      .vision-popup-title { font-size:1.25rem;font-weight:700;color:var(--neuro-text);margin:0; }
      .vision-close-btn {
        background:var(--neuro-bg);border:none;font-size:1.5rem;line-height:1;cursor:pointer;
        color:var(--neuro-text-light);box-shadow:var(--shadow-raised);border-radius:var(--radius-sm);
        padding:0.4rem 0.65rem;transition:box-shadow var(--transition-fast);
      }
      .vision-close-btn:hover { box-shadow:var(--shadow-inset);color:var(--neuro-text); }
      .vision-popup-body { padding:var(--spacing-lg);flex:1 1 auto;overflow-y:auto;color:var(--neuro-text); }
      .placeholder-box {
        display:flex;flex-direction:column;align-items:center;justify-content:center;
        padding:var(--spacing-xl);border:2px dashed var(--neuro-shadow-dark);border-radius:var(--radius-lg);
        margin-bottom:var(--spacing-md);background:var(--neuro-bg-lighter);box-shadow:var(--shadow-inset-sm);
      }
      .placeholder-icon { font-size:2rem;margin-bottom:var(--spacing-sm);color:var(--neuro-text-lighter); }
      .placeholder-text { color:var(--neuro-text-light);text-align:center; }
      .vision-controls { display:flex;gap:var(--spacing-sm);flex-wrap:wrap;margin-bottom:var(--spacing-md); }
      .vision-btn svg { width:1.1rem;height:1.1rem; }
      #tvai-video,#tvai-image-preview {
        max-width:100%;border-radius:var(--radius-md);margin-bottom:var(--spacing-md);
        display:block;box-shadow:var(--shadow-raised);
      }
      .vision-result {
        margin-top:var(--spacing-md);padding:var(--spacing-md);
        background:var(--neuro-bg-lighter);border-radius:var(--radius-lg);box-shadow:var(--shadow-inset);
      }
      .result-content { white-space:pre-wrap;line-height:1.6;color:var(--neuro-text); }
      #tvai-loading-spinner {
        display:flex;flex-direction:column;align-items:center;gap:var(--spacing-md);
        margin-top:var(--spacing-md);padding:var(--spacing-xl);text-align:center;
        font-weight:600;color:var(--neuro-accent);
      }
      .spinner {
        width:40px;height:40px;border:4px solid var(--neuro-shadow-light);
        border-top-color:var(--neuro-accent);border-radius:50%;animation:spin 0.8s linear infinite;
      }
      .hidden { display:none !important; }
    `;
    document.head.appendChild(style);
  }

  /* ==================== GLOBAL EXPORT ==================== */

  window.TarotVisionAI = async () => {
    injectStyles();
    buildPopup();
    await openPopup();
  };

  /* ==================== GLOBAL CLICK HANDLER ==================== */

  document.addEventListener('click', e => {
    const btn = e.target.closest('#tarot-vision-ai-btn');
    if (!btn) return;

    const isPrivileged = window.app?.state?.currentUser?.isAdmin || window.app?.state?.currentUser?.isVip;
    const isUnlocked   = isPrivileged || window.app?.gamification?.state?.unlockedFeatures?.includes('tarot_vision_ai');

    if (!isUnlocked) {
      showToast('Purchase Tarot Vision AI in the Karma Shop to use this feature.', 'info');
      return;
    }

    window.TarotVisionAI();
  });

})();
