export class AdminTab {
  constructor(supabase) {
    this.supabase = supabase;
    this.users = [];
    this.selectedUsers = [];
    
    // Premium features list
    this.premiumFeatures = [
      'advance_tarot_spreads',
      'tarot_vision_ai',
      'shadow_alchemy_lab',
      'advanced_meditations',
      'luxury_blush_champagne_skin',
      'luxury_champagne_gold_skin',
      'luxury_marble_bronze_skin',
      'royal_indigo_skin',
      'earth_luxury_skin'
    ];
    
    // Badges list
    this.availableBadges = [
      { id: 'early_supporter', name: 'Early Supporter', icon: '🌟' },
      { id: 'vip_member', name: 'VIP Member', icon: '👑' },
      { id: 'beta_tester', name: 'Beta Tester', icon: '🧪' },
      { id: 'spiritual_guide', name: 'Spiritual Guide', icon: '🕉️' },
      { id: 'community_hero', name: 'Community Hero', icon: '🦸' }
    ];
  }

  async render() {
    const container = document.createElement('div');
    container.className = 'admin-tab';
    container.style.cssText = 'padding:20px;max-width:100%;color:var(--neuro-text);';

    container.innerHTML = `
      <!-- User Selection Section -->
      <div style="background:var(--neuro-bg);border:2px solid var(--neuro-accent);border-radius:12px;padding:16px;margin-bottom:20px;box-shadow:var(--shadow-raised);">
        <h3 style="color:var(--neuro-text);margin-bottom:12px;font-size:0.95rem;font-weight:600;">👥 Select Users</h3>
        <div style="display:flex;gap:10px;margin-bottom:12px;">
          <button id="selectAll" style="flex:1;padding:8px 16px;background:var(--neuro-accent);color:white;border:none;border-radius:8px;cursor:pointer;font-size:0.85rem;font-weight:600;">Select All</button>
          <button id="clearSelection" style="flex:1;padding:8px 16px;background:#ff4757;color:white;border:none;border-radius:8px;cursor:pointer;font-size:0.85rem;font-weight:600;">Clear</button>
        </div>
        <div style="background:rgba(102,126,234,0.05);padding:8px 12px;border-radius:8px;margin-bottom:12px;">
          <span id="selectedCount" style="color:var(--neuro-text);font-weight:600;font-size:0.85rem;">0 users selected</span>
        </div>
        <div id="userCheckboxes" style="max-height:180px;overflow-y:auto;border:1px solid rgba(102,126,234,0.3);border-radius:8px;padding:8px;background:rgba(0,0,0,0.02);"></div>
      </div>

      <!-- Accordion-style Sections -->
      <div style="display:flex;flex-direction:column;gap:12px;">
        
        <!-- XP & Karma Section -->
        <div class="admin-section">
          <button class="admin-accordion-btn" data-section="xp-karma">
            <span style="font-size:1.2rem;margin-right:10px;">💎</span>
            <span style="flex:1;text-align:left;font-weight:600;font-size:0.95rem;">XP & Karma</span>
            <span class="accordion-chevron">▼</span>
          </button>
          <div class="admin-accordion-panel" id="panel-xp-karma"></div>
        </div>

        <!-- Features Section -->
        <div class="admin-section">
          <button class="admin-accordion-btn" data-section="features">
            <span style="font-size:1.2rem;margin-right:10px;">🔓</span>
            <span style="flex:1;text-align:left;font-weight:600;font-size:0.95rem;">Premium Features</span>
            <span class="accordion-chevron">▼</span>
          </button>
          <div class="admin-accordion-panel" id="panel-features"></div>
        </div>

        <!-- Badges Section -->
        <div class="admin-section">
          <button class="admin-accordion-btn" data-section="badges">
            <span style="font-size:1.2rem;margin-right:10px;">🎖️</span>
            <span style="flex:1;text-align:left;font-weight:600;font-size:0.95rem;">Badges</span>
            <span class="accordion-chevron">▼</span>
          </button>
          <div class="admin-accordion-panel" id="panel-badges"></div>
        </div>

        <!-- Messages Section -->
        <div class="admin-section">
          <button class="admin-accordion-btn" data-section="messages">
            <span style="font-size:1.2rem;margin-right:10px;">💬</span>
            <span style="flex:1;text-align:left;font-weight:600;font-size:0.95rem;">Messages</span>
            <span class="accordion-chevron">▼</span>
          </button>
          <div class="admin-accordion-panel" id="panel-messages"></div>
        </div>
        
      </div>
      
      <div id="message" style="margin-top:20px;font-weight:bold;padding:12px;border-radius:8px;display:none;font-size:0.85rem;"></div>

      <style>
        .admin-section {
          background:var(--neuro-bg);
          border:2px solid var(--neuro-accent);
          border-radius:12px;
          box-shadow:var(--shadow-raised);
          overflow:hidden;
        }
        
        .admin-accordion-btn {
          display:flex;
          align-items:center;
          width:100%;
          padding:12px 16px;
          background:var(--neuro-bg);
          border:none;
          color:var(--neuro-text);
          cursor:pointer;
          font-size:0.95rem;
          transition:all 0.2s;
        }
        
        .admin-accordion-btn:hover {
          background:rgba(102,126,234,0.05);
        }
        
        .accordion-chevron {
          font-size:0.8rem;
          color:var(--neuro-text-light);
          transition:transform 0.2s;
        }
        
        .admin-accordion-btn.active .accordion-chevron {
          transform:rotate(180deg);
        }
        
        .admin-accordion-panel {
          padding:0 20px;
          max-height:0;
          overflow:hidden;
          transition:max-height 0.3s ease, padding 0.3s ease;
        }
        
        .admin-accordion-panel.active {
          max-height:2000px;
          padding:20px;
        }
        
        .user-checkbox-item {
          display:flex;
          align-items:center;
          gap:8px;
          padding:8px;
          border-radius:6px;
          margin-bottom:4px;
          cursor:pointer;
          transition:background 0.2s;
        }
        .user-checkbox-item:hover {
          background:rgba(102,126,234,0.1);
        }
        .user-checkbox-item input[type="checkbox"] {
          cursor:pointer;
          width:16px;
          height:16px;
        }
        .admin-input {
          width:100%;
          padding:10px;
          background:var(--neuro-bg);
          border:2px solid var(--neuro-accent);
          border-radius:8px;
          color:var(--neuro-text);
          font-size:0.85rem;
          box-shadow:var(--shadow-inset-sm);
          transition:all 0.2s;
        }
        .admin-input:focus {
          outline:none;
          border-color:var(--neuro-accent-light);
          box-shadow:var(--shadow-glow);
        }
        .admin-btn {
          width:100%;
          padding:10px;
          background:var(--neuro-accent);
          color:white;
          border:none;
          border-radius:10px;
          cursor:pointer;
          font-weight:600;
          font-size:0.85rem;
          box-shadow:var(--shadow-raised);
          transition:all 0.2s;
        }
        .admin-btn:hover {
          transform:translateY(-2px);
          box-shadow:var(--shadow-raised-hover);
        }
        .admin-btn:active {
          transform:translateY(0);
          box-shadow:var(--shadow-inset);
        }
        .feature-checkbox-item {
          display:flex;
          align-items:center;
          gap:10px;
          padding:10px 12px;
          background:rgba(102,126,234,0.05);
          border:1px solid rgba(102,126,234,0.2);
          border-radius:8px;
          margin-bottom:8px;
          cursor:pointer;
          transition:all 0.2s;
        }
        .feature-checkbox-item:hover {
          background:rgba(102,126,234,0.15);
          border-color:var(--neuro-accent);
        }
        .feature-checkbox-item input {
          cursor:pointer;
          width:18px;
          height:18px;
        }
        .section-title {
          font-size:1.1rem;
          font-weight:700;
          color:var(--neuro-text);
          margin-bottom:12px;
          display:flex;
          align-items:center;
          gap:8px;
        }
      </style>
    `;

    try {
      await this.fetchUsers();
      this.renderUserCheckboxes(container);
      this.attachEventListeners(container);
    } catch (error) {
      console.error('Error fetching users:', error);
      container.querySelector('#userCheckboxes').innerHTML = '<p style="color:#ff4757;">Error loading users</p>';
    }

    return container;
  }
async fetchUsers() {
    try {
      const { data: profiles, error: profileError } = await this.supabase
        .from('profiles')
        .select('id, name, email, phone');
      
      if (profileError) throw profileError;

      const { data: progress, error: progressError } = await this.supabase
        .from('user_progress')
        .select('user_id, payload');
      
      if (progressError) throw progressError;

      this.users = (profiles || []).map(p => {
        const userProgress = (progress || []).find(pr => pr.user_id === p.id);
        return {
          id: p.id,
          name: p.name || 'No name',
          email: p.email || p.phone || 'No contact',
          xp: userProgress?.payload?.xp || 0,
          karma: userProgress?.payload?.karma || 0,
          level: userProgress?.payload?.level || 1
        };
      });
    } catch (error) {
      console.error('Failed to fetch users:', error);
      this.users = [];
      throw error;
    }
  }

  renderUserCheckboxes(container) {
    const checkboxContainer = container.querySelector('#userCheckboxes');
    if (!checkboxContainer) return;

    checkboxContainer.innerHTML = this.users.map(user => `
      <label class="user-checkbox-item">
        <input type="checkbox" class="user-checkbox" value="${user.id}">
        <span>${user.name} (${user.email}) - L${user.level}</span>
      </label>
    `).join('');
  }

  renderTabContent(container, section) {
    const panel = container.querySelector(`#panel-${section}`);
    if (!panel) return;

    switch(section) {
      case 'xp-karma':
        panel.innerHTML = `
          <div style="display:grid;gap:24px;">
            <div style="background:rgba(102,126,234,0.05);padding:20px;border-radius:10px;border:1px solid rgba(102,126,234,0.2);">
              <label style="display:block;margin-bottom:10px;font-weight:600;color:var(--neuro-text);font-size:1rem;">⚡ XP Gift Amount</label>
              <input type="number" id="xpAmount" class="admin-input" placeholder="Enter XP amount" min="0" value="100" style="margin-bottom:12px;">
              <button id="giftXp" class="admin-btn">🎁 Gift XP to Selected Users</button>
            </div>
            <div style="background:rgba(102,126,234,0.05);padding:20px;border-radius:10px;border:1px solid rgba(102,126,234,0.2);">
              <label style="display:block;margin-bottom:10px;font-weight:600;color:var(--neuro-text);font-size:1rem;">🌟 Karma Gift Amount</label>
              <input type="number" id="karmaAmount" class="admin-input" placeholder="Enter Karma amount" min="0" value="50" style="margin-bottom:12px;">
              <button id="giftKarma" class="admin-btn">🎁 Gift Karma to Selected Users</button>
            </div>
          </div>
        `;
        this.attachXpKarmaHandlers(container);
        break;

      case 'features':
        panel.innerHTML = `
          <div style="display:grid;gap:20px;">
            <div>
              <label style="display:block;margin-bottom:12px;font-weight:600;color:var(--neuro-text);">Select Features:</label>
              <div style="max-height:220px;overflow-y:auto;padding:4px;">
                ${this.premiumFeatures.map(f => `
                  <label class="feature-checkbox-item">
                    <input type="checkbox" class="feature-checkbox" value="${f}">
                    <span style="flex:1;font-size:0.95rem;">${f.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                  </label>
                `).join('')}
              </div>
            </div>
            <div style="background:rgba(102,126,234,0.05);padding:16px;border-radius:10px;border:1px solid rgba(102,126,234,0.2);">
              <label style="display:block;margin-bottom:10px;font-weight:600;color:var(--neuro-text);">⏰ Unlock Duration:</label>
              <select id="featureDuration" class="admin-input" style="margin-bottom:12px;">
                <option value="permanent">🔓 Permanent</option>
                <option value="24h">⏱️ 24 Hours (Temporary)</option>
                <option value="48h">⏱️ 48 Hours (Temporary)</option>
                <option value="72h">⏱️ 72 Hours (Temporary)</option>
                <option value="1week">⏱️ 1 Week (Temporary)</option>
              </select>
              <button id="unlockFeatures" class="admin-btn">🔓 Unlock for Selected Users</button>
            </div>
          </div>
        `;
        this.attachFeaturesHandlers(container);
        break;

      case 'badges':
        panel.innerHTML = `
          <div style="display:grid;gap:20px;">
            <div>
              <label style="display:block;margin-bottom:12px;font-weight:600;color:var(--neuro-text);">Choose a Badge:</label>
              <div style="display:grid;gap:10px;">
                ${this.availableBadges.map(badge => `
                  <label class="feature-checkbox-item" style="cursor:pointer;padding:14px;">
                    <input type="radio" name="badge" class="badge-radio" value="${badge.id}">
                    <span style="font-size:1.8rem;margin-right:4px;">${badge.icon}</span>
                    <span style="flex:1;font-weight:600;font-size:1rem;">${badge.name}</span>
                  </label>
                `).join('')}
              </div>
            </div>
            <div style="background:rgba(102,126,234,0.05);padding:16px;border-radius:10px;border:1px solid rgba(102,126,234,0.2);">
              <button id="awardBadge" class="admin-btn">🎖️ Award to Selected Users</button>
            </div>
          </div>
        `;
        this.attachBadgesHandlers(container);
        break;

      case 'messages':
        panel.innerHTML = `
          <div style="display:grid;gap:20px;">
            <div style="background:rgba(102,126,234,0.05);padding:20px;border-radius:10px;border:1px solid rgba(102,126,234,0.2);">
              <label style="display:block;margin-bottom:10px;font-weight:600;color:var(--neuro-text);font-size:1rem;">📌 Message Title</label>
              <input type="text" id="messageTitle" class="admin-input" placeholder="e.g., Special Announcement" style="margin-bottom:20px;">
              
              <label style="display:block;margin-bottom:10px;font-weight:600;color:var(--neuro-text);font-size:1rem;">✏️ Message Content</label>
              <textarea id="messageContent" class="admin-input" rows="6" placeholder="Write your message here..." style="resize:vertical;font-family:inherit;margin-bottom:16px;"></textarea>
              
              <button id="sendMessage" class="admin-btn">💬 Send to Selected Users</button>
              
              <div style="margin-top:16px;padding:12px;background:rgba(255,193,7,0.1);border-radius:8px;border:1px solid rgba(255,193,7,0.3);">
                <p style="font-size:0.85rem;color:var(--neuro-text-light);margin:0;line-height:1.5;">
                  💡 <strong>Note:</strong> Messages will be stored in user profiles and users will receive push notifications immediately.
                </p>
              </div>
            </div>
          </div>
        `;
        this.attachMessagesHandlers(container);
        break;
    }
  }

  attachEventListeners(container) {
    // Select All / Clear
    container.querySelector('#selectAll')?.addEventListener('click', () => {
      container.querySelectorAll('.user-checkbox').forEach(cb => cb.checked = true);
      this.updateSelectedUsers(container);
    });

    container.querySelector('#clearSelection')?.addEventListener('click', () => {
      container.querySelectorAll('.user-checkbox').forEach(cb => cb.checked = false);
      this.updateSelectedUsers(container);
    });

    // User checkboxes
    container.querySelectorAll('.user-checkbox').forEach(cb => {
      cb.addEventListener('change', () => this.updateSelectedUsers(container));
    });

    // Accordion buttons
    container.querySelectorAll('.admin-accordion-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const section = btn.dataset.section;
        const panel = container.querySelector(`#panel-${section}`);
        const isOpen = panel.classList.contains('active');
        
        // Close all panels
        container.querySelectorAll('.admin-accordion-panel').forEach(p => p.classList.remove('active'));
        container.querySelectorAll('.admin-accordion-btn').forEach(b => b.classList.remove('active'));
        
        // Open clicked panel if it was closed
        if (!isOpen) {
          panel.classList.add('active');
          btn.classList.add('active');
          
          // Load content if not already loaded
          if (!panel.dataset.filled) {
            this.renderTabContent(container, section);
            panel.dataset.filled = '1';
          }
        }
      });
    });
  }

  updateSelectedUsers(container) {
    const selected = Array.from(container.querySelectorAll('.user-checkbox:checked')).map(cb => cb.value);
    this.selectedUsers = this.users.filter(u => selected.includes(u.id));
    container.querySelector('#selectedCount').textContent = `${this.selectedUsers.length} selected`;
  }

  attachXpKarmaHandlers(container) {
    container.querySelector('#giftXp')?.addEventListener('click', async () => {
      const amount = parseInt(container.querySelector('#xpAmount').value);
      if (!amount || amount < 0) return alert('Please enter a valid XP amount');
      if (this.selectedUsers.length === 0) return alert('Please select at least one user');
      await this.batchUpdate(container, amount, 0);
    });

    container.querySelector('#giftKarma')?.addEventListener('click', async () => {
      const amount = parseInt(container.querySelector('#karmaAmount').value);
      if (!amount || amount < 0) return alert('Please enter a valid Karma amount');
      if (this.selectedUsers.length === 0) return alert('Please select at least one user');
      await this.batchUpdate(container, 0, amount);
    });
  }

  attachFeaturesHandlers(container) {
    container.querySelector('#unlockFeatures')?.addEventListener('click', async () => {
      const features = Array.from(container.querySelectorAll('.feature-checkbox:checked')).map(cb => cb.value);
      const duration = container.querySelector('#featureDuration').value;
      
      if (features.length === 0) return alert('Please select at least one feature');
      if (this.selectedUsers.length === 0) return alert('Please select at least one user');
      
      await this.batchUnlockFeatures(container, features, duration);
    });
  }

  attachBadgesHandlers(container) {
    container.querySelector('#awardBadge')?.addEventListener('click', async () => {
      const badge = container.querySelector('.badge-radio:checked')?.value;
      if (!badge) return alert('Please select a badge');
      if (this.selectedUsers.length === 0) return alert('Please select at least one user');
      
      await this.batchAwardBadge(container, badge);
    });
  }

  attachMessagesHandlers(container) {
    container.querySelector('#sendMessage')?.addEventListener('click', async () => {
      const title = container.querySelector('#messageTitle').value.trim();
      const content = container.querySelector('#messageContent').value.trim();
      
      if (!title || !content) return alert('Please enter both title and message');
      if (this.selectedUsers.length === 0) return alert('Please select at least one user');
      
      await this.batchSendMessage(container, title, content);
    });
  }
async sendPushNotificationToUser(userId, title, body) {
    try {
      const { data: subs, error } = await this.supabase
        .from('push_subscriptions')
        .select('subscription')
        .eq('user_id', userId);

      if (error) throw error;
      if (!subs || subs.length === 0) return;

      for (const subData of subs) {
        try {
          await fetch('/api/send', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              sub: subData.subscription,
              payload: {
                title,
                body,
                icon: '/Icons/icon-192x192.png',
                data: { url: '/' }
              }
            })
          });
        } catch (err) {
          console.error('Failed to send notification:', err);
        }
      }
    } catch (error) {
      console.error('Error fetching user subscriptions:', error);
    }
  }

async batchUpdate(container, xp, karma) {
  this.showMessage(container, 'Updating users...', 'info');
  let success = 0;
  let failed = 0;

  for (const user of this.selectedUsers) {
    try {
      const { error } = await this.supabase.rpc('update_user_gamification', {
        target_user_id: user.id,
        xp_delta: xp,
        karma_delta: karma
      });
      if (error) throw error;

      // Send push notification
      let notificationBody = '';
      if (xp > 0 && karma > 0) {
        notificationBody = `You received +${xp} XP and +${karma} Karma from Aanandoham!`;
      } else if (xp > 0) {
        notificationBody = `You received +${xp} XP from Aanandoham!`;
      } else if (karma > 0) {
        notificationBody = `You received +${karma} Karma from Aanandoham!`;
      }
      
      if (notificationBody) {
        await this.sendPushNotificationToUser(user.id, '🎁 Aanandoham\'s Gift!', notificationBody);
      }

      success++;
    } catch (error) {
      console.error(`Failed for user ${user.name}:`, error);
      failed++;
    }
  }

  this.showMessage(container, `✅ Updated ${success} users${failed > 0 ? `, ${failed} failed` : ''}`, 'success');
  await this.fetchUsers();
  this.renderUserCheckboxes(container);
}

  async batchUnlockFeatures(container, features, duration) {
    this.showMessage(container, 'Unlocking features...', 'info');
    
    if (duration !== 'permanent') {
      alert('Temporary unlocks require additional setup. Unlocking permanently for now.');
    }

    let success = 0;
    for (const user of this.selectedUsers) {
      try {
        for (const feature of features) {
          const { error } = await this.supabase.rpc('update_user_gamification', {
            target_user_id: user.id,
            xp_delta: 0,
            karma_delta: 0,
            unlock_feature: feature
          });
          if (error) throw error;
        }

        // Send push notification
        const featureList = features.map(f => f.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())).join(', ');
        await this.sendPushNotificationToUser(
          user.id,
          '🔓 New Features Unlocked!',
          `Admin unlocked: ${featureList}`
        );

        success++;
      } catch (error) {
        console.error(`Failed for user ${user.name}:`, error);
      }
    }

    this.showMessage(container, `✅ Unlocked features for ${success} users`, 'success');
  }

  async batchAwardBadge(container, badgeId) {
    this.showMessage(container, 'Awarding badges...', 'info');
    const badge = this.availableBadges.find(b => b.id === badgeId);
    
    let success = 0;
    for (const user of this.selectedUsers) {
      try {
        const { data: progressData } = await this.supabase
          .from('user_progress')
          .select('payload')
          .eq('user_id', user.id)
          .single();

        const currentPayload = progressData?.payload || {};
        const badges = currentPayload.badges || [];
        
        if (!badges.find(b => b.id === badgeId)) {
          badges.push({
            id: badgeId,
            name: badge.name,
            icon: badge.icon,
            date: new Date().toISOString(),
            unlocked: true
          });

          const { error } = await this.supabase
            .from('user_progress')
            .update({ 
              payload: { ...currentPayload, badges },
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id);

          if (error) throw error;

          // Send push notification
          await this.sendPushNotificationToUser(
            user.id,
            '🎖️ New Badge Earned!',
            `You received the ${badge.name} badge from Aanandoham!`
          );
        }
        success++;
      } catch (error) {
        console.error(`Failed for user ${user.name}:`, error);
      }
    }

    this.showMessage(container, `✅ Awarded badge to ${success} users`, 'success');
  }

  async batchSendMessage(container, title, content) {
    this.showMessage(container, 'Sending messages...', 'info');
    
    let success = 0;
    for (const user of this.selectedUsers) {
      try {
        const { data: progressData } = await this.supabase
          .from('user_progress')
          .select('payload')
          .eq('user_id', user.id)
          .single();

        const currentPayload = progressData?.payload || {};
        const messages = currentPayload.adminMessages || [];
        
        messages.push({
          id: Date.now() + Math.random(),
          title,
          content,
          date: new Date().toISOString(),
          read: false
        });

        const { error } = await this.supabase
          .from('user_progress')
          .update({ 
            payload: { ...currentPayload, adminMessages: messages },
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        if (error) throw error;

        // Send push notification
        await this.sendPushNotificationToUser(
          user.id,
          `💬 ${title}`,
          content.substring(0, 100) + (content.length > 100 ? '...' : '')
        );

        success++;
      } catch (error) {
        console.error(`Failed for user ${user.name}:`, error);
      }
    }

    this.showMessage(container, `✅ Sent message to ${success} users`, 'success');
    container.querySelector('#messageTitle').value = '';
    container.querySelector('#messageContent').value = '';
  }

  showMessage(container, text, type) {
    const msgDiv = container.querySelector('#message');
    if (!msgDiv) return;

    msgDiv.textContent = text;
    msgDiv.style.display = 'block';
    msgDiv.style.background = type === 'success' ? 'rgba(0,255,0,0.1)' : 
                              type === 'error' ? 'rgba(255,0,0,0.1)' : 
                              'rgba(102,126,234,0.1)';
    msgDiv.style.color = type === 'success' ? '#00ff00' : 
                         type === 'error' ? '#ff4757' : 
                         'var(--neuro-text)';

    if (type !== 'info') {
      setTimeout(() => {
        msgDiv.style.display = 'none';
      }, 3000);
    }
  }
}