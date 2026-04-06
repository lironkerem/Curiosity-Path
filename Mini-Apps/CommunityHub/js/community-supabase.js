/**
 * community-supabase.js
 * Supabase Data Layer - Community Hub
 *
 * Single source of truth for all DB operations and realtime subscriptions.
 * No other module talks to Supabase directly.
 *
 * @version 2.1.0
 */

import { CommunitySupabase } from './supabase-client.js';

const CommunityDB = {

    _sb:   null,   // Supabase client
    _uid:  null,   // Current user UUID
    _subs: {},     // Active realtime subscriptions { key → channel }

    _heartbeatTimer: null,

    // =========================================================================
    // INIT
    // =========================================================================

    async init() {
        // Read window.AppSupabase at call time — not at module parse time.
        // supabase-client.js may have been evaluated before Supabase.js set
        // window.AppSupabase, so CommunitySupabase (the import) may be null.
        // By the time init() is called (after auth), window.AppSupabase is ready.
        this._sb = window.AppSupabase || CommunitySupabase;
        if (!this._sb) {
            console.error('[CommunityDB] CommunitySupabase not ready — window.AppSupabase is null');
            return false;
        }

        const { data: { user }, error } = await this._sb.auth.getUser();
        if (error || !user) {
            console.error('[CommunityDB] No authenticated user:', error?.message);
            return false;
        }

        this._uid = user.id;
        return true;
    },

    get userId() { return this._uid; },
    get ready()  { return !!(this._sb && this._uid); },

    // =========================================================================
    // INTERNAL HELPERS
    // =========================================================================

    /** Centralised error log - keeps call sites terse */
    _err(label, err) {
        console.error(`[CommunityDB] ${label}:`, err?.message ?? err);
    },

    /**
     * Shared profile select string used across multiple queries.
     * Keeps the column list consistent and avoids typo drift.
     */
    _profileSelect: 'id, name, emoji, avatar_url',

    /** Returns ISO string for "N milliseconds ago" */
    _ago(ms) { return new Date(Date.now() - ms).toISOString(); },

    /** UTC midnight for today - reused in engagement/room stats */
    _todayUTC() {
        const d = new Date();
        d.setUTCHours(0, 0, 0, 0);
        return d.toISOString();
    },

    // =========================================================================
    // PROFILES
    // =========================================================================

    async getMyProfile() {
        if (!this.ready) return null;
        const { data, error } = await this._sb
            .from('profiles').select('*').eq('id', this._uid).single();
        if (error) { this._err('getMyProfile', error); return null; }
        return data;
    },

    async getProfile(userId) {
        if (!this.ready) return null;
        const { data, error } = await this._sb
            .from('profiles')
            .select('id, name, emoji, avatar_url, inspiration, community_status, community_role, total_sessions, total_minutes, gifts_given, birthday, country')
            .eq('id', userId).single();
        if (error) { this._err('getProfile', error); return null; }
        return data;
    },

    /** Parse a user_progress payload - shared logic for getUserProgress + getOwnGamificationState */
    _parseProgress(raw) {
        const p = typeof raw === 'string' ? JSON.parse(raw) : raw;
        return {
            xp:                  p.xp    ?? 0,
            karma:               p.karma ?? 0,
            level:               p.level ?? 1,
            badges:              p.badges ?? [],
            unlockedFeatures:    p.unlockedFeatures ?? [],
            streak:              p.streaks?.current ?? p.streak?.current ?? 0,
            longestStreak:       p.streaks?.longest ?? 0,
            totalSessions:       p.stats?.totalSessions    ?? 0,
            totalMeditations:    p.stats?.totalMeditations ?? 0,
            totalReadings:       p.stats?.totalReadings    ?? 0,
            totalTarotSpreads:   p.totalTarotSpreads   ?? 0,
            totalJournalEntries: p.totalJournalEntries ?? 0,
            totalWellnessRuns:   p.totalWellnessRuns   ?? 0,
            totalHappinessViews: p.totalHappinessViews ?? 0,
        };
    },

    async getUserProgress(userId) {
        if (!this.ready) return null;
        try {
            const { data, error } = await this._sb
                .from('user_progress').select('payload').eq('user_id', userId).single();
            if (error || !data) return null;
            return this._parseProgress(data.payload);
        } catch (err) {
            this._err('getUserProgress', err); return null;
        }
    },

    /** Read own gamification state from in-memory GamificationEngine (falls back to null if unavailable) */
    getOwnGamificationState() {
        const g = window.app?.gamification;
        if (!g) return null;
        return this._parseProgress(g.state ?? g);
    },

    async uploadAvatar(file) {
        if (!this.ready) return null;
        try {
            const ext  = file.name.split('.').pop().toLowerCase() || 'jpg';
            const path = `avatars/${this._uid}.${ext}`;
            const { error: upErr } = await this._sb.storage
                .from('community-avatars')
                .upload(path, file, { upsert: true, contentType: file.type });
            if (upErr) { this._err('uploadAvatar upload', upErr); return null; }

            const { data } = this._sb.storage.from('community-avatars').getPublicUrl(path);
            const url = data?.publicUrl;
            if (!url) return null;

            const publicUrl = `${url}?t=${Date.now()}`;
            const ok = await this.updateProfile({ avatar_url: publicUrl });
            return ok ? publicUrl : null;
        } catch (err) {
            this._err('uploadAvatar', err); return null;
        }
    },

    async updateProfile(updates) {
        if (!this.ready) return false;
        const { error } = await this._sb
            .from('profiles')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', this._uid);
        if (error) { this._err('updateProfile', error); return false; }
        return true;
    },

    // =========================================================================
    // PRESENCE
    // =========================================================================

    async setPresence(status = 'online', activity = '✨ Available', roomId = null) {
        if (!this.ready) return false;
        const now = new Date().toISOString();
        const { error } = await this._sb
            .from('community_presence')
            .upsert({
                user_id: this._uid, status, activity,
                room_id: roomId, last_seen: now, updated_at: now,
            }, { onConflict: 'user_id' });
        if (error) this._err('setPresence', error);
        return !error;
    },

    async setOffline() {
        return this.setPresence('offline', '💤 Offline', null);
    },

    async getActiveMembers() {
        if (!this.ready) return [];
        const { data, error } = await this._sb
            .from('community_presence')
            .select(`user_id, status, activity, room_id, is_phantom, last_seen, profiles ( ${this._profileSelect} )`)
            .neq('status', 'offline')
            .gte('last_seen', this._ago(5 * 60_000))
            .order('is_phantom', { ascending: false }) // phantoms always first
            .order('last_seen', { ascending: false });
        if (error) { this._err('getActiveMembers', error); return []; }
        return data || [];
    },

    async getRoomParticipants(roomId) {
        if (!this.ready) return [];
        const { data, error } = await this._sb
            .from('community_presence')
            .select(`user_id, status, activity, room_id, is_phantom, last_seen, profiles ( ${this._profileSelect} )`)
            .or(`room_id.eq.${roomId},is_phantom.eq.true`) // real room members OR phantoms
            .neq('status', 'offline')
            .gte('last_seen', this._ago(5 * 60_000))
            .order('is_phantom', { ascending: false }) // phantoms always first
            .order('last_seen', { ascending: true });
        if (error) { this._err('getRoomParticipants', error); return []; }
        return data || [];
    },

    subscribeToPresence(callback) {
        if (this._subs.presence) this._subs.presence.unsubscribe();
        this._subs.presence = this._sb
            .channel('community-presence')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'community_presence' },
                async () => callback(await this.getActiveMembers()))
            .subscribe();
        return this._subs.presence;
    },

    // =========================================================================
    // HEARTBEAT
    // =========================================================================

    startHeartbeat(intervalMs = 60_000) {
        this.stopHeartbeat();
        this._heartbeatTimer = setInterval(async () => {
            if (!this.ready) return;
            // Use imported Core if available, fall back to window.Core for classic-script compat
            const coreState = (typeof Core !== 'undefined' ? Core : window.Core)?.state;
            await this.setPresence(
                coreState?.currentUser?.status   || 'online',
                coreState?.currentUser?.activity || '✨ Available',
                coreState?.currentRoom           || null,
            );
        }, intervalMs);
        window.addEventListener('beforeunload', () => this._cleanup());
    },

    stopHeartbeat() {
        if (this._heartbeatTimer) { clearInterval(this._heartbeatTimer); this._heartbeatTimer = null; }
    },

    // =========================================================================
    // REFLECTIONS
    // =========================================================================

    _reflectionSelect: 'id, content, appreciation_count, created_at, profiles ( id, name, emoji, avatar_url )',

    async getReflections(limit = 30) {
        if (!this.ready) return [];
        const { data, error } = await this._sb
            .from('reflections').select(this._reflectionSelect)
            .order('created_at', { ascending: false }).limit(limit);
        if (error) { this._err('getReflections', error); return []; }
        return data || [];
    },

    async postReflection(content) {
        if (!this.ready) return null;
        const { data, error } = await this._sb
            .from('reflections')
            .insert({ user_id: this._uid, content })
            .select(this._reflectionSelect)
            .single();
        if (error) { this._err('postReflection', error); return null; }
        return data;
    },

    async deleteReflection(reflectionId) {
        if (!this.ready) return false;
        const { error } = await this._sb.from('reflections').delete().eq('id', reflectionId);
        if (error) { this._err('deleteReflection', error); return false; }
        return true;
    },

    async updateReflection(reflectionId, newContent) {
        if (!this.ready) return false;
        const { error } = await this._sb
            .from('reflections')
            .update({ content: newContent })
            .eq('id', reflectionId)
            .eq('user_id', this._uid);
        if (error) { this._err('updateReflection', error); return false; }
        return true;
    },

    subscribeToReflections(callback) {
        if (this._subs.reflections) this._subs.reflections.unsubscribe();
        this._subs.reflections = this._sb
            .channel('community-reflections')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reflections' },
                async ({ new: row }) => {
                    const { data } = await this._sb
                        .from('reflections').select(this._reflectionSelect)
                        .eq('id', row.id).single();
                    if (data) callback(data);
                })
            .subscribe();
        return this._subs.reflections;
    },

    // =========================================================================
    // APPRECIATIONS (reflections)
    // =========================================================================

    async getMyAppreciations() {
        if (!this.ready) return new Set();
        const { data, error } = await this._sb
            .from('appreciations').select('reflection_id').eq('user_id', this._uid);
        if (error) { this._err('getMyAppreciations', error); return new Set(); }
        return new Set(data.map(a => a.reflection_id));
    },

    async toggleAppreciation(reflectionId, currentlyAppreciated) {
        if (!this.ready) return null;
        if (currentlyAppreciated) {
            const { error } = await this._sb.from('appreciations').delete()
                .eq('user_id', this._uid).eq('reflection_id', reflectionId);
            if (error) { this._err('removeAppreciation', error); return null; }
            return { appreciated: false };
        } else {
            const { error } = await this._sb.from('appreciations')
                .insert({ user_id: this._uid, reflection_id: reflectionId });
            if (error) { this._err('addAppreciation', error); return null; }
            return { appreciated: true };
        }
    },

    async getReflectionCount(reflectionId) {
        if (!this.ready) return null;
        const { data, error } = await this._sb
            .from('reflections').select('appreciation_count').eq('id', reflectionId).single();
        if (error) { this._err('getReflectionCount', error); return null; }
        return data?.appreciation_count ?? null;
    },

    // =========================================================================
    // USER APPRECIATIONS (profile-level)
    // =========================================================================

    async getMyUserAppreciations() {
        if (!this.ready) return new Set();
        const { data, error } = await this._sb
            .from('user_appreciations').select('appreciated_user_id').eq('user_id', this._uid);
        if (error) { this._err('getMyUserAppreciations', error); return new Set(); }
        return new Set(data.map(r => r.appreciated_user_id));
    },

    async toggleUserAppreciation(targetUserId, currentlyAppreciated) {
        if (!this.ready) return null;
        if (currentlyAppreciated) {
            const { error } = await this._sb.from('user_appreciations').delete()
                .eq('user_id', this._uid).eq('appreciated_user_id', targetUserId);
            if (error) { this._err('removeUserAppreciation', error); return null; }
            return { appreciated: false };
        } else {
            const { error } = await this._sb.from('user_appreciations')
                .insert({ user_id: this._uid, appreciated_user_id: targetUserId });
            if (error) { this._err('addUserAppreciation', error); return null; }
            return { appreciated: true };
        }
    },

    async getUserAppreciationCount(targetUserId) {
        if (!this.ready) return 0;
        const { count, error } = await this._sb
            .from('user_appreciations')
            .select('*', { count: 'exact', head: true })
            .eq('appreciated_user_id', targetUserId);
        if (error) { this._err('getUserAppreciationCount', error); return 0; }
        return count || 0;
    },

    // =========================================================================
    // ROOM MESSAGES
    // =========================================================================

    _roomMsgSelect: 'id, message, created_at, profiles ( id, name, emoji, avatar_url )',

    async getRoomMessages(roomId, limit = 50) {
        if (!this.ready) return [];
        const { data, error } = await this._sb
            .from('room_messages').select(this._roomMsgSelect)
            .eq('room_id', roomId).order('created_at', { ascending: true }).limit(limit);
        if (error) { this._err('getRoomMessages', error); return []; }
        return data || [];
    },

    async sendRoomMessage(roomId, message) {
        if (!this.ready) return null;
        const { data, error } = await this._sb
            .from('room_messages')
            .insert({ user_id: this._uid, room_id: roomId, message })
            .select(this._roomMsgSelect)
            .single();
        if (error) { this._err('sendRoomMessage', error); return null; }
        return data;
    },

    subscribeToRoomChat(roomId, callback) {
        const key = `room-${roomId}`;
        if (this._subs[key]) this._subs[key].unsubscribe();
        this._subs[key] = this._sb
            .channel(`room-chat-${roomId}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'room_messages', filter: `room_id=eq.${roomId}` },
                async ({ new: row }) => {
                    const { data } = await this._sb
                        .from('room_messages').select(this._roomMsgSelect).eq('id', row.id).single();
                    if (data) callback(data);
                })
            .subscribe();
        return this._subs[key];
    },

    unsubscribeFromRoomChat(roomId) {
        this._unsub(`room-${roomId}`);
    },

    // =========================================================================
    // WHISPERS
    // =========================================================================

    async sendWhisper(recipientId, message) {
        if (!this.ready) return null;
        const { data, error } = await this._sb
            .from('whispers')
            .insert({ sender_id: this._uid, recipient_id: recipientId, message })
            .select().single();
        if (error) { this._err('sendWhisper', error); return null; }
        return data;
    },

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
        if (error) { this._err('getWhispers', error); return []; }
        return data || [];
    },

    async markWhisperRead(whisperId) {
        if (!this.ready) return;
        await this._sb.from('whispers').update({ read: true }).eq('id', whisperId);
    },

    async markConversationRead(otherUserId) {
        if (!this.ready) return;
        await this._sb.from('whispers').update({ read: true })
            .eq('recipient_id', this._uid).eq('sender_id', otherUserId).eq('read', false);
    },

    async getWhisperInbox() {
        if (!this.ready) return [];
        try {
            const { data, error } = await this._sb
                .from('whispers')
                .select(`
                    id, message, read, created_at, sender_id, recipient_id,
                    sender:profiles!whispers_sender_id_fkey ( id, name, emoji, avatar_url ),
                    recipient:profiles!whispers_recipient_id_fkey ( id, name, emoji, avatar_url )
                `)
                .or(`sender_id.eq.${this._uid},recipient_id.eq.${this._uid}`)
                .order('created_at', { ascending: false }).limit(200);
            if (error) { this._err('getWhisperInbox', error); return []; }

            const conversations = {};
            for (const w of (data || [])) {
                const partnerId = w.sender_id === this._uid ? w.recipient_id : w.sender_id;
                const partner   = w.sender_id === this._uid ? w.recipient   : w.sender;
                if (!conversations[partnerId]) {
                    conversations[partnerId] = { partnerId, partner, lastMessage: w.message, lastAt: w.created_at, unread: 0 };
                }
                if (w.recipient_id === this._uid && !w.read) conversations[partnerId].unread++;
            }
            return Object.values(conversations).sort((a, b) => new Date(b.lastAt) - new Date(a.lastAt));
        } catch (err) {
            this._err('getWhisperInbox', err); return [];
        }
    },

    async getUnreadWhisperCount() {
        if (!this.ready) return 0;
        const { count, error } = await this._sb
            .from('whispers').select('id', { count: 'exact', head: true })
            .eq('recipient_id', this._uid).eq('read', false);
        if (error) return 0;
        return count || 0;
    },

    subscribeToWhispers(callback) {
        if (this._subs.whispers) this._subs.whispers.unsubscribe();
        this._subs.whispers = this._sb
            .channel('my-whispers')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'whispers', filter: `recipient_id=eq.${this._uid}` },
                ({ new: row }) => callback(row))
            .subscribe();
        return this._subs.whispers;
    },

    // =========================================================================
    // SAFETY - REPORTS & BLOCKS
    // =========================================================================

    async submitReport(reportedUserId, reason, details = '') {
        if (!this.ready) return false;
        const { error } = await this._sb.from('reports')
            .insert({ reporter_id: this._uid, reported_user_id: reportedUserId, reason, details });
        if (error) { this._err('submitReport', error); return false; }
        return true;
    },

    async blockUser(userIdToBlock) {
        if (!this.ready) return false;
        const { error } = await this._sb.from('blocked_users')
            .insert({ user_id: this._uid, blocked_user_id: userIdToBlock });
        if (error) { this._err('blockUser', error); return false; }
        return true;
    },

    async getBlockedUsers() {
        if (!this.ready) return new Set();
        const { data, error } = await this._sb
            .from('blocked_users').select('blocked_user_id').eq('user_id', this._uid);
        if (error) return new Set();
        return new Set(data.map(b => b.blocked_user_id));
    },

    async getUserByName(name) {
        if (!this.ready) return null;
        const { data, error } = await this._sb
            .from('profiles').select('id, name').ilike('name', name).single();
        if (error) { this._err('getUserByName', error); return null; }
        return data;
    },

    // =========================================================================
    // USER PROGRESS (own full payload)
    // =========================================================================

    async getOwnFullProgress() {
        if (!this.ready) return null;
        try {
            const { data, error } = await this._sb
                .from('user_progress').select('payload').eq('user_id', this._uid).single();
            if (error || !data) return null;
            const p = typeof data.payload === 'string' ? JSON.parse(data.payload) : data.payload;
            return {
                journalEntries:    p.journalEntries    || [],
                energyEntries:     p.energyEntries     || [],
                gratitudeEntries:  p.gratitudeEntries  || [],
                flipEntries:       p.flipEntries       || [],
                tarotReadings:     p.tarotReadings     || [],
                meditationEntries: p.meditationEntries || [],
            };
        } catch (err) {
            this._err('getOwnFullProgress', err); return null;
        }
    },

    // =========================================================================
    // ROOM BLESSINGS
    // =========================================================================

    async getRoomBlessings(roomId) {
        if (!this.ready) return [];
        const { data, error } = await this._sb
            .from('room_blessings')
            .select('user_id, created_at, profiles ( name, avatar_url, emoji )')
            .eq('room_id', roomId).order('created_at', { ascending: false });
        if (error) { this._err('getRoomBlessings', error); return []; }
        return data || [];
    },

    /**
     * Bless a room via RPC.
     * The Postgres function bless_room_with_cooldown:
     *   - Enforces a 60s per-user per-room server-side cooldown
     *   - Upserts the room_blessings row (refreshing blessed_at)
     *   - Increments profiles.gifts_given atomically
     * Returns: { status: 'ok'|'cooldown'|'error', data?: row }
     */
    async blessRoom(roomId) {
        if (!this.ready) return { status: 'error' };

        const { data: rpcResult, error: rpcErr } = await this._sb
            .rpc('bless_room_with_cooldown', { p_room_id: roomId, p_cooldown_seconds: 60 });

        if (rpcErr) { this._err('blessRoom rpc', rpcErr); return { status: 'error' }; }
        if (rpcResult === 'cooldown') return { status: 'cooldown' };
        if (rpcResult !== 'ok')      return { status: 'error' };

        // Fetch row with profile after successful bless
        const { data, error: fetchErr } = await this._sb
            .from('room_blessings')
            .select('user_id, created_at, profiles ( name, avatar_url, emoji )')
            .eq('room_id', roomId)
            .eq('user_id', this._uid)
            .single();
        if (fetchErr) { this._err('blessRoom fetch', fetchErr); return { status: 'ok', data: null }; }
        return { status: 'ok', data };
    },

    subscribeToBlessings(roomId, callback) {
        const key = `bless-${roomId}`;
        if (this._subs[key]) this._subs[key].unsubscribe();

        // Listen to both INSERT and UPDATE:
        // - INSERT fires when a user blesses for the first time.
        // - UPDATE fires when a user re-blesses (upsert hits the UNIQUE constraint).
        //   REPLICA IDENTITY FULL is required on room_blessings for UPDATE payloads
        //   to carry room_id/user_id so the room_id filter works.
        const handler = async ({ new: row }) => {
            if (!row?.user_id) return;
            const { data } = await this._sb
                .from('profiles')
                .select('name, avatar_url, emoji')
                .eq('id', row.user_id)
                .single();
            callback({
                roomId,
                userId:    row.user_id,
                name:      data?.name       || 'A member',
                avatarUrl: data?.avatar_url || '',
                emoji:     data?.emoji      || '',
            });
        };

        this._subs[key] = this._sb
            .channel(key)
            .on('postgres_changes', {
                event:  'INSERT',
                schema: 'public',
                table:  'room_blessings',
                filter: `room_id=eq.${roomId}`,
            }, handler)
            .on('postgres_changes', {
                event:  'UPDATE',
                schema: 'public',
                table:  'room_blessings',
                filter: `room_id=eq.${roomId}`,
            }, handler)
            .subscribe();
        return this._subs[key];
    },

    unsubscribeFromBlessings(roomId) {
        this._unsub(`bless-${roomId}`);
    },

    // =========================================================================
    // APP SETTINGS
    // =========================================================================

    async getAppSettings(key) {
        if (!this.ready) return null;
        const { data, error } = await this._sb
            .from('app_settings').select('value').eq('key', key).single();
        if (error) { this._err('getAppSettings', error); return null; }
        return data?.value ?? null;
    },

    async saveAppSettings(key, value) {
        if (!this.ready) return false;
        const { error } = await this._sb.from('app_settings')
            .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
        if (error) { this._err('saveAppSettings', error); return false; }
        return true;
    },

    // =========================================================================
    // ROOM ENTRIES
    // =========================================================================

    async logRoomEntry(roomId) {
        if (!this.ready) return null;
        const { data, error } = await this._sb
            .from('room_entries').insert({ user_id: this._uid, room_id: roomId })
            .select('id').single();
        if (error) { this._err('logRoomEntry', error); return null; }
        return data?.id || null;
    },

    async logRoomExit(entryId) {
        if (!entryId || !this.ready) return;
        const { data: entry } = await this._sb
            .from('room_entries').select('entered_at').eq('id', entryId).single();
        if (!entry) return;
        const seconds = Math.round((Date.now() - new Date(entry.entered_at).getTime()) / 1_000);
        await this._sb.from('room_entries')
            .update({ left_at: new Date().toISOString(), duration_seconds: seconds })
            .eq('id', entryId);
    },

    // =========================================================================
    // BROADCAST MESSAGE (bulk whispers)
    // =========================================================================

    async broadcastMessage(userIds, message) {
        if (!this.ready || !userIds?.length) return { sent: 0, failed: 0 };
        const rows = userIds.map(recipient_id => ({ sender_id: this._uid, recipient_id, message }));
        const { data, error } = await this._sb.from('whispers').insert(rows).select('id');
        if (error) { this._err('broadcastMessage', error); return { sent: 0, failed: userIds.length }; }
        return { sent: data?.length || 0, failed: userIds.length - (data?.length || 0) };
    },

    // =========================================================================
    // ADMIN QUERIES
    // =========================================================================

    async getAdminNotifications(limit = 50) {
        if (!this.ready) return [];
        const { data, error } = await this._sb
            .from('admin_notifications').select('*')
            .order('created_at', { ascending: false }).limit(limit);
        if (error) { this._err('getAdminNotifications', error); return []; }
        return data || [];
    },

    async markNotificationRead(id) {
        if (!this.ready) return false;
        const { error } = await this._sb.from('admin_notifications').update({ read: true }).eq('id', id);
        if (error) { this._err('markNotificationRead', error); return false; }
        return true;
    },

    async markAllNotificationsRead() {
        if (!this.ready) return false;
        const { error } = await this._sb.from('admin_notifications').update({ read: true }).eq('read', false);
        if (error) { this._err('markAllNotificationsRead', error); return false; }
        return true;
    },

    async getUnreadNotificationCount() {
        if (!this.ready) return 0;
        const { count, error } = await this._sb
            .from('admin_notifications').select('*', { count: 'exact', head: true }).eq('read', false);
        if (error) { this._err('getUnreadNotificationCount', error); return 0; }
        return count || 0;
    },

    async getAdminMemberStats() {
        if (!this.ready) return {};
        const [totalRes, newRes, onlineRes] = await Promise.all([
            this._sb.from('profiles').select('*', { count: 'exact', head: true }),
            this._sb.from('profiles').select('*', { count: 'exact', head: true }).gte('updated_at', this._ago(7 * 24 * 60 * 60_000)),
            this._sb.from('community_presence').select('*', { count: 'exact', head: true })
                .neq('status', 'offline').gte('last_seen', this._ago(5 * 60_000)),
        ]);
        return {
            total:       totalRes.count  || 0,
            newThisWeek: newRes.count    || 0,
            onlineNow:   onlineRes.count || 0,
        };
    },

    async getAdminEngagementStats() {
        if (!this.ready) return {};
        const today = this._todayUTC();
        const [reflToday, reflTotal, whispToday, apprToday] = await Promise.all([
            this._sb.from('reflections').select('*', { count: 'exact', head: true }).gte('created_at', today),
            this._sb.from('reflections').select('*', { count: 'exact', head: true }),
            this._sb.from('whispers').select('*', { count: 'exact', head: true }).gte('created_at', today),
            this._sb.from('appreciations').select('*', { count: 'exact', head: true }).gte('created_at', today),
        ]);
        return {
            reflectionsToday:   reflToday.count  || 0,
            reflectionsTotal:   reflTotal.count  || 0,
            whispersToday:      whispToday.count || 0,
            appreciationsToday: apprToday.count  || 0,
        };
    },

    async getLeaderboard() {
        if (!this.ready) return { xp: [], karma: [] };
        // Select only the fields needed — avoids exposing full payload (journal/gratitude entries etc.)
        const { data: progress, error } = await this._sb
            .from('user_progress')
            .select('user_id, payload->xp, payload->karma, payload->level')
            .limit(50);
        if (error) { this._err('getLeaderboard', error); return { xp: [], karma: [] }; }

        const userIds = (progress || []).map(r => r.user_id);
        if (!userIds.length) return { xp: [], karma: [] };

        const { data: profiles } = await this._sb
            .from('profiles').select('id, name, emoji, avatar_url').in('id', userIds);
        const profileMap = Object.fromEntries((profiles || []).map(p => [p.id, p]));

        const enriched = (progress || [])
            .filter(r => profileMap[r.user_id])
            .map(r => ({
                user_id:  r.user_id,
                profiles: profileMap[r.user_id],
                payload:  { xp: r.xp ?? 0, karma: r.karma ?? 0, level: r.level ?? 1 }
            }));

        const top = (key) => [...enriched]
            .sort((a, b) => (b.payload?.[key] || 0) - (a.payload?.[key] || 0))
            .slice(0, 3);

        return { xp: top('xp'), karma: top('karma') };
    },

    async getRoomUsageToday() {
        if (!this.ready) return [];
        const { data, error } = await this._sb
            .from('room_entries').select('room_id, duration_seconds')
            .gte('entered_at', this._todayUTC());
        if (error) { this._err('getRoomUsageToday', error); return []; }

        const map = {};
        for (const row of (data || [])) {
            if (!map[row.room_id]) map[row.room_id] = { room_id: row.room_id, entries: 0, totalSeconds: 0 };
            map[row.room_id].entries++;
            map[row.room_id].totalSeconds += row.duration_seconds || 0;
        }
        return Object.values(map).sort((a, b) => b.entries - a.entries);
    },

    async getPushSubscriptionCount() {
        if (!this.ready) return 0;
        const { count, error } = await this._sb
            .from('push_subscriptions').select('*', { count: 'exact', head: true });
        if (error) { this._err('getPushSubscriptionCount', error); return 0; }
        return count || 0;
    },

    async getRetentionSignals() {
        if (!this.ready) return { quietMembers: [], streakMembers: [] };

        const [activeLastWeek, activeTwoWeeks, recentlyActive] = await Promise.all([
            this._sb.from('community_presence').select('user_id, profiles(name, emoji)')
                .gte('last_seen', this._ago(7 * 24 * 60 * 60_000)).neq('status', 'offline'),
            this._sb.from('community_presence').select('user_id')
                .gte('last_seen', this._ago(14 * 24 * 60 * 60_000))
                .lt('last_seen',  this._ago(7  * 24 * 60 * 60_000)),
            this._sb.from('community_presence').select('user_id, profiles(name, emoji)')
                .gte('last_seen', this._ago(3 * 24 * 60 * 60_000)),
        ]);

        const lastWeekIds = new Set((activeLastWeek.data || []).map(r => r.user_id));
        const twoWeekIds  = new Set((activeTwoWeeks.data  || []).map(r => r.user_id));

        const quietMembers = [...twoWeekIds].filter(id => !lastWeekIds.has(id)).slice(0, 5);
        const streakMembers = (recentlyActive.data || [])
            .filter(r => r.profiles).slice(0, 5)
            .map(r => ({ user_id: r.user_id, name: r.profiles?.name, emoji: r.profiles?.emoji }));

        return { quietMembers, streakMembers };
    },

    async getSafetyStats() {
        if (!this.ready) return {};
        const [reportsWeek, blockedTotal, notifUnread] = await Promise.all([
            this._sb.from('admin_notifications').select('*', { count: 'exact', head: true })
                .eq('type', 'report').gte('created_at', this._ago(7 * 24 * 60 * 60_000)),
            this._sb.from('blocked_users').select('*', { count: 'exact', head: true }),
            this._sb.from('admin_notifications').select('*', { count: 'exact', head: true }).eq('read', false),
        ]);
        return {
            reportsThisWeek: reportsWeek.count  || 0,
            blockedTotal:    blockedTotal.count  || 0,
            unreadNotifs:    notifUnread.count   || 0,
        };
    },

    async getRecentReflectionsAdmin(limit = 5) {
        if (!this.ready) return [];
        const { data, error } = await this._sb
            .from('reflections')
            .select('id, content, created_at, user_id, profiles!reflections_user_id_fkey(id, name, emoji, avatar_url)')
            .order('created_at', { ascending: false }).limit(limit);
        if (error) {
            this._err('getRecentReflectionsAdmin', error);
            const { data: plain } = await this._sb.from('reflections')
                .select('id, content, created_at, author_id')
                .order('created_at', { ascending: false }).limit(limit);
            return plain || [];
        }
        return data || [];
    },

    /**
     * Admin-only: update a user's gamification state atomically via Postgres RPC.
     * Uses update_user_gamification() which handles XP, Karma, feature unlocks,
     * and badge grants in a single atomic operation — no race conditions.
     *
     * @param {string} targetUserId
     * @param {Object} opts
     * @param {number}  [opts.xpDelta=0]
     * @param {number}  [opts.karmaDelta=0]
     * @param {string}  [opts.unlockFeature=null]
     * @param {string}  [opts.badgeId=null]
     * @param {string}  [opts.badgeName=null]
     * @param {string}  [opts.badgeIcon='🏅']
     * @param {string}  [opts.badgeRarity='common']
     * @param {number}  [opts.badgeXp=0]
     * @param {string}  [opts.badgeDesc='']
     * @returns {Promise<boolean>}
     */
    async adminUpdateGamification(targetUserId, {
        xpDelta       = 0,
        karmaDelta    = 0,
        unlockFeature = null,
        badgeId       = null,
        badgeName     = null,
        badgeIcon     = '🏅',
        badgeRarity   = 'common',
        badgeXp       = 0,
        badgeDesc     = '',
    } = {}) {
        if (!this.ready) return false;
        try {
            const { error } = await this._sb.rpc('update_user_gamification', {
                target_user_id: targetUserId,
                xp_delta:       xpDelta,
                karma_delta:    karmaDelta,
                unlock_feature: unlockFeature,
                badge_id:       badgeId,
                badge_name:     badgeName,
                badge_icon:     badgeIcon,
                badge_rarity:   badgeRarity,
                badge_xp:       badgeXp,
                badge_desc:     badgeDesc,
            });
            if (error) throw new Error(error.message);
            return true;
        } catch (err) {
            this._err('adminUpdateGamification', err); return false;
        }
    },

    // =========================================================================
    // CLEANUP
    // =========================================================================

    /** Shared unsub helper - unsubscribes and removes a keyed subscription */
    _unsub(key) {
        if (this._subs[key]) { this._subs[key].unsubscribe(); delete this._subs[key]; }
    },

    unsubscribeAll() {
        for (const sub of Object.values(this._subs)) {
            try { sub.unsubscribe(); } catch (_) {}
        }
        this._subs = {};
    },

    async _cleanup() {
        this.stopHeartbeat();
        await this.setOffline();
        this.unsubscribeAll();
    },
};

window.addEventListener('pagehide', () => CommunityDB._cleanup());

// Named export for ES module consumers
export { CommunityDB };

// Keep window assignment for classic scripts that still reference window.CommunityDB
window.CommunityDB = CommunityDB;
