/**
 * LUNAR-UI.JS v3.0
 * UI rendering singleton for all lunar phase rooms.
 *
 * KEY CHANGES v3:
 * - injectStyles: cssPrefix param removed (was never used in the CSS output)
 * - Added .lunar-affirmation-grid and .lunar-helper-text classes (used by lunar-config.js v3)
 * - Word cloud: font size and color now deterministic per-index (no Math.random → stable SSR/re-render)
 * - renderWordCloud: uses modular color/size instead of random for consistent re-renders
 * - Minor CSS dedup: consolidated duplicate color values into comments
 */

const LunarUI = {

    CONSTANTS: {
        DEFAULT_STAR_COUNT: 50,
        AVATAR_MAX_DISPLAY: 5,
        AVATAR_COLORS:      ['#8B7AFF', '#FF9B71', '#71E8FF', '#FFD371', '#FF71B4'],
        AVATAR_INITIALS:    ['L', 'S', 'N', 'A', 'M'],
        WORD_CLOUD_COLORS:  ['#8B7AFF', '#FF9B71', '#71E8FF', '#FFD371', '#FF71B4', '#71ffaa'],
        WORD_CLOUD_SIZES:   [1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 1.3, 1.1, 1.5, 1.7] // cycles
    },

    _stylesInjected: false,

    // ── Starfield ────────────────────────────────────────────────────────────────

    generateStarfield(count = LunarUI.CONSTANTS.DEFAULT_STAR_COUNT) {
        const stars = [];
        for (let i = 0; i < count; i++) {
            stars.push(
                `<div class="lunar-star" style="left:${Math.random()*100}%;top:${Math.random()*100}%;` +
                `animation-delay:${(Math.random()*3).toFixed(2)}s;opacity:${(Math.random()*0.5+0.3).toFixed(2)};"></div>`
            );
        }
        return stars.join('');
    },

    // ── Component renderers ──────────────────────────────────────────────────────

    renderTopBar({ emoji, name, daysText, livingPresenceCount, cssPrefix }) {
        return `
            <div class="${cssPrefix}-top-bar lunar-top-bar">
                <div class="${cssPrefix}-phase-left lunar-phase-left">
                    <div class="${cssPrefix}-moon-icon lunar-moon-icon-large">${emoji}</div>
                    <div class="${cssPrefix}-phase-info lunar-phase-info">
                        <h2>${name}</h2>
                        <p>${daysText}</p>
                    </div>
                </div>
                <div class="${cssPrefix}-live-count-top lunar-live-count-top">
                    <div class="lunar-pulse-dot"></div>
                    <span id="lunarLiveCountTop">${livingPresenceCount} members practicing with you now</span>
                </div>
                <button type="button" data-action="back-to-hub" class="lunar-back-hub-btn" aria-label="Leave practice and return to hub">
                    Gently Leave
                </button>
            </div>`;
    },

    renderMoonVisual({ cssPrefix, sphereClass, glowClass }) {
        return `
            <div class="${cssPrefix}-moon-visual lunar-moon-visual">
                <div class="${glowClass} lunar-moon-glow">
                    <div class="${sphereClass} lunar-moon-sphere"></div>
                </div>
            </div>`;
    },

    renderIntroCard({ imageUrl, description }) {
        return `
            <div class="lunar-intro-card">
                <picture>
                  <source srcset="${imageUrl}" type="image/webp">
                  <img src="${imageUrl.replace('.webp', '.png')}" alt="Moon Phase" width="400" height="400" class="lunar-intro-image" loading="lazy" decoding="async">
                </picture>
                <p>${description}</p>
            </div>`;
    },

    renderModeToggle({ cssPrefix }) {
        return `
            <div class="${cssPrefix}-mode-toggle lunar-mode-toggle">
                <button type="button" class="lunar-mode-btn active" data-mode="solo" data-action="switch-mode" aria-pressed="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                    <span>Solo Practice</span>
                </button>
                <button type="button" class="lunar-mode-btn" data-mode="group" data-action="switch-mode" aria-pressed="false">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    <span>Group Circle</span>
                </button>
            </div>`;
    },

    renderMockAvatars(count) {
        const { AVATAR_MAX_DISPLAY, AVATAR_COLORS, AVATAR_INITIALS } = LunarUI.CONSTANTS;
        const shown = Math.min(count, AVATAR_MAX_DISPLAY);
        const html = Array.from({ length: shown }, (_, i) =>
            `<div class="lunar-avatar" style="background-color:${AVATAR_COLORS[i]};animation-delay:${i*0.1}s;"
                  aria-label="Member ${AVATAR_INITIALS[i]}">${AVATAR_INITIALS[i]}</div>`
        ).join('');
        return html + `<div class="lunar-avatar lunar-join-avatar" role="button" tabindex="0" aria-label="Join circle" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}"><span aria-hidden="true">+</span></div>`;
    },

    /** Deterministic rendering: same word list always produces same visual output. */
    renderWordCloud(words) {
        if (!Array.isArray(words) || !words.length) return '<p style="color:rgba(224,224,255,0.6);">No words yet</p>';
        const { WORD_CLOUD_COLORS: COLORS, WORD_CLOUD_SIZES: SIZES } = LunarUI.CONSTANTS;
        return words.map((item, i) =>
            `<div class="lunar-word-cloud-item"
                  style="font-size:${SIZES[i % SIZES.length]}rem;color:${COLORS[i % COLORS.length]};animation-delay:${(i*0.1).toFixed(1)}s;"
                  aria-label="Intention: ${item.word}">${item.word}</div>`
        ).join('');
    },

    renderWisdomText(quote) {
        return `<div class="lunar-wisdom-text">"${quote}"</div>`;
    },

    // ── Popup factory ────────────────────────────────────────────────────────────

    createPopup({ icon, title, subtitle, content, cssPrefix, hasFooter = true }) {
        const popup = document.createElement('div');
        popup.className = `lunar-practice-popup ${cssPrefix}-practice-popup`;
        popup.setAttribute('role', 'dialog');
        popup.setAttribute('aria-modal', 'true');
        popup.setAttribute('aria-labelledby', 'popup-title');
        popup.setAttribute('aria-describedby', 'popup-subtitle');

        popup.innerHTML = `
            <div class="lunar-popup-content ${cssPrefix}-popup-content">
                <button type="button" class="lunar-popup-close" data-action="close-popup" aria-label="Close">✕</button>
                <div class="lunar-popup-header">
                    <div class="lunar-popup-icon" aria-hidden="true">${icon}</div>
                    <div class="lunar-popup-title">
                        <h2 id="popup-title">${title}</h2>
                        <p class="lunar-popup-subtitle" id="popup-subtitle">${subtitle}</p>
                    </div>
                </div>
                <div class="lunar-popup-body" id="collectiveIntentionContent">${content}</div>
                ${hasFooter ? `<div class="lunar-popup-footer"><button type="button" class="lunar-popup-btn" data-action="close-popup" aria-label="Close practice">Close Practice</button></div>` : ''}
            </div>`;
        return popup;
    },

    // ── Styles ───────────────────────────────────────────────────────────────────

    injectStyles() {
        if (this._stylesInjected) return;
        // Remove any stale version before injecting updated styles
        document.getElementById('lunar-shared-styles-v4')?.remove();
        const old = document.getElementById('lunar-shared-styles');
        if (old) old.remove();
        const style = document.createElement('style');
        style.id = 'lunar-shared-styles-v4';
        style.textContent = this._getSharedCSS();
        document.head.appendChild(style);
        this._stylesInjected = true;
    },

    _getSharedCSS() {
        return `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&display=swap');

/* ── Layout ──────────────────────────────────────────────────────────────── */
.lunar-room-bg{min-height:100vh;width:100%;background:transparent;position:relative;overflow-x:clip;}
.lunar-content-wrapper{position:relative;z-index:5;max-width:1200px;margin:0 auto;padding-top:6rem;}

/* ── Starfield ───────────────────────────────────────────────────────────── */
.lunar-starfield{position:fixed;inset:0;pointer-events:none;z-index:0;}
.lunar-star{position:absolute;width:2px;height:2px;background:#fff;border-radius:50%;animation:lunar-twinkle 3s infinite;}
@keyframes lunar-twinkle{0%,100%{opacity:.3}50%{opacity:1}}

/* ── Top bar ─────────────────────────────────────────────────────────────── */
.lunar-top-bar{position:relative;z-index:10;display:flex;align-items:center;justify-content:space-between;
    padding:1.5rem 2rem;background:rgba(10,10,26,.85);backdrop-filter:blur(12px);
    border-bottom:1px solid rgba(255,255,255,.08);}
.lunar-phase-left{display:flex;align-items:center;gap:1.5rem;}
.lunar-moon-icon-large{font-size:3rem;filter:drop-shadow(0 0 10px rgba(255,255,255,.3));}
.lunar-phase-info h2{margin:0;font-size:1.5rem;color:#e0e0ff;font-family:'Cormorant Garamond',serif;}
.lunar-phase-info p{margin:.5rem 0 0;color:rgba(224,224,255,.7);font-size:.95rem;}
.lunar-live-count-top{display:flex;align-items:center;gap:.75rem;padding:.75rem 1.5rem;
    background:rgba(139,122,255,.15);border-radius:50px;border:1px solid rgba(139,122,255,.3);}
.lunar-live-count-top span{color:rgba(224,224,255,.9);font-size:.95rem;font-weight:500;}
.lunar-pulse-dot{width:8px;height:8px;background:#8B7AFF;border-radius:50%;animation:lunar-pulse 2s infinite;}
@keyframes lunar-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.2)}}
.lunar-back-hub-btn{padding:.75rem 1.75rem;
    background:linear-gradient(135deg,rgba(139,122,255,.3),rgba(107,95,216,.4));
    border:1px solid rgba(139,122,255,.45);border-radius:50px;
    color:#e0e0ff;font-size:.9rem;font-family:'Cormorant Garamond',serif;font-style:italic;
    letter-spacing:.05em;cursor:pointer;transition:all .35s;
    box-shadow:0 0 24px rgba(139,122,255,.15),inset 0 0 12px rgba(139,122,255,.08);}
.lunar-back-hub-btn:hover{border-color:rgba(139,122,255,.7);color:#fff;
    box-shadow:0 0 40px rgba(139,122,255,.3),inset 0 0 16px rgba(139,122,255,.12);transform:translateY(-2px);}

/* ── Moon visual ─────────────────────────────────────────────────────────── */
.lunar-moon-visual{display:flex;justify-content:center;margin:3rem 0;}
.lunar-moon-glow{position:relative;width:220px;height:220px;border-radius:50%;display:flex;align-items:center;justify-content:center;}
.lunar-moon-sphere{position:relative;width:160px;height:160px;border-radius:50%;animation:lunar-float 6s ease-in-out infinite;overflow:hidden;}

.lunar-moon-glow::after{content:'';position:absolute;inset:-20px;border-radius:50%;animation:lunar-glow-pulse 4s ease-in-out infinite;pointer-events:none;}

@keyframes lunar-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes lunar-glow-pulse{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:1;transform:scale(1.08)}}

/* ── NEW MOON 🌑 ─────────────────────────────────────────────────────────── */
.newmoon-moon-sphere{
    background:radial-gradient(circle at 38% 38%, #1a1a2e 60%, #0d0d1a 100%);
    box-shadow:inset -6px -6px 18px rgba(255,255,255,.08), inset 4px 4px 12px rgba(255,255,255,.04);
}
.newmoon-moon-glow::after{background:radial-gradient(circle,rgba(100,100,180,.25) 0%,transparent 70%);}

/* ── WAXING MOON 🌓 ──────────────────────────────────────────────────────── */
.waxingmoon-moon-sphere{
    background:radial-gradient(circle at 65% 40%, #f0e8d0 0%, #d4c9a8 40%, #b8ad8c 70%, #9a9278 100%);
    box-shadow:0 0 40px rgba(210,195,150,.35), 0 0 80px rgba(210,195,150,.15);
}
.waxingmoon-moon-sphere::before{
    content:'';position:absolute;inset:0;border-radius:50%;
    background:radial-gradient(ellipse 120% 100% at 15% 50%, #0a0a1a 45%, transparent 70%);
}
.waxingmoon-moon-glow::after{background:radial-gradient(circle,rgba(210,195,150,.4) 0%,transparent 65%);}

/* ── FULL MOON 🌕 ────────────────────────────────────────────────────────── */
.fullmoon-moon-sphere{
    background:
        radial-gradient(circle at 38% 32%, rgba(0,0,0,.07) 0%, transparent 18%),
        radial-gradient(circle at 62% 55%, rgba(0,0,0,.05) 0%, transparent 12%),
        radial-gradient(circle at 48% 68%, rgba(0,0,0,.04) 0%, transparent 10%),
        radial-gradient(circle at 62% 38%, #ffffff 0%, #f5f0e0 35%, #e8dfc0 65%, #d4c9a0 100%);
    box-shadow:0 0 50px rgba(255,245,200,.6), 0 0 100px rgba(255,245,200,.3), 0 0 160px rgba(255,245,200,.1);
}
.fullmoon-moon-glow::after{background:radial-gradient(circle,rgba(255,245,200,.55) 0%,transparent 65%);}

/* ── WANING MOON 🌗 ──────────────────────────────────────────────────────── */
.waningmoon-moon-sphere{
    background:radial-gradient(circle at 35% 40%, #e8dfc0 0%, #c8bd9c 40%, #a8a07c 70%, #8a8260 100%);
    box-shadow:0 0 40px rgba(190,180,130,.3), 0 0 80px rgba(190,180,130,.12);
}
.waningmoon-moon-sphere::before{
    content:'';position:absolute;inset:0;border-radius:50%;
    background:radial-gradient(ellipse 120% 100% at 85% 50%, #0a0a1a 45%, transparent 70%);
}
.waningmoon-moon-glow::after{background:radial-gradient(circle,rgba(190,180,130,.35) 0%,transparent 65%);}


/* ── Intro card ──────────────────────────────────────────────────────────── */
.lunar-intro-card{text-align:center;margin:2rem 0;}
.lunar-intro-image{width:100%;max-width:500px;height:auto;margin:0 auto 1.5rem;display:block;filter:invert(1);}
.lunar-intro-card p{color:rgba(224,224,255,.8);font-size:1.1rem;line-height:1.8;max-width:600px;
    margin:0 auto;font-family:'Cormorant Garamond',serif;}

/* ── Mode toggle ─────────────────────────────────────────────────────────── */
.lunar-mode-toggle{display:flex;gap:.5rem;margin:2rem 0;justify-content:center;
    background:rgba(0,0,0,.25);border:1px solid rgba(255,255,255,.07);border-radius:50px;padding:.35rem;}
.lunar-mode-btn{display:flex;align-items:center;gap:.6rem;padding:.75rem 2rem;
    background:transparent;border:none;border-radius:50px;
    color:rgba(224,224,255,.45);font-size:.9rem;font-family:'Cormorant Garamond',serif;
    font-style:italic;letter-spacing:.04em;cursor:pointer;transition:all .35s;}
.lunar-mode-btn:hover{color:rgba(224,224,255,.75);}
.lunar-mode-btn.active{
    background:linear-gradient(135deg,rgba(139,122,255,.3),rgba(107,95,216,.4));
    border:1px solid rgba(139,122,255,.45);color:#e0e0ff;
    box-shadow:0 0 24px rgba(139,122,255,.15),inset 0 0 12px rgba(139,122,255,.08);}
.lunar-mode-btn svg{flex-shrink:0;opacity:.7;}
.lunar-mode-btn.active svg{opacity:1;}

/* ── Practice modes ──────────────────────────────────────────────────────── */
.lunar-practice-mode{display:none;animation:lunar-fade-in .5s ease-out;}
.lunar-practice-mode.active{display:block;}
.lunar-mode-description{text-align:center;margin:2rem 0 3rem;}
.lunar-mode-description h3{color:#e0e0ff;font-size:1.8rem;font-family:'Cormorant Garamond',serif;margin-bottom:.5rem;}
.lunar-mode-description p{color:rgba(224,224,255,.7);font-size:1.1rem;line-height:1.6;}

/* ── Practice grid ───────────────────────────────────────────────────────── */
.lunar-practices-section{margin:3rem 0;}
.lunar-practices-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;margin-top:2rem;}
.lunar-practice-card{background:rgba(0,0,0,.3);border-radius:16px;padding:2rem;
    border:1px solid rgba(255,255,255,.1);cursor:pointer;transition:all .3s;position:relative;overflow:hidden;}
.lunar-practice-card:hover{transform:translateY(-5px);border-color:rgba(139,122,255,.5);
    background:rgba(139,122,255,.1);box-shadow:0 10px 30px rgba(139,122,255,.2);}
.lunar-practice-card:focus{outline:2px solid rgba(139,122,255,.6);outline-offset:2px;}
.lunar-practice-card.locked{opacity:.6;cursor:default;}
.lunar-practice-card.locked:hover{transform:none;border-color:rgba(255,255,255,.1);background:rgba(0,0,0,.3);box-shadow:none;}
.lunar-practice-icon{font-size:2.5rem;margin-bottom:1rem;display:flex;align-items:center;justify-content:center;}
.lunar-practice-icon svg{width:40px;height:40px;}
.lunar-practice-info h4{color:#e0e0ff;font-size:1.2rem;margin:0 0 .75rem;font-family:'Cormorant Garamond',serif;}
.lunar-practice-info p{color:rgba(224,224,255,.7);font-size:.95rem;line-height:1.6;margin:0;}
.lunar-lock-badge{position:absolute;top:1rem;right:1rem;background:rgba(34,197,94,.2);color:#22c55e;
    padding:.5rem 1rem;border-radius:20px;font-size:.85rem;font-weight:600;border:1px solid rgba(34,197,94,.3);}

/* ── Saved inputs ────────────────────────────────────────────────────────── */
.lunar-saved-inputs{background:rgba(0,0,0,.3);border-radius:16px;padding:2rem;margin:2rem 0;
    border:1px solid rgba(139,122,255,.3);}
.lunar-saved-inputs h3{color:#e0e0ff;font-family:'Cormorant Garamond',serif;font-size:1.5rem;margin:0 0 1.5rem;text-align:center;}
.lunar-saved-item{margin:1.5rem 0;padding:1.5rem;background:rgba(255,255,255,.03);
    border-radius:12px;border-left:3px solid rgba(139,122,255,.5);}
.lunar-saved-label{color:rgba(139,122,255,.8);font-size:.9rem;font-weight:600;text-transform:uppercase;letter-spacing:1px;margin-bottom:.75rem;}
.lunar-saved-text{color:rgba(224,224,255,.9);font-size:1.1rem;line-height:1.6;font-family:'Cormorant Garamond',serif;}
.lunar-saved-footer{text-align:center;margin-top:1.5rem;padding-top:1.5rem;border-top:1px solid rgba(255,255,255,.1);
    color:rgba(224,224,255,.6);font-size:.9rem;font-style:italic;}

/* ── Group circle ────────────────────────────────────────────────────────── */
.lunar-group-intro{background:rgba(0,0,0,.3);border-radius:20px;padding:3rem;text-align:center;margin:2rem 0;border:1px solid rgba(255,255,255,.1);}
.lunar-group-intro h3{color:#e0e0ff;font-family:'Cormorant Garamond',serif;font-size:2rem;margin:0 0 1rem;}
.lunar-group-intro p{color:rgba(224,224,255,.8);font-size:1.1rem;line-height:1.8;max-width:600px;margin:0 auto 2rem;}
.lunar-live-presence{display:inline-flex;align-items:center;gap:.75rem;padding:.75rem 1.5rem;
    background:rgba(139,122,255,.15);border-radius:50px;border:1px solid rgba(139,122,255,.3);margin:1.5rem 0;}
.lunar-live-presence span{color:rgba(224,224,255,.9);font-size:.95rem;font-weight:500;}
.lunar-group-avatars{display:flex;justify-content:center;margin:2rem 0;}
.lunar-avatar{width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;
    color:#fff;font-weight:600;font-size:1.1rem;border:3px solid rgba(0,0,0,.5);margin-left:-12px;animation:lunar-fade-in .5s ease-out backwards;}
.lunar-avatar:first-child{margin-left:0;}
.lunar-join-avatar{background:rgba(139,122,255,.3);border-color:rgba(139,122,255,.5);cursor:pointer;transition:all .3s;}
.lunar-join-avatar:hover{transform:scale(1.1);background:rgba(139,122,255,.5);}
.lunar-join-circle-btn{margin-top:2rem;padding:1rem 3rem;
    background:linear-gradient(135deg,rgba(139,122,255,.3),rgba(107,95,216,.4));
    border:1px solid rgba(139,122,255,.45);border-radius:50px;
    color:#e0e0ff;font-size:1.05rem;font-family:'Cormorant Garamond',serif;font-style:italic;
    letter-spacing:.05em;cursor:pointer;transition:all .35s;
    box-shadow:0 0 24px rgba(139,122,255,.15),inset 0 0 12px rgba(139,122,255,.08);}
.lunar-join-circle-btn:hover{border-color:rgba(139,122,255,.7);color:#fff;
    box-shadow:0 0 40px rgba(139,122,255,.3),inset 0 0 16px rgba(139,122,255,.12);transform:translateY(-2px);}

/* ── Closure ─────────────────────────────────────────────────────────────── */
.lunar-closure-section{background:rgba(0,0,0,.3);border-radius:16px;padding:2.5rem;margin:3rem 0;border:1px solid rgba(255,255,255,.1);}
.lunar-closure-section h3{color:#e0e0ff;font-family:'Cormorant Garamond',serif;font-size:1.8rem;margin:0 0 1rem;text-align:center;}
.lunar-closure-section p{color:rgba(224,224,255,.8);font-size:1.1rem;line-height:1.6;text-align:center;margin-bottom:2rem;}

/* ── Wisdom ──────────────────────────────────────────────────────────────── */
.lunar-wisdom-section{margin:3rem 0;}
.lunar-wisdom-text{background:linear-gradient(135deg,rgba(139,122,255,.15),rgba(107,95,216,.15));
    border-left:4px solid rgba(139,122,255,.6);padding:2rem 2.5rem;border-radius:12px;
    color:rgba(224,224,255,.9);font-size:1.3rem;font-style:italic;font-family:'Cormorant Garamond',serif;
    line-height:1.8;text-align:center;}

/* ── Popup ───────────────────────────────────────────────────────────────── */
.lunar-practice-popup{position:fixed;inset:0;background:rgba(0,0,0,.8);backdrop-filter:blur(10px);
    z-index:999999;display:flex;align-items:center;justify-content:center;padding:2rem;animation:lunar-fade-in .3s ease-out;}
.lunar-popup-content{background:linear-gradient(135deg,rgba(26,26,46,.95),rgba(15,15,30,.95));
    border-radius:24px;max-width:700px;width:100%;max-height:90vh;overflow-y:auto;
    border:1px solid rgba(139,122,255,.3);box-shadow:0 20px 60px rgba(0,0,0,.5);
    animation:lunar-fade-in-up .4s ease-out;position:relative;}
.lunar-popup-close{position:absolute;top:1.5rem;right:1.5rem;background:rgba(255,255,255,.1);border:none;
    width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;
    color:rgba(224,224,255,.8);font-size:1.5rem;cursor:pointer;transition:all .3s;z-index:10;}
.lunar-popup-close:hover{background:rgba(255,255,255,.2);transform:rotate(90deg);}
.lunar-popup-header{padding:2.5rem;border-bottom:1px solid rgba(255,255,255,.1);display:flex;align-items:center;gap:1.5rem;}
.lunar-popup-icon{font-size:3rem;flex-shrink:0;}
.lunar-popup-icon svg{width:48px;height:48px;color:#8B7AFF;}
.lunar-popup-title h2{margin:0;color:#e0e0ff;font-family:'Cormorant Garamond',serif;font-size:1.8rem;}
.lunar-popup-subtitle{margin:.5rem 0 0;color:rgba(224,224,255,.7);font-size:1rem;}
.lunar-popup-body{padding:2.5rem;}
.lunar-popup-section{margin-bottom:2rem;}
.lunar-popup-section:last-child{margin-bottom:0;}
.lunar-popup-section h3{color:#e0e0ff;font-family:'Cormorant Garamond',serif;font-size:1.5rem;margin:0 0 1rem;}
.lunar-popup-section h4{color:#e0e0ff;font-size:1.2rem;margin:0 0 .75rem;}
.lunar-popup-section p{color:rgba(224,224,255,.8);line-height:1.8;margin:.75rem 0;}
.lunar-popup-section ul,.lunar-popup-section ol{color:rgba(224,224,255,.8);line-height:2;padding-left:1.5rem;margin:1rem 0;}
.lunar-popup-section li{margin:.5rem 0;font-size:1.05rem;}
.lunar-popup-highlight{background:rgba(139,122,255,.15);border-left:3px solid rgba(139,122,255,.6);
    padding:1rem 1.5rem;border-radius:8px;margin:1.5rem 0;}
.lunar-popup-highlight p{margin:0;font-style:italic;color:rgba(224,224,255,.9);}
.lunar-popup-footer{margin-top:2rem;padding-top:1.5rem;border-top:1px solid rgba(255,255,255,.1);}

/* ── Buttons ─────────────────────────────────────────────────────────────── */
.lunar-popup-btn{width:100%;padding:1rem 1.5rem;
    background:linear-gradient(135deg,rgba(139,122,255,.3),rgba(107,95,216,.4));
    border:1px solid rgba(139,122,255,.45);border-radius:50px;
    color:#e0e0ff;font-size:1rem;font-family:'Cormorant Garamond',serif;font-style:italic;
    letter-spacing:.05em;cursor:pointer;transition:all .35s;
    box-shadow:0 0 24px rgba(139,122,255,.15),inset 0 0 12px rgba(139,122,255,.08);}
.lunar-popup-btn:hover{border-color:rgba(139,122,255,.7);color:#fff;transform:translateY(-2px);
    box-shadow:0 0 40px rgba(139,122,255,.3),inset 0 0 16px rgba(139,122,255,.12);}
.lunar-popup-btn:disabled{opacity:.3;cursor:not-allowed;transform:none;box-shadow:none;}
.lunar-btn-secondary{
    background:linear-gradient(135deg,rgba(255,255,255,.06),rgba(255,255,255,.03));
    border:1px solid rgba(255,255,255,.15);color:rgba(224,224,255,.6);
    box-shadow:none;margin-top:.75rem;}
.lunar-btn-secondary:hover{border-color:rgba(255,255,255,.3);color:#e0e0ff;
    background:linear-gradient(135deg,rgba(255,255,255,.1),rgba(255,255,255,.06));
    box-shadow:none;transform:translateY(-1px);}
.lunar-btn-success{
    background:linear-gradient(135deg,rgba(113,255,170,.25),rgba(95,216,158,.35));
    border:1px solid rgba(113,255,170,.45);color:#a0ffd0;
    box-shadow:0 0 24px rgba(113,255,170,.1),inset 0 0 12px rgba(113,255,170,.06);}
.lunar-btn-success:hover{border-color:rgba(113,255,170,.7);color:#d0fff0;transform:translateY(-2px);
    box-shadow:0 0 40px rgba(113,255,170,.25),inset 0 0 16px rgba(113,255,170,.1);}

/* ── Forms ───────────────────────────────────────────────────────────────── */
.lunar-textarea-large{width:100%;min-height:150px;background:rgba(0,0,0,.3);border:1px solid rgba(255,255,255,.1);
    border-radius:12px;padding:1.5rem;color:#e0e0ff;font-family:inherit;font-size:1.1rem;
    line-height:1.6;margin:1.5rem 0;resize:vertical;transition:border-color .3s;box-sizing:border-box;}
.lunar-textarea-large:focus{outline:none;border-color:rgba(139,122,255,.5);}
.lunar-helper-text{font-size:.9rem;color:rgba(224,224,255,.6);margin-top:.5rem;}
.lunar-affirmation-grid{display:grid;gap:.5rem;margin:1rem 0;}
.lunar-affirmation-btn{padding:.75rem;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);
    border-radius:8px;color:rgba(224,224,255,.8);cursor:pointer;text-align:left;transition:all .3s;width:100%;}
.lunar-affirmation-btn:hover{background:rgba(139,122,255,.15);border-color:rgba(139,122,255,.4);}
.lunar-intention-preview{background:rgba(139,122,255,.1);border-radius:12px;padding:1.5rem;margin:1.5rem 0;}
.lunar-preview-label{font-style:italic;color:rgba(224,224,255,.6);font-size:.9rem;margin-bottom:1rem;}
.lunar-word-input{width:100%;padding:1.5rem;background:rgba(0,0,0,.3);border:1px solid rgba(255,255,255,.1);
    border-radius:12px;color:#e0e0ff;font-size:1.5rem;text-align:center;font-family:'Cormorant Garamond',serif;
    margin:1.5rem 0;transition:border-color .3s;box-sizing:border-box;}
.lunar-word-input:focus{outline:none;border-color:rgba(139,122,255,.5);}

/* ── Timers ──────────────────────────────────────────────────────────────── */
.lunar-timer-display{font-size:4rem;color:#8B7AFF;font-family:'Cormorant Garamond',serif;margin:2rem 0;}
.lunar-timer-small{font-size:2rem;color:#8B7AFF;font-family:'Cormorant Garamond',serif;margin:1rem 0;}

/* ── Word cloud ──────────────────────────────────────────────────────────── */
.lunar-word-cloud{background:rgba(0,0,0,.3);border-radius:16px;padding:3rem;min-height:300px;
    display:flex;flex-wrap:wrap;gap:1rem;align-items:center;justify-content:center;margin:2rem 0;}
.lunar-word-cloud-item{font-family:'Cormorant Garamond',serif;opacity:.8;font-weight:500;
    animation:lunar-fade-in-scale .6s ease-out backwards;}
.lunar-word-count{color:rgba(224,224,255,.6);font-size:.9rem;margin:2rem 0;}
.lunar-witness-title{color:#e0e0ff;font-family:'Cormorant Garamond',serif;margin-bottom:1rem;}

/* ── Admin panel ─────────────────────────────────────────────────────────── */
.lunar-admin-wrapper{margin-top:24px;border-radius:var(--radius-lg,12px);border:2px dashed var(--neuro-accent-a30);overflow:hidden;}
.lunar-admin-header{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;
    cursor:pointer;background:var(--neuro-bg-lighter);user-select:none;}
.lunar-admin-header span:first-child{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;}
.lunar-admin-body{padding:16px 20px;background:var(--neuro-bg-lighter);border-top:1px solid var(--neuro-accent-a10);}
.lunar-admin-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;}
.lunar-admin-room-btn{padding:12px;background:var(--season-mood);border:1px solid var(--border);
    border-radius:var(--radius-md,8px);cursor:pointer;text-align:left;transition:background .2s;width:100%;}
.lunar-admin-room-btn:hover{background:var(--border);}

/* ── Animations ──────────────────────────────────────────────────────────── */
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;}
@keyframes lunar-fade-in{from{opacity:0}to{opacity:1}}
@keyframes lunar-fade-in-up{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes lunar-fade-in-scale{from{opacity:0;transform:scale(.8)}to{opacity:.8;transform:scale(1)}}

/* ── Responsive ──────────────────────────────────────────────────────────── */
@media(max-width:768px){
    .lunar-top-bar{flex-wrap:wrap;flex-direction:row;align-items:center;padding:1rem;gap:.75rem;}
    .lunar-phase-left{flex:1;gap:1rem;min-width:0;}
    .lunar-moon-icon-large{font-size:2rem;flex-shrink:0;}
    .lunar-phase-info{min-width:0;}
    .lunar-phase-info h2{font-size:1.1rem;}
    .lunar-phase-info p{font-size:.85rem;}
    .lunar-back-hub-btn{position:static;flex-shrink:0;order:1;padding:.5rem 1rem;font-size:.85rem;}
    .lunar-live-count-top{order:2;width:100%;box-sizing:border-box;justify-content:center;}
    .lunar-live-count-top span{font-size:.85rem;}
    .lunar-wisdom-text{font-size:1.2rem;padding:1.5rem;}
    .lunar-practices-grid{grid-template-columns:1fr;}
    .lunar-timer-display{font-size:3rem;}
    .lunar-mode-toggle{flex-direction:column;padding:.25rem;}
    .lunar-mode-btn{width:100%;justify-content:center;padding:.6rem 1rem;}
}

/* ── Accessibility ───────────────────────────────────────────────────────── */
.lunar-practice-card:focus,.lunar-popup-btn:focus,.lunar-mode-btn:focus,.lunar-back-hub-btn:focus{
    outline:1px solid rgba(139,122,255,.5);outline-offset:3px;}
@media(prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;}}
        `;
    }
};

export { LunarUI };
