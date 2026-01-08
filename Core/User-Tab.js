// User-Tab.js – 100 % complete with Notifications + Profile-Save + avatar_url fix + Rules patch (2026-01-08)
import { supabase } from './Supabase.js';

export default class UserTab {
  constructor(app) {
    this.app = app;
    this.btn = null;
  }

  render() {
    const html = `
      <div class="user-menu" id="user-menu">
        <button class="user-disc" id="user-menu-btn" aria-expanded="false" aria-controls="user-dropdown">
          <svg class="disc-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.8-1.36-6.05-3.55C7.35 13.36 9.57 12 12 12s4.65 1.36 6.05 3.65C16.8 17.84 14.5 19.2 12 19.2z"/>
          </svg>
          <span class="disc-avatar">
            <img class="disc-avatar-img hidden" alt="avatar">
            <span class="disc-avatar-emoji">👤</span>
          </span>
          <span class="disc-dot hidden"></span>
        </button>

        <div class="user-dropdown" id="user-dropdown" role="menu">
          <button class="dropdown-item" data-section="profile">👤 Profile</button>
          <div class="accordion-panel" id="panel-profile"></div>
          <button class="dropdown-item" data-section="settings">🎭 Skins</button>
          <div class="accordion-panel" id="panel-settings"></div>
          <button class="dropdown-item" data-section="notifications">🔔 Notifications</button>
          <div class="accordion-panel" id="panel-notifications"></div>
          <button class="dropdown-item" data-section="automations">⚙️ Automations</button>
          <div class="accordion-panel" id="panel-automations"></div>
          <button class="dropdown-item" data-section="about">ℹ️ About the App</button>
          <div class="accordion-panel" id="panel-about"></div>
          <button class="dropdown-item" data-section="rules">📜 Rules</button>
          <div class="accordion-panel" id="panel-rules"></div>
          <button class="dropdown-item" data-section="contact">📧 Contact Me</button>
          <div class="accordion-panel" id="panel-contact"></div>
          <button class="dropdown-item" data-section="export">💾 Export Data</button>
          <div class="accordion-panel" id="panel-export"></div>
          <button class="dropdown-item" data-section="billing">⬆️ Pricings</button>
          <div class="accordion-panel" id="panel-billing"></div>
          ${this.app.state.currentUser?.isAdmin ? `
            <button class="dropdown-item" data-section="admin">🔧 Admin Hacks</button>
            <div class="accordion-panel" id="panel-admin"></div>
          ` : ''}
          <div class="dropdown-divider"></div>
          <button class="dropdown-item" data-action="logout">🚪 Logout</button>
        </div>
      </div>

      <style>
        .user-menu{position:fixed;top:12px;right:12px;z-index:100;}
        .user-disc{width:36px;height:36px;border-radius:50%;border:none;background:var(--neuro-bg);box-shadow:var(--shadow-raised);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:box-shadow .2s,transform .2s;}
        .user-disc:active{box-shadow:var(--shadow-inset);transform:scale(.95);}
        .disc-icon{width:20px;height:20px;fill:#fff;transition:opacity .2s;}
        .disc-avatar{width:28px;height:28px;border-radius:50%;background:var(--neuro-bg);box-shadow:var(--shadow-inset-sm);display:flex;align-items:center;justify-content:center;overflow:hidden;transition:opacity .2s;}
        .disc-avatar-img{width:100%;height:100%;object-fit:cover;}
        .disc-avatar-emoji{font-size:1.1rem;}
        .user-disc .disc-icon{opacity:1;}
        .user-disc .disc-avatar{opacity:0;position:absolute;}
        .user-disc.avatar-mode .disc-icon{opacity:0;}
        .user-disc.avatar-mode .disc-avatar{opacity:1;}
        .disc-dot{position:absolute;top:2px;right:2px;width:8px;height:8px;border-radius:50%;background:var(--neuro-accent);box-shadow:0 0 4px var(--neuro-accent);animation:pulseDot 1.5s infinite;}
        @keyframes pulseDot{0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.3);opacity:.8;}}
        .user-dropdown{position:absolute;right:0;top:calc(100% + 6px);width:230px;background:var(--neuro-bg);border-radius:24px;box-shadow:var(--shadow-raised-lg);padding:12px 0;opacity:0;transform:scale(.95);pointer-events:none;transition:opacity .2s,transform .2s;z-index:50;max-height:80vh;overflow-y:auto;}
        .user-dropdown.active{opacity:1;transform:scale(1);pointer-events:auto;}
        .dropdown-divider{height:1px;background:var(--neuro-shadow-dark);margin:8px 0;opacity:.5;}
        .dropdown-item{display:block;width:calc(100% - 24px);margin:0 auto 8px auto;padding:10px 8px;font-size:.95rem;text-align:left;background:var(--neuro-bg);border:1px solid var(--neuro-shadow-dark);border-radius:10px;color:var(--neuro-text);cursor:pointer;box-shadow:var(--shadow-raised-sm);transition:all .2s;}
        .dropdown-item:hover{background:rgba(102,126,234,.08);border-color:var(--neuro-accent);}
        .dropdown-item:active{box-shadow:var(--shadow-inset);}
        .accordion-panel{padding:8px 12px;font-size:.85rem;color:var(--neuro-text-light);display:none;}
        .accordion-panel.active{display:block;}
        .avatar-upload-label{position:relative;cursor:pointer;display:inline-block;}
        .avatar-upload-label input[type=file]{position:absolute;opacity:0;width:0;height:0;pointer-events:none;}
        .profile-avatar-container{width:80px;height:80px;border-radius:50%;background:var(--neuro-bg);box-shadow:var(--shadow-inset);display:flex;align-items:center;justify-content:center;overflow:hidden;cursor:pointer;position:relative;margin:0 auto 10px;}
        .profile-avatar-container img{width:100%;height:100%;object-fit:cover;}
        .profile-avatar-emoji{font-size:2.5rem;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);}
        .accordion-inner input[type=text],.accordion-inner input[type=email],.accordion-inner input[type=tel],.accordion-inner input[type=date],.accordion-inner input[type=time],.accordion-inner select{width:100%;padding:6px 8px;font-size:.8rem;border-radius:8px;border:none;background:var(--neuro-bg);box-shadow:var(--shadow-inset-sm);margin-bottom:8px;font-family:inherit;color:var(--neuro-text);}
        .btn-link{font-size:.8rem;padding:4px 8px;background:transparent;border:none;color:var(--neuro-accent);cursor:pointer;text-decoration:underline;border-radius:4px;}
        .btn-link:hover{background:rgba(102,126,234,.08);}
        .automation-group,.notification-section{background:rgba(102,126,234,.05);border-radius:8px;padding:10px;margin-bottom:10px;}
        .automation-label{display:flex;align-items:center;gap:8px;font-weight:600;cursor:pointer;color:var(--neuro-text);}
        .automation-controls{padding-left:28px;font-size:.85rem;color:var(--neuro-text-light);}
        .automation-controls.disabled{opacity:.4;}
        .toggle-switch-container{display:flex;align-items:center;justify-content:space-between;padding:8px 0;gap:12px;}
        .toggle-switch{position:relative;width:44px;height:22px;cursor:pointer;}
        .toggle-switch input{opacity:0;width:0;height:0;}
        .toggle-slider{position:absolute;inset:0;background:var(--neuro-shadow-dark);border-radius:22px;transition:.3s;box-shadow:var(--shadow-inset-sm);}
        .toggle-slider:before{content:"";position:absolute;height:16px;width:16px;left:3px;bottom:3px;background:var(--neuro-bg);border-radius:50%;transition:.3s;box-shadow:var(--shadow-raised);}
        .toggle-switch input:checked + .toggle-slider{background:var(--neuro-accent);}
        .toggle-switch input:checked + .toggle-slider:before{transform:translateX(22px);}
      </style>
    `;

    if (!document.getElementById('user-tab-styles')) {
      const s = document.createElement('style');
      s.id = 'user-tab-styles';
      s.textContent = html.match(/<style>(.+?)<\/style>/s)[1];
      document.head.appendChild(s);
    }
    return html.replace(/<style>.+?<\/style>/s, '');
  }

  /* ----------  PROFILE SAVE / LOAD  ---------- */
  async saveQuickProfile() {
    const uid = this.app.state?.currentUser?.id;
    if (!uid) return this.app.showToast('Not logged in', 'error');

    const payload = {
      name:       document.getElementById('profile-name')?.value.trim()   || null,
      email:      document.getElementById('profile-email')?.value.trim()  || null,
      phone:      document.getElementById('profile-phone')?.value.trim()  || null,
      birthday:   document.getElementById('profile-birthday')?.value      || null,
      emoji:      document.getElementById('profile-emoji')?.value         || '👤',
      avatar_url: document.getElementById('profile-avatar-img')?.src || ''  // ← DB column
    };

    let savedOnServer = false;
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({ id: uid, ...payload }, { onConflict: 'id' });
      if (!error) savedOnServer = true;
    } catch (e) { console.warn('Profile server save failed', e); }

    localStorage.setItem(`profile_${uid}`, JSON.stringify(payload));
    Object.assign(this.app.state.currentUser, payload);
    this.syncAvatar();
    this.app.showToast(
      savedOnServer ? '✅ Profile saved & synced' : '⚠️ Saved locally (offline)',
      savedOnServer ? 'success' : 'warning'
    );
  }

  async hydrateUserProfile() {
    const uid = this.app.state?.currentUser?.id;
    if (!uid) return;

    const localKey = `profile_${uid}`;
    let data = null;

    try {
      const { data: row, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .single();
      if (!error && row) data = row;
    } catch (e) { console.warn('Profile fetch error', e); }

    if (!data) {
      try { data = JSON.parse(localStorage.getItem(localKey)); } catch (e) {}
    }

    if (data) {
      const target = this.app.state.currentUser;
      ['name','email','phone','birthday','emoji','avatar_url'].forEach(k => {
        if (data[k] !== undefined) target[k] = data[k];
      });
      this.syncAvatar();
    }
  }
  /* ----------  END PROFILE  ---------- */

  init() {
    if (!window.app.renderProfileHTML) {
      window.app.renderProfileHTML = () => {
        const u = this.app.state.currentUser || {};
        return `
          <div class="accordion-inner">
            <div style="display:flex;flex-direction:column;align-items:center;gap:10px;margin-bottom:10px;">
              <label class="avatar-upload-label" title="Click to change picture">
                <input type="file" id="avatar-upload" accept="image/*">
                <div class="profile-avatar-container" id="profile-avatar-preview">
                  <img id="profile-avatar-img" src="${u.avatar_url || ''}" style="${u.avatar_url ? '' : 'display:none;'}">
                  <span class="profile-avatar-emoji" style="${u.avatar_url ? 'display:none;' : ''}">${u.emoji || '👤'}</span>
                </div>
              </label>
              <select id="profile-emoji">${['👤','♈️','♉️','♊️','♋️','♌️','♍️','♎️','♏️','♐️','♑️','♒️','♓️','🧘‍♀️','🌙','☀️','🌟','🔮','🦋','🌿','🌸','🕉️','🍀'].map(e=>'<option '+(e===u.emoji?'selected':'')+' value="'+e+'">'+e+'</option>').join('')}</select>
            </div>
            <input id="profile-name" type="text" maxlength="30" placeholder="Display name" value="${u.name || ''}">
            <input id="profile-email" type="email" placeholder="E-mail" value="${u.email || ''}">
            <input id="profile-phone" type="tel" placeholder="Phone" value="${u.phone || ''}">
            <input id="profile-birthday" type="date" value="${u.birthday || ''}">
            <button class="btn-link" id="save-profile-btn">Save changes</button>
          </div>
        `;
      };

      /* ----------  RULES  ---------- */
      window.app.renderRulesHTML = () => {
        const categories = [
          {title:'FIRST-WINS',badges:[{icon:'🌱',name:'First Step',desc:'do any single action',xp:10,karma:3,rarity:'common'},{icon:'💚',name:'First Gratitude',desc:'log 1 gratitude entry',xp:10,karma:3,rarity:'common'},{icon:'📝',name:'First Journal',desc:'save 1 journal entry',xp:10,karma:3,rarity:'common'},{icon:'⚡',name:'First Energy',desc:'log 1 energy check-in',xp:10,karma:3,rarity:'common'},{icon:'🃏',name:'First Reading',desc:'complete 1 tarot spread',xp:10,karma:3,rarity:'common'},{icon:'🧘',name:'First Meditation',desc:'finish 1 meditation session',xp:10,karma:3,rarity:'common'},{icon:'🛒',name:'First Purchase',desc:'buy anything in the Karma Shop',xp:50,karma:3,rarity:'common'}]},
          {title:'GRATITUDE',badges:[{icon:'❤️',name:'Gratitude Warrior',desc:'30 entries',xp:50,karma:5,rarity:'uncommon'},{icon:'💝',name:'Gratitude Legend',desc:'100 entries',xp:100,karma:10,rarity:'rare'},{icon:'💖',name:'Gratitude Sage',desc:'200 entries',xp:200,karma:15,rarity:'epic'},{icon:'💘',name:'Gratitude Titan',desc:'500 entries',xp:500,karma:30,rarity:'legendary'}]},
          {title:'JOURNAL',badges:[{icon:'📔',name:'Journal Keeper',desc:'20 entries',xp:50,karma:5,rarity:'uncommon'},{icon:'📚',name:'Journal Master',desc:'75 entries',xp:100,karma:10,rarity:'rare'},{icon:'📖',name:'Journal Sage',desc:'150 entries',xp:200,karma:15,rarity:'epic'},{icon:'📜',name:'Journal Titan',desc:'400 entries',xp:500,karma:30,rarity:'legendary'}]},
          {title:'ENERGY CHECK-INS',badges:[{icon:'⚡',name:'Energy Tracker',desc:'30 logs',xp:50,karma:5,rarity:'uncommon'},{icon:'🔋',name:'Energy Sage',desc:'100 logs',xp:100,karma:10,rarity:'rare'},{icon:'🔌',name:'Energy Titan',desc:'300 logs',xp:300,karma:15,rarity:'epic'},{icon:'⚡️',name:'Energy Legend',desc:'600 logs',xp:600,karma:30,rarity:'legendary'}]},
          {title:'TAROT SPREADS',badges:[{icon:'🔮',name:'Tarot Apprentice',desc:'10 spreads',xp:25,karma:3,rarity:'common'},{icon:'🃏',name:'Tarot Mystic',desc:'25 spreads',xp:50,karma:5,rarity:'uncommon'},{icon:'🌙',name:'Tarot Oracle',desc:'75 spreads',xp:100,karma:10,rarity:'rare'},{icon:'🧙',name:'Tarot Sage',desc:'150 spreads',xp:200,karma:15,rarity:'epic'},{icon:'🔮',name:'Tarot Titan',desc:'400 spreads',xp:500,karma:30,rarity:'legendary'}]},
          {title:'MEDITATION SESSIONS',badges:[{icon:'🧘',name:'Meditation Devotee',desc:'20 sessions',xp:50,karma:5,rarity:'uncommon'},{icon:'🕉️',name:'Meditation Master',desc:'60 sessions',xp:100,karma:10,rarity:'rare'},{icon:'🧘‍♂️',name:'Meditation Sage',desc:'100 sessions',xp:300,karma:15,rarity:'epic'},{icon:'🧘‍♀️',name:'Meditation Titan',desc:'200 sessions',xp:700,karma:30,rarity:'legendary'}]},
          {title:'HAPPINESS BOOSTERS',badges:[{icon:'😊',name:'Happiness Seeker',desc:'50 views',xp:50,karma:5,rarity:'uncommon'},{icon:'🎉',name:'Joy Master',desc:'150 views',xp:100,karma:10,rarity:'rare'},{icon:'😍',name:'Happiness Sage',desc:'300 views',xp:200,karma:15,rarity:'epic'},{icon:'🤩',name:'Happiness Titan',desc:'700 views',xp:500,karma:30,rarity:'legendary'}]},
          {title:'WELLNESS EXERCISES',badges:[{icon:'🌿',name:'Wellness Champion',desc:'50 exercises',xp:50,karma:5,rarity:'uncommon'},{icon:'🌳',name:'Wellness Guru',desc:'150 exercises',xp:100,karma:10,rarity:'rare'},{icon:'🌲',name:'Wellness Titan',desc:'300 exercises',xp:300,karma:15,rarity:'epic'},{icon:'🌎',name:'Wellness Legend',desc:'700 exercises',xp:1000,karma:30,rarity:'legendary'}]},
          {title:'STREAK BADGES',badges:[{icon:'⭐',name:'Perfect Week',desc:'complete every daily quest 7 days in a row',xp:75,karma:10,rarity:'rare'},{icon:'💎',name:'Dedication',desc:'30-day login streak',xp:100,karma:15,rarity:'epic'},{icon:'🔱',name:'Unstoppable',desc:'60-day login streak',xp:150,karma:15,rarity:'epic'},{icon:'👑',name:'Legendary Streak',desc:'100-day login streak',xp:200,karma:30,rarity:'legendary'}]},
          {title:'QUEST-COMPLETION BADGES',badges:[{icon:'🔥',name:'Weekly Warrior',desc:'complete all weekly quests 4 separate weeks',xp:100,karma:15,rarity:'epic'},{icon:'🌟',name:'Monthly Master',desc:'complete all monthly quests at least once',xp:150,karma:15,rarity:'epic'},{icon:'🎯',name:'Quest Crusher',desc:'finish 100 total quests (any type)',xp:150,karma:15,rarity:'epic'},{icon:'⭐',name:'Daily Champion',desc:'complete all dailies on 30 separate days',xp:100,karma:10,rarity:'rare'}]},
          {title:'CURRENCY BADGES',badges:[{icon:'💰',name:'Karma Collector',desc:'accumulate 500 Karma',xp:50,karma:10,rarity:'rare'},{icon:'💎',name:'Karma Lord',desc:'accumulate 2000 Karma',xp:200,karma:30,rarity:'legendary'},{icon:'⚡',name:'XP Legend',desc:'earn 10 000 XP',xp:100,karma:15,rarity:'epic'},{icon:'⚡',name:'XP Titan',desc:'earn 50 000 XP',xp:200,karma:30,rarity:'legendary'}]},
          {title:'LEVEL MILESTONES',badges:[{icon:'🎯',name:'Rising Star',desc:'reach Level 5',xp:100,karma:15,rarity:'epic'},{icon:'🌟',name:'Enlightened Soul',desc:'reach Level 7',xp:150,karma:15,rarity:'epic'},{icon:'👑',name:'Enlightened Master',desc:'reach Level 10',xp:300,karma:30,rarity:'legendary'}]},
          {title:'CHAKRA BADGES',badges:[{icon:'🌈',name:'Chakra Balancer',desc:'log all 7 chakras ≥ 8 in one session',xp:75,karma:15,rarity:'epic'},{icon:'🎨',name:'Chakra Master',desc:'log all 7 chakras ≥ 9 in one session',xp:150,karma:30,rarity:'legendary'}]},
          {title:'CROSS-FEATURE BADGES',badges:[{icon:'🎪',name:'Triple Threat',desc:'use 3 different features in one day',xp:25,karma:5,rarity:'uncommon'},{icon:'💫',name:'Super Day',desc:'gratitude + journal + energy + meditation',xp:50,karma:10,rarity:'rare'},{icon:'🗺️',name:'Complete Explorer',desc:'use every main feature at least once',xp:100,karma:15,rarity:'epic'},{icon:'🎭',name:'Renaissance Soul',desc:'≥ 10 actions in 5+ different features',xp:150,karma:30,rarity:'epic'}]}
        ];
        const rarityColour = {common:'#9ca3af',uncommon:'#10b981',rare:'#3b82f6',epic:'#a855f7',legendary:'#f59e0b'};
        return `
<div class="accordion-inner rules-panel">
  <div class="rules-header">
    <h3>Complete Badge Guide</h3>
    <button class="btn-link" id="rules-toggle">Expand all</button>
  </div>
  ${categories.map(cat => `
    <section class="rules-category">
      <h4 class="rules-category-title">${cat.title}</h4>
      <div class="rules-grid">
        ${cat.badges.map(b => `
          <div class="rules-card" data-rarity="${b.rarity}">
            <div class="rules-card-icon">${b.icon}</div>
            <div class="rules-card-body">
              <div class="rules-card-name">${b.name}</div>
              <div class="rules-card-desc">${b.desc}</div>
              <div class="rules-card-rewards">
                <span class="rules-xp">+${b.xp} XP</span>
                <span class="rules-karma">+${b.karma} Karma</span>
              </div>
            </div>
            <div class="rules-card-tag" style="color:${rarityColour[b.rarity]}">${b.rarity}</div>
          </div>`).join('')}
      </div>
    </section>`).join('')}
</div>

<style>
.rules-panel{max-height:70vh;overflow-y:auto;padding-right:6px}
.rules-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
.rules-header h3{margin:0;font-size:1.1rem;font-weight:600}
.rules-header .btn-link{font-size:.8rem;padding:4px 8px}
.rules-category{margin-bottom:20px}
.rules-category-title{position:sticky;top:0;background:var(--neuro-bg);padding:8px 0;font-size:.95rem;font-weight:600;border-bottom:1px solid var(--neuro-shadow-dark);margin-bottom:10px;z-index:2}
.rules-grid{display:grid;gap:10px;grid-template-columns:repeat(auto-fill,minmax(220px,1fr))}
.rules-card{display:flex;align-items:center;gap:10px;background:var(--neuro-bg);border:1px solid var(--neuro-shadow-dark);border-radius:12px;padding:10px;box-shadow:var(--shadow-raised-sm);transition:all .2s}
.rules-card:hover{box-shadow:var(--shadow-raised);border-color:var(--neuro-accent)}
.rules-card-icon{font-size:1.6rem;line-height:1}
.rules-card-body{flex:1}
.rules-card-name{font-weight:600;font-size:.85rem;margin-bottom:2px}
.rules-card-desc{font-size:.75rem;opacity:.8;margin-bottom:4px}
.rules-card-rewards{display:flex;gap:8px;font-size:.7rem}
.rules-xp{background:rgba(16,185,129,.15);color:#10b981;padding:2px 6px;border-radius:4px}
.rules-karma{background:rgba(245,158,11,.15);color:#f59e0b;padding:2px 6px;border-radius:4px}
.rules-card-tag{font-size:.65rem;font-weight:600;text-transform:uppercase;letter-spacing:.5px}
</style>

<script>
(function(){
  const toggle = document.getElementById('rules-toggle');
  if (!toggle) return;
  let allOpen = false;
  toggle.textContent = 'Expand all';
  toggle.addEventListener('click', () => {
    document.querySelectorAll('.rules-category').forEach(sec => {
      sec.classList.toggle('open', !allOpen);
    });
    allOpen = !allOpen;
    toggle.textContent = allOpen ? 'Collapse all' : 'Expand all';
  });
})();
</script>
  `;
      };

      /*  OTHER HELPERS  */
      window.app.renderAboutHTML = () => `<div class="accordion-inner"><p><strong>The Curiosity Path</strong> by Aanandoham, 2026.</p><p>A digital way, for a digital practitioner, to continue practicing Spirituality in the 21st Century.</p><p>This App was built to share tools, practices and ancient wisdom - digitally, from your device.</p><p>It is a convenient, accessible way, to stay connected to your 'Self', by small daily practices.</p><p>My hope is that you will utilize it to enhance your life, one small function at a time.</p></div>`;
      window.app.renderContactHTML = () => `<div class="accordion-inner"><p>Contact me for questions, private sessions, classes, retreats, guidance or any technical issues.</p><a href="https://lironkerem.wixsite.com/project-curiosity" target="_blank" style="font-weight:bold;text-decoration:underline;color:var(--neuro-accent);">Official website</a><br><a href="mailto:lironkerem@gmail.com" style="font-weight:bold;text-decoration:underline;color:var(--neuro-accent);">Email me</a><br><a href="https://www.facebook.com/AanandohamsProjectCuriosity" target="_blank" style="font-weight:bold;text-decoration:underline;color:var(--neuro-accent);">Facebook Page</a></div>`;
      window.app.renderExportHTML = () => `<div class="accordion-inner"><button class="btn-link" onclick="window.app.exportUserData()">Download JSON</button></div>`;
      window.app.renderBillingHTML = () => `<div class="accordion-inner"><p><strong>Free</strong> - basic tools, ads free forever.</p><p><strong>Practitioner</strong> - full Premium packs, monthly.</p><p><strong>Adept</strong> - Premium packs + Sessons discounts, monthly.</p><p><strong>Master</strong> - Premium packs + Discounts + 1-on-1 calls.</p><button class="btn-link">Choose plan</button></div>`;
      window.app.renderAdminHTML = () => `<div class="accordion-inner" id="admin-panel-container"><div id="admin-tab-mount"></div></div>`;

      window.app.renderSettingsHTML = () => {
        const activeTheme = localStorage.getItem('activeTheme') || 'default';
        const isDarkMode = document.body.classList.contains('dark-mode');
        const hasChampagne = this.app.gamification?.state?.unlockedFeatures?.includes('luxury_champagne_gold_skin');
        const hasIndigo = this.app.gamification?.state?.unlockedFeatures?.includes('royal_indigo_skin');
        const hasEarth = this.app.gamification?.state?.unlockedFeatures?.includes('earth_luxury_skin');
        return `
        <div class="accordion-inner">
          <div style="margin-bottom:16px;">
            <div class="toggle-switch-container">
              <span class="toggle-switch-label">🌙 Dark Mode</span>
              <label class="toggle-switch">
                <input type="checkbox" id="dark-mode-toggle" ${isDarkMode ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
          <hr style="border:none;height:1px;background:rgba(0,0,0,.1);margin:16px 0;">
          <div style="margin-bottom:12px;font-weight:600;">Select Theme</div>
          <div class="toggle-switch-container">
            <span class="toggle-switch-label">Default (Neumorphic)</span>
            <label class="toggle-switch">
              <input type="checkbox" class="theme-toggle" data-theme="default" ${activeTheme === 'default' ? 'checked' : ''}>
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="toggle-switch-container">
            <span class="toggle-switch-label">Escaping the Matrix</span>
            <label class="toggle-switch">
              <input type="checkbox" class="theme-toggle" data-theme="matrix-code" ${activeTheme === 'matrix-code' ? 'checked' : ''}>
              <span class="toggle-slider"></span>
            </label>
          </div>
          <hr style="border:none;height:1px;background:rgba(0,0,0,.1);margin:16px 0;">
          <div style="margin-bottom:12px;font-weight:600;">Premium Themes</div>
          <div class="toggle-switch-container ${hasChampagne ? '' : 'disabled'}" title="${hasChampagne ? '' : '🔒 Purchase in Karma Shop to unlock'}">
            <span class="toggle-switch-label">Champagne Gold ${hasChampagne ? '' : '🔒'}</span>
            <label class="toggle-switch">
              <input type="checkbox" class="theme-toggle" data-theme="champagne-gold" ${activeTheme === 'champagne-gold' ? 'checked' : ''} ${hasChampagne ? '' : 'disabled'}>
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="toggle-switch-container ${hasIndigo ? '' : 'disabled'}" title="${hasIndigo ? '' : '🔒 Purchase in Karma Shop to unlock'}">
            <span class="toggle-switch-label">Royal Indigo ${hasIndigo ? '' : '🔒'}</span>
            <label class="toggle-switch">
              <input type="checkbox" class="theme-toggle" data-theme="royal-indigo" ${activeTheme === 'royal-indigo' ? 'checked' : ''} ${hasIndigo ? '' : 'disabled'}>
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="toggle-switch-container ${hasEarth ? '' : 'disabled'}" title="${hasEarth ? '' : '🔒 Purchase in Karma Shop to unlock'}">
            <span class="toggle-switch-label">Earth Luxury ${hasEarth ? '' : '🔒'}</span>
            <label class="toggle-switch">
              <input type="checkbox" class="theme-toggle" data-theme="earth-luxury" ${activeTheme === 'earth-luxury' ? 'checked' : ''} ${hasEarth ? '' : 'disabled'}>
              <span class="toggle-slider"></span>
            </label>
          </div>
          <hr style="border:none;height:1px;background:rgba(0,0,0,.1);margin:12px 0;">
          <small style="opacity:.7">Changes apply immediately. Dark mode works with all themes!</small>
        </div>`;
      };

window.app.renderAutomationsHTML = () => {
  const automations = JSON.parse(localStorage.getItem('wellness_automations')) || {
    selfReset: { enabled: false, interval: 60 },
    fullBodyScan: { enabled: false, interval: 180 },
    nervousSystem: { enabled: false, interval: 120 },
    tensionSweep: { enabled: false, interval: 120 }
  };
  return `
    <div class="accordion-inner">
      <p style="font-size:0.85rem;margin-bottom:12px;opacity:0.8;">Enable automatic reminders for your wellness practices</p>
      ${['self-reset','full-body-scan','nervous-system','tension-sweep'].map((t,idx)=>`
      <div class="automation-group">
        <div class="automation-header">
          <label class="automation-label">
            <input type="checkbox" id="auto-${t}" ${automations[t.replace('-','')].enabled ? 'checked' : ''}>
            <span>${['🧘 Self Reset','🌊 Full Body Scan','⚡ Nervous System Reset','🌀 Tension Sweep'][idx]}</span>
          </label>
        </div>
        <div class="automation-controls ${automations[t.replace('-','')].enabled ? '' : 'disabled'}">
          <label>Every <input type="number" id="interval-${t}" value="${automations[t.replace('-','')].interval}" min="15" max="480" step="15" ${automations[t.replace('-','')].enabled ? '' : 'disabled'}> minutes</label>
        </div>
      </div>`).join('')}
      <button class="btn-link" id="save-automations-btn">Save Automation Settings</button>
      <hr style="border:none;height:1px;background:rgba(0,0,0,.1);margin:12px 0;">
      <small style="opacity:.7;font-size:0.75rem;">⚠️ Automations will trigger pop-up reminders at your chosen intervals while the app is open.</small>
    </div>`;
};

      /*  NOTIFICATION HELPERS  */
      window.app.enablePushNotifications = async function () {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
          this.showToast('❌ Push notifications not supported', 'error'); return false;
        }
        try {
          const permission = await Notification.requestPermission();
          if (permission !== 'granted') { this.showToast('❌ Notification permission denied', 'error'); return false; }
          const sw = await navigator.serviceWorker.ready;
          let sub = await sw.pushManager.getSubscription();
          if (!sub) {
            const VAPID_KEY = 'BGC3GSs75wSk-IXvSHfsmr725CJnQxNuYJHExJZ113yITzwPgAZrVe6-IGyD1zC_t5mtH3-HG1P4GndS8PnSrOc';
            sub = await sw.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: this.urlBase64ToUint8Array(VAPID_KEY) });
            const payload = this.state?.currentUser?.id ? { ...sub.toJSON(), user_id: this.state.currentUser.id } : sub;
            const res = await fetch('/api/save-sub', { method: 'POST', headers: { 'Content-Type': 'application/json', ...(this.auth?.session?.access_token && { Authorization: `Bearer ${this.auth.session.access_token}` }) }, body: JSON.stringify(payload) });
            if (!res.ok) throw new Error('Failed to save subscription');
          }
          this.showToast('✅ Notifications enabled!', 'success'); return true;
        } catch (err) { console.error(err); this.showToast('❌ Failed to enable notifications', 'error'); return false; }
      };
      window.app.disablePushNotifications = async function () {
        try { const sw = await navigator.serviceWorker.ready; const sub = await sw.pushManager.getSubscription(); if (sub) { await sub.unsubscribe(); this.showToast('🔕 Notifications disabled', 'success'); } } catch (e) { console.error(e); }
      };
      window.app.urlBase64ToUint8Array = function (base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
        const rawData = atob(base64);
        return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
      };
      window.app.saveNotificationSettings = async function () { const settings = { enabled: document.getElementById('master-notifications-toggle')?.checked || false, reminders: { morning: { enabled: document.getElementById('reminder-morning')?.checked || false, time: document.getElementById('time-morning')?.value || '08:00' }, afternoon: { enabled: document.getElementById('reminder-afternoon')?.checked || false, time: document.getElementById('time-afternoon')?.value || '13:00' }, evening: { enabled: document.getElementById('reminder-evening')?.checked || false, time: document.getElementById('time-evening')?.value || '18:00' }, night: { enabled: document.getElementById('reminder-night')?.checked || false, time: document.getElementById('time-night')?.value || '21:00' } }, quotes: { enabled: document.getElementById('quotes-enabled')?.checked || false }, affirmations: { enabled: document.getElementById('affirmations-enabled')?.checked || false }, frequency: document.getElementById('inspirational-frequency')?.value || 'moderate', wellness: { enabled: document.getElementById('wellness-notifications')?.checked || false, syncWithAutomations: true } }; localStorage.setItem('notification_settings', JSON.stringify(settings)); const { error } = await supabase.from('notification_prefs').upsert({ user_id: this.state.currentUser.id, prefs: settings }, { onConflict: 'user_id' }); if (error) { console.error(error); this.showToast('⚠️ Saved locally, but cloud sync failed', 'error'); } else { this.showToast('✅ Settings saved & scheduled', 'success'); } this.scheduleNotifications(settings); };
      window.app.sendTestNotification = async function () { try { const res = await fetch('/api/subs'); const subs = await res.json(); if (!subs.length) { this.showToast('❌ No subscriptions found', 'error'); return; } const response = await fetch('/api/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sub: subs[subs.length - 1], payload: { title: '✨ The Curiosity Path', body: 'Test notification from Aanandoham!', icon: '/Icons/icon-192x192.png', data: { url: '/' } } }) }); const result = await response.json(); if (response.ok) { this.showToast('📱 Test notification sent!', 'success'); } else throw new Error(result.error); } catch (err) { console.error(err); this.showToast('❌ Failed: ' + err.message, 'error'); } };
      window.app.scheduleNotifications = function (settings) { if (this._notificationTimers) this._notificationTimers.forEach(t => clearTimeout(t)); this._notificationTimers = []; if (!settings.enabled) return; Object.entries(settings.reminders).forEach(([p, c]) => { if (c.enabled) this.scheduleDailyNotification(p, c.time); }); if (settings.quotes.enabled || settings.affirmations.enabled) this.scheduleInspirationalNotifications(settings); if (settings.wellness.enabled) this.scheduleWellnessNotifications(settings); };
      window.app.scheduleDailyNotification = function (period, time) { const [h, m] = time.split(':').map(Number); const now = new Date(); const scheduled = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0); if (scheduled < now) scheduled.setDate(scheduled.getDate() + 1); const delay = scheduled - now; const timer = setTimeout(() => { this.sendScheduledNotification(period); this.scheduleDailyNotification(period, time); }, delay); this._notificationTimers.push(timer); };
      window.app.sendScheduledNotification = async function (period) { const messages = { morning: { title: '🌅 Good Morning!', body: 'Start your day with intention. How are you feeling?' }, afternoon: { title: '☀️ Afternoon Check-in', body: 'Take a moment to breathe and reflect.' }, evening: { title: '🌆 Evening Reflection', body: 'How was your day? Time to unwind.' }, night: { title: '🌙 Goodnight', body: 'Rest well. Tomorrow is a new beginning.' } }; try { const res = await fetch('/api/subs'); const subs = await res.json(); if (!subs.length) return; await fetch('/api/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sub: subs[0], payload: { ...messages[period], icon: '/Icons/icon-192x192.png', data: { url: '/' } } }) }); } catch (e) { console.error(e); } };
      window.app.scheduleInspirationalNotifications = function (settings) { const intervals = { light: 4 * 60 * 60 * 1000, moderate: 2 * 60 * 60 * 1000, intense: 90 * 60 * 1000 }; const send = async () => { let content; const both = settings.quotes.enabled && settings.affirmations.enabled; if (both) { if (Math.random() < 0.5 && window.QuotesData?.getRandomQuote) { const q = window.QuotesData.getRandomQuote(); content = { title: '💭 Daily Quote', body: `"${q.text}" - ${q.author}` }; } else if (window.affirmations?.length) { content = { title: '🌟 Daily Affirmation', body: window.affirmations[Math.floor(Math.random() * window.affirmations.length)] }; } } else if (settings.quotes.enabled && window.QuotesData?.getRandomQuote) { const q = window.QuotesData.getRandomQuote(); content = { title: '💭 Daily Quote', body: `"${q.text}" - ${q.author}` }; } else if (settings.affirmations.enabled && window.affirmations?.length) { content = { title: '🌟 Daily Affirmation', body: window.affirmations[Math.floor(Math.random() * window.affirmations.length)] }; } if (!content) return; try { const res = await fetch('/api/subs'); const subs = await res.json(); if (!subs.length) return; await fetch('/api/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sub: subs[0], payload: { ...content, icon: '/Icons/icon-192x192.png', data: { url: '/' } } }) }); } catch (e) { console.error(e); } }; const next = () => { const t = setTimeout(() => { send(); next(); }, intervals[settings.frequency]); this._notificationTimers.push(t); }; next(); };
      window.app.scheduleWellnessNotifications = function (settings) { if (!settings.wellness.enabled) return; const automations = JSON.parse(localStorage.getItem('wellness_automations')) || {}; const msgs = { selfReset: { title: '🧘 Self Reset Reminder', body: 'Time to pause and reset. Take a moment for yourself.' }, fullBodyScan: { title: '🌊 Body Scan Time', body: 'Listen to your body. Scan from head to toe and release tension.' }, nervousSystem: { title: '⚡ Nervous System Reset', body: 'Time to calm your nervous system. Deep breaths.' }, tensionSweep: { title: '🌀 Tension Sweep', body: 'Sweep away accumulated tension. Relax and let go.' } }; Object.entries(automations).forEach(([k, c]) => { if (c.enabled && c.interval) this.scheduleWellnessReminder(k, c.interval, msgs[k]); }); };
      window.app.scheduleWellnessReminder = function (type, intervalMinutes, message) { const intervalMs = intervalMinutes * 60 * 1000; const send = async () => { try { const res = await fetch('/api/subs'); const subs = await res.json(); if (!subs.length) return; await fetch('/api/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sub: subs[0], payload: { title: message.title, body: message.body, icon: '/Icons/icon-192x192.png', data: { url: '/' } } }) }); } catch (e) { console.error(e); } }; const next = () => { const t = setTimeout(() => { send(); next(); }, intervalMs); this._notificationTimers.push(t); }; next(); };
    }

    const dropdown = document.getElementById('user-dropdown');
    if (!dropdown) return;

    document.querySelectorAll('.dropdown-item[data-section]').forEach(btn => {
      btn.addEventListener('click', () => {
        const section = btn.dataset.section;
        const panel = document.getElementById(`panel-${section}`);
        const isOpen = panel.classList.contains('active');
        document.querySelectorAll('.accordion-panel').forEach(p => p.classList.remove('active'));
        if (!isOpen) {
          panel.classList.add('active');
          if (!panel.dataset.filled) {
            switch (section) {
              case 'profile': panel.innerHTML = window.app.renderProfileHTML(); break;
              case 'settings': panel.innerHTML = window.app.renderSettingsHTML(); break;
              case 'notifications': panel.innerHTML = window.app.renderNotificationsHTML(); break;
              case 'automations': panel.innerHTML = window.app.renderAutomationsHTML(); break;
              case 'about': panel.innerHTML = window.app.renderAboutHTML(); break;
              case 'rules': panel.innerHTML = window.app.renderRulesHTML(); break;
              case 'contact': panel.innerHTML = window.app.renderContactHTML(); break;
              case 'export': panel.innerHTML = window.app.renderExportHTML(); break;
              case 'billing': panel.innerHTML = window.app.renderBillingHTML(); break;
              case 'admin': panel.innerHTML = window.app.renderAdminHTML(); this.loadAdminPanel(); break;
            }
            panel.dataset.filled = '1';
            if (section === 'profile') this.attachProfileHandlers();
            if (section === 'settings') this.attachSettingsHandlers();
            if (section === 'notifications') this.attachNotificationsHandlers();
            if (section === 'automations') this.attachAutomationsHandlers();
          }
        }
      });
    });

    document.querySelector('[data-action="logout"]')?.addEventListener('click', () => this.showLogoutModal());

    this.btn = document.getElementById('user-menu-btn');
    if (!this.btn) return;

    this.btn.addEventListener('click', e => {
      e.stopPropagation();
      const expanded = this.btn.getAttribute('aria-expanded') === 'true';
      this.btn.setAttribute('aria-expanded', !expanded);
      dropdown.classList.toggle('active');
      this.syncAvatar();
    });

    document.addEventListener('click', e => {
      if (!this.btn.contains(e.target) && !dropdown.contains(e.target)) {
        this.btn.setAttribute('aria-expanded', 'false');
        dropdown.classList.remove('active');
      }
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        this.btn.setAttribute('aria-expanded', 'false');
        dropdown.classList.remove('active');
      }
    });

    this.syncAvatar();
    this.loadActiveTheme();
    this.restoreDarkMode();
    this.hydrateUserProfile();
  }

  attachProfileHandlers() {
    document.getElementById('profile-emoji')?.addEventListener('change', e => {
      const emojiSpan = document.querySelector('.profile-avatar-emoji');
      const img = document.getElementById('profile-avatar-img');
      if (emojiSpan) emojiSpan.textContent = e.target.value;
      if (img) { img.style.display = 'none'; emojiSpan.style.display = 'block'; }
    });
    document.getElementById('avatar-upload')?.addEventListener('change', () => this.liveAvatarPreview());
    document.getElementById('save-profile-btn')?.addEventListener('click', () => this.saveQuickProfile());
  }

  attachSettingsHandlers() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
      darkModeToggle.addEventListener('change', e => {
        const activeTheme = localStorage.getItem('activeTheme') || 'default';
        const isChecked = e.target.checked;
        if (isChecked) document.body.classList.add('dark-mode'); else document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', isChecked ? 'enabled' : 'disabled');
        if (activeTheme === 'default') {
          if (isChecked) document.getElementById('dark-mode-css')?.removeAttribute('disabled');
          else document.getElementById('dark-mode-css')?.setAttribute('disabled', 'true');
        } else document.getElementById('dark-mode-css')?.setAttribute('disabled', 'true');
        if (activeTheme === 'matrix-code' && window.app?.initMatrixRain) setTimeout(() => window.app.initMatrixRain(), 50);
      });
    }
    document.querySelectorAll('.theme-toggle').forEach(toggle => {
      toggle.addEventListener('change', e => {
        if (e.target.checked) {
          document.querySelectorAll('.theme-toggle').forEach(other => { if (other !== e.target) other.checked = false; });
          this.switchTheme(e.target.dataset.theme);
        } else e.target.checked = true;
      });
    });
  }

  attachNotificationsHandlers() {
    const masterToggle = document.getElementById('master-notifications-toggle');
    const optionsDiv = document.getElementById('notification-options');
    let saveTimeout;
    const autoSave = () => { clearTimeout(saveTimeout); saveTimeout = setTimeout(() => this.app.saveNotificationSettings(), 1500); };
    masterToggle?.addEventListener('change', async (e) => {
      if (e.target.checked) {
        const granted = await this.app.enablePushNotifications();
        if (!granted) { e.target.checked = false; return; }
        optionsDiv.style.opacity = '1'; optionsDiv.style.pointerEvents = 'auto';
      } else {
        await this.app.disablePushNotifications();
        optionsDiv.style.opacity = '.4'; optionsDiv.style.pointerEvents = 'none';
      }
      autoSave();
    });
    ['morning', 'afternoon', 'evening', 'night'].forEach(p => {
      const toggle = document.getElementById(`reminder-${p}`);
      const timeInput = document.getElementById(`time-${p}`);
      toggle?.addEventListener('change', e => { timeInput.disabled = !e.target.checked; autoSave(); });
      timeInput?.addEventListener('change', autoSave);
    });
    const quotesToggle = document.getElementById('quotes-enabled');
    const affirmationsToggle = document.getElementById('affirmations-enabled');
    const freqSelect = document.getElementById('inspirational-frequency');
    const updateFreq = () => { const any = quotesToggle?.checked || affirmationsToggle?.checked; freqSelect.disabled = !any; freqSelect.parentElement.style.opacity = any ? '1' : '.4'; freqSelect.parentElement.style.pointerEvents = any ? 'auto' : 'none'; };
    quotesToggle?.addEventListener('change', () => { updateFreq(); autoSave(); });
    affirmationsToggle?.addEventListener('change', () => { updateFreq(); autoSave(); });
    freqSelect?.addEventListener('change', autoSave);
    document.getElementById('wellness-notifications')?.addEventListener('change', autoSave);
    document.getElementById('save-notification-settings')?.addEventListener('click', () => { clearTimeout(saveTimeout); this.app.saveNotificationSettings(); });
    document.getElementById('test-notification')?.addEventListener('click', () => this.app.sendTestNotification());
  }

  attachAutomationsHandlers() {
    ['self-reset', 'full-body-scan', 'nervous-system', 'tension-sweep'].forEach(t => {
      const c = document.getElementById(`auto-${t}`);
      const i = document.getElementById(`interval-${t}`);
      const p = c?.closest('.automation-group')?.querySelector('.automation-controls');
      c?.addEventListener('change', e => { if (i) i.disabled = !e.target.checked; if (p) p.classList.toggle('disabled', !e.target.checked); });
    });
    document.getElementById('save-automations-btn')?.addEventListener('click', () => this.saveAutomations());
  }

  saveAutomations() {
    const automations = {
      selfReset: { enabled: document.getElementById('auto-self-reset')?.checked || false, interval: parseInt(document.getElementById('interval-self-reset')?.value || 60) },
      fullBodyScan: { enabled: document.getElementById('auto-full-body-scan')?.checked || false, interval: parseInt(document.getElementById('interval-full-body-scan')?.value || 180) },
      nervousSystem: { enabled: document.getElementById('auto-nervous-system')?.checked || false, interval: parseInt(document.getElementById('interval-nervous-system')?.value || 120) },
      tensionSweep: { enabled: document.getElementById('auto-tension-sweep')?.checked || false, interval: parseInt(document.getElementById('interval-tension-sweep')?.value || 120) }
    };
    localStorage.setItem('wellness_automations', JSON.stringify(automations));
    if (window.app.restartAutomations) window.app.restartAutomations();
    const notifSettings = JSON.parse(localStorage.getItem('notification_settings')) || {};
    if (notifSettings.enabled && notifSettings.wellness?.enabled) window.app.scheduleNotifications(notifSettings);
    this.app.showToast('✅ Automation settings saved!', 'success');
  }

  liveAvatarPreview() {
    const file = document.getElementById('avatar-upload').files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      const img = document.getElementById('profile-avatar-img');
      const emoji = document.querySelector('.profile-avatar-emoji');
      if (img) { img.src = e.target.result; img.style.display = 'block'; }
      if (emoji) emoji.style.display = 'none';
    };
    reader.readAsDataURL(file);
  }

  loadActiveTheme() {
    try {
      const t = localStorage.getItem('activeTheme');
      if (t && t !== 'default') setTimeout(() => this.switchTheme(t), 100);
    } catch (e) {
      console.warn(e);
      localStorage.setItem('activeTheme', 'default');
    }
  }

  switchTheme(themeName) {
    if (themeName !== 'default') document.getElementById('dark-mode-css')?.setAttribute('disabled', 'true');
    document.body.classList.remove('champagne-gold', 'royal-indigo', 'earth-luxury', 'matrix-code');
    document.querySelectorAll('link[data-premium-theme]').forEach(l => l.remove());
    const rain = document.querySelector('.matrix-rain-container');
    if (rain) rain.remove();
    localStorage.setItem('activeTheme', themeName);
    if (themeName === 'default') {
      document.getElementById('dark-mode-css')?.removeAttribute('disabled');
      return;
    }
    document.body.classList.add(themeName);
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `./Assets/CSS/${themeName}.css`;
    link.setAttribute('data-premium-theme', themeName);
    document.head.appendChild(link);
    if (themeName === 'matrix-code' && window.app?.initMatrixRain) setTimeout(() => window.app.initMatrixRain(), 100);
  }

  restoreDarkMode() {
    const saved = localStorage.getItem('darkMode');
    const isDark = saved === 'enabled';
    if (isDark) {
      document.body.classList.add('dark-mode');
      const activeTheme = localStorage.getItem('activeTheme') || 'default';
      if (activeTheme === 'default') document.getElementById('dark-mode-css')?.removeAttribute('disabled');
      else document.getElementById('dark-mode-css')?.setAttribute('disabled', 'true');
      const toggle = document.getElementById('dark-mode-toggle');
      if (toggle) toggle.checked = true;
    }
  }

  loadAdminPanel() {
    const mount = document.getElementById('admin-tab-mount');
    if (!mount) return;
    mount.innerHTML = '<div style="text-align:center;padding:20px;color:var(--neuro-text);">Loading admin panel...</div>';
    import('./Admin-Tab.js')
      .then(({ AdminTab }) => import('./Supabase.js').then(({ supabase }) => new AdminTab(supabase).render()))
      .then(content => { mount.innerHTML = ''; mount.appendChild(content); })
      .catch(err => { console.error(err); mount.innerHTML = '<div style="color:#ff4757;padding:10px;">Failed to load admin panel: ' + err.message + '</div>'; });
  }

  syncAvatar() {
    const u = this.app.state.currentUser || {};
    const iconFace = this.btn.querySelector('.disc-icon');
    const avFace = this.btn.querySelector('.disc-avatar');
    const avImg = this.btn.querySelector('.disc-avatar-img');
    const avEmoji = this.btn.querySelector('.disc-avatar-emoji');

    if (u.avatar_url && u.avatar_url.trim() !== '') {
      avImg.src = u.avatar_url;
      avImg.classList.remove('hidden');
      avEmoji.classList.add('hidden');
      this.btn.classList.add('avatar-mode');
    } else {
      avEmoji.textContent = u.emoji || '👤';
      avImg.classList.add('hidden');
      avEmoji.classList.remove('hidden');
      this.btn.classList.remove('avatar-mode');
    }
  }

  showLogoutModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="neuro-modal modal-small">
        <div class="modal-header"><div class="modal-icon">🚪</div><h3 class="modal-title">Logout?</h3></div>
        <p class="modal-message">Are you sure you want to logout?</p>
        <div class="modal-actions">
          <button class="btn" id="cancel-logout">Cancel</button>
          <button class="btn btn-primary" id="confirm-logout">Logout</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
    modal.querySelector('#cancel-logout').onclick = () => modal.remove();
    modal.querySelector('#confirm-logout').onclick = () => { modal.remove(); window.app.logout(); };
    modal.onclick = e => { if (e.target === modal) modal.remove(); };
  }
}