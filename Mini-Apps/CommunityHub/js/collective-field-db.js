/**
 * COLLECTIVE FIELD — SUPABASE INTEGRATION
 *
 * Handles all DB operations for:
 *   - collective_field   (shared energy level, daily pulse count)
 *   - collective_pulses  (per-pulse events → recent senders)
 *   - wave_contributions (per-session logs → wave total, personal stats)
 *
 * Exposes window.CollectiveFieldDB.
 * Designed to mirror CommunityDB patterns — all Supabase calls go here,
 * no other module talks to Supabase directly.
 *
 * @version 1.0.0
 */

const CollectiveFieldDB = {

    // =========================================================================
    // STATE
    // =========================================================================

    _realtimeChannels: {},   // keyed by channel name for cleanup
    _pollInterval: null,
    POLL_INTERVAL_MS: 30000, // 30s fallback polling

    // =========================================================================
    // INIT — call once after CommunityDB.init()
    // =========================================================================

    /**
     * Load initial state from DB and start realtime + polling.
     * Call this after the DOM is ready and CommunityDB is initialised.
     */
    async init() {
        try {
            await this._ensureTodayRow();
            await this.loadAll();
            this._subscribeRealtime();
            this._startPolling();
            console.log('✅ CollectiveFieldDB initialised');
        } catch (err) {
            console.error('CollectiveFieldDB init error:', err);
        }
    },

    /**
     * Load everything and push into CollectiveField UI
     */
    async loadAll() {
        await Promise.all([
            this.loadFieldState(),
            this.loadRecentSenders(),
            this.loadWaveTotal(),
            this.loadWaveParticipants(),
            this.loadUserContribution(),
        ]);
    },

    // =========================================================================
    // DAILY ROW MANAGEMENT
    // =========================================================================

    /**
     * Ensure a collective_field row exists for today (UTC).
     * If yesterday's row exists and today's doesn't, today starts fresh.
     */
    async _ensureTodayRow() {
        const today = this._todayUTC();
        const { data, error } = await window.CommunitySupabase
            .from('collective_field')
            .select('id')
            .eq('date', today)
            .maybeSingle();

        if (error) throw error;

        if (!data) {
            // Insert fresh row for today
            const { error: insertErr } = await window.CommunitySupabase
                .from('collective_field')
                .insert({ date: today, energy_level: 0, pulse_count_today: 0 });
            if (insertErr) throw insertErr;
            console.log(`✓ collective_field row created for ${today}`);
        }
    },

    // =========================================================================
    // ENERGY FIELD — READ
    // =========================================================================

    /**
     * Load today's shared field state and push to UI
     */
    async loadFieldState() {
        const { data, error } = await window.CommunitySupabase
            .from('collective_field')
            .select('energy_level, pulse_count_today')
            .eq('date', this._todayUTC())
            .single();

        if (error) { console.error('loadFieldState error:', error); return; }

        CollectiveField.updateEnergyLevel(data.energy_level);
        CollectiveField.updateCommunityPulseCount(data.pulse_count_today);
    },

    /**
     * Load the 5 most recent senders and push to UI
     */
    async loadRecentSenders() {
        const { data, error } = await window.CommunitySupabase
            .from('collective_pulses')
            .select('user_id, profiles(emoji, avatar_url)')
            .eq('date', this._todayUTC())
            .order('created_at', { ascending: false })
            .limit(5);

        if (error) { console.error('loadRecentSenders error:', error); return; }

        const senders = (data || []).map(row => ({
            emoji:     row.profiles?.emoji     || '🧘',
            avatarUrl: row.profiles?.avatar_url || null,
        }));

        CollectiveField.updateRecentSenders(senders);
    },

    // =========================================================================
    // ENERGY FIELD — WRITE
    // =========================================================================

    /**
     * Record a pulse from the current user.
     * - Increments energy_level (+5, cap 100) and pulse_count_today atomically
     * - Inserts a row into collective_pulses for recent senders
     */
    async recordPulse() {
        const userId = window.CommunityDB?.userId;
        if (!userId) { console.error('recordPulse: no userId'); return; }

        const today = this._todayUTC();

        // Atomic increment via RPC — avoids race conditions between concurrent users
        const { error: rpcErr } = await window.CommunitySupabase.rpc('increment_field_pulse', {
            p_date: today,
            p_energy_add: 5,
        });
        if (rpcErr) { console.error('recordPulse RPC error:', rpcErr); return; }

        // Log pulse event for recent senders
        const { error: insertErr } = await window.CommunitySupabase
            .from('collective_pulses')
            .insert({ user_id: userId, date: today });
        if (insertErr) { console.error('recordPulse insert error:', insertErr); return; }

        console.log('✓ Pulse recorded');
    },

    // =========================================================================
    // CALM WAVE — READ
    // =========================================================================

    /**
     * Load today's collective wave total minutes and push to UI
     */
    async loadWaveTotal() {
        const { data, error } = await window.CommunitySupabase
            .from('wave_contributions')
            .select('minutes')
            .eq('date', this._todayUTC());

        if (error) { console.error('loadWaveTotal error:', error); return; }

        const total = (data || []).reduce((sum, row) => sum + (row.minutes || 0), 0);
        CollectiveField.updateWaveTotalMinutes(total);
    },

    /**
     * Load count of distinct users who contributed ≥1 min today
     */
    async loadWaveParticipants() {
        const { data, error } = await window.CommunitySupabase
            .from('wave_contributions')
            .select('user_id')
            .eq('date', this._todayUTC());

        if (error) { console.error('loadWaveParticipants error:', error); return; }

        // Distinct user count
        const uniqueUsers = new Set((data || []).map(r => r.user_id)).size;
        CollectiveField.updateWaveParticipants(uniqueUsers);
    },

    /**
     * Load the current user's today + all-time wave minutes and push to UI
     */
    async loadUserContribution() {
        const userId = window.CommunityDB?.userId;
        if (!userId) return;

        // Today
        const { data: todayData, error: todayErr } = await window.CommunitySupabase
            .from('wave_contributions')
            .select('minutes')
            .eq('user_id', userId)
            .eq('date', this._todayUTC());

        if (todayErr) { console.error('loadUserContribution today error:', todayErr); return; }

        // All time
        const { data: allData, error: allErr } = await window.CommunitySupabase
            .from('wave_contributions')
            .select('minutes')
            .eq('user_id', userId);

        if (allErr) { console.error('loadUserContribution allTime error:', allErr); return; }

        const todayMins   = (todayData || []).reduce((s, r) => s + (r.minutes || 0), 0);
        const allTimeMins = (allData   || []).reduce((s, r) => s + (r.minutes || 0), 0);

        CollectiveField.updateUserContribution(todayMins, allTimeMins);
    },

    // =========================================================================
    // CALM WAVE — WRITE
    // =========================================================================

    /**
     * Log a completed or partial wave session
     * @param {number} minutes - minutes contributed
     * @param {boolean} completed - true if full session, false if partial
     */
    async logWaveContribution(minutes, completed) {
        const userId = window.CommunityDB?.userId;
        if (!userId) { console.error('logWaveContribution: no userId'); return; }
        if (minutes < 1) return; // enforced minimum

        const { error } = await window.CommunitySupabase
            .from('wave_contributions')
            .insert({
                user_id:   userId,
                date:      this._todayUTC(),
                minutes:   minutes,
                completed: completed,
            });

        if (error) { console.error('logWaveContribution error:', error); return; }

        console.log(`✓ Wave contribution logged: ${minutes}min (completed: ${completed})`);

        // Reload wave total + participants so UI reflects the new contribution
        await this.loadWaveTotal();
        await this.loadWaveParticipants();
    },

    // =========================================================================
    // REALTIME — subscribe to live changes from other users
    // =========================================================================

    _subscribeRealtime() {
        const today = this._todayUTC();

        // ── Channel 1: collective_field row changes (energy level, pulse count) ──
        this._realtimeChannels.field = window.CommunitySupabase
            .channel('collective_field_changes')
            .on('postgres_changes', {
                event:  'UPDATE',
                schema: 'public',
                table:  'collective_field',
                filter: `date=eq.${today}`,
            }, payload => {
                const row = payload.new;
                CollectiveField.updateEnergyLevel(row.energy_level);
                CollectiveField.updateCommunityPulseCount(row.pulse_count_today);
                console.log('⚡ Field state updated via realtime');
            })
            .subscribe();

        // ── Channel 2: collective_pulses inserts (new pulse from any user) ──
        this._realtimeChannels.pulses = window.CommunitySupabase
            .channel('collective_pulses_inserts')
            .on('postgres_changes', {
                event:  'INSERT',
                schema: 'public',
                table:  'collective_pulses',
                filter: `date=eq.${today}`,
            }, async payload => {
                // Trigger the visual ripple for all users viewing the hub
                CollectiveField.receiveExternalPulse({ userId: payload.new.user_id, intensity: 0.7 });
                // Reload recent senders strip
                await this.loadRecentSenders();
                console.log(`⚡ External pulse received from ${payload.new.user_id}`);
            })
            .subscribe();

        // ── Channel 3: wave_contributions inserts (someone logged a session) ──
        this._realtimeChannels.wave = window.CommunitySupabase
            .channel('wave_contributions_inserts')
            .on('postgres_changes', {
                event:  'INSERT',
                schema: 'public',
                table:  'wave_contributions',
                filter: `date=eq.${today}`,
            }, async () => {
                await this.loadWaveTotal();
                await this.loadWaveParticipants();
                console.log('⚡ Wave total updated via realtime');
            })
            .subscribe();

        console.log('✓ CollectiveFieldDB realtime subscriptions active');
    },

    // =========================================================================
    // POLLING FALLBACK — refreshes state every 30s
    // =========================================================================

    _startPolling() {
        if (this._pollInterval) clearInterval(this._pollInterval);

        this._pollInterval = setInterval(async () => {
            try {
                await this.loadAll();
                console.log('✓ CollectiveFieldDB polled');
            } catch (err) {
                console.error('CollectiveFieldDB poll error:', err);
            }
        }, this.POLL_INTERVAL_MS);
    },

    // =========================================================================
    // CLEANUP
    // =========================================================================

    /**
     * Unsubscribe all realtime channels and stop polling.
     * Call on page unload or hub teardown.
     */
    destroy() {
        Object.values(this._realtimeChannels).forEach(ch => {
            try { ch.unsubscribe(); } catch (_) {}
        });
        this._realtimeChannels = {};

        if (this._pollInterval) {
            clearInterval(this._pollInterval);
            this._pollInterval = null;
        }
        console.log('✓ CollectiveFieldDB destroyed');
    },

    // =========================================================================
    // UTILITIES
    // =========================================================================

    /**
     * Returns today's date string in UTC: "YYYY-MM-DD"
     */
    _todayUTC() {
        return new Date().toISOString().slice(0, 10);
    },
};

// ── Cleanup on page unload ────────────────────────────────────────────────────
window.addEventListener('beforeunload', () => CollectiveFieldDB.destroy());

// ── Global exposure ───────────────────────────────────────────────────────────
window.CollectiveFieldDB = CollectiveFieldDB;
