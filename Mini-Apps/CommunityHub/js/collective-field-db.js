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

import { CommunityDB } from './community-supabase.js';

// CollectiveField is NOT imported here to avoid a circular dependency
// (collective-field.js imports CollectiveFieldDB, CollectiveFieldDB pushes back to CollectiveField).
// CollectiveField's window bridge is guaranteed to be set before init() is ever called
// (CommunityHubEngine loads collective-field.js in Group 4b, then calls CollectiveFieldDB.init()).
// eslint-disable-next-line no-undef
const _cf = () => window.CollectiveField;

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
            console.log('✅ CollectiveFieldDB initialised');
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

    get _sb() { return window.CommunitySupabase; },

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
        const userId = CommunityDB?.userId;
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
        const userId = CommunityDB?.userId;
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
        const userId = CommunityDB?.userId;
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
        this._realtimeChannels.wave = this._sb
            .channel('wave_contributions_inserts')
            .on('postgres_changes', {
                event: 'INSERT', schema: 'public',
                table: 'wave_contributions', filter: `date=eq.${today}`,
            }, async () => {
                await Promise.all([this.loadWaveTotal(), this.loadWaveParticipants()]);
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

window.addEventListener('beforeunload', () => CollectiveFieldDB.destroy());

// Window bridge: preserved for external callers
window.CollectiveFieldDB = CollectiveFieldDB;

export { CollectiveFieldDB };
