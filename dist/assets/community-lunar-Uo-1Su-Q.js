var A=Object.defineProperty;var P=(n,e,t)=>e in n?A(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var I=(n,e,t)=>P(n,typeof e!="symbol"?e+"":e,t);import{_ as x}from"./features-lazy-bN0WDG2L.js";import{b as C}from"./community-hub-Bv-lWZW8.js";const d={generateIntentionPracticeContent(n,e,t){const{intention:o="",affirmation:r="",releaseList:i=""}=n,a=e.map(s=>`
            <button type="button" data-affirmation="${this._escapeAttr(s)}" class="lunar-affirmation-btn">
                ${this._escapeHtml(s)}
            </button>`).join("");return`
            <div class="lunar-popup-section">
                <h3>Purpose</h3>
                <p>${t.purpose}</p>
            </div>

            <div class="lunar-popup-section">
                <h3>One Clear Intention</h3>
                <p>Write one sentence beginning with:</p>
                <div class="lunar-popup-highlight">
                    <p>"${t.intentionPrompt}"</p>
                </div>
                <textarea id="intentionText" class="lunar-textarea-large"
                    style="min-height:80px;" maxlength="500"
                    aria-label="Your intention"
                    placeholder="${t.intentionPrompt}"
                >${this._escapeHtml(o)}</textarea>
                <p class="lunar-helper-text">${t.intentionHelper}</p>
            </div>

            <div class="lunar-popup-section">
                <h3>One ${t.affirmationType} Affirmation</h3>
                <p>${t.affirmationPrompt}</p>
                <div class="lunar-affirmation-grid">${a}</div>
                <textarea id="affirmationText" class="lunar-textarea-large"
                    style="min-height:80px;" maxlength="300"
                    aria-label="Your affirmation"
                    placeholder="Or write your own..."
                >${this._escapeHtml(r)}</textarea>
                ${t.affirmationHelper?`<p class="lunar-helper-text">${t.affirmationHelper}</p>`:""}
            </div>

            <div class="lunar-popup-section">
                <h3>${t.listTitle}</h3>
                <p>${t.listPrompt}</p>
                ${t.listHelper?`<p class="lunar-helper-text">${t.listHelper}</p>`:""}
                <textarea id="releaseListText" class="lunar-textarea-large"
                    style="min-height:120px;" maxlength="1000"
                    aria-label="${t.listTitle}"
                    placeholder="1. &#10;2. &#10;3. "
                >${this._escapeHtml(i)}</textarea>
                ${t.listFooter?`<div class="lunar-popup-highlight"><p>${t.listFooter}</p></div>`:""}
            </div>

            <div class="lunar-popup-footer">
                <button type="button" class="lunar-popup-btn" data-action="save-practice" aria-label="Save your practice">
                    Save Practice
                </button>
            </div>`},generateFutureAlignmentContent({purpose:n,steps:e,guideline:t}){return`
            <div class="lunar-popup-section">
                <h3>Purpose</h3>
                <p>${n}</p>
            </div>
            <div class="lunar-popup-section">
                <h3>Practice Steps</h3>
                <ul>${e.map(o=>`<li>${o}</li>`).join("")}</ul>
            </div>
            <div class="lunar-popup-highlight"><p>${t}</p></div>`},generateBodyPracticeContent({purpose:n,steps:e,guideline:t}){return`
            <div class="lunar-popup-section">
                <h3>Purpose</h3>
                <p>${n}</p>
            </div>
            <div class="lunar-popup-section">
                <h3>Practice Steps</h3>
                <ul>${e.map(o=>`<li>${o}</li>`).join("")}</ul>
                <div class="lunar-popup-highlight" style="margin-top:1rem;">
                    <p>${t}</p>
                </div>
            </div>`},generateEnergyAwarenessContent(n){return`
            <div class="lunar-popup-section">
                <h3>Purpose</h3>
                <p>${n.purpose}</p>
            </div>
            <div class="lunar-popup-section">
                <h3>Energy Direction</h3>
                <ul>${n.energySteps.map(e=>`<li>${e}</li>`).join("")}</ul>
                <div class="lunar-popup-highlight"><p>${n.energyGuideline}</p></div>
            </div>
            <div class="lunar-popup-section">
                <h3>${n.awarenessTitle}</h3>
                <p>${n.awarenessPrompt}</p>
                ${n.awarenessExample?`<p class="lunar-helper-text"><em>${n.awarenessExample}</em></p>`:""}
            </div>
            <div class="lunar-popup-section">
                <h3>Closing</h3>
                <div class="lunar-popup-highlight"><p>"${n.closingStatement}"</p></div>
                <p>Say once, out loud or silently. End the practice.</p>
            </div>`},_escapeHtml(n){if(!n)return"";const e=document.createElement("div");return e.textContent=n,e.innerHTML},_escapeAttr(n){return n?n.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;"):""}},j=Object.freeze(Object.defineProperty({__proto__:null,LunarConfig:d},Symbol.toStringTag,{value:"Module"})),m={CONSTANTS:{DEFAULT_STAR_COUNT:50,AVATAR_MAX_DISPLAY:5,AVATAR_COLORS:["#8B7AFF","#FF9B71","#71E8FF","#FFD371","#FF71B4"],AVATAR_INITIALS:["L","S","N","A","M"],WORD_CLOUD_COLORS:["#8B7AFF","#FF9B71","#71E8FF","#FFD371","#FF71B4","#71ffaa"],WORD_CLOUD_SIZES:[1,1.2,1.4,1.6,1.8,2,1.3,1.1,1.5,1.7]},_stylesInjected:!1,generateStarfield(n=m.CONSTANTS.DEFAULT_STAR_COUNT){const e=[];for(let t=0;t<n;t++)e.push(`<div class="lunar-star" style="left:${Math.random()*100}%;top:${Math.random()*100}%;animation-delay:${(Math.random()*3).toFixed(2)}s;opacity:${(Math.random()*.5+.3).toFixed(2)};"></div>`);return e.join("")},renderTopBar({emoji:n,name:e,daysText:t,livingPresenceCount:o,cssPrefix:r}){return`
            <div class="${r}-top-bar lunar-top-bar">
                <div class="${r}-phase-left lunar-phase-left">
                    <div class="${r}-moon-icon lunar-moon-icon-large">${n}</div>
                    <div class="${r}-phase-info lunar-phase-info">
                        <h2>${e}</h2>
                        <p>${t}</p>
                    </div>
                </div>
                <div class="${r}-live-count-top lunar-live-count-top">
                    <div class="lunar-pulse-dot"></div>
                    <span id="lunarLiveCountTop">${o} members practicing with you now</span>
                </div>
                <button type="button" data-action="back-to-hub" class="lunar-back-hub-btn" aria-label="Leave practice and return to hub">
                    Gently Leave
                </button>
            </div>`},renderMoonVisual({cssPrefix:n,sphereClass:e,glowClass:t}){return`
            <div class="${n}-moon-visual lunar-moon-visual">
                <div class="${t} lunar-moon-glow">
                    <div class="${e} lunar-moon-sphere"></div>
                </div>
            </div>`},renderIntroCard({imageUrl:n,description:e}){return`
            <div class="lunar-intro-card">
                <picture>
                  <source srcset="${n}" type="image/webp">
                  <img src="${n.replace(".webp",".png")}" alt="Moon Phase" width="400" height="400" class="lunar-intro-image" loading="lazy" decoding="async">
                </picture>
                <p>${e}</p>
            </div>`},renderModeToggle({cssPrefix:n}){return`
            <div class="${n}-mode-toggle lunar-mode-toggle">
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
            </div>`},renderMockAvatars(n){const{AVATAR_MAX_DISPLAY:e,AVATAR_COLORS:t,AVATAR_INITIALS:o}=m.CONSTANTS,r=Math.min(n,e);return Array.from({length:r},(a,s)=>`<div class="lunar-avatar" style="background-color:${t[s]};animation-delay:${s*.1}s;"
                  aria-label="Member ${o[s]}">${o[s]}</div>`).join("")+`<div class="lunar-avatar lunar-join-avatar" role="button" tabindex="0" aria-label="Join circle" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}"><span aria-hidden="true">+</span></div>`},renderWordCloud(n){if(!Array.isArray(n)||!n.length)return'<p style="color:rgba(224,224,255,0.6);">No words yet</p>';const{WORD_CLOUD_COLORS:e,WORD_CLOUD_SIZES:t}=m.CONSTANTS;return n.map((o,r)=>`<div class="lunar-word-cloud-item"
                  style="font-size:${t[r%t.length]}rem;color:${e[r%e.length]};animation-delay:${(r*.1).toFixed(1)}s;"
                  aria-label="Intention: ${o.word}">${o.word}</div>`).join("")},renderWisdomText(n){return`<div class="lunar-wisdom-text">"${n}"</div>`},createPopup({icon:n,title:e,subtitle:t,content:o,cssPrefix:r,hasFooter:i=!0}){const a=document.createElement("div");return a.className=`lunar-practice-popup ${r}-practice-popup`,a.setAttribute("role","dialog"),a.setAttribute("aria-modal","true"),a.setAttribute("aria-labelledby","popup-title"),a.setAttribute("aria-describedby","popup-subtitle"),a.innerHTML=`
            <div class="lunar-popup-content ${r}-popup-content">
                <button type="button" class="lunar-popup-close" data-action="close-popup" aria-label="Close">close</button>
                <div class="lunar-popup-header">
                    <div class="lunar-popup-icon" aria-hidden="true">${n}</div>
                    <div class="lunar-popup-title">
                        <h2 id="popup-title">${e}</h2>
                        <p class="lunar-popup-subtitle" id="popup-subtitle">${t}</p>
                    </div>
                </div>
                <div class="lunar-popup-body" id="collectiveIntentionContent">${o}</div>
                ${i?'<div class="lunar-popup-footer"><button type="button" class="lunar-popup-btn" data-action="close-popup" aria-label="Close practice">Close Practice</button></div>':""}
            </div>`,a},injectStyles(){if(this._stylesInjected||document.getElementById("lunar-shared-styles")){this._stylesInjected=!0;return}const n=document.createElement("style");n.id="lunar-shared-styles",n.textContent=this._getSharedCSS(),document.head.appendChild(n),this._stylesInjected=!0},_getSharedCSS(){return`
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
.lunar-popup-close{position:absolute;top:1.5rem;right:1.5rem;
    background:linear-gradient(135deg,rgba(139,122,255,.3),rgba(107,95,216,.4));
    border:1px solid rgba(139,122,255,.45);border-radius:50px;
    width:auto;height:auto;padding:.35rem 1rem;
    display:flex;align-items:center;justify-content:center;
    color:#e0e0ff;font-size:1rem;font-family:'Cormorant Garamond',serif;font-style:italic;
    cursor:pointer;transition:all .35s;z-index:10;
    box-shadow:0 0 16px rgba(139,122,255,.15),inset 0 0 8px rgba(139,122,255,.08);}
.lunar-popup-close:hover{border-color:rgba(139,122,255,.7);color:#fff;transform:translateY(-1px);
    box-shadow:0 0 28px rgba(139,122,255,.3),inset 0 0 12px rgba(139,122,255,.12);}
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
.lunar-affirmation-btn{padding:.65rem 1.25rem;
    background:linear-gradient(135deg,rgba(139,122,255,.18),rgba(107,95,216,.15));
    border:1px solid rgba(139,122,255,.35);border-radius:50px;
    color:rgba(224,224,255,.75);cursor:pointer;text-align:center;
    font-family:'Cormorant Garamond',serif;font-style:italic;font-size:.95rem;letter-spacing:.03em;
    transition:all .35s;width:100%;
    box-shadow:0 0 12px rgba(139,122,255,.08),inset 0 0 6px rgba(139,122,255,.04);}
.lunar-affirmation-btn:hover{background:linear-gradient(135deg,rgba(139,122,255,.3),rgba(107,95,216,.4));
    border-color:rgba(139,122,255,.6);color:#e0e0ff;
    box-shadow:0 0 24px rgba(139,122,255,.2),inset 0 0 10px rgba(139,122,255,.08);transform:translateY(-1px);}
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
        `}},G=Object.freeze(Object.defineProperty({__proto__:null,LunarUI:m},Symbol.toStringTag,{value:"Module"})),_=()=>window.CommunityDB,v={location:{latitude:31,longitude:0,name:"Default"},currentMoonData:null,currentLunarRoom:null,lunarRooms:[{phaseRanges:[[0,.068],[.932,1]],phaseName:"New Moon",icon:"🌑",roomName:"New Moon Intentions",description:"Set intentions and plant seeds for the lunar cycle",roomId:"new-moon",energy:"Beginning, Stillness, Potential",practices:["Silent meditation","Intention setting","Vision journaling","Seed planting ritual"]},{phaseRanges:[[.068,.432]],phaseName:"Waxing Moon",icon:"🌓",roomName:"Waxing Growth Practice",description:"Build momentum and cultivate expanding energy",roomId:"waxing-moon",energy:"Growth, Action, Building",practices:["Dynamic movement","Energy cultivation","Goal visualization","Action planning meditation"]},{phaseRanges:[[.432,.568]],phaseName:"Full Moon",icon:"🌕",roomName:"Full Moon Illumination",description:"Celebrate fullness and release what no longer serves",roomId:"full-moon",energy:"Culmination, Release, Clarity",practices:["Celebration ritual","Gratitude meditation","Release ceremony","Moon bathing"]},{phaseRanges:[[.568,.932]],phaseName:"Waning Moon",icon:"🌗",roomName:"Waning Release Practice",description:"Let go and reflect on the lunar journey",roomId:"waning-moon",energy:"Release, Reflection, Rest",practices:["Reflection meditation","Letting go ritual","Rest and restore","Completion ceremony"]}],init(){if(this._initialized)return;this._initialized=!0;const n=()=>this.updateAll();navigator.geolocation?navigator.geolocation.getCurrentPosition(({coords:e})=>{this.location={latitude:e.latitude,longitude:e.longitude,name:"Your Location"},n()},()=>n(),{timeout:5e3,maximumAge:36e5}):n(),setInterval(()=>this.updateAll(),6e5)},updateAll(){this.updateMoonData(),this.updateMoonVisualization(),this.updateLunarRoom(),this.renderLunarCard()},setLocation(n,e,t){this.location={latitude:n,longitude:e,name:t},this.updateAll()},updateMoonData(){const n=new Date,e=C.getMoonIllumination(n),t=C.getMoonTimes(n,this.location.latitude,this.location.longitude);this.currentMoonData={phase:e.phase,fraction:e.fraction,angle:e.angle,rise:t.rise,set:t.set,phaseName:this.getMoonPhaseName(e.phase),age:e.phase*29.53,nextFullMoon:this.getNextFullMoon(n)},this._renderMoonInfo()},_renderMoonInfo(){const n=this.currentMoonData;if(!n)return;const e=(o,r)=>{const i=document.getElementById(o);i&&(i.textContent=r)};e("moonPhaseName",n.phaseName),e("moonIllumination",`${Math.round(n.fraction*100)}% illuminated`),e("moonAge",`${n.age.toFixed(1)} days old`),e("moonrise",n.rise?this.formatTime(n.rise):"No rise today"),e("moonset",n.set?this.formatTime(n.set):"No set today");const t=Math.ceil((n.nextFullMoon-new Date)/864e5);e("nextPhase",`Next Full Moon: ${this.formatDate(n.nextFullMoon)} (${t} days)`)},updateMoonVisualization(){this.currentMoonData&&this.drawMoon(this.currentMoonData.phase,this.currentMoonData.angle)},drawMoon(n,e){const t=document.getElementById("moonSvg");if(!t)return;const o=50,r=60,i=60;t.innerHTML="";const a=document.createElementNS("http://www.w3.org/2000/svg","g");a.setAttribute("transform",`rotate(${(e*180/Math.PI*-1).toFixed(2)}, ${r}, ${i})`),t.appendChild(a);const s=document.createElementNS("http://www.w3.org/2000/svg","circle");s.setAttribute("cx",r),s.setAttribute("cy",i),s.setAttribute("r",o),s.setAttribute("fill","#2d3748"),a.appendChild(s);const l=Math.cos(n*2*Math.PI)*o,c=document.createElementNS("http://www.w3.org/2000/svg","path");c.setAttribute("fill","#f7fafc"),c.setAttribute("d",n<.5?`M ${r},${i-o} A ${o},${o} 0 0 1 ${r},${i+o} Q ${r+l},${i} ${r},${i-o}`:`M ${r},${i-o} Q ${r+l},${i} ${r},${i+o} A ${o},${o} 0 0 1 ${r},${i-o}`),a.appendChild(c),[{x:.3,y:-.2,r:.15},{x:-.2,y:.3,r:.1},{x:.1,y:.4,r:.08}].forEach(({x:p,y:h,r:f})=>{if(!(n<.5&&p>0||n>=.5&&p<0||n>.45&&n<.55))return;const b=document.createElementNS("http://www.w3.org/2000/svg","circle");b.setAttribute("cx",r+p*o),b.setAttribute("cy",i+h*o),b.setAttribute("r",f*o),b.setAttribute("fill","rgba(0,0,0,0.15)"),a.appendChild(b)})},getMoonPhaseName(n){return n<.03||n>.97?"New Moon":n<.22?"Waxing Crescent":n<.28?"First Quarter":n<.47?"Waxing Gibbous":n<.53?"Full Moon":n<.72?"Waning Gibbous":n<.78?"Last Quarter":"Waning Crescent"},getNextFullMoon(n){const e=C.getMoonIllumination(n).phase,t=e<.5?(.5-e)*29.53:(1.5-e)*29.53;return new Date(n.getTime()+t*864e5)},getLunarRoomByPhase(n){return this.lunarRooms.find(e=>e.phaseRanges.some(([t,o])=>n>=t&&n<=o))??this.lunarRooms[0]},updateLunarRoom(){var e;if(!this.currentMoonData)return;const n=this.getLunarRoomByPhase(this.currentMoonData.phase);(e=this.currentLunarRoom)==null||e.roomId,n.roomId,this.currentLunarRoom=n},getCurrentRoom(){return this.currentLunarRoom},_ROOM_MODULES:{"new-moon":()=>x(()=>Promise.resolve().then(()=>R),void 0),"waxing-moon":()=>x(()=>Promise.resolve().then(()=>E),void 0),"full-moon":()=>x(()=>Promise.resolve().then(()=>N),void 0),"waning-moon":()=>x(()=>Promise.resolve().then(()=>B),void 0)},_roomExportName:{"new-moon":"NewMoonRoom","waxing-moon":"WaxingMoonRoom","full-moon":"FullMoonRoom","waning-moon":"WaningMoonRoom"},async _loadAndEnterRoom(n){var t,o,r;const e=this._ROOM_MODULES[n];if(!e){(t=window.Core)==null||t.showToast(`Unknown room: ${n}`);return}try{const a=(await e())[this._roomExportName[n]];a?a.enterRoom():(o=window.Core)==null||o.showToast(`${n} failed to initialise`)}catch(i){console.error(`[LunarEngine] Failed to load ${n}:`,i),(r=window.Core)==null||r.showToast(`Failed to load ${n}`)}},joinLunarRoom(){var n;if(!this.currentLunarRoom){(n=window.Core)==null||n.showToast("Lunar room not ready");return}this._loadAndEnterRoom(this.currentLunarRoom.roomId)},adminJoinRoom(n){this._loadAndEnterRoom(n)},renderLunarCard(){var r,i,a;const n=document.getElementById("lunarContainer");if(!n){console.warn("LunarEngine: #lunarContainer not found");return}if(m.injectStyles(),!this.currentMoonData||!this.currentLunarRoom){n.innerHTML='<p style="color:var(--text-muted);padding:20px;">Loading lunar data...</p>';return}const{currentMoonData:e,currentLunarRoom:t}=this,o=(a=(i=(r=window.Core)==null?void 0:r.state)==null?void 0:i.currentUser)==null?void 0:a.is_admin;n.innerHTML=`
            <div class="celestial-card-full lunar-card">
                <div class="celestial-content-horizontal">
                    <div class="celestial-visual-section">
                        <div class="moon-visual">
                            <svg width="120" height="120" viewBox="0 0 120 120" id="moonSvg" aria-hidden="true" focusable="false"></svg>
                        </div>
                    </div>
                    <div class="celestial-info-section">
                        <div class="celestial-info-title">Lunar Phase &amp; Cycles</div>
                        <div class="moon-phase-name" id="moonPhaseName">${e.phaseName}</div>
                        <div class="moon-illumination" id="moonIllumination">${Math.round(e.fraction*100)}% illuminated</div>
                        <div class="moon-age" id="moonAge">${e.age.toFixed(1)} days old</div>
                        <div class="next-phase" id="nextPhase">
                            Next Full Moon: ${this.formatDate(e.nextFullMoon)}
                            (${Math.ceil((e.nextFullMoon-new Date)/864e5)} days)
                        </div>
                    </div>
                    <div class="celestial-times-section">
                        <div class="celestial-time">
                            <span class="time-label">Moonrise</span>
                            <span class="time-value" id="moonrise">${e.rise?this.formatTime(e.rise):"No rise today"}</span>
                        </div>
                        <div class="celestial-time">
                            <span class="time-label">Moonset</span>
                            <span class="time-value" id="moonset">${e.set?this.formatTime(e.set):"No set today"}</span>
                        </div>
                    </div>
                </div>
                ${this._renderRoomSection(t)}
                ${o?this._renderAdminSection():""}
            </div>`,this.updateMoonVisualization(),this._refreshOuterCard()},_renderRoomSection(n){return`
            <div class="celestial-practice-room" data-room-type="lunar" id="lunarPracticeRoom">
                <div class="room-divider"></div>
                <div class="room-content-inline">
                    <div class="room-header-inline">
                        <div class="room-icon-inline" id="lunarRoomIcon">${n.icon}</div>
                        <div class="room-info-inline">
                            <div class="room-name-inline" id="lunarRoomName">${n.roomName}</div>
                            <div class="room-desc-inline" id="lunarRoomDesc">${n.description}</div>
                        </div>
                    </div>
                    <div class="room-meta-inline">
                        <div class="room-energy">
                            <div class="energy-pulse" style="background:var(--ring-silent);"></div>
                            <span id="lunarRoomPresence">0 present</span>
                        </div>
                        <button type="button" class="btn btn-primary join-btn-inline" data-action="join-lunar-room">Join Space</button>
                    </div>
                </div>
            </div>`},_attachCardListeners(){const n=document.querySelector('[data-action="join-lunar-room"]');n&&!n._lunarBound&&(n.addEventListener("click",()=>this.joinLunarRoom()),n._lunarBound=!0)},_renderAdminSection(){const n="lunarAdminPanel",e="lunarAdminToggle",t=new Set,r=this.lunarRooms.filter(i=>t.has(i.roomId)?!1:t.add(i.roomId)).map(i=>`
            <button type="button" class="lunar-admin-room-btn" data-room-id="${i.roomId}">
                <div style="font-size:24px;margin-bottom:4px;">${i.icon}</div>
                <div style="font-size:13px;font-weight:600;color:var(--text);">${i.roomName}</div>
                <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">${i.phaseName}</div>
            </button>`).join("");return`
            <div class="lunar-admin-wrapper">
                <div class="lunar-admin-header" role="button" tabindex="0" aria-expanded="false" data-panel="${n}" data-toggle="${e}">
                    <span style="display:inline-flex;align-items:center;gap:0.4rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> ADMIN: Enter Any Lunar Room</span>
                    <span id="${e}">▶</span>
                </div>
                <div id="${n}" class="lunar-admin-body" style="display:none;">
                    <div class="lunar-admin-grid">${r}</div>
                </div>
            </div>`},_attachAdminListeners(){const n=document.querySelector(".lunar-admin-header");if(n&&!n._lunarBound){const e=()=>{const t=document.getElementById(n.dataset.panel),o=document.getElementById(n.dataset.toggle),r=t.style.display!=="none";t.style.display=r?"none":"block",o.textContent=r?"▶":"▼",n.setAttribute("aria-expanded",String(!r))};n.addEventListener("click",e),n.addEventListener("keydown",t=>{(t.key==="Enter"||t.key===" ")&&(t.preventDefault(),e())}),n._lunarBound=!0}document.querySelectorAll(".lunar-admin-room-btn").forEach(e=>{e._lunarBound||(e.addEventListener("click",()=>this.adminJoinRoom(e.dataset.roomId)),e._lunarBound=!0)})},_refreshOuterCard(){var t,o,r;if(!((t=_())!=null&&t.ready)){this._outerCardRetry||(this._outerCardRetry=setTimeout(()=>{this._outerCardRetry=null,this._refreshOuterCard()},500));return}const n=(o=this.currentLunarRoom)==null?void 0:o.roomId;if(!n)return;const e=async()=>{var i;try{const a=await((i=_())==null?void 0:i.getRoomParticipants(n)),s=document.getElementById("lunarRoomPresence");s&&(s.textContent=`${a.length} present`)}catch(a){console.warn("[LunarEngine] _refreshOuterCard error:",a)}};if(e(),this._attachCardListeners(),this._attachAdminListeners(),this._outerCardSub)try{this._outerCardSub.unsubscribe()}catch{}this._outerCardSub=(r=_())==null?void 0:r.subscribeToPresence(e)},formatTime(n){return!n||isNaN(n.getTime())?"N/A":n.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",hour12:!0})},formatDate(n){return n.toLocaleDateString("en-US",{month:"short",day:"numeric"})},getMoonData(){return this.currentMoonData},renderLunarRoom(){this.renderLunarCard()},injectAdminUI(){var t,o,r;if(!((r=(o=(t=window.Core)==null?void 0:t.state)==null?void 0:o.currentUser)==null?void 0:r.is_admin))return;const e=document.querySelector("#lunarContainer .celestial-card-full");if(e&&!document.getElementById("lunarAdminPanel")){const i=document.createElement("div");i.innerHTML=this._renderAdminSection(),e.appendChild(i.firstElementChild),this._attachAdminListeners()}}};window.LunarEngine=v;const H=Object.freeze(Object.defineProperty({__proto__:null,LunarEngine:v},Symbol.toStringTag,{value:"Module"})),g=()=>window.CommunityDB,u=class u{constructor(e){if(!e)throw new Error("LunarRoom: phaseConfig is required");this.config=e,this.isActive=!1,this.currentPractice=null,this.collectiveTimer=null,this.collectiveWords=null,this.saveDebounceTimer=null,this._retryCheckTimeout=null,this._hasLoggedWaiting=!1,this.eventListeners=[],this.userWeekData=this._getDefaultUserData(),this.weekStartDate=null,this.weekEndDate=null,this.domCache={dynamicContent:null,popup:null},this._bindMethods()}_getDefaultUserData(){return{seedAffirmation:null,practiceCount:0,journalEntries:[],emotionalEchoes:[],intentionShared:!1,privateIntention:"",collectiveWord:"",intention:"",affirmation:"",releaseList:""}}_bindMethods(){["init","enterRoom","renderRoomDashboard","switchMode","showPracticePopup","showCollectiveIntentionPopup","startCollectiveStep2","startCollectiveStep3","startCollectiveStep4","startCollectiveStep5","startMeditationTimer","startWitnessingTimer","submitWordToCollective","completeCollectivePractice","closeCollectivePopup","closePracticePopup","saveIntentionPractice","submitClosure","showLockedMessage","enterGroupCircle","leaveRoom","_handlePopupClick","_clearTimer"].forEach(e=>{typeof this[e]=="function"&&(this[e]=this[e].bind(this))})}init(){try{this.checkIfWeekActive(),m.injectStyles(this.config.cssPrefix)}catch(e){console.error(`${this.config.name} init error:`,e)}}checkIfWeekActive(){var e,t,o;try{if(!(v!=null&&v.currentMoonData)){this._hasLoggedWaiting||(this._hasLoggedWaiting=!0),this._retryCheckTimeout||(this._retryCheckTimeout=setTimeout(()=>{this._retryCheckTimeout=null,this.checkIfWeekActive()},500));return}if((o=(t=(e=window.Core)==null?void 0:e.state)==null?void 0:t.currentUser)==null?void 0:o.is_admin){this.isActive=!0,this.calculateWeekDates(),this.loadUserWeekData();return}const i=v.currentMoonData.phase;this.isActive=this.config.phaseRanges.some(([a,s])=>i>=a&&i<=s),this.isActive&&(this.calculateWeekDates(),this.loadUserWeekData())}catch(r){console.error("checkIfWeekActive error:",r),this.isActive=!1}}calculateWeekDates(){var e,t,o;try{const r=v==null?void 0:v.currentMoonData;if(!r){console.error("No moon data");return}const{phase:i,age:a}=r,s=u.CONSTANTS,l=new Date,c=new Date(l-a*s.MS_PER_DAY);let p=this.config.phaseRanges.find(([h,f])=>i>=h&&i<=f);if(!p&&(p=((o=(t=(e=window.Core)==null?void 0:e.state)==null?void 0:t.currentUser)==null?void 0:o.is_admin)?this.config.phaseRanges[0]:null,!p)){this._calculateNextOccurrence(i,a);return}this.weekStartDate=new Date(c.getTime()+p[0]*s.LUNAR_CYCLE_DAYS*s.MS_PER_DAY),this.weekEndDate=new Date(c.getTime()+p[1]*s.LUNAR_CYCLE_DAYS*s.MS_PER_DAY)}catch(r){console.error("calculateWeekDates error:",r)}}_calculateNextOccurrence(e,t){try{const o=u.CONSTANTS,r=new Date,i=new Date(r-t*o.MS_PER_DAY),[a,s]=this.config.phaseRanges[0],l=e<a?i:new Date(i.getTime()+o.LUNAR_CYCLE_DAYS*o.MS_PER_DAY);this.weekStartDate=new Date(l.getTime()+a*o.LUNAR_CYCLE_DAYS*o.MS_PER_DAY),this.weekEndDate=new Date(l.getTime()+s*o.LUNAR_CYCLE_DAYS*o.MS_PER_DAY)}catch(o){console.error("_calculateNextOccurrence error:",o)}}getDaysRemaining(){return this.weekEndDate?Math.max(0,Math.ceil((this.weekEndDate-new Date)/u.CONSTANTS.MS_PER_DAY)):0}shouldShowClosure(){const e=this.getDaysRemaining();return e>0&&e<=2}loadUserWeekData(){try{const e=localStorage.getItem(this.config.storageKey);e&&(this.userWeekData={...this.userWeekData,...JSON.parse(e)})}catch(e){console.error("loadUserWeekData error:",e)}}saveUserWeekData(e=!1){if(e){this._performSave();return}clearTimeout(this.saveDebounceTimer),this.saveDebounceTimer=setTimeout(()=>this._performSave(),u.CONSTANTS.SAVE_DEBOUNCE_MS)}_performSave(){var e;try{localStorage.setItem(this.config.storageKey,JSON.stringify(this.userWeekData))}catch(t){console.error("_performSave error:",t),(e=window.Core)==null||e.showToast("Failed to save data")}}_sanitizeInput(e){return typeof e=="string"?e.replace(/<[^>]*>/g,"").trim():""}_validateIntention(e){const t=u.CONSTANTS;return e!=null&&e.trim()?e.length>t.MAX_INTENTION_LENGTH?{valid:!1,error:`Intention must be under ${t.MAX_INTENTION_LENGTH} characters`}:{valid:!0}:{valid:!1,error:"Intention cannot be empty"}}_validateAffirmation(e){const t=u.CONSTANTS;return e!=null&&e.trim()?e.length>t.MAX_AFFIRMATION_LENGTH?{valid:!1,error:`Affirmation must be under ${t.MAX_AFFIRMATION_LENGTH} characters`}:{valid:!0}:{valid:!1,error:"Affirmation cannot be empty"}}_validateCollectiveWord(e){return e!=null&&e.trim()?e.length>u.CONSTANTS.MAX_WORD_LENGTH?{valid:!1,error:`Word must be under ${u.CONSTANTS.MAX_WORD_LENGTH} characters`}:e.trim().includes(" ")?{valid:!1,error:"Please enter only one word"}:{valid:!0}:{valid:!1,error:"Word cannot be empty"}}enterRoom(){var e,t,o,r,i,a,s,l;try{const c=(o=(t=(e=window.Core)==null?void 0:e.state)==null?void 0:t.currentUser)==null?void 0:o.is_admin;if(!this.isActive&&!c){(r=window.Core)==null||r.showToast(`${this.config.emoji} ${this.config.name} room opens during the ${this.config.name} phase`);return}(i=window.Core)==null||i.navigateTo("practiceRoomView"),(s=(a=window.PracticeRoom)==null?void 0:a.stopHubPresence)==null||s.call(a),window.currentLunarRoom=this,this.renderRoomDashboard(),this._setPresence(),this._loadCollectiveWords(),setTimeout(()=>this._refreshLivePresence(),300)}catch(c){console.error("enterRoom error:",c),(l=window.Core)==null||l.showToast("Failed to enter room")}}leaveRoom(){var e,t,o;try{this._clearPresence(),["_presenceSub","_collectiveWordsSub"].forEach(r=>{if(this[r]){try{this[r].unsubscribe()}catch{}this[r]=null}}),this._clearTimer(),this._removeEventListeners(),window.currentLunarRoom=null,(t=(e=window.PracticeRoom)==null?void 0:e.startHubPresence)==null||t.call(e),(o=window.Core)==null||o.navigateTo("hubView")}catch(r){console.error("leaveRoom error:",r)}}renderRoomDashboard(){var e;try{const t=(e=this.domCache).dynamicContent??(e.dynamicContent=document.getElementById("dynamicRoomContent"));if(!t){console.error("dynamicRoomContent not found");return}const o=new Date,r=this.getDaysRemaining(),i=Math.ceil((this.weekStartDate-o)/u.CONSTANTS.MS_PER_DAY),a=this.getLivingPresenceCount(),s=this.isActive?`${r} ${r===1?"day":"days"} remaining`:`${i} ${i===1?"day":"days"} until ${this.config.name}`;t.innerHTML=`
                <div class="lunar-room-bg">
                    <div class="${this.config.cssPrefix}-starfield lunar-starfield">
                        ${m.generateStarfield()}
                    </div>
                    ${m.renderTopBar({emoji:this.config.emoji,name:this.config.name,daysText:s,livingPresenceCount:a,cssPrefix:this.config.cssPrefix})}
                    <div class="${this.config.cssPrefix}-content-wrapper lunar-content-wrapper">
                        ${m.renderMoonVisual({cssPrefix:this.config.cssPrefix,sphereClass:`${this.config.cssPrefix}-moon-sphere`,glowClass:`${this.config.cssPrefix}-moon-glow`})}
                        ${m.renderIntroCard({imageUrl:this.config.imageUrl,description:this.config.description})}
                        ${m.renderModeToggle({cssPrefix:this.config.cssPrefix,globalName:this.config.globalName})}
                        <div class="lunar-practice-mode active" data-mode="solo">${this._renderSoloPracticeMode()}</div>
                        <div class="lunar-practice-mode" data-mode="group">${this._renderGroupCircleMode(a)}</div>
                        ${this._renderClosureSection()}
                        <div class="lunar-wisdom-section">${m.renderWisdomText(this.config.wisdomQuote)}</div>
                    </div>
                </div>`,this._attachEventListeners(t)}catch(t){console.error("renderRoomDashboard error:",t)}}_renderSoloPracticeMode(){const e=!!(this.userWeekData.intention||this.userWeekData.affirmation);return`
            <div class="lunar-mode-description">
                <h3>Your Sacred Space</h3>
                <p>${this.config.modeDescription||"Individual practices for this lunar phase"}</p>
            </div>
            <div class="lunar-practices-section">
                <div class="lunar-practices-grid">${this._renderPracticeCards()}</div>
            </div>
            ${e?this._renderSavedInputs():""}`}_renderPracticeCards(){var r;const e=Object.entries(this.config.practices),t=(r=e[0])==null?void 0:r[0],o=!!(this.userWeekData.intention||this.userWeekData.affirmation);return e.map(([i,a])=>{const s=i===t&&o;return`
                <div class="lunar-practice-card ${this.config.cssPrefix}-practice-card${s?" locked":""}"
                     data-practice="${i}" data-locked="${s}"
                     tabindex="0" role="button"
                     aria-label="${a.title}${s?" - Complete":""}">
                    <div class="lunar-practice-icon" style="color:${a.color};">${a.icon}</div>
                    <div class="lunar-practice-info">
                        <h4>${a.title}</h4>
                        <p>${a.description}</p>
                    </div>
                    ${s?'<div class="lunar-lock-badge">✓ Complete</div>':""}
                </div>`}).join("")}_renderSavedInputs(){const{intention:e,affirmation:t,releaseList:o}=this.userWeekData,r=this.config.savedInputLabels,i=a=>d._escapeHtml(a);return`
            <div class="lunar-saved-inputs">
                <h3>${r.title}</h3>
                ${e?`<div class="lunar-saved-item"><div class="lunar-saved-label">${r.intention}</div><div class="lunar-saved-text">${i(e)}</div></div>`:""}
                ${t?`<div class="lunar-saved-item"><div class="lunar-saved-label">${r.affirmation}</div><div class="lunar-saved-text">${i(t)}</div></div>`:""}
                ${o?`<div class="lunar-saved-item"><div class="lunar-saved-label">${r.releaseList}</div><div class="lunar-saved-text">${i(o).replace(/\n/g,"<br>")}</div></div>`:""}
                <div class="lunar-saved-footer">${r.footer}</div>
            </div>`}_renderGroupCircleMode(e){return`
            <div class="lunar-group-intro">
                <h3>Group Intention Circle</h3>
                <p>Join others in ${this.config.collectiveFocus}. Together we create ${this.config.collectiveNoun}.</p>
                <div class="lunar-live-presence">
                    <div class="lunar-pulse-dot"></div>
                    <span>${e} members in circle</span>
                </div>
                <div class="lunar-group-avatars">${m.renderMockAvatars(e)}</div>
                <button type="button" class="lunar-join-circle-btn" data-action="enter-group-circle">Enter the Circle</button>
            </div>`}_renderClosureSection(){if(!this.shouldShowClosure())return"";const e=u.CONSTANTS;return`
            <div class="lunar-closure-section">
                <h3>${this.config.closureTitle}</h3>
                <p>${this.config.closureDescription}</p>
                <label for="closureReflection" class="sr-only">${this.config.closureTitle}</label>
                <textarea id="closureReflection" class="lunar-textarea-large"
                    placeholder="${this.config.closurePlaceholder}"
                    aria-label="${this.config.closurePlaceholder}"
                    maxlength="${e.MAX_INTENTION_LENGTH}"></textarea>
                <button type="button" class="lunar-popup-btn" data-action="submit-closure">
                    ${this.config.closureButton}
                </button>
            </div>`}_attachEventListeners(e){this._removeEventListeners();const t=o=>{const r=o.target.closest(".lunar-practice-card");if(r&&(o.type==="click"||o.key==="Enter"||o.key===" ")){o.preventDefault(),r.dataset.locked==="true"?this.showLockedMessage():this.showPracticePopup(r.dataset.practice);return}if(o.type!=="click")return;const i=o.target.closest("[data-action]");if(i)switch(i.dataset.action){case"switch-mode":this.switchMode(i.dataset.mode);break;case"enter-group-circle":this.enterGroupCircle();break;case"submit-closure":this.submitClosure();break;case"back-to-hub":window.Rituals?Rituals.showClosing():this.leaveRoom();break}};e.addEventListener("click",t),e.addEventListener("keydown",t),this.eventListeners.push({element:e,type:"click",handler:t},{element:e,type:"keydown",handler:t})}_removeEventListeners(){this.eventListeners.forEach(({element:e,type:t,handler:o})=>e==null?void 0:e.removeEventListener(t,o)),this.eventListeners=[]}switchMode(e){document.querySelectorAll(".lunar-practice-mode").forEach(t=>t.classList.toggle("active",t.dataset.mode===e)),document.querySelectorAll(".lunar-mode-btn").forEach(t=>{const o=t.dataset.mode===e;t.classList.toggle("active",o),t.setAttribute("aria-pressed",String(o))})}showPracticePopup(e){try{const t=this.config.practices[e];if(!t){console.error(`Practice not found: ${e}`);return}this.currentPractice=e;const o=e===Object.keys(this.config.practices)[0],r=m.createPopup({icon:t.icon,title:t.title,subtitle:t.description,content:this.getPracticeContent(e),cssPrefix:this.config.cssPrefix,hasFooter:!o,onClose:()=>this.closePracticePopup()});(document.getElementById("communityHubFullscreenContainer")??document.body).appendChild(r),this.domCache.popup=r,this._attachPopupListeners(r,e)}catch(t){console.error("showPracticePopup error:",t)}}_attachPopupListeners(e,t){var o;e.querySelectorAll('[data-action="close-popup"]').forEach(r=>r.addEventListener("click",this.closePracticePopup)),e.addEventListener("click",this._handlePopupClick),t===Object.keys(this.config.practices)[0]&&((o=e.querySelector('[data-action="save-practice"]'))==null||o.addEventListener("click",this.saveIntentionPractice),e.querySelectorAll("[data-affirmation]").forEach(r=>r.addEventListener("click",()=>{const i=e.querySelector("#affirmationText");i&&(i.value=r.dataset.affirmation)})))}_handlePopupClick(e){e.target===e.currentTarget&&this.closePracticePopup()}getPracticeContent(e){try{const t=this.config.practiceContent[e];return t?t(this.userWeekData,this.config.prebuiltAffirmations):`<div class="lunar-popup-section"><h3>Practice</h3><p>${this.config.practices[e].description}</p></div>`}catch(t){return console.error("getPracticeContent error:",t),"<p>Error loading practice content</p>"}}closePracticePopup(){const e=this.domCache.popup??document.querySelector(".lunar-practice-popup");e&&(e.remove(),this.domCache.popup=null)}saveIntentionPractice(){var e,t,o,r;try{const i=document.getElementById("intentionText"),a=document.getElementById("affirmationText"),s=document.getElementById("releaseListText");if(!i||!a||!s){console.error("Form elements not found");return}const l=this._sanitizeInput(i.value),c=this._sanitizeInput(a.value),p=this._sanitizeInput(s.value),h=this._validateIntention(l);if(!h.valid){(e=window.Core)==null||e.showToast(h.error);return}const f=this._validateAffirmation(c);if(!f.valid){(t=window.Core)==null||t.showToast(f.error);return}Object.assign(this.userWeekData,{intention:l,affirmation:c,releaseList:p}),this.userWeekData.practiceCount++,this.saveUserWeekData(!0),(o=window.Core)==null||o.showToast("Practice saved"),this.closePracticePopup(),this.renderRoomDashboard()}catch(i){console.error("saveIntentionPractice error:",i),(r=window.Core)==null||r.showToast("Failed to save practice")}}showLockedMessage(){var e;(e=window.Core)==null||e.showToast("✓ Practice completed for this cycle")}showCollectiveIntentionPopup(){var e;try{const t=m.createPopup({icon:"🌙",title:"Collective Intention Circle",subtitle:`Join others in ${this.config.collectiveFocus}`,content:this._getCollectiveStep1Content(),cssPrefix:this.config.cssPrefix,hasFooter:!1,onClose:()=>this.closeCollectivePopup()});(document.getElementById("communityHubFullscreenContainer")??document.body).appendChild(t),this.domCache.popup=t,t.querySelectorAll('[data-action="close-popup"]').forEach(o=>o.addEventListener("click",this.closeCollectivePopup)),(e=t.querySelector('[data-action="begin-collective"]'))==null||e.addEventListener("click",this.startCollectiveStep2),t.addEventListener("click",this._handlePopupClick)}catch(t){console.error("showCollectiveIntentionPopup error:",t)}}_getCollectiveStep1Content(){return`
            <div class="lunar-popup-section" style="text-align:center;">
                <p>This practice creates space for collective intention.</p>
                <p>You will be guided through 5 steps:</p>
                <ol style="text-align:left;max-width:500px;margin:2rem auto;">
                    <li>Silent meditation (3 minutes)</li>
                    <li>Write your private intention</li>
                    <li>Choose one word for the collective</li>
                    <li>Silent witnessing (2 minutes)</li>
                    <li>Complete the practice</li>
                </ol>
                <button class="lunar-popup-btn" data-action="begin-collective">Begin Practice</button>
            </div>`}startCollectiveStep2(){var t,o;const e=document.getElementById("collectiveIntentionContent");e&&(e.innerHTML=`
            <div class="lunar-popup-section" style="text-align:center;">
                <h3>Step 1: Silent Meditation</h3>
                <p>Take 3 minutes to center yourself before setting your intention.</p>
                <div id="meditationTimer" class="lunar-timer-display">3:00</div>
                <button id="startMeditationBtn" class="lunar-popup-btn" data-action="start-meditation">Begin Meditation</button>
                <button id="skipToIntentionBtn" class="lunar-popup-btn lunar-btn-secondary" data-action="skip-meditation" style="display:none;">Continue to Intention</button>
            </div>`,(t=e.querySelector('[data-action="start-meditation"]'))==null||t.addEventListener("click",this.startMeditationTimer),(o=e.querySelector('[data-action="skip-meditation"]'))==null||o.addEventListener("click",this.startCollectiveStep3))}startMeditationTimer(){var e;(e=document.getElementById("startMeditationBtn"))==null||e.style.setProperty("display","none"),this._runTimer("meditationTimer",u.CONSTANTS.MEDITATION_DURATION,()=>{const t=document.getElementById("skipToIntentionBtn");t&&(t.textContent="Continue to Intention",t.style.display="block")}),setTimeout(()=>{const t=document.getElementById("skipToIntentionBtn");t&&(t.style.display="block")},1e4)}startCollectiveStep3(){var t;this._clearTimer();const e=document.getElementById("collectiveIntentionContent");e&&(e.innerHTML=`
            <div class="lunar-popup-section">
                <h3>Step 2: Your Private Intention</h3>
                <p>Write your intention for this ${this.config.name} cycle. This remains private.</p>
                <textarea id="privateIntentionText" class="lunar-textarea-large"
                    placeholder="I intend to..."
                    maxlength="${u.CONSTANTS.MAX_INTENTION_LENGTH}"
                >${d._escapeHtml(this.userWeekData.privateIntention||"")}</textarea>
                <button class="lunar-popup-btn" data-action="save-private-intention">Continue</button>
            </div>`,(t=e.querySelector('[data-action="save-private-intention"]'))==null||t.addEventListener("click",this.startCollectiveStep4))}startCollectiveStep4(){var o;const e=document.getElementById("privateIntentionText");e&&(this.userWeekData.privateIntention=this._sanitizeInput(e.value));const t=document.getElementById("collectiveIntentionContent");t&&(t.innerHTML=`
            <div class="lunar-popup-section">
                <h3>Step 3: Choose One Word</h3>
                <p>From your intention, choose one word to contribute to the collective field.</p>
                <div class="lunar-intention-preview">
                    <div class="lunar-preview-label">Your intention:</div>
                    <p>${d._escapeHtml(this.userWeekData.privateIntention||"No intention set")}</p>
                </div>
                <input type="text" id="collectiveWordInput" class="lunar-word-input"
                    aria-label="Enter your word for this lunar phase"
                    placeholder="Your word..." maxlength="${u.CONSTANTS.MAX_WORD_LENGTH}">
                <button class="lunar-popup-btn" data-action="submit-collective-word">Plant Your Word</button>
            </div>`,(o=t.querySelector('[data-action="submit-collective-word"]'))==null||o.addEventListener("click",()=>{const r=document.getElementById("collectiveWordInput");r&&this.submitWordToCollective(r.value)}))}submitWordToCollective(e){var r,i,a;const t=this._sanitizeInput(e),o=this._validateCollectiveWord(t);if(!o.valid){(r=window.Core)==null||r.showToast(o.error);return}this.userWeekData.collectiveWord=t,this.userWeekData.intentionShared=!0,this.collectiveWords||(this.collectiveWords=this.getMockCollectiveWords()),this.collectiveWords.push({word:t,timestamp:Date.now()}),(i=g())!=null&&i.ready&&((a=g())==null||a.sendRoomMessage(`${this._getLunarRoomId()}-collective`,t).catch(s=>console.error("[LunarRoom] submitWordToCollective DB error:",s))),this.startCollectiveStep5()}startCollectiveStep5(){var t,o;const e=document.getElementById("collectiveIntentionContent");e&&(e.innerHTML=`
            <div class="lunar-popup-section" style="text-align:center;">
                <h3>Step 4: Collective Intention Field</h3>
                <p style="margin-bottom:2rem;">Your word has been planted. Witness the collective intentions emerging.</p>
                <div id="wordCloud" class="lunar-word-cloud">
                    ${m.renderWordCloud(this.collectiveWords??this.getMockCollectiveWords())}
                </div>
                <p class="lunar-word-count"><strong>${this.getCollectiveWordsCount()}</strong> intentions planted in this ${this.config.name} cycle</p>
                <div style="margin:2rem 0;">
                    <h4 class="lunar-witness-title">Step 5: Silent Witnessing (2 min)</h4>
                    <div id="witnessingTimer" class="lunar-timer-small">2:00</div>
                    <button id="startWitnessingBtn" class="lunar-popup-btn" data-action="start-witnessing">Begin Silent Witnessing</button>
                    <button id="completeBtn" class="lunar-popup-btn lunar-btn-success" data-action="complete-collective" style="display:none;">Complete Practice</button>
                </div>
            </div>`,(t=e.querySelector('[data-action="start-witnessing"]'))==null||t.addEventListener("click",this.startWitnessingTimer),(o=e.querySelector('[data-action="complete-collective"]'))==null||o.addEventListener("click",this.completeCollectivePractice))}startWitnessingTimer(){var e;(e=document.getElementById("startWitnessingBtn"))==null||e.style.setProperty("display","none"),this._runTimer("witnessingTimer",u.CONSTANTS.WITNESSING_DURATION,()=>{const t=document.getElementById("completeBtn");t&&(t.style.display="block")})}_runTimer(e,t,o){let r=t;const i=document.getElementById(e);i&&(this.collectiveTimer=setInterval(()=>{r--;const a=Math.floor(r/60),s=r%60;i.textContent=`${a}:${String(s).padStart(2,"0")}`,r<=0&&(this._clearTimer(),i.textContent="Complete",o==null||o())},u.CONSTANTS.TIMER_INTERVAL_MS))}completeCollectivePractice(){var e;this.userWeekData.practiceCount++,this.saveUserWeekData(!0),(e=window.Core)==null||e.showToast("Intention planted with the collective"),this.closeCollectivePopup(),this.renderRoomDashboard()}closeCollectivePopup(){this._clearTimer(),this.closePracticePopup()}enterGroupCircle(){this.showCollectiveIntentionPopup()}submitClosure(){var e,t,o;try{const r=document.getElementById("closureReflection");r&&(this.userWeekData.closureReflection=this._sanitizeInput(r.value),this.saveUserWeekData(!0)),(e=window.Core)==null||e.showToast(this.config.completionMessage),this.userWeekData=this._getDefaultUserData(),this.saveUserWeekData(!0),(t=window.Core)==null||t.navigateTo("hubView")}catch(r){console.error("submitClosure error:",r),(o=window.Core)==null||o.showToast("Failed to submit closure")}}_clearTimer(){this.collectiveTimer&&(clearInterval(this.collectiveTimer),this.collectiveTimer=null)}getLivingPresenceCount(){return typeof this._cachedPresenceCount=="number"?this._cachedPresenceCount:0}getMockCollectiveWords(){const e=Date.now();return[{word:"Growth",timestamp:e-864e5},{word:"Peace",timestamp:e-72e6},{word:"Courage",timestamp:e-432e5},{word:"Clarity",timestamp:e-36e6},{word:"Healing",timestamp:e-216e5},{word:"Trust",timestamp:e-18e6},{word:"Love",timestamp:e-144e5},{word:"Balance",timestamp:e-72e5},{word:"Freedom",timestamp:e-36e5},{word:"Joy",timestamp:e-18e5}]}getCollectiveWordsCount(){return(this.collectiveWords??this.getMockCollectiveWords()).length}_getLunarRoomId(){return{newmoon:"new-moon",waxingmoon:"waxing-moon",fullmoon:"full-moon",waningmoon:"waning-moon"}[this.config.cssPrefix]??this.config.cssPrefix}_setPresence(){var e,t,o;if((e=g())!=null&&e.ready)try{const r=this._getLunarRoomId(),i=`${this.config.emoji} ${this.config.name}`;(t=g())==null||t.setPresence("online",i,r),(o=window.Core)!=null&&o.state&&(window.Core.state.currentRoom=r,window.Core.state.currentUser&&(window.Core.state.currentUser.activity=i))}catch(r){console.error("[LunarRoom] _setPresence error:",r)}}_clearPresence(){var e,t,o;if((e=g())!=null&&e.ready)try{(t=g())==null||t.setPresence("online","✨ Available",null),(o=window.Core)!=null&&o.state&&(window.Core.state.currentRoom=null,window.Core.state.currentUser&&(window.Core.state.currentUser.activity="✨ Available"))}catch(r){console.error("[LunarRoom] _clearPresence error:",r)}}async _refreshLivePresence(){var o,r;if(!((o=g())!=null&&o.ready))return;const e=this._getLunarRoomId(),t=async()=>{var i,a;try{const s=await((i=g())==null?void 0:i.getRoomParticipants(e)),l=await((a=g())==null?void 0:a.getBlockedUsers()),c=s.filter(y=>!l.has(y.user_id));this._cachedPresenceCount=c.length,this._cachedParticipants=c;const p=document.getElementById("lunarLiveCountTop");p&&(p.textContent=`${c.length} members practicing with you now`);const h=document.querySelector(".lunar-live-presence span");h&&(h.textContent=`${c.length} members in circle`);const f=document.querySelector(".lunar-group-avatars");f&&(f.innerHTML=this._buildRealAvatars(c))}catch(s){console.warn("[LunarRoom] _refreshLivePresence error:",s)}};if(await t(),this._presenceSub)try{this._presenceSub.unsubscribe()}catch{}this._presenceSub=(r=g())==null?void 0:r.subscribeToPresence(t)}_buildRealAvatars(e){const o=e.slice(0,5),r=e.length-5,i=o.map(s=>{var y,b;const l=s.profiles??{},c=l.name??l.display_name??"?",p=c.charAt(0).toUpperCase(),h=((b=(y=window.Core)==null?void 0:y.getAvatarGradient)==null?void 0:b.call(y,s.user_id))??"background:#8B7AFF";let f=l.avatar_url?`<img src="${l.avatar_url}" alt="${p}" width="40" height="40" loading="lazy" decoding="async" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`:l.emoji?`<span style="font-size:18px;">${l.emoji}</span>`:`<span style="font-size:14px;font-weight:600;">${p}</span>`;return`<div class="lunar-avatar" style="${h};display:flex;align-items:center;justify-content:center;" aria-label="${c}">${f}</div>`}).join(""),a=r>0?`<div class="lunar-avatar" style="background:#333;display:flex;align-items:center;justify-content:center;font-size:12px;">+${r}</div>`:`<div class="lunar-avatar lunar-join-avatar" role="button" tabindex="0" aria-label="Join circle" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}"><span aria-hidden="true">+</span></div>`;return i+a}async _loadCollectiveWords(){var o,r;if(!((o=g())!=null&&o.ready))return;const e=`${this._getLunarRoomId()}-collective`,t=async()=>{var i;try{const a=await((i=g())==null?void 0:i.getRoomMessages(e,100));if(a!=null&&a.length){this.collectiveWords=a.map(c=>({word:c.message,timestamp:new Date(c.created_at).getTime()}));const s=document.getElementById("wordCloud");s&&(s.innerHTML=m.renderWordCloud(this.collectiveWords));const l=document.querySelector(".lunar-word-count strong");l&&(l.textContent=this.collectiveWords.length)}}catch(a){console.warn("[LunarRoom] _loadCollectiveWords error:",a)}};if(await t(),this._collectiveWordsSub)try{this._collectiveWordsSub.unsubscribe()}catch{}this._collectiveWordsSub=(r=g())==null?void 0:r.subscribeToRoomChat(e,t)}cleanup(){this._clearTimer(),this._removeEventListeners(),clearTimeout(this.saveDebounceTimer),clearTimeout(this._retryCheckTimeout),["_presenceSub","_collectiveWordsSub"].forEach(e=>{if(this[e]){try{this[e].unsubscribe()}catch{}this[e]=null}}),this.domCache={dynamicContent:null,popup:null}}};I(u,"CONSTANTS",{MEDITATION_DURATION:180,WITNESSING_DURATION:120,SAVE_DEBOUNCE_MS:500,MAX_INTENTION_LENGTH:500,MAX_AFFIRMATION_LENGTH:300,MAX_RELEASE_LIST_LENGTH:1e3,MAX_WORD_LENGTH:50,TIMER_INTERVAL_MS:1e3,LUNAR_CYCLE_DAYS:29.53,MS_PER_DAY:864e5});let w=u;const U=Object.freeze(Object.defineProperty({__proto__:null,LunarRoom:w},Symbol.toStringTag,{value:"Module"})),$={name:"New Moon",emoji:"🌑",cssPrefix:"newmoon",globalName:"NewMoonRoom",storageKey:"newmoon_week_data",phaseRanges:[[0,.068],[.932,1]],imageUrl:"/Community/Lunar/NewMoon.webp",description:"In darkness, we plant seeds of intention. In silence, we listen for what wants to emerge.",wisdomQuote:"Every ending is a beginning in disguise. Tonight, we honor both.",modeDescription:"Individual practices for planting intentions and honoring new beginnings",collectiveFocus:"collective intention-setting",collectiveNoun:"dreams emerging",closureTitle:"Week Closure",closureDescription:"Before this New Moon phase ends, take a moment to reflect on your journey.",closurePlaceholder:"What did you discover? What wants to carry forward?",closureButton:"Complete Cycle",completionMessage:"🌙 New Moon week complete. Well done.",savedInputLabels:{title:"Your New Moon Seeds",intention:"Intention",affirmation:"Affirmation",releaseList:"Release List",footer:"These seeds will grow throughout this lunar cycle"},prebuiltAffirmations:["I trust the timing of my life","I am worthy of new beginnings","I welcome clarity and direction","I release what no longer serves me","I am open to what wants to emerge","I plant seeds of intention with love","I am aligned with my highest path","I create space for new possibilities","I honor my intuition and inner knowing","I am ready for transformation"],practices:{intentionRelease:{id:"intention-release",title:"Intention and Release",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',description:"Mental clarity and subconscious direction",color:"var(--ring-silent)"},futureAlignment:{id:"future-alignment",title:"Future Alignment Visualization",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24"/></svg>',description:"Give the nervous system a destination",color:"var(--ring-available)"},bodyGrounding:{id:"body-grounding",title:"Body Grounding Reset",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="3"/><path d="M12 11v10M8 15l4-4 4 4M8 21h8"/></svg>',description:"Signal safety before growth",color:"var(--ring-deep)"},energyAwareness:{id:"energy-awareness",title:"Energy and Awareness",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',description:"Contain energy and protect the seed",color:"var(--ring-resonant)"}},practiceContent:{intentionRelease:(n,e)=>d.generateIntentionPracticeContent(n,e,{purpose:"Mental clarity and subconscious direction.",intentionPrompt:"This lunar cycle, I choose to cultivate…",intentionHelper:"Read it out loud once after writing.",affirmationType:"Positive",affirmationPrompt:"Create a positive affirmation for this lunar cycle to repeat.",affirmationHelper:"This will be your affirmation for the entire cycle.",listTitle:"Release List",listPrompt:"Write 3 habits, beliefs, or patterns you are done carrying.",listHelper:null,listFooter:"Do not analyze. After this practice, symbolically let them go."}),futureAlignment:()=>d.generateFutureAlignmentContent({purpose:"Give the nervous system a destination.",steps:["Close your eyes","Imagine yourself at the Full Moon feeling aligned and complete","Notice posture, breath, and emotional tone"],guideline:"Do not visualize details. Feel the state."}),bodyGrounding:()=>d.generateBodyPracticeContent({purpose:"Signal safety before growth.",steps:["Stand barefoot","Bend knees slightly","Slow inhale through the nose","Long exhale through the mouth","Repeat 5 times"],guideline:"This tells the body it is safe to begin something new."}),energyAwareness:()=>d.generateEnergyAwarenessContent({purpose:"Contain energy and protect the seed.",energySteps:["Place hands on the lower belly","Imagine energy collecting inward, not expanding"],energyGuideline:"New Moon energy consolidates, it does not radiate.",awarenessTitle:"Boundary Setting",awarenessPrompt:"Write one clear boundary you will maintain this cycle.",awarenessExample:"Example: not explaining yourself unnecessarily.",closingStatement:"I have planted what matters. I allow it to grow in its own time."})}},k=new w($);k.init();const R=Object.freeze(Object.defineProperty({__proto__:null,NewMoonRoom:k},Symbol.toStringTag,{value:"Module"})),L={name:"Waxing Moon",emoji:"🌓",cssPrefix:"waxingmoon",globalName:"WaxingMoonRoom",storageKey:"waxingmoon_week_data",phaseRanges:[[.068,.432]],imageUrl:"/Community/Lunar/WaxingMoon.webp",description:"In the growing light, we build and expand. What you tend to now will flourish.",wisdomQuote:"In the growing light, we build what matters. What you tend to now will flourish.",modeDescription:"Individual practices for building momentum and expanding energy",collectiveFocus:"building collective energy",collectiveNoun:"momentum",closureTitle:"Phase Reflection",closureDescription:"Before this Waxing Moon phase ends, reflect on the momentum you've built.",closurePlaceholder:"What energy have you cultivated? What is taking shape?",closureButton:"Complete Phase",completionMessage:"🌓 Waxing Moon phase complete. Your momentum is set.",savedInputLabels:{title:"Your Waxing Moon Intentions",intention:"Intention",affirmation:"Supporting Affirmation",releaseList:"Growth List",footer:"Building momentum with each passing day"},prebuiltAffirmations:["I am growing stronger each day","I take inspired action with confidence","My intentions are manifesting with ease","I embrace momentum and forward movement","I am aligned with my highest purpose","I cultivate what wants to emerge","I trust the process of becoming","I build energy with intention and grace","I am worthy of abundance and growth","I step into my power with clarity"],practices:{intentionSetting:{id:"intention-setting",title:"Intention and Growth",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',description:"Conscious direction and active cultivation",color:"var(--ring-silent)"},energyBuilding:{id:"energy-building",title:"Future Alignment Visualization",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24"/></svg>',description:"Align identity, action, and momentum",color:"var(--ring-available)"},actionAlignment:{id:"action-alignment",title:"Body Movement and Breath",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="3"/><path d="M12 11v10M8 15l4-4 4 4M8 21h8"/></svg>',description:"Activate expansion and forward energy",color:"var(--ring-deep)"},manifestationFocus:{id:"manifestation-focus",title:"Energy and Awareness",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',description:"Direct energy outward with clarity",color:"var(--ring-resonant)"}},practiceContent:{intentionSetting:(n,e)=>d.generateIntentionPracticeContent(n,e,{purpose:"Conscious direction and active cultivation.",intentionPrompt:"This lunar cycle, I choose to actively grow…",intentionHelper:"Read it out loud once.",affirmationType:"Positive",affirmationPrompt:"Choose one affirmation to lock for the entire cycle.",affirmationHelper:"Choose one only. Lock it for the entire cycle.",listTitle:"Growth List",listPrompt:"Write 3 actions, qualities, or habits you are committed to strengthening.",listHelper:null,listFooter:"These are not goals. They are practices. Do not analyze. Keep the list visible this cycle."}),energyBuilding:()=>d.generateFutureAlignmentContent({purpose:"Align identity, action, and momentum.",steps:["Close your eyes","Imagine yourself approaching the Full Moon feeling energized and in motion","Notice posture, breath, and emotional tone","See yourself taking aligned action with ease"],guideline:"Do not visualize details. Feel the momentum."}),actionAlignment:()=>d.generateBodyPracticeContent({purpose:"Activate expansion and forward energy.",steps:["Stand with feet hip-width apart","Inhale through the nose while raising arms upward","Exhale through the mouth while lowering arms slowly","Repeat 5 times"],guideline:"Allow the body to feel taller, more open, and available for growth."}),manifestationFocus:()=>d.generateEnergyAwarenessContent({purpose:"Direct energy outward with clarity and stability.",energySteps:["Place one hand on the heart, one hand on the lower belly","Imagine energy gently expanding outward from the center"],energyGuideline:"Waxing Moon energy grows steadily, it builds and reaches.",awarenessTitle:"Awareness Focus",awarenessPrompt:"Write one area of life you will consciously nurture this cycle.",awarenessExample:"Example: consistent communication, creative output, physical vitality.",closingStatement:"I am nurturing what I have planted. I move forward with clarity and trust."})}},T=new w(L);T.init();const E=Object.freeze(Object.defineProperty({__proto__:null,WaxingMoonRoom:T},Symbol.toStringTag,{value:"Module"})),D={name:"Full Moon",emoji:"🌕",cssPrefix:"fullmoon",globalName:"FullMoonRoom",storageKey:"fullmoon_week_data",phaseRanges:[[.432,.568]],imageUrl:"/Community/Lunar/FullMoon.webp",description:"In illumination, we see clearly. In fullness, we honor what is.",wisdomQuote:"In the light of the full moon, everything becomes visible. We honor what we see.",modeDescription:"Individual practices for illumination, clarity, and conscious release",collectiveFocus:"collective awareness",collectiveNoun:"illumination",closureTitle:"Week Closure",closureDescription:"Before this Full Moon phase ends, take a moment to reflect on your journey.",closurePlaceholder:"What did you discover? What wants to carry forward?",closureButton:"Complete Cycle",completionMessage:"🌕 Full Moon week complete. Well done.",savedInputLabels:{title:"Your Full Moon Insights",intention:"Insight",affirmation:"Affirmation",releaseList:"Illumination List",footer:"What has been revealed in the light"},prebuiltAffirmations:["I trust the timing of my life","I am worthy of clarity and truth","I welcome what has been revealed","I release what no longer serves me","I am open to deeper understanding","I honor the light and the shadow","I am aligned with my authentic self","I embrace the fullness of this moment","I honor my intuition and insight","I am ready for honest reflection"],practices:{intentionIllumination:{id:"intention-illumination",title:"Intention and Illumination",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',description:"Conscious awareness and emotional clarity",color:"var(--ring-silent)"},futureAlignment:{id:"future-alignment",title:"Future Alignment Visualization",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24"/></svg>',description:"Integrate insight and stabilize direction",color:"var(--ring-available)"},bodyPresence:{id:"body-presence",title:"Body Presence and Breath",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="3"/><path d="M12 11v10M8 15l4-4 4 4M8 21h8"/></svg>',description:"Ground heightened energy and emotional charge",color:"var(--ring-deep)"},energyAwareness:{id:"energy-awareness",title:"Energy and Awareness",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',description:"Balance expansion with containment",color:"var(--ring-resonant)"}},practiceContent:{intentionIllumination:(n,e)=>d.generateIntentionPracticeContent(n,e,{purpose:"Conscious awareness and emotional clarity.",intentionPrompt:"This Full Moon, I allow myself to clearly see…",intentionHelper:"Read it out loud once.",affirmationType:"Reflective",affirmationPrompt:"Choose one affirmation to lock for this phase.",affirmationHelper:null,listTitle:"Illumination List",listPrompt:"Write 3 realizations, emotions, or truths that have become visible for you.",listHelper:null,listFooter:"Do not judge or explain them. Let them be seen."}),futureAlignment:()=>d.generateFutureAlignmentContent({purpose:"Integrate insight and stabilize direction.",steps:["Close your eyes","Imagine yourself at the peak of the Full Moon feeling clear and present","Notice posture, breath, and emotional tone","Feel the clarity of knowing what matters and what no longer does"],guideline:"Do not visualize outcomes. Feel understanding."}),bodyPresence:()=>d.generateBodyPracticeContent({purpose:"Ground heightened energy and emotional charge.",steps:["Stand or sit comfortably","Inhale slowly through the nose","Pause briefly at the top of the breath","Exhale slowly through the mouth","Repeat 5 times"],guideline:"Allow the body to soften and settle as awareness expands."}),energyAwareness:()=>d.generateEnergyAwarenessContent({purpose:"Balance expansion with containment.",energySteps:["Place one hand on the heart, one hand on the forehead","Imagine energy circulating evenly through the body"],energyGuideline:"Full Moon energy illuminates, it does not need to grow or contract.",awarenessTitle:"Conscious Release",awarenessPrompt:"Write one pattern, reaction, or attachment you are ready to let go of.",awarenessExample:"Release it through understanding, not force.",closingStatement:"I honor what has come into view. I integrate what is true."})}},M=new w(D);M.init();const N=Object.freeze(Object.defineProperty({__proto__:null,FullMoonRoom:M},Symbol.toStringTag,{value:"Module"})),W={name:"Waning Moon",emoji:"🌗",cssPrefix:"waningmoon",globalName:"WaningMoonRoom",storageKey:"waningmoon_week_data",phaseRanges:[[.568,.932]],imageUrl:"/Community/Lunar/WaningMoon.webp",description:"In the waning light, we release and reflect. In letting go, we make space for what's to come.",wisdomQuote:"As the moon wanes, we honor the cycle. What we release makes room for new beginnings.",modeDescription:"Individual practices for release, reflection, and rest",collectiveFocus:"collective release",collectiveNoun:"completion",closureTitle:"Cycle Completion",closureDescription:"Before this Waning Moon phase ends, reflect on your journey through the entire lunar cycle.",closurePlaceholder:"What is complete? What are you grateful for? What are you ready to release?",closureButton:"Complete Cycle",completionMessage:"🌗 Waning Moon cycle complete. Rest well.",savedInputLabels:{title:"Your Waning Moon Release",intention:"Letting Go",affirmation:"Soothing Affirmation",releaseList:"Release List",footer:"These weights are loosening as the moon wanes"},prebuiltAffirmations:["I release what no longer serves me","I trust the natural cycle of endings and beginnings","I am grateful for this cycle's lessons","I let go with grace and ease","I honor the wisdom of rest","I make space for what is to come","I trust the process of release","I am complete in this moment","I embrace the power of letting go","I prepare myself for renewal"],practices:{intentionLettingGo:{id:"intention-letting-go",title:"Intention and Letting Go",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',description:"Conscious release and nervous system relief",color:"var(--ring-silent)"},futureAlignment:{id:"future-alignment",title:"Future Alignment Visualization",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24"/></svg>',description:"Orient toward simplicity and recovery",color:"var(--ring-available)"},bodyRestBreath:{id:"body-rest-breath",title:"Body Rest and Breath",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="3"/><path d="M12 11v10M8 15l4-4 4 4M8 21h8"/></svg>',description:"Support parasympathetic recovery",color:"var(--ring-deep)"},energyAwareness:{id:"energy-awareness",title:"Energy and Awareness",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',description:"Disperse excess and reclaim personal space",color:"var(--ring-resonant)"}},practiceContent:{intentionLettingGo:(n,e)=>d.generateIntentionPracticeContent(n,e,{purpose:"Conscious release and nervous system relief.",intentionPrompt:"This waning cycle, I allow myself to let go of…",intentionHelper:"Read it out loud once.",affirmationType:"Soothing",affirmationPrompt:"Choose one affirmation to lock for this phase.",affirmationHelper:null,listTitle:"Release List",listPrompt:"Write 3 obligations, emotional weights, or mental loops you are ready to loosen.",listHelper:"These do not need to disappear. They only need to matter less.",listFooter:null}),futureAlignment:()=>d.generateFutureAlignmentContent({purpose:"Orient toward simplicity and recovery.",steps:["Close your eyes","Imagine yourself at the end of this lunar cycle feeling lighter and unburdened","Notice posture, breath, and emotional tone","Feel the absence of pressure"],guideline:"Do not imagine improvement. Feel relief."}),bodyRestBreath:()=>d.generateBodyPracticeContent({purpose:"Support parasympathetic recovery.",steps:["Sit or lie down","Inhale gently through the nose","Long, slow exhale through the mouth","Allow the body to sink with each exhale","Repeat 5 times"],guideline:"This tells the body it is safe to stop pushing."}),energyAwareness:()=>d.generateEnergyAwarenessContent({purpose:"Disperse excess and reclaim personal space.",energySteps:["Place hands on the thighs or lower abdomen","Imagine excess energy draining downward and away"],energyGuideline:"Waning Moon energy releases, it does not hold or build.",awarenessTitle:"Conscious Simplification",awarenessPrompt:"Write one thing you will intentionally do less of until the next New Moon.",awarenessExample:"Less effort. Less explanation. Less engagement.",closingStatement:"I release what is complete. I rest before what comes next."})}},S=new w(W);S.init();const B=Object.freeze(Object.defineProperty({__proto__:null,WaningMoonRoom:S},Symbol.toStringTag,{value:"Module"}));export{G as a,H as b,U as c,j as l};
