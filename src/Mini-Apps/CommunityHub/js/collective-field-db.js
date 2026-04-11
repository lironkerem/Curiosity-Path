/**
 * COLLECTIVE FIELD - SUPABASE INTEGRATION
 *
 * Handles all DB operations for:
 *   - collective_field   (shared energy level, daily pulse count)
 *   - collective_pulses  (per-pulse events → recent senders)
 *   - wave_contributions (per-session logs → wave total, personal stats)
 *
 * @version 1.1.0
 */

// Neither CommunityDB nor CollectiveField are imported directly:
// - CollectiveField: avoided to prevent a circular dependency.
// - CommunityDB: avoided because dynamic-import deduplication is not guaranteed in the
//   raw-copied (non-bundled) module context — each importer may receive its own instance,
//   so CommunityDB._uid would be null here even after CommunityHubEngine calls CommunityDB.init().
//   window.CommunityDB is always set by community-supabase.js and .init() is called by
//   CommunityHubEngine before CollectiveFieldDB.init(), so the window reference is safe.
const _cf  = () => window.CollectiveField;
const _cdb = () => window.CommunityDB;

const CollectiveFieldDB = {

    // =========================================================================
    // STATE
    // =========================================================================

    _realtimeChannels: {},
    _pollInterval:     null,
    POLL_INTERVAL_MS:  30_000,

    // =========================================================================
    // INIT
    // =========================================================================

    async init() {
        try {
            await this._ensureTodayRow();
            await this.loadAll();
            this._subscribeRealtime();
            this._startPolling();
        } catch (err) {
            console.error('[CollectiveFieldDB] init error:', err);
        }
    },

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
    // HELPERS
    // =========================================================================

    // Read window.AppSupabase directly — window.CommunitySupabase may be null
    // because supabase-client.js captures window.AppSupabase at module parse time
    // (before Supabase.js has run). AppSupabase is always set by the time any
    // DB method is called (after auth + CommunityHub init).
    get _sb() { return window.AppSupabase || window.CommunitySupabase || null; },

    _todayUTC() {
        return new Date().toISOString().slice(0, 10);
    },

    // Centralised error logger - keeps call sites terse
    _err(label, error) {
        console.error(`[CollectiveFieldDB] ${label}:`, error);
    },

    // =========================================================================
    // DAILY ROW
    // =========================================================================

    async _ensureTodayRow() {
        const today = this._todayUTC();
        const { data, error } = await this._sb
            .from('collective_field')
            .select('id')
            .eq('date', today)
            .maybeSingle();

        if (error) throw error;

        if (!data) {
            const { error: insertErr } = await this._sb
                .from('collective_field')
                .insert({ date: today, energy_level: 0, pulse_count_today: 0 });
            if (insertErr) throw insertErr;
        }
    },

    // =========================================================================
    // ENERGY FIELD - READ
    // =========================================================================

    async loadFieldState() {
        const { data, error } = await this._sb
            .from('collective_field')
            .select('energy_level, pulse_count_today')
            .eq('date', this._todayUTC())
            .single();

        if (error) { this._err('loadFieldState', error); return; }

        _cf().updateEnergyLevel(data.energy_level);
        _cf().updateCommunityPulseCount(data.pulse_count_today);
    },

    async loadRecentSenders() {
        const { data, error } = await this._sb
            .from('collective_pulses')
            .select('user_id, profiles(emoji, avatar_url)')
            .eq('date', this._todayUTC())
            .order('created_at', { ascending: false })
            .limit(5);

        if (error) { this._err('loadRecentSenders', error); return; }

        _cf().updateRecentSenders(
            (data || []).map(row => ({
                emoji:     row.profiles?.emoji      || '🧘',
                avatarUrl: row.profiles?.avatar_url || null,
            }))
        );
    },

    // =========================================================================
    // ENERGY FIELD - WRITE
    // =========================================================================

    async recordPulse() {
        const userId = _cdb()?.userId;
        if (!userId) { this._err('recordPulse', 'no userId'); return; }

        const today = this._todayUTC();

        const { error: rpcErr } = await this._sb.rpc('increment_field_pulse', {
            p_date:       today,
            p_energy_add: 5,
        });
        if (rpcErr) { this._err('recordPulse RPC', rpcErr); return; }

        const { error: insertErr } = await this._sb
            .from('collective_pulses')
            .insert({ user_id: userId, date: today });
        if (insertErr) { this._err('recordPulse insert', insertErr); }
    },

    // =========================================================================
    // CALM WAVE - READ
    // =========================================================================

    async loadWaveTotal() {
        const { data, error } = await this._sb
            .from('wave_contributions')
            .select('minutes')
            .eq('date', this._todayUTC());

        if (error) { this._err('loadWaveTotal', error); return; }

        _cf().updateWaveTotalMinutes(
            (data || []).reduce((sum, row) => sum + (row.minutes || 0), 0)
        );
    },

    async loadWaveParticipants() {
        const { data, error } = await this._sb
            .from('wave_contributions')
            .select('user_id')
            .eq('date', this._todayUTC());

        if (error) { this._err('loadWaveParticipants', error); return; }

        _cf().updateWaveParticipants(
            new Set((data || []).map(r => r.user_id)).size
        );
    },

    async loadUserContribution() {
        const userId = _cdb()?.userId;
        if (!userId) return;

        const today = this._todayUTC();

        const [{ data: todayData, error: todayErr }, { data: allData, error: allErr }] =
            await Promise.all([
                this._sb.from('wave_contributions').select('minutes').eq('user_id', userId).eq('date', today),
                this._sb.from('wave_contributions').select('minutes').eq('user_id', userId),
            ]);

        if (todayErr) { this._err('loadUserContribution today', todayErr); return; }
        if (allErr)   { this._err('loadUserContribution allTime', allErr); return; }

        const sum = (rows) => (rows || []).reduce((s, r) => s + (r.minutes || 0), 0);
        _cf().updateUserContribution(sum(todayData), sum(allData));
    },

    // =========================================================================
    // CALM WAVE - WRITE
    // =========================================================================

    async logWaveContribution(minutes, completed) {
        console.log('[DEBUG logWave] window.CommunityDB:', window.CommunityDB);
        console.log('[DEBUG logWave] window.CommunityDB?.userId:', window.CommunityDB?.userId);
        console.log('[DEBUG logWave] window.CommunityDB?._uid:', window.CommunityDB?._uid);
        console.log('[DEBUG logWave] window.Core?.state?.currentUser:', window.Core?.state?.currentUser);
        console.log('[DEBUG logWave] window.AppSupabase?.auth?.getUser:', typeof window.AppSupabase?.auth?.getUser);
        const userId = _cdb()?.userId;
        if (!userId)    { this._err('logWaveContribution', 'no userId'); return; }
        if (minutes < 1) return;

        const { error } = await this._sb
            .from('wave_contributions')
            .insert({ user_id: userId, date: this._todayUTC(), minutes, completed });

        if (error) { this._err('logWaveContribution', error); return; }

        // Reload wave totals so UI reflects the new contribution
        await Promise.all([this.loadWaveTotal(), this.loadWaveParticipants()]);
    },

    // =========================================================================
    // REALTIME
    // =========================================================================

    _subscribeRealtime() {
        const today = this._todayUTC();

        // Channel 1: energy level + pulse count updates
        this._realtimeChannels.field = this._sb
            .channel('collective_field_changes')
            .on('postgres_changes', {
                event: 'UPDATE', schema: 'public',
                table: 'collective_field', filter: `date=eq.${today}`,
            }, ({ new: row }) => {
                _cf().updateEnergyLevel(row.energy_level);
                _cf().updateCommunityPulseCount(row.pulse_count_today);
            })
            .subscribe();

        // Channel 2: new pulse from any user
        this._realtimeChannels.pulses = this._sb
            .channel('collective_pulses_inserts')
            .on('postgres_changes', {
                event: 'INSERT', schema: 'public',
                table: 'collective_pulses', filter: `date=eq.${today}`,
            }, async ({ new: row }) => {
                _cf().receiveExternalPulse({ userId: row.user_id, intensity: 0.7 });
                await this.loadRecentSenders();
            })
            .subscribe();

        // Channel 3: new wave session logged
        // With REPLICA IDENTITY FULL, the INSERT payload contains the full new row.
        // We can use row.minutes directly to increment the running total immediately,
        // then re-query participants (no shortcut — need distinct user count).
        this._realtimeChannels.wave = this._sb
            .channel('wave_contributions_inserts')
            .on('postgres_changes', {
                event: 'INSERT', schema: 'public',
                table: 'wave_contributions', filter: `date=eq.${today}`,
            }, async ({ new: row }) => {
                // Fast path: add minutes from payload without a round-trip
                if (typeof row?.minutes === 'number' && row.minutes > 0) {
                    const current = _cf().state.waveTotalMinutes || 0;
                    _cf().updateWaveTotalMinutes(current + row.minutes);
                }
                // Participant count still requires a distinct query
                await this.loadWaveParticipants();
            })
            .subscribe();
    },

    // =========================================================================
    // POLLING FALLBACK
    // =========================================================================

    _startPolling() {
        if (this._pollInterval) clearInterval(this._pollInterval);
        this._pollInterval = setInterval(async () => {
            try { await this.loadAll(); }
            catch (err) { this._err('poll', err); }
        }, this.POLL_INTERVAL_MS);
    },

    // =========================================================================
    // CLEANUP
    // =========================================================================

    destroy() {
        for (const ch of Object.values(this._realtimeChannels)) {
            try { ch.unsubscribe(); } catch (_) {}
        }
        this._realtimeChannels = {};
        if (this._pollInterval) { clearInterval(this._pollInterval); this._pollInterval = null; }
    },
};

window.addEventListener('pagehide', () => CollectiveFieldDB.destroy());

// Window bridge: preserved for external callers
window.CollectiveFieldDB = CollectiveFieldDB;

export { CollectiveFieldDB };
