(() => {
  'use strict';

  /* ---------- CONFIG ---------- */
  const MAX_FILE_SIZE   = 4 * 1024 * 1024;          // 4 MB
  const ALLOWED_TYPES   = ['image/jpeg', 'image/png'];
  const API_ROUTE       = '/api/tarot-vision';      // serverless function
  const RETRY_COUNT     = 3;
  const TIMEOUT_MS      = 25_000;

  /* ---------- STATE ---------- */
  let imageBase64 = null;   // cleaned on reset
  let stream      = null;

  /* ---------- delayed DOM cache (populated after stub exists) ---------- */
  let video, canvas, preview, ph, capture, uploadB, uploadI, analyze, resetB, result, loader;

  /* ---------- INIT (delayed query) ---------- */
  async function init() {
    await Promise.resolve();                  // one-tick delay
    const $ = sel => document.querySelector(sel);
    video   = $('#video');
    canvas  = $('#canvas');
    preview = $('#image-preview');
    ph      = $('#upload-placeholder');
    capture = $('#capture-btn');
    uploadB = $('#upload-btn');
    uploadI = $('#upload-input');
    analyze = $('#analyze-btn');
    resetB  = $('#reset-btn');
    result  = $('#result');
    loader  = $('#loading-spinner');

    /* ---- bind events ---- */
    uploadI.addEventListener('change', handleFile, { passive: true });
    capture.addEventListener('click', toggleCamera, { passive: true });
    uploadB.addEventListener('click', () => uploadI.click(), { passive: true });
    analyze.addEventListener('click', analyzeImage, { passive: true });
    resetB.addEventListener('click', reset, { passive: true });
  }

  /* ---------- POPUP MARKUP ---------- */
  function buildPopup() {
    if (document.getElementById('tarot-vision-popup')) return;
    const overlay = document.createElement('div');
    overlay.id = 'tarot-vision-popup';
    overlay.innerHTML = `
      <div class="vision-popup-overlay">
        <div class="vision-popup-card">
          <header class="vision-popup-header">
            <h3 class="vision-popup-title">Tarot Vision AI</h3>
            <button id="vision-close" class="vision-close-btn" aria-label="Close">&times;</button>
          </header>

          <section class="vision-popup-body">
          <video id="video" class="hidden" playsinline autoplay muted></video>
            <canvas id="canvas" class="hidden"></canvas>
            <img  id="image-preview" class="hidden">

            <div id="upload-placeholder" class="placeholder-box">
              <span class="placeholder-icon">📷</span>
              <p>Take a photo or upload an image of your cards</p>
            </div>

            <div class="vision-controls">
              <button id="capture-btn" type="button" class="vision-btn">${icon('camera')} Camera</button>
              <button id="upload-btn"  type="button" class="vision-btn">${icon('photo')} Upload</button>
              <button id="analyze-btn" type="button" class="vision-btn" disabled>${icon('search')} Analyze</button>
            </div>

            <input id="upload-input" type="file" accept="image/jpeg,image/png" class="hidden">
            <button id="reset-btn" type="button" class="vision-btn hidden">Reset</button>

            <div id="result" class="vision-result"></div>
            <div id="loading-spinner" class="hidden">Analysing…</div>
          </section>
        </div>
      </div>`;
    document.body.appendChild(overlay);

    /* ---- close handlers ---- */
    overlay.addEventListener('click', e => {
      if (e.target === overlay || e.target.id === 'vision-close') closePopup();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closePopup();
    });
  }

  /* ---------- POPUP SHOW / HIDE ---------- */
  function openPopup() {
    buildPopup();
    const popup = document.getElementById('tarot-vision-popup');
    popup.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closePopup() {
    const popup = document.getElementById('tarot-vision-popup');
    if (!popup) return;
    popup.classList.remove('active');
    document.body.style.overflow = '';
    reset();
  }

  /* ---------- CORE FUNCTIONS ---------- */
async function toggleCamera() {
  if (stream) { takePhoto(); return; }
  try {
    loader.classList.remove('hidden');
    
    // Check if getUserMedia is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Camera API not supported');
    }
    
    stream = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        facingMode: 'environment',
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      },
      audio: false
    });
    
    video.srcObject = stream;
    video.muted = true;
    video.setAttribute('playsinline', '');
    await video.play(); // Explicitly start playback
    
    video.classList.remove('hidden');
    ph.classList.add('hidden');
    preview.classList.add('hidden');
    capture.innerHTML = icon('photo') + ' Take Photo';
  } catch (e) {
    console.error('Camera error:', e.name, e.message);
    alert(`Camera error: ${e.name} - ${e.message}`);
  } finally {
    loader.classList.add('hidden');
  }
}
  function takePhoto() {
    const ctx = canvas.getContext('2d');
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    imageBase64 = canvas.toDataURL('image/jpeg', 0.92);
    preview.src = imageBase64;
    stopStream();
    showPreview();
    analyze.disabled = false;
    capture.innerHTML = icon('camera') + ' Use Camera';
  }
  function stopStream() {
    if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; video.srcObject = null; }
  }
  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) return alert('Only JPEG / PNG images are allowed.');
    if (file.size > MAX_FILE_SIZE) return alert('Image must be ≤ 4 MB.');
    const reader = new FileReader();
    reader.onload = ({ target }) => {
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        imageBase64 = target.result;
        preview.src = imageBase64;
        showPreview();
        analyze.disabled = false;
      };
      img.src = target.result;
    };
    reader.readAsDataURL(file);
  }
  async function analyzeImage() {
   if (!imageBase64) { window.app.showToast('No image to analyse.', 'warning'); return; }
    loader.classList.remove('hidden');
    analyze.disabled = true;
    result.innerHTML = '<p class="placeholder-text">Interpreting the cards…</p>';
    for (let attempt = 1; attempt <= RETRY_COUNT; attempt++) {
      try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), TIMEOUT_MS);
        const res = await fetch(API_ROUTE, {
          method : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body   : JSON.stringify({ image: imageBase64.split(',')[1] }),
          signal : controller.signal
        });
        clearTimeout(id);
        if (!res.ok) throw new Error('Network error ' + res.status);
        const data = await res.json();
        displayResult(data.text || 'No interpretation returned.');
        showResetUI();
        return;
      } catch (err) {
        if (attempt === RETRY_COUNT) displayResult('Sorry, we could not complete the reading. Please try again.');
      }
    }
    loader.classList.add('hidden');
    analyze.disabled = false;
  }
  function showPreview() {
    video.classList.add('hidden');
    preview.classList.remove('hidden');
    ph.classList.add('hidden');
  }
  function displayResult(text) {
    loader.classList.add('hidden');
    result.innerHTML = `<div class="result-content">${sanitize(text)}</div>`;
  }
  function showResetUI() {
    [capture, uploadB, analyze].forEach(b => b.classList.add('hidden'));
    resetB.classList.remove('hidden');
  }
  function reset() {
    imageBase64 = null;
    uploadI.value = '';
    stopStream();
    preview.src = '';
    preview.classList.add('hidden');
    ph.classList.remove('hidden');
    result.innerHTML = '<p class="placeholder-text">Your tarot reading will appear here…</p>';
    [capture, uploadB, analyze].forEach(b => {
      b.classList.remove('hidden');
      b.disabled = false;
    });
    resetB.classList.add('hidden');
    analyze.disabled = true;
  }
  function sanitize(str) {
    return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function icon(name) {
    const map = {
      camera: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0-10c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/></svg>`,
      photo: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h4.05l1.83-2h4.24l1.83 2H20v12zM12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z"/></svg>`,
      search: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>`
    };
    return map[name] || '';
  }

  /* ---------- POPUP STYLES (injected once) ---------- */
function injectStyles() {
  if (document.getElementById('vision-popup-styles')) return;
  const style = document.createElement('style');
  style.id = 'vision-popup-styles';
  style.textContent = `
    #tarot-vision-popup { position: fixed; inset: 0; z-index: 9999; display: none; align-items: center; justify-content: center; background: rgba(0,0,0,.6); backdrop-filter: blur(4px); padding: 1rem; }
    #tarot-vision-popup.active { display: flex; }
    .vision-popup-card { background: var(--neuro-bg, #fff); border-radius: 12px; width: 90%; max-width: 600px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 10px 30px rgba(0,0,0,.3); overflow: hidden; margin: auto; }
      .vision-popup-header { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; border-bottom: 1px solid var(--neuro-border, #e5e7eb); }
      .vision-popup-title { font-size: 1.25rem; font-weight: 700; color: var(--neuro-text, #111); }
      .vision-close-btn { background: none; border: none; font-size: 1.5rem; line-height: 1; cursor: pointer; color: var(--neuro-text-light, #666); }
      .vision-popup-body { padding: 1.25rem; flex: 1 1 auto; overflow-y: auto; }
      .placeholder-box { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; border: 2px dashed var(--neuro-border, #e5e7eb); border-radius: 8px; margin-bottom: 1rem; }
      .placeholder-icon { font-size: 2rem; margin-bottom: .5rem; }
      .vision-controls { display: flex; gap: .75rem; flex-wrap: wrap; }
      .vision-btn { display: inline-flex; align-items: center; gap: .4rem; padding: .5rem 1rem; border: none; border-radius: 6px; background: var(--neuro-accent, #fcd34d); color: #111; font-weight: 600; cursor: pointer; transition: background .2s; }
      .vision-btn:hover { background: #f59e0b; }
      .vision-btn:disabled { background: #9ca3af; cursor: not-allowed; }
      .vision-result { margin-top: 1rem; white-space: pre-wrap; }
      #loading-spinner { margin-top: 1rem; text-align: center; font-weight: 600; }
      #video, #image-preview { max-width: 100%; border-radius: 8px; margin-bottom: 1rem; }
      .hidden { display: none !important; }
    `;
    document.head.appendChild(style);
  }

  /* ---------- EXPORT (manual control) ---------- */
  window.TarotVisionAI = async () => {
    injectStyles();
    buildPopup();
    openPopup();
    await init();               // init is in scope
  };

  /* ---- global button click ---- */
document.addEventListener('click', e => {
  /* ----- NEW GUARD ----- */
  if (e.target.closest('#tarot-vision-ai-btn')) {
    const unlocked = window.app?.gamification?.state?.unlockedFeatures?.includes('tarot_vision_ai');
    if (!unlocked) {
      window.app.showToast('🔒 Purchase Tarot Vision AI in the Karma Shop to use this feature.', 'info');
      return;                       // stop here – popup never opens
    }
    // else continue as normal
  }
  /* ----- existing handler ----- */
  if (e.target.closest('#tarot-vision-ai-btn')) TarotVisionAI();
});
})();