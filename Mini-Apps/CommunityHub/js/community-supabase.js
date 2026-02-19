/**
 * community-supabase.js
 * Supabase Data Layer — The Community Hub
 *
 * One place for ALL database operations and realtime subscriptions.
 * Every other module (active-members, community-module, practice, etc.)
 * calls this object — never talks to Supabase directly.
 *
 * Place this file at:
 *   /Mini-Apps/CommunityHub/js/community-supabase.js
 *
 * Load order in CommunityHubEngine.js GROUP 1 (already has supabase-client.js):
 *   this.loadScript('/Mini-Apps/CommunityHub/js/community-supabase.js')
 */

const CommunityDB = {

  _sb:    null,   // Supabase client
  _uid:   null,   // Current user UUID
  _subs:  {},     // Active realtime subscriptions

  // ============================================================================
  // INIT — call once before any other method
  // ============================================================================

  async init() {
    this._sb = window.CommunitySupabase;

    if (!this._sb) {
      console.error('[CommunityDB] Supabase client not ready (window.CommunitySupabase is null)');
      return false;
    }

    const { data: { user }, error } = await this._sb.auth.getUser();

    if (error || !user) {
      console.error('[CommunityDB] No authenticated user:', error?.message);
      return false;
    }

    this._uid = user.id;
    console.log('✅ [CommunityDB] Ready — user:', user.email);
    return true;
  },

  get userId()  { return this._uid; },
  get ready()   { return !!this._sb && !!this._uid; },

  // ============================================================================
  // PROFILES
  // ============================================================================

  /** Get the current user's full profile */
  async getMyProfile() {
    if (!this.ready) return null;
    const { data, error } = await this._sb
      .from('profiles')
      .select('*')
      .eq('id', this._uid)
      .single();
    if (error) { console.error('[CommunityDB] getMyProfile:', error.message); return null; }
    return data;
  },

  /** Get any user's public-safe profile (by UUID) */
  async getProfile(userId) {
    if (!this.ready) return null;
    const { data, error } = await this._sb
      .from('profiles')
      .select('id, name, emoji, avatar_url, inspiration, community_status, community_role, total_sessions, total_minutes, gifts_given')
      .eq('id', userId)
      .single();
    if (error) { console.error('[CommunityDB] getProfile:', error.message); return null; }
    return data;
  },

  /**
   * Update current user's profile fields
   * @param {Object} updates - e.g. { inspiration: 'new text', community_status: 'silent' }
   */
  async updateProfile(updates) {
    if (!this.ready) return false;
    const { error } = await this._sb
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', this._uid);
    if (error) { console.error('[CommunityDB] updateProfile:', error.message); return false; }
    return true;
  },

  // ============================================================================
  // PRESENCE — who is online + realtime
  // ============================================================================

  /**
   * Mark the current user online/away and set their current activity & room.
   * Call this on login, on status change, and every ~60s as a heartbeat.
   * @param {string} status   'online' | 'away' | 'offline'
   * @param {string} activity e.g. '🧘 In practice', '✨ Available'
   * @param {string|null} roomId  e.g. 'silent-room', null when in the hub
   */
  async setPresence(status = 'online', activity = '✨ Available', roomId = null) {
    if (!this.ready) return false;
    const { error } = await this._sb
      .from('community_presence')
      .upsert({
        user_id:    this._uid,
        status,
        activity,
        room_id:    roomId,
        last_seen:  new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
    if (error) console.error('[CommunityDB] setPresence:', error.message);
    return !error;
  },

  /** Convenience: mark the user offline (call on page unload) */
  async setOffline() {
    return this.setPresence('offline', '💤 Offline', null);
  },

  /**
   * Get all members seen in the last 5 minutes (excludes offline).
   * Returns array with joined profile data.
   */
  async getActiveMembers() {
    if (!this.ready) return [];
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { data, error } = await this._sb
      .from('community_presence')
      .select(`
        user_id, status, activity, room_id, last_seen,
        profiles ( id, name, emoji, avatar_url )
      `)
      .neq('status', 'offline')
      .gte('last_seen', fiveMinutesAgo)
      .order('last_seen', { ascending: false });
    if (error) { console.error('[CommunityDB] getActiveMembers:', error.message); return []; }
    return data || [];
  },

  /**
   * Subscribe to presence changes. Callback receives the updated member list.
   * @param {Function} callback  (members: Array) => void
   */
  subscribeToPresence(callback) {
    if (this._subs.presence) this._subs.presence.unsubscribe();

    this._subs.presence = this._sb
      .channel('community-presence')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_presence' },
        async () => {
          const members = await this.getActiveMembers();
          callback(members);
        })
      .subscribe();

    return this._subs.presence;
  },

  // ============================================================================
  // REFLECTIONS — community wall posts
  // ============================================================================

  /**
   * Fetch the latest reflections (with author profile).
   * Blocked users are filtered out client-side (see getBlockedUsers).
   */
  async getReflections(limit = 30) {
    if (!this.ready) return [];
    const { data, error } = await this._sb
      .from('reflections')
      .select(`
        id, content, appreciation_count, created_at,
        profiles ( id, name, emoji, avatar_url )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) { console.error('[CommunityDB] getReflections:', error.message); return []; }
    return data || [];
  },

  /**
   * Post a new reflection.
   * @param {string} content
   * @returns {Object|null} The created reflection row
   */
  async postReflection(content) {
    if (!this.ready) return null;
    const { data, error } = await this._sb
      .from('reflections')
      .insert({ user_id: this._uid, content })
      .select(`
        id, content, appreciation_count, created_at,
        profiles ( id, name, emoji, avatar_url )
      `)
      .single();
    if (error) { console.error('[CommunityDB] postReflection:', error.message); return null; }
    return data;
  },

  /** Delete a reflection you own */
  async deleteReflection(reflectionId) {
    if (!this.ready) return false;
    const { error } = await this._sb
      .from('reflections').delete().eq('id', reflectionId);
    if (error) { console.error('[CommunityDB] deleteReflection:', error.message); return false; }
    return true;
  },

  /**
   * Subscribe to new reflections being posted.
   * Callback receives the full reflection object (with profile).
   */
  subscribeToReflections(callback) {
    if (this._subs.reflections) this._subs.reflections.unsubscribe();

    this._subs.reflections = this._sb
      .channel('community-reflections')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reflections' },
        async (payload) => {
          // Fetch full row with profile join
          const { data } = await this._sb
            .from('reflections')
            .select(`
              id, content, appreciation_count, created_at,
              profiles ( id, name, emoji, avatar_url )
            `)
            .eq('id', payload.new.id)
            .single();
          if (data) callback(data);
        })
      .subscribe();

    return this._subs.reflections;
  },

  // ============================================================================
  // APPRECIATIONS — the 🙏 button
  // ============================================================================

  /**
   * Get a Set of reflection IDs the current user has already appreciated.
   * Use this to initialise which 🙏 buttons show as "active".
   * @returns {Set<string>}
   */
  async getMyAppreciations() {
    if (!this.ready) return new Set();
    const { data, error } = await this._sb
      .from('appreciations')
      .select('reflection_id')
      .eq('user_id', this._uid);
    if (error) { console.error('[CommunityDB] getMyAppreciations:', error.message); return new Set(); }
    return new Set(data.map(a => a.reflection_id));
  },

  /**
   * Toggle an appreciation on a reflection.
   * The DB trigger automatically updates appreciation_count.
   * @param {string}  reflectionId
   * @param {boolean} currentlyAppreciated  — current state (true = will un-appreciate)
   * @returns {{ appreciated: boolean }|null}
   */
  async toggleAppreciation(reflectionId, currentlyAppreciated) {
    if (!this.ready) return null;

    if (currentlyAppreciated) {
      const { error } = await this._sb
        .from('appreciations')
        .delete()
        .eq('user_id', this._uid)
        .eq('reflection_id', reflectionId);
      if (error) { console.error('[CommunityDB] removeAppreciation:', error.message); return null; }
      return { appreciated: false };
    } else {
      const { error } = await this._sb
        .from('appreciations')
        .insert({ user_id: this._uid, reflection_id: reflectionId });
      if (error) { console.error('[CommunityDB] addAppreciation:', error.message); return null; }
      return { appreciated: true };
    }
  },

  // ============================================================================
  // ROOM MESSAGES — live chat inside practice rooms
  // ============================================================================

  /**
   * Load recent messages for a room (last 50, oldest first for display).
   * @param {string} roomId  e.g. 'campfire-room'
   */
  async getRoomMessages(roomId, limit = 50) {
    if (!this.ready) return [];
    const { data, error } = await this._sb
      .from('room_messages')
      .select(`
        id, message, created_at,
        profiles ( id, name, emoji, avatar_url )
      `)
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })
      .limit(limit);
    if (error) { console.error('[CommunityDB] getRoomMessages:', error.message); return []; }
    return data || [];
  },

  /**
   * Send a chat message in a room.
   * @param {string} roomId
   * @param {string} message
   */
  async sendRoomMessage(roomId, message) {
    if (!this.ready) return null;
    const { data, error } = await this._sb
      .from('room_messages')
      .insert({ user_id: this._uid, room_id: roomId, message })
      .select('id, message, created_at, profiles ( id, name, emoji, avatar_url )')
      .single();
    if (error) { console.error('[CommunityDB] sendRoomMessage:', error.message); return null; }
    return data;
  },

  /**
   * Subscribe to incoming messages in a specific room.
   * Callback receives the full message object (with author profile).
   * @param {string}   roomId
   * @param {Function} callback  (message: Object) => void
   */
  subscribeToRoomChat(roomId, callback) {
    const key = `room-${roomId}`;
    if (this._subs[key]) this._subs[key].unsubscribe();

    this._subs[key] = this._sb
      .channel(`room-chat-${roomId}`)
      .on('postgres_changes', {
          event: 'INSERT', schema: 'public', table: 'room_messages',
          filter: `room_id=eq.${roomId}`
        },
        async (payload) => {
          const { data } = await this._sb
            .from('room_messages')
            .select('id, message, created_at, profiles ( id, name, emoji, avatar_url )')
            .eq('id', payload.new.id)
            .single();
          if (data) callback(data);
        })
      .subscribe();

    return this._subs[key];
  },

  /** Unsubscribe from a room's chat (call when leaving the room) */
  unsubscribeFromRoomChat(roomId) {
    const key = `room-${roomId}`;
    if (this._subs[key]) {
      this._subs[key].unsubscribe();
      delete this._subs[key];
      console.log(`[CommunityDB] Unsubscribed from ${roomId} chat`);
    }
  },

  // ============================================================================
  // WHISPERS — private messages between two users
  // ============================================================================

  /**
   * Send a private whisper to another user.
   * @param {string} recipientId  target user UUID
   * @param {string} message
   */
  async sendWhisper(recipientId, message) {
    if (!this.ready) return null;
    const { data, error } = await this._sb
      .from('whispers')
      .insert({ sender_id: this._uid, recipient_id: recipientId, message })
      .select()
      .single();
    if (error) { console.error('[CommunityDB] sendWhisper:', error.message); return null; }
    return data;
  },

  /**
   * Get full conversation between current user and another user (oldest first).
   * @param {string} otherUserId
   */
  async getWhispers(otherUserId) {
    if (!this.ready) return [];
    const { data, error } = await this._sb
      .from('whispers')
      .select(`
        id, message, read, created_at,
        sender:profiles!whispers_sender_id_fkey ( id, name, emoji ),
        recipient:profiles!whispers_recipient_id_fkey ( id, name, emoji )
      `)
      .or(`and(sender_id.eq.${this._uid},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${this._uid})`)
      .order('created_at', { ascending: true });
    if (error) { console.error('[CommunityDB] getWhispers:', error.message); return []; }
    return data || [];
  },

  /** Mark a whisper as read */
  async markWhisperRead(whisperId) {
    if (!this.ready) return;
    await this._sb.from('whispers').update({ read: true }).eq('id', whisperId);
  },

  /**
   * Subscribe to incoming whispers for the current user.
   * Callback receives the raw new whisper row.
   */
  subscribeToWhispers(callback) {
    if (this._subs.whispers) this._subs.whispers.unsubscribe();

    this._subs.whispers = this._sb
      .channel('my-whispers')
      .on('postgres_changes', {
          event: 'INSERT', schema: 'public', table: 'whispers',
          filter: `recipient_id=eq.${this._uid}`
        },
        (payload) => callback(payload.new))
      .subscribe();

    return this._subs.whispers;
  },

  /**
   * Get the current appreciation_count for a single reflection.
   * Used to refresh the count after a toggle.
   * @param {string} reflectionId
   * @returns {number|null}
   */
  async getReflectionCount(reflectionId) {
    if (!this.ready) return null;
    const { data, error } = await this._sb
      .from('reflections')
      .select('appreciation_count')
      .eq('id', reflectionId)
      .single();
    if (error) { console.error('[CommunityDB] getReflectionCount:', error.message); return null; }
    return data?.appreciation_count ?? null;
  },

  /**
   * Look up a user's id and name by display name (case-insensitive).
   * Used by confirmBlock() to resolve a username to a UUID.
   * @param {string} name
   * @returns {{ id: string, name: string }|null}
   */
  async getUserByName(name) {
    if (!this.ready) return null;
    const { data, error } = await this._sb
      .from('profiles')
      .select('id, name')
      .ilike('name', name)
      .single();
    if (error) { console.error('[CommunityDB] getUserByName:', error.message); return null; }
    return data;
  },

  // ============================================================================
  // SAFETY — reports & blocks
  // ============================================================================

  /**
   * Submit a safety report.
   * @param {string} reportedUserId  UUID of reported user
   * @param {string} reason          e.g. 'harassment'
   * @param {string} details         optional free text
   */
  async submitReport(reportedUserId, reason, details = '') {
    if (!this.ready) return false;
    const { error } = await this._sb
      .from('reports')
      .insert({ reporter_id: this._uid, reported_user_id: reportedUserId, reason, details });
    if (error) { console.error('[CommunityDB] submitReport:', error.message); return false; }
    return true;
  },

  /**
   * Block a user. Their content will be filtered client-side.
   * @param {string} userIdToBlock
   */
  async blockUser(userIdToBlock) {
    if (!this.ready) return false;
    const { error } = await this._sb
      .from('blocked_users')
      .insert({ user_id: this._uid, blocked_user_id: userIdToBlock });
    if (error) { console.error('[CommunityDB] blockUser:', error.message); return false; }
    return true;
  },

  /**
   * Get a Set of UUIDs that the current user has blocked.
   * Use this to filter out their content in any list.
   * @returns {Set<string>}
   */
  async getBlockedUsers() {
    if (!this.ready) return new Set();
    const { data, error } = await this._sb
      .from('blocked_users')
      .select('blocked_user_id')
      .eq('user_id', this._uid);
    if (error) return new Set();
    return new Set(data.map(b => b.blocked_user_id));
  },

  // ============================================================================
  // PRESENCE HEARTBEAT
  // Keeps last_seen fresh so users don't disappear from the active list.
  // Call startHeartbeat() once on init; it auto-cleans up on page unload.
  // ============================================================================

  _heartbeatTimer: null,

  startHeartbeat(intervalMs = 60000) {
    this.stopHeartbeat();
    this._heartbeatTimer = setInterval(async () => {
      if (!this.ready) return;
      const status = Core?.state?.currentUser?.status || 'online';
      const activity = Core?.state?.currentUser?.activity || '✨ Available';
      const roomId = Core?.state?.currentRoom || null;
      await this.setPresence(status, activity, roomId);
    }, intervalMs);

    // Clean up on tab close
    window.addEventListener('beforeunload', () => this._cleanup());
    console.log('[CommunityDB] Presence heartbeat started');
  },

  stopHeartbeat() {
    if (this._heartbeatTimer) {
      clearInterval(this._heartbeatTimer);
      this._heartbeatTimer = null;
    }
  },

  // ============================================================================
  // CLEANUP
  // ============================================================================

  async _cleanup() {
    this.stopHeartbeat();
    await this.setOffline();
    this.unsubscribeAll();
  },

  unsubscribeAll() {
    Object.values(this._subs).forEach(sub => { try { sub.unsubscribe(); } catch(e) {} });
    this._subs = {};
    console.log('[CommunityDB] All subscriptions cleared');
  }
};

window.CommunityDB = CommunityDB;
console.log('✅ community-supabase.js loaded');
