// ===================================================================
// MEDITATIONS ENGINE - Optimized & Professional
// ===================================================================

/**
 * MeditationsEngine - Manages guided meditation sessions with YouTube integration
 * Handles playback, progress tracking, achievements, and user state management
 */
class MeditationsEngine {
  constructor(app) {
    this.app = app;
    
    // YouTube Player state
    this.ytPlayer = null;
    this.isPlaying = false;
    this.currentMeditation = null;
    this.sessionStartTime = null;
    this.progressInterval = null;
    
    // Event cleanup tracking
    this.eventCleanup = [];
    
    // Configuration
    this.pdfGuideUrl = '/public/Source_PDF/Meditation_Demo.pdf';
    this.SKIP_SECONDS = 15;
    this.MIN_PLAYER_WIDTH = 380;
    this.PROGRESS_UPDATE_MS = 1000;

    // Initialize
    this.loadYouTubeAPI();
    this.meditations = this.getMeditationsData();
  }

  /**
   * Load YouTube IFrame API if not already loaded
   */
  loadYouTubeAPI() {
    // If API already loaded and ready, mark it immediately
    if (window.YT && window.YT.Player) {
      window.ytReady = true;
      return;
    }
    // Set the callback BEFORE injecting the script to avoid race condition
    window.onYouTubeIframeAPIReady = () => {
      window.ytReady = true;
    };
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }
  }

  /**
   * Get meditations data with metadata for each session
   * @returns {Array} Array of meditation objects
   */
  getMeditationsData() {
    return [
      // FREE MEDITATIONS
      {
        id: 1,
        title: 'Grounding to the Center of Earth',
        duration: '29:56',
        category: 'Grounding',
        description: 'Connect deeply with Earth energy and find your center',
        embedUrl: 'https://www.youtube.com/embed/_KedpeSYwgA?enablejsapi=1&rel=0&playsinline=1',
        emoji: '🌍',
        type: 'guided',
        premium: false
      },
      {
        id: 2,
        title: 'Aura Adjustment and Cleaning',
        duration: '29:56',
        category: 'Energy',
        description: 'Cleanse and strengthen your energetic field',
        embedUrl: 'https://www.youtube.com/embed/gIMfdNkAC4g?enablejsapi=1&rel=0&playsinline=1',
        emoji: '✨',
        type: 'guided',
        premium: false
      },
      {
        id: 3,
        title: 'Chakra Cleaning',
        duration: '39:58',
        category: 'Chakras',
        description: 'Balance and clear all seven energy centers',
        embedUrl: 'https://www.youtube.com/embed/BFvmLeYg7cE?enablejsapi=1&rel=0&playsinline=1',
        emoji: '🌈',
        type: 'guided',
        premium: false
      },
      {
        id: 4,
        title: 'The Center of the Universe',
        duration: '29:56',
        category: 'Spiritual',
        description: 'Expand your consciousness to cosmic awareness',
        embedUrl: 'https://www.youtube.com/embed/1T2dNQ4M7Ko?enablejsapi=1&rel=0&playsinline=1',
        emoji: '🌌',
        type: 'guided',
        premium: false
      },
      {
        id: 5,
        title: 'Blowing Roses Healing Technique',
        duration: '29:56',
        category: 'Healing',
        description: 'Release emotional blockages with visualization',
        embedUrl: 'https://www.youtube.com/embed/3yQrtsHbSBo?enablejsapi=1&rel=0&playsinline=1',
        emoji: '🌹',
        type: 'guided',
        premium: false
      },
      {
        id: 6,
        title: '3 Wishes Manifestation',
        duration: '29:52',
        category: 'Manifestation',
        description: 'Align your intentions with universal flow',
        embedUrl: 'https://www.youtube.com/embed/EvRa_qwgJao?enablejsapi=1&rel=0&playsinline=1',
        emoji: '⭐',
        type: 'guided',
        premium: false
      },
      // PREMIUM MEDITATIONS
      {
        id: 7,
        title: 'Meeting your Higher Self',
        duration: '29:56',
        category: 'Premium',
        description: 'Connect with your highest consciousness',
        embedUrl: 'https://www.youtube.com/embed/34mla-PnpeU?enablejsapi=1&rel=0&playsinline=1',
        emoji: '💎',
        type: 'guided',
        premium: true
      },
      {
        id: 8,
        title: 'Inner Temple',
        duration: '29:46',
        category: 'Premium',
        description: 'Create your sacred inner sanctuary',
        embedUrl: 'https://www.youtube.com/embed/t6o6lpftZBA?enablejsapi=1&rel=0&playsinline=1',
        emoji: '🔮',
        type: 'guided',
        premium: true
      },
      {
        id: 9,
        title: 'Gratitude Practice',
        duration: '29:56',
        category: 'Premium',
        description: 'Cultivate deep appreciation and abundance',
        embedUrl: 'https://www.youtube.com/embed/JyTwWAhsiq8?enablejsapi=1&rel=0&playsinline=1',
        emoji: '👑',
        type: 'guided',
        premium: true
      }
    ];
  }

  /**
   * Builds the Community Meditation Rooms CTA card
   */
  /**
   * Shows a self-contained schedule modal for a timed room.
   * Works without Community Hub being loaded.
   */
  showMeditationSchedule(roomKey) {
    const configs = {
      guided: {
        title:    "Today's Meditation Schedule",
        cycleSec: 60 * 60,
        openSec:  15 * 60,
        sessions: [
          { title: 'Grounding to the Center of Earth', duration: '29:56', category: 'Grounding',     emoji: '🌍' },
          { title: 'Aura Adjustment and Cleaning',     duration: '29:56', category: 'Energy',        emoji: '✨' },
          { title: 'Chakra Cleaning',                  duration: '39:58', category: 'Chakras',       emoji: '🌈' },
          { title: 'The Center of the Universe',       duration: '29:56', category: 'Spiritual',     emoji: '🌌' },
          { title: 'Blowing Roses Healing Technique',  duration: '29:56', category: 'Healing',       emoji: '🌹' },
          { title: '3 Wishes Manifestation',           duration: '29:52', category: 'Manifestation', emoji: '⭐' },
          { title: 'Meeting your Higher Self',         duration: '29:56', category: 'Premium',       emoji: '💎' },
          { title: 'Inner Temple',                     duration: '29:46', category: 'Premium',       emoji: '🔮' },
          { title: 'Gratitude Practice',               duration: '29:56', category: 'Premium',       emoji: '👑' },
        ]
      },
      osho: {
        title:    'Upcoming OSHO Sessions',
        cycleSec: 90 * 60,
        openSec:  10 * 60,
        sessions: [
          { title: 'OSHO Dynamic Meditation',    duration: '77:00', category: 'Energy',   emoji: '🔥' },
          { title: 'OSHO Kundalini Meditation',  duration: '77:00', category: 'Movement', emoji: '💃' },
          { title: 'OSHO Nadabrahma Meditation', duration: '77:00', category: 'Humming',  emoji: '🕉️' },
          { title: 'OSHO Nataraj Meditation',    duration: '77:00', category: 'Dance',    emoji: '🎭' },
          { title: 'OSHO Whirling Meditation',   duration: '77:00', category: 'Spinning', emoji: '🌀' },
        ]
      }
    };

    const cfg     = configs[roomKey];
    if (!cfg) return;

    const now     = Date.now();
    const cycleMs = cfg.cycleSec * 1000;
    const openMs  = cfg.openSec  * 1000;
    const base    = Math.floor(now / cycleMs);
    const fmt     = ms => new Date(ms).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

    const rows = Array.from({ length: 6 }, (_, i) => {
      const idx        = (base + i) % cfg.sessions.length;
      const session    = cfg.sessions[idx];
      const cycleStart = (base + i) * cycleMs;
      const cycleClose = cycleStart + openMs;
      const timeInto   = now - cycleStart;
      const isOpen     = i === 0 && timeInto >= 0 && timeInto < openMs;
      const isInSess   = i === 0 && timeInto >= openMs;

      const badge = isOpen
        ? `<span style="background:#22c55e;color:white;font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;margin-left:8px;">OPEN NOW</span>`
        : isInSess
          ? `<span style="background:rgba(239,68,68,0.15);color:#ef4444;font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;margin-left:8px;">IN SESSION</span>`
          : '';

      const rowBg = isOpen ? 'background:var(--neuro-accent);color:white;' : 'background:var(--neuro-bg);';

      return `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:12px;border-radius:12px;margin-bottom:8px;${rowBg}
                    box-shadow:4px 4px 10px var(--neuro-shadow-dark),-4px -4px 10px var(--neuro-shadow-light);">
          <div style="display:flex;align-items:center;gap:12px;flex:1;">
            <span style="font-size:24px;">${session.emoji}</span>
            <div>
              <div style="font-weight:600;font-size:14px;">${session.title}${badge}</div>
              <div style="font-size:11px;opacity:0.7;">${[session.category, session.duration].filter(Boolean).join(' · ')}</div>
            </div>
          </div>
          <div style="text-align:right;font-size:12px;white-space:nowrap;margin-left:12px;">
            <div style="font-weight:600;">${fmt(cycleStart)}</div>
            <div style="opacity:0.6;">closes ${fmt(cycleClose)}</div>
          </div>
        </div>`;
    }).join('');

    // Remove any existing instance
    document.getElementById('meditationScheduleModal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'meditationScheduleModal';
    modal.style.cssText = `
      position:fixed;inset:0;z-index:99999;
      background:rgba(0,0,0,0.5);
      display:flex;align-items:center;justify-content:center;
      padding:1rem;
    `;
    modal.innerHTML = `
      <div style="background:var(--neuro-bg);border-radius:16px;padding:1.5rem;max-width:520px;width:100%;
                  max-height:80vh;overflow-y:auto;
                  box-shadow:12px 12px 24px var(--neuro-shadow-dark),-12px -12px 24px var(--neuro-shadow-light);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;">
          <h2 style="margin:0;font-size:1.1rem;color:var(--neuro-text);">${cfg.title}</h2>
          <button onclick="document.getElementById('meditationScheduleModal')?.remove()"
                  style="background:none;border:none;font-size:1.4rem;cursor:pointer;color:var(--neuro-text-light);line-height:1;">×</button>
        </div>
        <div>${rows}</div>
      </div>
    `;

    modal.addEventListener('click', e => {
      if (e.target === modal) modal.remove();
    });

    document.body.appendChild(modal);
  }

  buildMeditationCTA() {
    // Calculate cycle state directly from the clock - works before Community Hub loads
    const calcCycle = (cycleSec, openSec) => {
      const now          = Date.now();
      const cycleMs      = cycleSec * 1000;
      const openMs       = openSec  * 1000;
      const timeInCycle  = now % cycleMs;
      if (timeInCycle < openMs) return null; // currently open
      const msUntilOpen  = cycleMs - timeInCycle;
      const m = Math.floor(msUntilOpen / 60000);
      const s = Math.floor((msUntilOpen % 60000) / 1000);
      return `Opens in ${m}:${String(s).padStart(2, '0')}`;
    };

    const guidedCountdown = calcCycle(60 * 60, 15 * 60);  // 60-min cycle, 15-min open
    const oshoCountdown   = calcCycle(90 * 60, 10 * 60);  // 90-min cycle, 10-min open

    const btnStyle = null; // replaced by community-link-btn class

    const disabledStyle = `
      width: 100%;
      padding: 0.75rem 1rem;
      border-radius: 999px;
      border: none;
      background: var(--neuro-bg);
      color: var(--neuro-text-light);
      font-size: 0.9rem;
      font-weight: 600;
      cursor: not-allowed;
      opacity: 0.55;
      box-shadow: inset 4px 4px 8px var(--neuro-shadow-dark), inset -4px -4px 8px var(--neuro-shadow-light);
    `;

    return `
      <div class="community-link-card" style="padding-top:0;">
        <div style="display:flex;flex-direction:column;align-items:center;gap:0;margin-bottom:0;">
          <picture><source srcset="/public/Tabs/CommunityHub.webp" type="image/webp"><img src="/public/Tabs/CommunityHub.png" alt="Community" width="480" height="360" style="width:30rem;object-fit:contain;margin-top:1rem;margin-bottom:1rem;" loading="lazy" decoding="async"></picture>
          <h3 style="margin: 0 0 0.75rem; font-size: 1.15rem; text-align:center;">
            Meditate Together with the Community
          </h3>
        </div>
        <p style="margin: 0 0 1.5rem; font-size: 0.92rem; line-height: 1.6;">
          Practice in real time with others. Choose silence, guided visualization, or active OSHO techniques -
          all in shared, live spaces.
        </p>
        <div class="meditation-cta-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem;">

          <button
            onclick="document.activeElement?.blur(); window.app.nav.switchTab('community-hub')"
            class="btn btn-primary"
            style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;white-space:nowrap;"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Enter the Community Hub
          </button>

          <button
            onclick="document.activeElement?.blur(); window._pendingRoomOpen = 'silent'; window.app.nav.switchTab('community-hub')"
            class="btn btn-primary"
            style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;white-space:nowrap;"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
            Silent Meditation
          </button>

          ${guidedCountdown ? `
          <div style="display:flex;flex-direction:column;gap:0.35rem;">
            <button type="button" disabled style="${disabledStyle}" style="display:inline-flex;align-items:center;justify-content:center;gap:0.4rem;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>
              Guided - ${guidedCountdown}
            </button>
            <button type="button" onclick="event.stopPropagation(); window.featuresManager.engines.meditations.showMeditationSchedule('guided')"
              style="background:none;border:none;padding:0;font-size:11px;color:var(--neuro-text-light);cursor:pointer;text-decoration:underline;text-align:center;display:inline-flex;align-items:center;justify-content:center;gap:0.3rem;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:11px;height:11px;"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
              View Schedule
            </button>
          </div>
          ` : `
          <div style="display:flex;flex-direction:column;gap:0.35rem;">
            <button
              onclick="document.activeElement?.blur(); window._pendingRoomOpen = 'guided'; window.app.nav.switchTab('community-hub')"
              class="btn btn-primary"
              style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;white-space:nowrap;"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>
              Guided Visualizations
            </button>
            <button type="button" onclick="event.stopPropagation(); window.featuresManager.engines.meditations.showMeditationSchedule('guided')"
              style="background:none;border:none;padding:0;font-size:11px;color:var(--neuro-text-light);cursor:pointer;text-decoration:underline;text-align:center;display:inline-flex;align-items:center;justify-content:center;gap:0.3rem;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:11px;height:11px;"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
              View Schedule
            </button>
          </div>
          `}

          ${oshoCountdown ? `
          <div style="display:flex;flex-direction:column;gap:0.35rem;">
            <button type="button" disabled style="${disabledStyle}" style="display:inline-flex;align-items:center;justify-content:center;gap:0.4rem;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 22V12"/><path d="M12 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="currentColor"/><path d="M9 22v-4l3-2 3 2v4"/><path d="M7 15l5-3 5 3"/></svg>
              OSHO Active - ${oshoCountdown}
            </button>
            <button type="button" onclick="event.stopPropagation(); window.featuresManager.engines.meditations.showMeditationSchedule('osho')"
              style="background:none;border:none;padding:0;font-size:11px;color:var(--neuro-text-light);cursor:pointer;text-decoration:underline;text-align:center;display:inline-flex;align-items:center;justify-content:center;gap:0.3rem;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:11px;height:11px;"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
              View Schedule
            </button>
          </div>
          ` : `
          <div style="display:flex;flex-direction:column;gap:0.35rem;">
            <button
              onclick="document.activeElement?.blur(); window._pendingRoomOpen = 'osho'; window.app.nav.switchTab('community-hub')"
              class="btn btn-primary"
              style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;white-space:nowrap;"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 22V12"/><path d="M12 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="currentColor"/><path d="M9 22v-4l3-2 3 2v4"/><path d="M7 15l5-3 5 3"/></svg>
              OSHO Active Meditations
            </button>
            <button type="button" onclick="event.stopPropagation(); window.featuresManager.engines.meditations.showMeditationSchedule('osho')"
              style="background:none;border:none;padding:0;font-size:11px;color:var(--neuro-text-light);cursor:pointer;text-decoration:underline;text-align:center;display:inline-flex;align-items:center;justify-content:center;gap:0.3rem;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:11px;height:11px;"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
              View Schedule
            </button>
          </div>
          `}

        </div>
      </div>
    `;
  }

  /**
   * Main render method - builds the complete meditation interface
   */
  render() {
    const tab = document.getElementById('meditations-tab');
    tab.innerHTML = `
      <div style="padding:1.5rem;min-height:100vh;">
        <div class="universal-content">

          <header class="main-header project-curiosity"
                  style="--header-img:url('/public/Tabs/NavMeditations.webp');
                         --header-title:'';
                         --header-tag:'Aanandoham\\'s curated, unique collection of guided meditations'">
            <h1>Guided Meditations</h1>
            <h3>Aanandoham's curated, unique collection of guided meditations</h3>
            <span class="header-sub"></span>
          </header>

          <div class="text-center" style="margin-bottom: 2rem;">
            <button onclick="window.featuresManager.engines.meditations.openPDFGuide()" 
                    class="btn btn-primary" 
                    style="padding: 12px 32px; display: inline-flex; align-items: center; gap: 8px;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              A Demo from the 'Art of Meditation' Workbook - Free For you (PDF)
            </button>
          </div>

          <div class="card dashboard-wellness-toolkit" style="margin-bottom: 2rem;">
            <div class="dashboard-wellness-header">
              <h3 class="dashboard-wellness-title" style="display:flex;align-items:center;gap:0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg> Wellness Toolkit</h3>
              <p class="dashboard-wellness-subtitle">Quick access to your daily reset practices</p>
            </div>
            <div class="wellness-buttons-grid">
              <button class="wellness-tool-btn wellness-tool-active" onclick="window.openSelfReset()" aria-label="Open 60-Second Self Reset">
                <div class="wellness-tool-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg></div>
                <div class="wellness-tool-content">
                  <h4 class="wellness-tool-name">Self Reset</h4>
                  <p class="wellness-tool-description">Short Breathing practice</p>
                  <div class="wellness-tool-stats">
                    <span class="wellness-stat-xp">+10 XP</span>
                    <span class="wellness-stat-karma">+1 Karma</span>
                  </div>
                </div>
              </button>
              <button class="wellness-tool-btn wellness-tool-active" onclick="window.openFullBodyScan()" aria-label="Full Body Scan">
                <div class="wellness-tool-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg></div>
                <div class="wellness-tool-content">
                  <h4 class="wellness-tool-name">Full Body Scan</h4>
                  <p class="wellness-tool-description">Progressive relaxation</p>
                  <div class="wellness-tool-stats">
                    <span class="wellness-stat-xp">+10 XP</span>
                    <span class="wellness-stat-karma">+1 Karma</span>
                  </div>
                </div>
              </button>
              <button class="wellness-tool-btn wellness-tool-active" onclick="window.openNervousReset()" aria-label="Nervous System Reset">
                <div class="wellness-tool-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg></div>
                <div class="wellness-tool-content">
                  <h4 class="wellness-tool-name">Nervous System</h4>
                  <p class="wellness-tool-description">Balance & regulation</p>
                  <div class="wellness-tool-stats">
                    <span class="wellness-stat-xp">+10 XP</span>
                    <span class="wellness-stat-karma">+1 Karma</span>
                  </div>
                </div>
              </button>
              <button class="wellness-tool-btn wellness-tool-active" onclick="window.openTensionSweep()" aria-label="Tension Sweep">
                <div class="wellness-tool-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20"/><path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12"/><circle cx="12" cy="12" r="2"/></svg></div>
                <div class="wellness-tool-content">
                  <h4 class="wellness-tool-name">Tension Sweep</h4>
                  <p class="wellness-tool-description">Release stored tension</p>
                  <div class="wellness-tool-stats">
                    <span class="wellness-stat-xp">+10 XP</span>
                    <span class="wellness-stat-karma">+1 Karma</span>
                  </div>
                </div>
              </button>
            </div>
          </div>

          ${this.buildMeditationCTA()}

          <div class="card" style="margin-bottom: 2rem;">
            <div class="dashboard-wellness-header" style="margin-bottom:1.5rem;">
              <h3 class="dashboard-wellness-title" style="display:flex;align-items:center;gap:0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg> Guided Meditations</h3>
              <p class="dashboard-wellness-subtitle">Aanandoham's private, curated, unique collection</p>
            </div>

            <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:1.5rem;">
              ${this.renderMeditationCards()}
            </div>
          </div>

          ${this.renderPlayer()}

        </div>
      </div>

      ${this.renderStyles()}
    `;

    this.attachEventListeners();
  }

  /**
   * Render all meditation cards
   * @returns {string} HTML string of all meditation cards
   */
  renderMeditationCards() {
    return this.meditations.map(med => {
      const isPremium = med.premium;
      const isPrivileged = this.app.state?.currentUser?.isAdmin || this.app.state?.currentUser?.isVip;
      const isLocked = isPremium && !isPrivileged && !this.app.gamification?.state?.unlockedFeatures?.includes('advanced_meditations');
      
      return `
        <div class="meditation-card ${isLocked ? 'locked' : ''}" 
             title="${isLocked ? 'Purchase Advanced Meditations in Karma Shop to unlock' : ''}">
          ${isPremium ? '<span class="premium-badge">PREMIUM</span>' : ''}
          ${isLocked ? '<div class="lock-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>' : ''}
          
          <div class="meditation-header">
            <span class="meditation-emoji">${med.emoji}</span>
            <span class="meditation-duration">${med.duration}</span>
          </div>
          
          <h4 class="meditation-title">${med.title}</h4>
          <p class="meditation-description">${med.description}</p>

          <div class="meditation-actions">
            <button class="btn btn-secondary flex-1" onclick="window.featuresManager.engines.meditations.playAudio(${med.id})" style="display:inline-flex;align-items:center;justify-content:center;gap:0.4rem;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>
              Audio
            </button>
            <button class="btn btn-primary flex-1" onclick="window.featuresManager.engines.meditations.playVideo(${med.id})">
              ▶️ Video
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Render the floating player interface
   * @returns {string} HTML string for player
   */
  renderPlayer() {
    return `
      <div id="meditation-player-wrapper" class="player-wrapper">
        <div id="meditation-audio-player" class="compact-player hidden">
          <button onclick="window.featuresManager.engines.meditations.stopMeditation()" class="player-close-btn">✕</button>
          
          <div id="video-pane" class="video-pane hidden">
            <div id="yt-player-container"></div>
          </div>
          
          <div class="player-info">
            <div id="player-emoji" class="player-emoji"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg></div>
            <div class="player-text">
              <h4 id="player-title" class="font-bold">No Meditation Selected</h4>
              <p id="player-time" class="text-sm">0:00 / 0:00</p>
            </div>
          </div>
          
          <div class="player-controls">
            <button onclick="window.featuresManager.engines.meditations.skipBackward()" class="icon-btn" aria-label="Skip backward 10 seconds">⏪</button>
            <div class="play-pause-wrapper">
              <svg class="progress-ring" width="60" height="60">
                <circle class="progress-ring-bg" stroke-width="4" fill="transparent" r="28" cx="30" cy="30" />
                <circle id="player-progress-ring" class="progress-ring-fg" stroke-width="4" fill="transparent" r="28" cx="30" cy="30" />
              </svg>
              <button onclick="window.featuresManager.engines.meditations.togglePlay()" id="play-pause-btn" class="btn btn-primary play-pause-btn">▶️</button>
              <button onclick="window.featuresManager.engines.meditations.stopMeditation()" class="stop-btn" title="Stop">⏹️</button>
            </div>
            <button onclick="window.featuresManager.engines.meditations.skipForward()" class="icon-btn" aria-label="Skip forward 10 seconds">⏩</button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render all CSS styles for the meditation interface
   * @returns {string} CSS in style tags
   */
  renderStyles() {
    return `
      <style>
        @media (max-width: 600px) {
          .meditation-cta-grid { grid-template-columns: 1fr !important; }
        }
        /* Meditation Cards */
        .meditation-card {
          flex: 0 1 320px;
          max-width: 320px;
          background: var(--neuro-bg);
          border-radius: var(--radius-2xl);
          padding: 1.5rem;
          box-shadow: 8px 8px 16px var(--neuro-shadow-dark), -8px -8px 16px var(--neuro-shadow-light);
          position: relative;
          transition: transform 0.2s;
        }
        .meditation-card.locked { opacity: 0.75; }
        .premium-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: linear-gradient(135deg, #FFD700, #FFA500);
          color: #000;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: bold;
        }
        .lock-icon {
          position: absolute;
          top: 1rem;
          right: 1rem;
          font-size: 3rem;
          opacity: 0.3;
          z-index: 1;
        }
        .meditation-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }
        .meditation-emoji { font-size: 2rem; }
        .meditation-duration {
          font-size: 0.875rem;
          color: var(--neuro-text-light);
        }
        .meditation-title {
          font-size: 1.25rem;
          font-weight: bold;
          color: var(--neuro-text);
          margin-bottom: 0.5rem;
        }
        .meditation-description {
          font-size: 0.875rem;
          color: var(--neuro-text-light);
          margin-bottom: 0.75rem;
        }
        .meditation-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        /* Player Wrapper - Fixed positioning */
        .player-wrapper {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
          transition: none;
        }
        .compact-player {
          width: 380px;
          min-width: 380px;
          background: var(--neuro-bg);
          border-radius: var(--radius-2xl);
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          box-shadow: 20px 20px 40px var(--neuro-shadow-dark), -20px -20px 40px var(--neuro-shadow-light);
          user-select: none;
          position: relative;
          transition: opacity 0.3s, transform 0.3s;
        }
        .compact-player.hidden {
          transform: translateY(100px);
          opacity: 0;
          pointer-events: none;
        }
        .compact-player.video-mode {
          max-width: none;
          padding: 12px;
        }
        .player-close-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          width: 30px;
          height: 30px;
          border: none;
          background: none;
          cursor: pointer;
          color: var(--neuro-text-light);
          font-size: 1.2rem;
          z-index: 10;
        }
        
        /* Player Info - Draggable header */
        .player-info {
          cursor: grab;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .player-info:active { cursor: grabbing; }
        .player-emoji {
          width: 50px;
          height: 50px;
          flex-shrink: 0;
          background: var(--neuro-bg);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          box-shadow: inset 4px 4px 8px var(--neuro-shadow-dark), inset -4px -4px 8px var(--neuro-shadow-light);
        }
        .player-text #player-title {
          color: var(--neuro-text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .player-text #player-time { color: var(--neuro-text-light); }
        
        /* Player Controls */
        .player-controls {
          display: flex;
          justify-content: space-around;
          align-items: center;
          flex-shrink: 0;
        }
        .play-pause-wrapper {
          position: relative;
          width: 60px;
          height: 60px;
        }
        .play-pause-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          padding: 0;
        }
        .play-pause-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        /* Progress Ring */
        .progress-ring {
          position: absolute;
          top: 0;
          left: 0;
        }
        .progress-ring-bg { stroke: var(--neuro-shadow-dark); }
        .progress-ring-fg {
          stroke: var(--neuro-accent);
          transform: rotate(-90deg);
          transform-origin: 50% 50%;
          transition: stroke-dashoffset 0.1s linear;
        }
        .player-controls .icon-btn {
          width: 40px;
          height: 40px;
          padding: 0;
        }
        
        /* Video Pane */
        .video-pane {
          position: relative;
          width: 100%;
          flex: 1;
          min-height: 240px;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 12px;
          box-shadow: inset 4px 4px 8px var(--neuro-shadow-dark), inset -4px -4px 8px var(--neuro-shadow-light);
        }
        .video-pane #yt-player-container,
        .video-pane #yt-player-container iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .video-pane.hidden { display: none; }
        
        /* Stop Button */
        .stop-btn {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) translateX(34px);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: none;
          background: var(--neuro-bg);
          box-shadow: 2px 2px 6px var(--neuro-shadow-dark), -2px -2px 6px var(--neuro-shadow-light);
          font-size: 1.1rem;
          cursor: pointer;
          color: var(--neuro-text);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }
        .stop-btn:active {
          box-shadow: inset 2px 2px 4px var(--neuro-shadow-dark), inset -2px -2px 4px var(--neuro-shadow-light);
        }
      </style>
    `;
  }

  /**
   * Attach event listeners (currently minimal, cleanup handled in cleanup())
   */
  attachEventListeners() {
    // Note: do NOT call this.cleanup() here — it would destroy the ytPlayer
    // on every re-render (tab switch). Player lifecycle is managed by stopMeditation().
  }

  /**
   * Play meditation in audio-only mode
   * @param {number} id - Meditation ID
   */
  playAudio(id) {
    const med = this.meditations.find(m => m.id === id);
    if (!med) return;
    
    // Check premium access
    const isPrivileged = this.app.state?.currentUser?.isAdmin || this.app.state?.currentUser?.isVip;
    if (med.premium && !isPrivileged && !this.app.gamification?.state?.unlockedFeatures?.includes('advanced_meditations')) {
      this.app.showToast('Unlock Advanced Meditations in the Karma Shop!', 'info');
      return;
    }
    
    this._play(med, false);
  }

  /**
   * Play meditation with video visible
   * @param {number} id - Meditation ID
   */
  playVideo(id) {
    const med = this.meditations.find(m => m.id === id);
    if (!med) return;
    
    // Check premium access
    const isPrivileged2 = this.app.state?.currentUser?.isAdmin || this.app.state?.currentUser?.isVip;
    if (med.premium && !isPrivileged2 && !this.app.gamification?.state?.unlockedFeatures?.includes('advanced_meditations')) {
      this.app.showToast('Unlock Advanced Meditations in the Karma Shop!', 'info');
      return;
    }
    
    this._play(med, true);
  }

  /**
   * Internal method to start playing a meditation
   * @param {Object} med - Meditation object
   * @param {boolean} showVideo - Whether to show video pane
   */
  _play(med, showVideo) {
    try {
      this.currentMeditation = med;
      this.sessionStartTime = Date.now();

      // If the DOM was wiped by a re-render, the iframe YT.Player was bound to
      // no longer exists. Detect this and reset so a fresh player is created.
      if (this.ytPlayer && !document.getElementById('yt-player-container')) {
        try { this.ytPlayer.destroy(); } catch (_) {}
        this.ytPlayer = null;
      }

      // Update player UI
      const playerBox = document.getElementById('meditation-audio-player');
      document.getElementById('player-emoji').innerHTML = med.emoji;
      document.getElementById('player-title').textContent = med.title;
      playerBox.classList.remove('hidden');

      // Start YouTube player
      if (med.embedUrl) {
        this._startYouTubePlayer(med, showVideo);
      }
    } catch (error) {
      console.error('Error starting meditation:', error);
      this.app.showToast('Error starting meditation', 'error');
    }
  }

  /**
   * Initialize YouTube player with the meditation video
   * @param {Object} med - Meditation object
   * @param {boolean} showVideo - Whether to show video pane
   */
  _startYouTubePlayer(med, showVideo) {
    if (!window.ytReady || !window.YT || !window.YT.Player) {
      this.app.showToast('Initializing player\u2026 please tap again.', 'info');
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        window.ytReady = true;
        if (typeof prev === 'function') prev();
        this._startYouTubePlayer(med, showVideo);
      };
      return;
    }

    try {
      const videoId = med.embedUrl.match(/embed\/([a-zA-Z0-9_-]{11})/)[1];
      const origin = (window.location.origin && window.location.origin !== 'null')
        ? window.location.origin : undefined;

      // Show/hide video pane BEFORE YT.Player binds — iframe must be visible in DOM
      if (showVideo) {
        this._showVideoPane();
      } else {
        this._hideVideoPane();
      }

      document.getElementById('play-pause-btn').disabled = true;

      if (!this.ytPlayer || typeof this.ytPlayer.playVideo !== 'function') {
        // Destroy any stale instance
        if (this.ytPlayer && typeof this.ytPlayer.destroy === 'function') {
          try { this.ytPlayer.destroy(); } catch (_) {}
          this.ytPlayer = null;
        }

        const playerVars = { enablejsapi: 1, rel: 0, playsinline: 1 };
        if (origin) playerVars.origin = origin;

        this.ytPlayer = new YT.Player('yt-player-container', {
          videoId,
          playerVars,
          events: {
            onReady: () => {
              document.getElementById('play-pause-btn').disabled = false;
              this.ytPlayer.playVideo();
              this.app.showToast(showVideo ? 'Playing \u2013 tap pause to stop' : 'Audio playing', 'success');
            },
            onStateChange: (e) => this._handleYouTubeStateChange(e),
            onError: (e) => {
              console.error('YouTube player error:', e);
              this.app.showToast('Video error \u2013 check connection or video availability', 'error');
            }
          }
        });
      } else {
        // Reuse existing player — just swap the video
        this.ytPlayer.loadVideoById(videoId);
      }

      this._startProgressUpdates();
    } catch (error) {
      console.error('Error initializing YouTube player:', error);
      this.app.showToast('Error loading video', 'error');
    }
  }

  /**
   * Handle YouTube player state changes
   * @param {Object} event - YouTube state change event
   */
  _handleYouTubeStateChange(event) {
    const eng = window.featuresManager.engines.meditations;
    
    if (event.data === YT.PlayerState.ENDED && eng.currentMeditation) {
      eng.onMeditationComplete();
    }
    
    if (event.data === YT.PlayerState.PLAYING) {
      eng.isPlaying = true;
      document.getElementById('play-pause-btn').textContent = '⏸️';
    }
    
    if (event.data === YT.PlayerState.PAUSED) {
      eng.isPlaying = false;
      document.getElementById('play-pause-btn').textContent = '▶️';
    }
  }

  /**
   * Start interval for updating progress display
   */
  _startProgressUpdates() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
    
    this.progressInterval = setInterval(() => {
      if (this.isPlaying) {
        this.updateProgress();
      }
    }, this.PROGRESS_UPDATE_MS);
  }

  /**
   * Show video pane and enable drag
   */
  _showVideoPane() {
    document.getElementById('video-pane').classList.remove('hidden');
    document.getElementById('meditation-audio-player').classList.add('video-mode');
    this.initDrag();
  }

  /**
   * Hide video pane
   */
  _hideVideoPane() {
    document.getElementById('video-pane').classList.add('hidden');
    document.getElementById('meditation-audio-player').classList.remove('video-mode');
  }

  /**
   * Initialize drag functionality for player
   */
  initDrag() {
    const header = document.querySelector('.player-info');
    const wrap = document.getElementById('meditation-player-wrapper');
    if (!header || !wrap) return;

    let px, py, dx, dy;

    const start = (e) => {
      px = e.touches ? e.touches[0].clientX : e.clientX;
      py = e.touches ? e.touches[0].clientY : e.clientY;
      const rect = wrap.getBoundingClientRect();
      dx = px - rect.left;
      dy = py - rect.top;
      
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', end);
      document.addEventListener('touchmove', move, { passive: false });
      document.addEventListener('touchend', end, { passive: true });
      e.preventDefault();
    };

    const move = (e) => {
      const cx = (e.touches ? e.touches[0].clientX : e.clientX) - dx;
      const cy = (e.touches ? e.touches[0].clientY : e.clientY) - dy;
      wrap.style.left = cx + 'px';
      wrap.style.top = cy + 'px';
      wrap.style.bottom = 'auto';
      wrap.style.right = 'auto';
    };

    const end = () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', end);
      document.removeEventListener('touchmove', move);
      document.removeEventListener('touchend', end);
    };

    header.addEventListener('mousedown', start);
    header.addEventListener('touchstart', start, { passive: false });

    // Track cleanup
    this.eventCleanup.push(() => {
      header.removeEventListener('mousedown', start);
      header.removeEventListener('touchstart', start);
    });
  }

  /**
   * Toggle play/pause state
   */
  togglePlay() {
    if (!this.currentMeditation) return;

    if (this.ytPlayer && typeof this.ytPlayer.playVideo === 'function') {
      try {
        if (this.isPlaying) {
          this.ytPlayer.pauseVideo();
        } else {
          this.ytPlayer.playVideo();
        }
      } catch (error) {
        console.error('Error toggling playback:', error);
        this.app.showToast('Player not ready', 'info');
      }
    }
  }

  /**
   * Stop meditation and cleanup
   */
  stopMeditation() {
    try {
      this.isPlaying = false;
      this.currentMeditation = null;
      this.sessionStartTime = null;

      if (this.progressInterval) {
        clearInterval(this.progressInterval);
        this.progressInterval = null;
      }

      // Destroy the YT player fully — stops all telemetry pings
      if (this.ytPlayer && typeof this.ytPlayer.destroy === 'function') {
        try { this.ytPlayer.destroy(); } catch (_) {}
        this.ytPlayer = null;
      }

      // Reset the container so a fresh player can be created next time
      const container = document.getElementById('yt-player-container');
      if (container) container.innerHTML = '';

      const btn = document.getElementById('play-pause-btn');
      if (btn) btn.textContent = '\u25b6\ufe0f';
      const playerBox = document.getElementById('meditation-audio-player');
      if (playerBox) playerBox.classList.add('hidden');
      this._hideVideoPane();
    } catch (error) {
      console.error('Error stopping meditation:', error);
    }
  }

  /**
   * Skip forward in meditation
   */
  skipForward() {
    if (!this.ytPlayer || typeof this.ytPlayer.getCurrentTime !== 'function') return;
    
    try {
      const current = this.ytPlayer.getCurrentTime() || 0;
      const duration = this.ytPlayer.getDuration() || 0;
      const newTime = Math.min(current + this.SKIP_SECONDS, duration);
      this.ytPlayer.seekTo(newTime, true);
    } catch (error) {
      console.error('Error skipping forward:', error);
    }
  }

  /**
   * Skip backward in meditation
   */
  skipBackward() {
    if (!this.ytPlayer || typeof this.ytPlayer.getCurrentTime !== 'function') return;
    
    try {
      const current = this.ytPlayer.getCurrentTime() || 0;
      const newTime = Math.max(current - this.SKIP_SECONDS, 0);
      this.ytPlayer.seekTo(newTime, true);
    } catch (error) {
      console.error('Error skipping backward:', error);
    }
  }

  /**
   * Update progress display
   */
  updateProgress() {
    if (!this.ytPlayer || typeof this.ytPlayer.getCurrentTime !== 'function') return;
    
    try {
      const current = this.ytPlayer.getCurrentTime() || 0;
      const duration = this.ytPlayer.getDuration() || 0;
      
      if (duration > 0) {
        document.getElementById('player-time').textContent = 
          `${this.formatTime(current)} / ${this.formatTime(duration)}`;
        this.updateRing(current, duration);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  }

  /**
   * Update circular progress ring
   * @param {number} current - Current time in seconds
   * @param {number} duration - Total duration in seconds
   */
  updateRing(current, duration) {
    const ring = document.getElementById('player-progress-ring');
    if (!ring || !duration || duration === 0) return;
    
    try {
      const r = ring.r.baseVal.value;
      const circumference = 2 * Math.PI * r;
      ring.style.strokeDasharray = `${circumference} ${circumference}`;
      
      const progress = current / duration;
      const offset = circumference - (progress * circumference);
      ring.style.strokeDashoffset = isNaN(offset) ? circumference : offset;
    } catch (error) {
      console.error('Error updating ring:', error);
    }
  }

  /**
   * Handle meditation completion - save session and grant rewards
   */
  onMeditationComplete() {
    try {
      this.isPlaying = false;
      document.getElementById('play-pause-btn').textContent = '▶️';
      this.app.showToast('Meditation complete! Well done.', 'success');
      
      if (!this.currentMeditation) return;

      // Calculate duration in minutes — use a minimum of 1 min if player hasn't
      // reported a full duration yet (e.g. mid-session completion or non-YouTube)
      const rawDuration = this.ytPlayer
        ? Math.floor((this.ytPlayer.getDuration() || 0) / 60)
        : 0;
      const duration = Math.max(rawDuration, 1);

      const chakra = this.getChakraFromMeditation(this.currentMeditation.category);

      // Create session data
      const sessionData = {
        type: this.currentMeditation.type || 'guided',
        meditationId: this.currentMeditation.id,
        title: this.currentMeditation.title,
        category: this.currentMeditation.category,
        duration: duration,
        chakra: chakra,
        timestamp: new Date().toISOString(),
        sessionStartTime: this.sessionStartTime,
        completedAt: Date.now()
      };

      // Save to state — this triggers handleMeditationGamification in AppState which
      // awards XP (duration-based), progresses daily/weekly/monthly quests, updates
      // streak, chakra, and badges. Do NOT also call progressQuest here — double-count.
      if (this.app.state) {
        this.app.state.addEntry('meditation', sessionData);
      }

      // Check for badge milestones
      this.checkAchievements();
      this.sessionStartTime = null;
    } catch (error) {
      console.error('Error completing meditation:', error);
    }
  }

  /**
   * Check and grant meditation badges based on total sessions completed
   */
  checkAchievements() {
    try {
      // Use the engine's own counter (totalWellnessRuns tracks via incrementWellnessRuns,
      // but meditation sessions are tracked separately via meditationHistory length)
      const total = (this.app.state?.data?.meditationHistory || []).length;
      const gm = this.app.gamification;
      if (!gm) return;

      // Map milestones to existing badge definitions in GamificationEngine
      const badges = gm.getBadgeDefinitions();
      if (total >= 1)   gm.checkAndGrantBadge('first_meditation',    badges);
      if (total >= 20)  gm.checkAndGrantBadge('meditation_devotee',  badges);
      if (total >= 60)  gm.checkAndGrantBadge('meditation_master',   badges);
      if (total >= 100) gm.checkAndGrantBadge('meditation_100',      badges);
      if (total >= 200) gm.checkAndGrantBadge('meditation_200',      badges);
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  }

  /**
   * Map meditation category to chakra
   * @param {string} category - Meditation category
   * @returns {string|null} Chakra name or null
   */
  getChakraFromMeditation(category) {
    const mapping = {
      Grounding: 'root',
      Energy: 'sacral',
      Chakras: 'heart',
      Spiritual: 'crown',
      Healing: 'heart',
      Manifestation: 'solar',
      Premium: 'crown'
    };
    return mapping[category] || null;
  }

  /**
   * Format seconds to MM:SS
   * @param {number} seconds - Time in seconds
   * @returns {string} Formatted time string
   */
  formatTime(seconds) {
    if (!seconds || isNaN(seconds) || seconds < 0) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Open PDF meditation guide in new tab
   */
  openPDFGuide() {
    if (this.pdfGuideUrl && this.pdfGuideUrl !== 'YOUR_PDF_URL_HERE') {
      window.open(this.pdfGuideUrl, '_blank');
    } else {
      this.app.showToast('PDF Guide is not yet available.', 'info');
    }
  }

  /**
   * Destroy alias for FeaturesManager lifecycle compatibility
   */
  destroy() {
    this.cleanup();
  }

  /**
   * Cleanup resources and event listeners
   */
  cleanup() {
    try {
      // Clear interval
      if (this.progressInterval) {
        clearInterval(this.progressInterval);
        this.progressInterval = null;
      }

      // Remove tracked event listeners
      this.eventCleanup.forEach(cleanup => cleanup());
      this.eventCleanup = [];

      // Destroy YouTube player and clear its container to stop all telemetry pings
      if (this.ytPlayer && typeof this.ytPlayer.destroy === 'function') {
        try { this.ytPlayer.destroy(); } catch (_) {}
        this.ytPlayer = null;
      }
      const container = document.getElementById('yt-player-container');
      if (container) container.innerHTML = '';

      // Reset state
      this.isPlaying = false;
      this.currentMeditation = null;
      this.sessionStartTime = null;
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
}

// Export for browser and module environments
if (typeof window !== 'undefined') {
  window.MeditationsEngine = MeditationsEngine;
}

export default MeditationsEngine;