/**
 * TarotVisionAI.js - AI-Powered Tarot Card Reading via Camera/Upload
 */

(() => {
  'use strict';

  const CONFIG = {
    MAX_FILE_SIZE: 4 * 1024 * 1024,
    ALLOWED_TYPES: ['image/jpeg', 'image/png'],
    API_ROUTE: '/api/tarot-vision',
    RETRY_COUNT: 3,
    TIMEOUT_MS: 25000,
    CAMERA_CONSTRAINTS: {
      video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
      audio: false
    },
    IMAGE_QUALITY: 0.92
  };

  let state = {
    imageBase64: null,
    stream: null,
    isAnalyzing: false
  };

  let elements = {
    video: null, canvas: null, preview: null, placeholder: null,
    captureBtn: null, uploadBtn: null, uploadInput: null,
    analyzeBtn: null, resetBtn: null, result: null, loader: null
  };

  async function init() {
    await Promise.resolve();
    const $ = sel => document.querySelector(sel);
    elements.video       = $('#video');
    elements.canvas      = $('#canvas');
    elements.preview     = $('#image-preview');
    elements.placeholder = $('#upload-placeholder');
    elements.captureBtn  = $('#capture-btn');
    elements.uploadBtn   = $('#upload-btn');
    elements.uploadInput = $('#upload-input');
    elements.analyzeBtn  = $('#analyze-btn');
    elements.resetBtn    = $('#reset-btn');
    elements.result      = $('#result');
    elements.loader      = $('#loading-spinner');
    bindEventListeners();
  }

  function bindEventListeners() {
    elements.uploadInput.addEventListener('change', handleFileUpload, { passive: true });
    elements.captureBtn.addEventListener('click',  toggleCamera,                     { passive: true });
    elements.uploadBtn.addEventListener('click',   () => elements.uploadInput.click(), { passive: true });
    elements.analyzeBtn.addEventListener('click',  analyzeImage,                     { passive: true });
    elements.resetBtn.addEventListener('click',    resetInterface,                   { passive: true });
  }

  // ─── Popup Management ─────────────────────────────────────────────────────

  function buildPopup() {
    if (document.getElementById('tarot-vision-popup')) return;
    const overlay = document.createElement('div');
    overlay.id = 'tarot-vision-popup';
    overlay.innerHTML = `
      <div class="vision-popup-overlay">
        <div class="vision-popup-card">
          <header class="vision-popup-header">
            <h3 class="vision-popup-title" style="display:flex;align-items:center;gap:0.5rem;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:1.25rem;height:1.25rem;flex-shrink:0;"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
              Tarot Vision AI
            </h3>
            <button id="vision-close" class="vision-close-btn" aria-label="Close">&times;</button>
          </header>
          <section class="vision-popup-body">
            <video id="video" class="hidden" playsinline autoplay muted></video>
            <canvas id="canvas" class="hidden"></canvas>
            <img id="image-preview" class="hidden" alt="Preview" width="400" height="400" loading="lazy" decoding="async">
            <div id="upload-placeholder" class="placeholder-box">
              <span class="placeholder-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:2rem;height:2rem;"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg></span>
              <p>Take a photo or upload an image of your cards</p>
            </div>
            <div class="vision-controls">
              <button id="capture-btn" type="button" class="vision-btn">${getIcon('camera')} Camera</button>
              <button id="upload-btn" type="button" class="vision-btn">${getIcon('photo')} Upload</button>
              <button id="analyze-btn" type="button" class="vision-btn btn-primary" disabled>${getIcon('search')} Analyze</button>
            </div>
            <input id="upload-input" type="file" accept="image/jpeg,image/png" class="hidden">
            <button id="reset-btn" type="button" class="vision-btn hidden">🔄 Reset</button>
            <div id="result" class="vision-result">
              <p class="placeholder-text">Your tarot reading will appear here...</p>
            </div>
            <div id="loading-spinner" class="hidden">
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

  // Fixed: store escHandler on overlay element to prevent listener leak
  function setupPopupEventListeners(overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.id === 'vision-close') closePopup();
    });
    overlay._escHandler = (e) => { if (e.key === 'Escape') closePopup(); };
    document.addEventListener('keydown', overlay._escHandler);
  }

  async function openPopup() {
    buildPopup();
    const popup = document.getElementById('tarot-vision-popup');
    popup.classList.add('active');
    document.body.style.overflow = 'hidden';
    await init();
  }

  // Fixed: removes stored Escape listener on close
  function closePopup() {
    const popup = document.getElementById('tarot-vision-popup');
    if (!popup) return;
    if (popup._escHandler) {
      document.removeEventListener('keydown', popup._escHandler);
      popup._escHandler = null;
    }
    popup.classList.remove('active');
    document.body.style.overflow = '';
    resetInterface();
    stopCameraStream();
  }

  // ─── Camera ───────────────────────────────────────────────────────────────

  async function toggleCamera() {
    if (state.stream) { capturePhoto(); return; }
    try {
      showLoader(true);
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('Camera API not supported in this browser');
      state.stream = await navigator.mediaDevices.getUserMedia(CONFIG.CAMERA_CONSTRAINTS);
      elements.video.srcObject = state.stream;
      elements.video.muted = true;
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
    elements.preview.src = state.imageBase64;
    stopCameraStream();
    showPreview();
    enableAnalyzeButton();
    elements.captureBtn.innerHTML = `${getIcon('camera')} Use Camera`;
  }

  function stopCameraStream() {
    if (state.stream) {
      state.stream.getTracks().forEach(t => t.stop());
      state.stream = null;
      elements.video.srcObject = null;
    }
  }

  function handleCameraError(error) {
    console.error('Camera error:', error);
    let message = 'Unable to access camera. ';
    if (error.name === 'NotAllowedError')   message += 'Please grant camera permissions and try again.';
    else if (error.name === 'NotFoundError') message += 'No camera found on this device.';
    else if (error.name === 'NotReadableError') message += 'Camera is already in use by another application.';
    else message += error.message || 'Please try again.';
    showToast(message, 'error');
  }

  // ─── File Upload ──────────────────────────────────────────────────────────

  function handleFileUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!CONFIG.ALLOWED_TYPES.includes(file.type)) { showToast('Only JPEG and PNG images are allowed.', 'warning'); return; }
    if (file.size > CONFIG.MAX_FILE_SIZE)          { showToast('Image must be 4 MB or smaller.', 'warning'); return; }
    const reader = new FileReader();
    reader.onload  = e => processUploadedImage(e.target.result);
    reader.onerror = ()  => showToast('Failed to read image file.', 'error');
    reader.readAsDataURL(file);
  }

  function processUploadedImage(dataUrl) {
    const img = new Image();
    img.onload  = () => { state.imageBase64 = dataUrl; elements.preview.src = dataUrl; showPreview(); enableAnalyzeButton(); };
    img.onerror = ()  => showToast('Failed to load image.', 'error');
    img.src = dataUrl;
  }

  // ─── Analysis ─────────────────────────────────────────────────────────────

  async function analyzeImage() {
    if (!state.imageBase64) { showToast('No image to analyze.', 'warning'); return; }
    if (state.isAnalyzing) return;
    state.isAnalyzing = true;
    showLoader(true);
    elements.analyzeBtn.disabled = true;
    elements.result.innerHTML = '<p class="placeholder-text">Interpreting the cards...</p>';

    for (let attempt = 1; attempt <= CONFIG.RETRY_COUNT; attempt++) {
      try {
        const result = await sendAnalysisRequest();
        displayResult(result.text || 'No interpretation returned.');
        showResetUI();
        return;
      } catch (error) {
        console.error(`Analysis attempt ${attempt} failed:`, error);
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
      const base64Data = state.imageBase64.split(',')[1];
      const response   = await fetch(CONFIG.API_ROUTE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Data }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error(`Network error: ${response.status} ${response.statusText}`);
      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  // ─── UI Updates ───────────────────────────────────────────────────────────

  function showPreview() {
    elements.video.classList.add('hidden');
    elements.preview.classList.remove('hidden');
    elements.placeholder.classList.add('hidden');
  }

  function displayResult(text) {
    showLoader(false);
    elements.result.innerHTML = `<div class="result-content">${sanitizeHTML(text)}</div>`;
    state.isAnalyzing = false;
  }

  function showResetUI() {
    [elements.captureBtn, elements.uploadBtn, elements.analyzeBtn].forEach(btn => btn.classList.add('hidden'));
    elements.resetBtn.classList.remove('hidden');
  }

  function enableAnalyzeButton() { elements.analyzeBtn.disabled = false; }

  function showLoader(show) {
    show ? elements.loader.classList.remove('hidden') : elements.loader.classList.add('hidden');
  }

  function resetInterface() {
    state.imageBase64 = null;
    state.isAnalyzing = false;
    elements.uploadInput.value = '';
    stopCameraStream();
    elements.preview.src = '';
    elements.preview.classList.add('hidden');
    elements.placeholder.classList.remove('hidden');
    elements.result.innerHTML = '<p class="placeholder-text">Your tarot reading will appear here...</p>';
    [elements.captureBtn, elements.uploadBtn, elements.analyzeBtn].forEach(btn => {
      btn.classList.remove('hidden');
      btn.disabled = false;
    });
    elements.analyzeBtn.disabled = true;
    elements.resetBtn.classList.add('hidden');
    elements.captureBtn.innerHTML = `${getIcon('camera')} Camera`;
  }

  // ─── Utilities ────────────────────────────────────────────────────────────

  function sanitizeHTML(str) {
    return str
      .replace(/&/g,  '&amp;').replace(/</g, '&lt;')
      .replace(/>/g,  '&gt;').replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getIcon(name) {
    const icons = {
      camera: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0-10c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/></svg>`,
      photo:  `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h4.05l1.83-2h4.24l1.83 2H20v12zM12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z"/></svg>`,
      search: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>`
    };
    return icons[name] || '';
  }

  function showToast(message, type = 'info') {
    if (window.app?.showToast) window.app.showToast(message, type);
    else alert(message);
  }

  // ─── Styles ───────────────────────────────────────────────────────────────

  function injectStyles() {
    if (document.getElementById('vision-popup-styles')) return;
    const style = document.createElement('style');
    style.id = 'vision-popup-styles';
    style.textContent = `
      #tarot-vision-popup {
        position:fixed;inset:0;z-index:10000;display:none;align-items:center;justify-content:center;
        background:rgba(196,173,145,0.85);backdrop-filter:blur(4px);padding:var(--spacing-md);animation:fadeIn 0.3s ease;
      }
      #tarot-vision-popup.active { display:flex; }
      .vision-popup-card {
        background:var(--neuro-bg);border-radius:var(--radius-2xl);width:90%;max-width:600px;max-height:90vh;
        display:flex;flex-direction:column;box-shadow:var(--shadow-raised-lg);overflow:hidden;margin:auto;
        animation:slideUpShadow 0.4s ease;position:relative;z-index:10001;
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
      #video, #image-preview {
        max-width:100%;border-radius:var(--radius-md);margin-bottom:var(--spacing-md);
        display:block;box-shadow:var(--shadow-raised);
      }
      .vision-result {
        margin-top:var(--spacing-md);padding:var(--spacing-md);
        background:var(--neuro-bg-lighter);border-radius:var(--radius-lg);box-shadow:var(--shadow-inset);
      }
      .result-content { white-space:pre-wrap;line-height:1.6;color:var(--neuro-text); }
      #loading-spinner {
        display:flex;flex-direction:column;align-items:center;gap:var(--spacing-md);
        margin-top:var(--spacing-md);padding:var(--spacing-xl);text-align:center;
        font-weight:600;color:var(--neuro-accent);
      }
      .spinner {
        width:40px;height:40px;border:4px solid var(--neuro-shadow-light);
        border-top-color:var(--neuro-accent);border-radius:50%;animation:chatbot-spin 0.8s linear infinite;
      }
      .hidden { display:none !important; }
    `;
    document.head.appendChild(style);
  }

  // ─── Global Export ────────────────────────────────────────────────────────

  window.TarotVisionAI = async () => { injectStyles(); buildPopup(); await openPopup(); };

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('#tarot-vision-ai-btn');
    if (!btn) return;
    const isPrivileged = window.app?.state?.currentUser?.isAdmin || window.app?.state?.currentUser?.isVip;
    const isUnlocked   = isPrivileged || window.app?.gamification?.state?.unlockedFeatures?.includes('tarot_vision_ai');
    if (!isUnlocked) { showToast('Purchase Tarot Vision AI in the Karma Shop to use this feature.', 'info'); return; }
    window.TarotVisionAI();
  });

})();