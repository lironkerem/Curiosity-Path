/**
 * TarotVisionAI.js - AI-Powered Tarot Card Reading via Camera/Upload
 * Provides popup interface for capturing/uploading tarot card images and analyzing them with AI
 */

(() => {
  'use strict';

  /* ==================== CONFIGURATION ==================== */
  
  const CONFIG = {
    MAX_FILE_SIZE: 4 * 1024 * 1024,                    // 4 MB limit
    ALLOWED_TYPES: ['image/jpeg', 'image/png'],        // Accepted image formats
    API_ROUTE: '/api/tarot-vision',                    // Serverless function endpoint
    RETRY_COUNT: 3,                                     // Number of retry attempts
    TIMEOUT_MS: 25000,                                 // 25 second timeout
    CAMERA_CONSTRAINTS: {
      video: {
        facingMode: 'environment',                     // Use back camera on mobile
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      },
      audio: false
    },
    IMAGE_QUALITY: 0.92                                // JPEG quality (0-1)
  };

  /* ==================== STATE ==================== */
  
  let state = {
    imageBase64: null,                                  // Current image data
    stream: null,                                       // Camera stream reference
    isAnalyzing: false                                  // Analysis in progress flag
  };

  /* ==================== DOM ELEMENTS (lazy loaded) ==================== */
  
  let elements = {
    video: null,
    canvas: null,
    preview: null,
    placeholder: null,
    captureBtn: null,
    uploadBtn: null,
    uploadInput: null,
    analyzeBtn: null,
    resetBtn: null,
    result: null,
    loader: null
  };

  /* ==================== INITIALIZATION ==================== */

  /**
   * Initialize DOM references and event listeners
   * Called after popup is rendered
   */
  async function init() {
    // Wait for next tick to ensure DOM is ready
    await Promise.resolve();
    
    // Cache DOM elements
    const $ = (sel) => document.querySelector(sel);
    elements.video = $('#video');
    elements.canvas = $('#canvas');
    elements.preview = $('#image-preview');
    elements.placeholder = $('#upload-placeholder');
    elements.captureBtn = $('#capture-btn');
    elements.uploadBtn = $('#upload-btn');
    elements.uploadInput = $('#upload-input');
    elements.analyzeBtn = $('#analyze-btn');
    elements.resetBtn = $('#reset-btn');
    elements.result = $('#result');
    elements.loader = $('#loading-spinner');

    // Bind event listeners
    bindEventListeners();
  }

  /**
   * Bind all event listeners with passive mode for better performance
   */
  function bindEventListeners() {
    elements.uploadInput.addEventListener('change', handleFileUpload, { passive: true });
    elements.captureBtn.addEventListener('click', toggleCamera, { passive: true });
    elements.uploadBtn.addEventListener('click', () => elements.uploadInput.click(), { passive: true });
    elements.analyzeBtn.addEventListener('click', analyzeImage, { passive: true });
    elements.resetBtn.addEventListener('click', resetInterface, { passive: true });
  }

  /* ==================== POPUP MANAGEMENT ==================== */

  /**
   * Build popup HTML structure
   * Only creates if not already in DOM
   */
  function buildPopup() {
    if (document.getElementById('tarot-vision-popup')) return;
    
    const overlay = document.createElement('div');
    overlay.id = 'tarot-vision-popup';
    overlay.innerHTML = `
      <div class="vision-popup-overlay">
        <div class="vision-popup-card">
          <!-- Header -->
          <header class="vision-popup-header">
            <h3 class="vision-popup-title" style="display:flex;align-items:center;gap:0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:1.25rem;height:1.25rem;flex-shrink:0;"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg> Tarot Vision AI</h3>
            <button id="vision-close" class="vision-close-btn" aria-label="Close">&times;</button>
          </header>

          <!-- Body -->
          <section class="vision-popup-body">
            <!-- Camera video stream -->
            <video id="video" class="hidden" playsinline autoplay muted></video>
            
            <!-- Canvas for photo capture -->
            <canvas id="canvas" class="hidden"></canvas>
            
            <!-- Image preview -->
            <img id="image-preview" class="hidden" alt="Preview" width="400" height="400">

            <!-- Placeholder -->
            <div id="upload-placeholder" class="placeholder-box">
              <span class="placeholder-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:2rem;height:2rem;"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg></span>
              <p>Take a photo or upload an image of your cards</p>
            </div>

            <!-- Control buttons -->
            <div class="vision-controls">
              <button id="capture-btn" type="button" class="vision-btn">
                ${getIcon('camera')} Camera
              </button>
              <button id="upload-btn" type="button" class="vision-btn">
                ${getIcon('photo')} Upload
              </button>
              <button id="analyze-btn" type="button" class="vision-btn btn-primary" disabled>
                ${getIcon('search')} Analyze
              </button>
            </div>

            <!-- Hidden file input -->
            <input id="upload-input" type="file" accept="image/jpeg,image/png" class="hidden">
            
            <!-- Reset button (hidden by default) -->
            <button id="reset-btn" type="button" class="vision-btn hidden">🔄 Reset</button>

            <!-- Results display -->
            <div id="result" class="vision-result">
              <p class="placeholder-text">Your tarot reading will appear here...</p>
            </div>
            
            <!-- Loading spinner -->
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

  /**
   * Setup popup-specific event listeners (close handlers)
   * @param {HTMLElement} overlay - Popup overlay element
   */
  function setupPopupEventListeners(overlay) {
    // Close on overlay click or close button
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.id === 'vision-close') {
        closePopup();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closePopup();
      }
    });
  }

  /**
   * Open the popup and initialize
   */
  async function openPopup() {
    buildPopup();
    const popup = document.getElementById('tarot-vision-popup');
    popup.classList.add('active');
    document.body.style.overflow = 'hidden';
    await init();
  }

  /**
   * Close the popup and cleanup
   */
  function closePopup() {
    const popup = document.getElementById('tarot-vision-popup');
    if (!popup) return;
    
    popup.classList.remove('active');
    document.body.style.overflow = '';
    resetInterface();
    stopCameraStream();
  }

  /* ==================== CAMERA FUNCTIONALITY ==================== */

  /**
   * Toggle camera on/off or capture photo if camera is active
   */
  async function toggleCamera() {
    // If camera is active, take photo
    if (state.stream) {
      capturePhoto();
      return;
    }

    // Otherwise, start camera
    try {
      showLoader(true);
      
      // Check browser support
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera API not supported in this browser');
      }

      // Request camera access
      state.stream = await navigator.mediaDevices.getUserMedia(CONFIG.CAMERA_CONSTRAINTS);
      
      // Configure video element
      elements.video.srcObject = state.stream;
      elements.video.muted = true;
      elements.video.setAttribute('playsinline', '');
      
      // Wait for video to be ready
      await elements.video.play();
      
      // Update UI
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

  /**
   * Capture photo from video stream
   */
  function capturePhoto() {
    const ctx = elements.canvas.getContext('2d');
    
    // Set canvas dimensions to match video
    elements.canvas.width = elements.video.videoWidth;
    elements.canvas.height = elements.video.videoHeight;
    
    // Draw current video frame to canvas
    ctx.drawImage(elements.video, 0, 0);
    
    // Convert to base64 JPEG
    state.imageBase64 = elements.canvas.toDataURL('image/jpeg', CONFIG.IMAGE_QUALITY);
    
    // Update preview
    elements.preview.src = state.imageBase64;
    
    // Cleanup and update UI
    stopCameraStream();
    showPreview();
    enableAnalyzeButton();
    elements.captureBtn.innerHTML = `${getIcon('camera')} Use Camera`;
  }

  /**
   * Stop active camera stream
   */
  function stopCameraStream() {
    if (state.stream) {
      state.stream.getTracks().forEach(track => track.stop());
      state.stream = null;
      elements.video.srcObject = null;
    }
  }

  /**
   * Handle camera errors with user-friendly messages
   * @param {Error} error - Error object
   */
  function handleCameraError(error) {
    console.error('Camera error:', error);
    
    let message = 'Unable to access camera. ';
    
    if (error.name === 'NotAllowedError') {
      message += 'Please grant camera permissions and try again.';
    } else if (error.name === 'NotFoundError') {
      message += 'No camera found on this device.';
    } else if (error.name === 'NotReadableError') {
      message += 'Camera is already in use by another application.';
    } else {
      message += error.message || 'Please try again.';
    }
    
    showToast(message, 'error');
  }

  /* ==================== FILE UPLOAD ==================== */

  /**
   * Handle file upload from input
   * @param {Event} event - Change event
   */
  function handleFileUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!CONFIG.ALLOWED_TYPES.includes(file.type)) {
      showToast('Only JPEG and PNG images are allowed.', 'warning');
      return;
    }

    // Validate file size
    if (file.size > CONFIG.MAX_FILE_SIZE) {
      showToast('Image must be 4 MB or smaller.', 'warning');
      return;
    }

    // Read file
    const reader = new FileReader();
    reader.onload = (e) => {
      processUploadedImage(e.target.result);
    };
    reader.onerror = () => {
      showToast('Failed to read image file.', 'error');
    };
    reader.readAsDataURL(file);
  }

  /**
   * Process uploaded image data
   * @param {string} dataUrl - Base64 data URL
   */
  function processUploadedImage(dataUrl) {
    const img = new Image();
    
    img.onload = () => {
      state.imageBase64 = dataUrl;
      elements.preview.src = dataUrl;
      showPreview();
      enableAnalyzeButton();
    };
    
    img.onerror = () => {
      showToast('Failed to load image.', 'error');
    };
    
    img.src = dataUrl;
  }

  /* ==================== IMAGE ANALYSIS ==================== */

  /**
   * Send image to AI for analysis
   */
  async function analyzeImage() {
    if (!state.imageBase64) {
      showToast('No image to analyze.', 'warning');
      return;
    }

    if (state.isAnalyzing) return;
    
    state.isAnalyzing = true;
    showLoader(true);
    elements.analyzeBtn.disabled = true;
    elements.result.innerHTML = '<p class="placeholder-text">Interpreting the cards...</p>';

    // Retry loop
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

  /**
   * Send analysis request to API with timeout
   * @returns {Promise<Object>} API response
   */
  async function sendAnalysisRequest() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT_MS);

    try {
      // Extract base64 data (remove data URL prefix)
      const base64Data = state.imageBase64.split(',')[1];

      const response = await fetch(CONFIG.API_ROUTE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Data }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Network error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /* ==================== UI UPDATES ==================== */

  /**
   * Show image preview and hide other elements
   */
  function showPreview() {
    elements.video.classList.add('hidden');
    elements.preview.classList.remove('hidden');
    elements.placeholder.classList.add('hidden');
  }

  /**
   * Display analysis result
   * @param {string} text - Result text to display
   */
  function displayResult(text) {
    showLoader(false);
    const sanitizedText = sanitizeHTML(text);
    elements.result.innerHTML = `<div class="result-content">${sanitizedText}</div>`;
    state.isAnalyzing = false;
  }

  /**
   * Show reset UI state (hide capture/upload buttons)
   */
  function showResetUI() {
    [elements.captureBtn, elements.uploadBtn, elements.analyzeBtn].forEach(btn => {
      btn.classList.add('hidden');
    });
    elements.resetBtn.classList.remove('hidden');
  }

  /**
   * Enable analyze button
   */
  function enableAnalyzeButton() {
    elements.analyzeBtn.disabled = false;
  }

  /**
   * Show/hide loading spinner
   * @param {boolean} show - Whether to show loader
   */
  function showLoader(show) {
    if (show) {
      elements.loader.classList.remove('hidden');
    } else {
      elements.loader.classList.add('hidden');
    }
  }

  /**
   * Reset interface to initial state
   */
  function resetInterface() {
    // Clear state
    state.imageBase64 = null;
    state.isAnalyzing = false;
    
    // Clear file input
    elements.uploadInput.value = '';
    
    // Stop camera if active
    stopCameraStream();
    
    // Reset preview
    elements.preview.src = '';
    elements.preview.classList.add('hidden');
    
    // Show placeholder
    elements.placeholder.classList.remove('hidden');
    
    // Reset result display
    elements.result.innerHTML = '<p class="placeholder-text">Your tarot reading will appear here...</p>';
    
    // Reset buttons
    [elements.captureBtn, elements.uploadBtn, elements.analyzeBtn].forEach(btn => {
      btn.classList.remove('hidden');
      btn.disabled = false;
    });
    
    elements.analyzeBtn.disabled = true;
    elements.resetBtn.classList.add('hidden');
    elements.captureBtn.innerHTML = `${getIcon('camera')} Camera`;
  }

  /* ==================== UTILITIES ==================== */

  /**
   * Sanitize HTML to prevent XSS
   * @param {string} str - String to sanitize
   * @returns {string} Sanitized string
   */
  function sanitizeHTML(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Get SVG icon by name
   * @param {string} name - Icon name (camera, photo, search)
   * @returns {string} SVG markup
   */
  function getIcon(name) {
    const icons = {
      camera: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0-10c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/></svg>`,
      photo: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h4.05l1.83-2h4.24l1.83 2H20v12zM12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z"/></svg>`,
      search: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>`
    };
    return icons[name] || '';
  }

  /**
   * Show toast notification (uses global app toast if available)
   * @param {string} message - Message to display
   * @param {string} type - Message type (info, warning, error)
   */
  function showToast(message, type = 'info') {
    if (window.app?.showToast) {
      window.app.showToast(message, type);
    } else {
      alert(message);
    }
  }

  /* ==================== STYLES ==================== */

  /**
   * Inject popup styles into document head
   */
  function injectStyles() {
    if (document.getElementById('vision-popup-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'vision-popup-styles';
    style.textContent = `
      /* Popup Overlay — matches .modal-overlay */
      #tarot-vision-popup {
        position: fixed;
        inset: 0;
        z-index: 10000;
        display: none;
        align-items: center;
        justify-content: center;
        background: rgba(196, 173, 145, 0.85);
        backdrop-filter: blur(4px);
        padding: var(--spacing-md);
        animation: fadeIn 0.3s ease;
      }

      #tarot-vision-popup.active {
        display: flex;
      }

      /* Popup Card — matches .modal-card */
      .vision-popup-card {
        background: var(--neuro-bg);
        border-radius: var(--radius-2xl);
        width: 90%;
        max-width: 600px;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
        box-shadow: var(--shadow-raised-lg);
        overflow: hidden;
        margin: auto;
        animation: slideUpShadow 0.4s ease;
        position: relative;
        z-index: 10001;
      }

      /* Header */
      .vision-popup-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--spacing-md) var(--spacing-lg);
        border-bottom: 1px solid var(--neuro-shadow-dark);
        background: var(--neuro-bg);
      }

      .vision-popup-title {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--neuro-text);
        margin: 0;
      }

      /* Close btn — matches .modal-close-btn */
      .vision-close-btn {
        background: var(--neuro-bg);
        border: none;
        font-size: 1.5rem;
        line-height: 1;
        cursor: pointer;
        color: var(--neuro-text-light);
        box-shadow: var(--shadow-raised);
        border-radius: var(--radius-sm);
        padding: 0.4rem 0.65rem;
        transition: box-shadow var(--transition-fast);
      }

      .vision-close-btn:hover {
        box-shadow: var(--shadow-inset);
        color: var(--neuro-text);
      }

      /* Body */
      .vision-popup-body {
        padding: var(--spacing-lg);
        flex: 1 1 auto;
        overflow-y: auto;
        color: var(--neuro-text);
      }

      /* Placeholder box */
      .placeholder-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: var(--spacing-xl);
        border: 2px dashed var(--neuro-shadow-dark);
        border-radius: var(--radius-lg);
        margin-bottom: var(--spacing-md);
        background: var(--neuro-bg-lighter);
        box-shadow: var(--shadow-inset-sm);
      }

      .placeholder-icon {
        font-size: 2rem;
        margin-bottom: var(--spacing-sm);
        color: var(--neuro-text-lighter);
      }

      .placeholder-text {
        color: var(--neuro-text-light);
        text-align: center;
      }

      /* Controls */
      .vision-controls {
        display: flex;
        gap: var(--spacing-sm);
        flex-wrap: wrap;
        margin-bottom: var(--spacing-md);
      }

      /* Buttons — inherit .btn + .btn-primary from main styles */
      .vision-btn {
        /* inherits from global .btn via button[type="button"] */
      }

      .vision-btn svg {
        width: 1.1rem;
        height: 1.1rem;
      }

      /* Media elements */
      #video,
      #image-preview {
        max-width: 100%;
        border-radius: var(--radius-md);
        margin-bottom: var(--spacing-md);
        display: block;
        box-shadow: var(--shadow-raised);
      }

      /* Result area */
      .vision-result {
        margin-top: var(--spacing-md);
        padding: var(--spacing-md);
        background: var(--neuro-bg-lighter);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-inset);
      }

      .result-content {
        white-space: pre-wrap;
        line-height: 1.6;
        color: var(--neuro-text);
      }

      /* Loading Spinner */
      #loading-spinner {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--spacing-md);
        margin-top: var(--spacing-md);
        padding: var(--spacing-xl);
        text-align: center;
        font-weight: 600;
        color: var(--neuro-accent);
      }

      .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid var(--neuro-shadow-light);
        border-top-color: var(--neuro-accent);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      /* Utility */
      .hidden {
        display: none !important;
      }
    `;
    
    document.head.appendChild(style);
  }

  /* ==================== GLOBAL EXPORT ==================== */

  /**
   * Global function to open Tarot Vision AI popup
   */
  window.TarotVisionAI = async () => {
    injectStyles();
    buildPopup();
    await openPopup();
  };

  /* ==================== GLOBAL EVENT LISTENER ==================== */

  /**
   * Listen for button clicks to open popup
   * Checks for feature unlock before opening
   */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('#tarot-vision-ai-btn');
    if (!btn) return;

    // Check if feature is unlocked
    const isPrivileged = window.app?.state?.currentUser?.isAdmin || window.app?.state?.currentUser?.isVip;
    const isUnlocked = isPrivileged || window.app?.gamification?.state?.unlockedFeatures?.includes('tarot_vision_ai');
    
    if (!isUnlocked) {
      showToast('Purchase Tarot Vision AI in the Karma Shop to use this feature.', 'info');
      return;
    }

    // Open popup
    window.TarotVisionAI();
  });

})();