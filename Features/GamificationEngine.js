// =========================================================
//  GamificationEngine.js - 56-BADGE SYSTEM ONLY
//  Achievements removed; Karma reward per rarity added
// =========================================================
export class GamificationEngine {
  constructor(app) {
    this.app = app;
    this.listeners = {};
    this.state = this.loadState() || this.defaultState();
    this.checkAllBadges();
  }

  /* ---------------------------------------------------------
     DEFAULT STATE
  --------------------------------------------------------- */
  defaultState() {
    return {
      xp: 0,
      level: 1,
      karma: 0,
      streak: { current: 0 },
      completedSessions: { daily: 0, weekly: 0 },
      badges: [],
      unlockedFeatures: [],
      quests: { daily: [], weekly: [], monthly: [] },
      logs: [],
      totalWellnessRuns: 0,
      totalTarotSpreads: 0,
      totalJournalEntries: 0,
      totalHappinessViews: 0,
      weeklyQuestCompletions: 0,
      monthlyQuestCompletions: 0,
      dailyQuestCompletions: 0,
      totalQuestCompletions: 0,
      dailyQuestStreak: 0,
      _bulkMode: false,
      settings: {
        xpPerAction: 10,
        xpPerLevel: 100,
        streakResetDays: 1,
        synergyBonus: 10
      }
    };
  }

  /* ---------------------------------------------------------
     CLOUD + LOCAL PERSISTENCE
  --------------------------------------------------------- */
  saveState() {
    localStorage.setItem('gamificationState', JSON.stringify(this.state));
    if (this.app?.state) {
      this.app.state.data = { ...this.app.state.data, ...this.state };
      this.app.state.saveAppData();
    }
  }

  loadState() {
    try {
      if (this.app?.state?.data && this.app.state.data.xp !== undefined) {
        const cloud = this.app.state.data;
        if (cloud.streak?.best) delete cloud.streak.best;
        if (cloud.streak?.lastCheckIn) delete cloud.streak.lastCheckIn;
        if (cloud.energyLevel) delete cloud.energyLevel;
        if (cloud.alignmentScore) delete cloud.alignmentScore;
        if (cloud.chakraProgress) delete cloud.chakraProgress;
        if (cloud.totalPracticeMinutes) delete cloud.totalPracticeMinutes;
        return { ...this.defaultState(), ...cloud };
      }
      const local = JSON.parse(localStorage.getItem('gamificationState'));
      return local || null;
    } catch {
      return null;
    }
  }

  /* ---------------------------------------------------------
     LIFETIME COUNTERS
  --------------------------------------------------------- */
  incrementWellnessRuns() {
    this.state.totalWellnessRuns += 1;
    this.checkAllBadges();
    this.saveState();
    this.emit('wellnessRunCompleted', this.state.totalWellnessRuns);
  }
  incrementTarotSpreads() {
    this.state.totalTarotSpreads += 1;
    this.checkAllBadges();
    this.saveState();
    this.emit('tarotSpreadCompleted', this.state.totalTarotSpreads);
  }
  incrementJournalEntries() {
    this.state.totalJournalEntries += 1;
    this.checkAllBadges();
    this.saveState();
    this.emit('journalEntrySaved', this.state.totalJournalEntries);
  }
  incrementHappinessViews() {
    this.state.totalHappinessViews += 1;
    this.checkAllBadges();
    this.saveState();
    this.emit('happinessViewAdded', this.state.totalHappinessViews);
  }

  /* ---------------------------------------------------------
     EVENT BUS
  --------------------------------------------------------- */
  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }
  emit(event, data) {
    (this.listeners[event] || []).forEach(cb => cb(data));
  }

  /* ---------------------------------------------------------
     XP / KARMA / LEVEL
  --------------------------------------------------------- */
  addXP(amount, source = 'general') {
    let final = amount;
    if (this.hasActiveXPBoost()) final = amount * 2;
    this.state.xp += final;
    this.logAction('xp', { amount: final, source, boosted: final !== amount });
    this.emit('xpGained', { amount: final, source });
    this.checkLevelUp();
    this.checkAllBadges();
    this.saveState();
  }

  addKarma(amount, source = 'general') {
    this.state.karma += amount;
    this.logAction('karma', { amount, source });
    this.emit('karmaGained', { amount, source });
    this.checkAllBadges();
    this.saveState();
  }

  hasActiveXPBoost() {
    try {
      const boosts = JSON.parse(localStorage.getItem('karma_active_boosts')) || [];
      const now = Date.now();
      return boosts.some(b => b.id === 'xp_multiplier' && b.expiresAt > now);
    } catch {
      return false;
    }
  }

  calculateLevel() {
    const ladder = [
      { level: 1, title: 'Seeker', xp: 0 },
      { level: 2, title: 'Practitioner', xp: 800 },
      { level: 3, title: 'Adept', xp: 2000 },
      { level: 4, title: 'Healer', xp: 4200 },
      { level: 5, title: 'Master', xp: 7000 },
      { level: 6, title: 'Sage', xp: 12000 },
      { level: 7, title: 'Enlightened', xp: 30000 },
      { level: 8, title: 'Buddha', xp: 60000 },
      { level: 9, title: 'Light', xp: 180000 },
      { level: 10, title: 'Emptiness', xp: 450000 }
    ];
    let i = ladder.length - 1;
    while (i > 0 && this.state.xp < ladder[i].xp) i--;
    const cur = ladder[i], next = ladder[i + 1] || ladder[i];
    const prog = next.xp === cur.xp ? 100 : ((this.state.xp - cur.xp) / (next.xp - cur.xp)) * 100;
    return {
      level: cur.level,
      title: cur.title,
      progress: Math.round(prog),
      pointsToNext: Math.max(0, next.xp - this.state.xp)
    };
  }

  checkLevelUp() {
    const prev = this.state.level;
    const { level, title } = this.calculateLevel();
    if (level > prev) {
      this.state.level = level;
      this.emit('levelUp', { level, title });
      this.addXP(50, `Level ${level}`);
      this.app?.showToast(`🎉 Level ${level} – ${title}  +50 XP`, 'success');
      this.checkAllBadges();
    }
  }

  /* ---------------------------------------------------------
     STREAK
  --------------------------------------------------------- */
  updateStreak() {
    const today = new Date().toDateString();
    if (this.state.streak.lastCheckIn === today) return;
    const last = this.state.streak.lastCheckIn ? new Date(this.state.streak.lastCheckIn) : null;
    const diff = last ? (new Date(today) - last) / (1000 * 60 * 60 * 24) : null;
    if (!last || diff > this.state.settings.streakResetDays) {
      this.state.streak.current = 1;
    } else {
      this.state.streak.current += 1;
    }
    this.state.streak.lastCheckIn = today;
    this.emit('streakUpdated', { current: this.state.streak.current });
    this.checkAllBadges();
    this.saveState();
  }

  /* ---------------------------------------------------------
     BADGES – 56 TOTAL – KARMA BY RARITY
  --------------------------------------------------------- */
  getBadgeDefinitions() {
    return {
      // FIRST-WIN COMMON
      first_step: { name: 'First Step', icon: '🌱', description: 'Any first action in the app', xp: 10, rarity: 'common' },
      first_gratitude: { name: 'First Gratitude', icon: '💚', description: 'First gratitude entry', xp: 10, rarity: 'common' },
      first_journal: { name: 'First Journal', icon: '📝', description: 'First journal entry', xp: 10, rarity: 'common' },
      first_energy: { name: 'First Energy', icon: '⚡', description: 'First energy check-in', xp: 10, rarity: 'common' },
      first_tarot: { name: 'First Reading', icon: '🃏', description: 'First tarot spread', xp: 10, rarity: 'common' },
      first_meditation: { name: 'First Meditation', icon: '🧘', description: 'First meditation session', xp: 10, rarity: 'common' },
      first_purchase: { name: 'First Purchase', icon: '🛒', description: 'First purchase in the Karma Shop', xp: 50, rarity: 'epic' },

      // GRATITUDE
      gratitude_warrior: { name: 'Gratitude Warrior', icon: '❤️', description: '30 gratitude entries', xp: 50, rarity: 'uncommon' },
      gratitude_legend: { name: 'Gratitude Legend', icon: '💝', description: '100 gratitude entries', xp: 100, rarity: 'rare' },
      gratitude_200: { name: 'Gratitude Sage', icon: '💖', description: '200 gratitude entries', xp: 200, rarity: 'epic' },
      gratitude_500: { name: 'Gratitude Titan', icon: '💘', description: '500 gratitude entries', xp: 500, rarity: 'legendary' },

      // JOURNAL
      journal_keeper: { name: 'Journal Keeper', icon: '📔', description: '20 journal entries', xp: 50, rarity: 'uncommon' },
      journal_master: { name: 'Journal Master', icon: '📚', description: '75 journal entries', xp: 100, rarity: 'rare' },
      journal_150: { name: 'Journal Sage', icon: '📖', description: '150 journal entries', xp: 200, rarity: 'epic' },
      journal_400: { name: 'Journal Titan', icon: '📜', description: '400 journal entries', xp: 500, rarity: 'legendary' },

      // ENERGY
      energy_tracker: { name: 'Energy Tracker', icon: '⚡', description: '30 energy logs', xp: 50, rarity: 'uncommon' },
      energy_sage: { name: 'Energy Sage', icon: '🔋', description: '100 energy logs', xp: 100, rarity: 'rare' },
      energy_300: { name: 'Energy Titan', icon: '🔌', description: '300 energy logs', xp: 300, rarity: 'epic' },
      energy_600: { name: 'Energy Legend', icon: '⚡️', description: '600 energy logs', xp: 600, rarity: 'legendary' },

      // TAROT
      tarot_apprentice: { name: 'Tarot Apprentice', icon: '🔮', description: '10 tarot spreads', xp: 25, rarity: 'common' },
      tarot_mystic: { name: 'Tarot Mystic', icon: '🃏', description: '25 tarot spreads', xp: 50, rarity: 'uncommon' },
      tarot_oracle: { name: 'Tarot Oracle', icon: '🌙', description: '75 tarot spreads', xp: 100, rarity: 'rare' },
      tarot_150: { name: 'Tarot Sage', icon: '🧙', description: '150 tarot spreads', xp: 200, rarity: 'epic' },
      tarot_400: { name: 'Tarot Titan', icon: '🔮', description: '400 tarot spreads', xp: 500, rarity: 'legendary' },

      // MEDITATION
      meditation_devotee: { name: 'Meditation Devotee', icon: '🧘', description: '20 meditation sessions', xp: 50, rarity: 'uncommon' },
      meditation_master: { name: 'Meditation Master', icon: '🕉️', description: '60 meditation sessions', xp: 100, rarity: 'rare' },
      meditation_100: { name: 'Meditation Sage', icon: '🧘‍♂️', description: '100 meditation sessions', xp: 300, rarity: 'epic' },
      meditation_200: { name: 'Meditation Titan', icon: '🧘‍♀️', description: '200 meditation sessions', xp: 700, rarity: 'legendary' },

      // HAPPINESS
      happiness_seeker: { name: 'Happiness Seeker', icon: '😊', description: '50 happiness booster views', xp: 50, rarity: 'uncommon' },
      joy_master: { name: 'Joy Master', icon: '🎉', description: '150 happiness booster views', xp: 100, rarity: 'rare' },
      happiness_300: { name: 'Happiness Sage', icon: '😍', description: '300 happiness booster views', xp: 200, rarity: 'epic' },
      happiness_700: { name: 'Happiness Titan', icon: '🤩', description: '700 happiness booster views', xp: 500, rarity: 'legendary' },

      // WELLNESS
      wellness_champion: { name: 'Wellness Champion', icon: '🌿', description: '50 wellness exercises', xp: 50, rarity: 'uncommon' },
      wellness_guru: { name: 'Wellness Guru', icon: '🌳', description: '150 wellness exercises', xp: 100, rarity: 'rare' },
      wellness_300: { name: 'Wellness Titan', icon: '🌲', description: '300 wellness exercises', xp: 300, rarity: 'epic' },
      wellness_700: { name: 'Wellness Legend', icon: '🌎', description: '700 wellness exercises', xp: 1000, rarity: 'legendary' },

      // STREAK
      perfect_week: { name: 'Perfect Week', icon: '⭐', description: 'Complete all daily quests 7 days straight', xp: 75, rarity: 'rare' },
      dedication_streak: { name: 'Dedication', icon: '💎', description: '30-day streak', xp: 100, rarity: 'epic' },
      unstoppable: { name: 'Unstoppable', icon: '🔱', description: '60-day streak', xp: 150, rarity: 'epic' },
      legendary_streak: { name: 'Legendary Streak', icon: '👑', description: '100-day streak', xp: 200, rarity: 'legendary' },

      // QUEST COMPLETION
      weekly_warrior: { name: 'Weekly Warrior', icon: '🔥', description: 'Finish every weekly quest 4 separate weeks', xp: 100, rarity: 'epic' },
      monthly_master: { name: 'Monthly Master', icon: '🌟', description: 'Finish every monthly quest at least once', xp: 150, rarity: 'epic' },
      quest_crusher: { name: 'Quest Crusher', icon: '🎯', description: '100 total quests (any type)', xp: 150, rarity: 'epic' },
      daily_champion: { name: 'Daily Champion', icon: '⭐', description: 'Finish all dailies on 30 separate days', xp: 100, rarity: 'rare' },

      // CURRENCY
      karma_collector: { name: 'Karma Collector', icon: '💰', description: '500 karma accumulated', xp: 50, rarity: 'rare' },
      karma_lord: { name: 'Karma Lord', icon: '💎', description: '2000 karma accumulated', xp: 200, rarity: 'legendary' },
      xp_milestone: { name: 'XP Legend', icon: '⚡', description: '10000 XP earned', xp: 100, rarity: 'epic' },
      xp_titan: { name: 'XP Titan', icon: '⚡', description: '50000 XP earned', xp: 200, rarity: 'legendary' },

      // LEVEL MILESTONES
      level_5_hero: { name: 'Rising Star', icon: '🎯', description: 'Reach Level 5', xp: 100, rarity: 'epic' },
      level_7_hero: { name: 'Enlightened Soul', icon: '🌟', description: 'Reach Level 7', xp: 150, rarity: 'epic' },
      level_10_hero: { name: 'Enlightened Master', icon: '👑', description: 'Reach Level 10', xp: 300, rarity: 'legendary' },

      // CHAKRA
      chakra_balancer: { name: 'Chakra Balancer', icon: '🌈', description: 'All 7 chakras ≥ 8 in one session', xp: 75, rarity: 'epic' },
      chakra_master: { name: 'Chakra Master', icon: '🎨', description: 'All 7 chakras ≥ 9 in one session', xp: 150, rarity: 'legendary' },

      // CROSS-FEATURE
      triple_threat: { name: 'Triple Threat', icon: '🎪', description: 'Use 3 different features in one day', xp: 25, rarity: 'uncommon' },
      super_day: { name: 'Super Day', icon: '💫', description: 'Gratitude + journal + energy + meditation in one day', xp: 50, rarity: 'rare' },
      complete_explorer: { name: 'Complete Explorer', icon: '🗺️', description: 'Use every main feature at least once', xp: 100, rarity: 'epic' },
      renaissance_soul: { name: 'Renaissance Soul', icon: '🎭', description: '≥ 10 actions in 5+ different features', xp: 150, rarity: 'epic' }
    };
  }

  /* ---------------------------------------------------------
     BADGE UNLOCK – XP + KARMA BY RARITY  (no achievements)
  --------------------------------------------------------- */
  grantBadge(badge) {
    if (this.state.badges.find(b => b.id === badge.id)) return;

    // 1. karma reward by rarity
    const karmaMap = { common: 3, uncommon: 5, rare: 10, epic: 15, legendary: 30 };
    const karma = karmaMap[badge.rarity] || 0;
    if (karma) {
      this.state.karma += karma;
      this.logAction('karma', { amount: karma, source: `Badge: ${badge.id}` });
    }

    // 2. store badge
    this.state.badges.push({ ...badge, unlocked: true, date: new Date().toISOString() });
    this.emit('badgeUnlocked', badge);

    // 3. xp reward
    if (badge.xp) this.addXP(badge.xp, `Badge: ${badge.id}`);

    // 4. inspirational toast
    if (badge.inspirational) this.emit('inspirationalMessage', badge.inspirational);

    this.saveState();
  }

  checkAndGrantBadge(badgeId, badgeDefinitions) {
    if (this.state.badges.find(b => b.id === badgeId)) return;
    const def = badgeDefinitions[badgeId];
    this.grantBadge({
      id: badgeId,
      name: def.name,
      icon: def.icon,
      description: def.description,
      xp: def.xp,
      rarity: def.rarity,
      inspirational: def.inspirational
    });
  }

  /* ---------------------------------------------------------
     BADGE CHECKS – 56 TOTAL
  --------------------------------------------------------- */
  checkAllBadges() {
    if (!this.app.state?.data) return;
    const data = this.app.state.data;
    const badges = this.getBadgeDefinitions();

    const gratitudeCount = (data.gratitudeEntries || []).length;
    const journalCount = (data.journalEntries || []).length;
    const energyCount = (data.energyEntries || []).length;
    const tarotCount = this.state.totalTarotSpreads || 0;
    const meditationCount = (data.meditationHistory || []).length;
    const happinessCount = this.state.totalHappinessViews || 0;
    const wellnessCount = this.state.totalWellnessRuns || 0;

    // FIRST-WIN
    const totalActions = gratitudeCount + journalCount + energyCount + tarotCount + meditationCount;
    if (totalActions >= 1) this.checkAndGrantBadge('first_step', badges);
    if (gratitudeCount >= 1) this.checkAndGrantBadge('first_gratitude', badges);
    if (journalCount >= 1) this.checkAndGrantBadge('first_journal', badges);
    if (energyCount >= 1) this.checkAndGrantBadge('first_energy', badges);
    if (tarotCount >= 1) this.checkAndGrantBadge('first_tarot', badges);
    if (meditationCount >= 1) this.checkAndGrantBadge('first_meditation', badges);

    // GRATITUDE
    if (gratitudeCount >= 30) this.checkAndGrantBadge('gratitude_warrior', badges);
    if (gratitudeCount >= 100) this.checkAndGrantBadge('gratitude_legend', badges);
    if (gratitudeCount >= 200) this.checkAndGrantBadge('gratitude_200', badges);
    if (gratitudeCount >= 500) this.checkAndGrantBadge('gratitude_500', badges);

    // JOURNAL
    if (journalCount >= 20) this.checkAndGrantBadge('journal_keeper', badges);
    if (journalCount >= 75) this.checkAndGrantBadge('journal_master', badges);
    if (journalCount >= 150) this.checkAndGrantBadge('journal_150', badges);
    if (journalCount >= 400) this.checkAndGrantBadge('journal_400', badges);

    // ENERGY
    if (energyCount >= 30) this.checkAndGrantBadge('energy_tracker', badges);
    if (energyCount >= 100) this.checkAndGrantBadge('energy_sage', badges);
    if (energyCount >= 300) this.checkAndGrantBadge('energy_300', badges);
    if (energyCount >= 600) this.checkAndGrantBadge('energy_600', badges);

    // TAROT
    if (tarotCount >= 10) this.checkAndGrantBadge('tarot_apprentice', badges);
    if (tarotCount >= 25) this.checkAndGrantBadge('tarot_mystic', badges);
    if (tarotCount >= 75) this.checkAndGrantBadge('tarot_oracle', badges);
    if (tarotCount >= 150) this.checkAndGrantBadge('tarot_150', badges);
    if (tarotCount >= 400) this.checkAndGrantBadge('tarot_400', badges);

    // MEDITATION
    if (meditationCount >= 20) this.checkAndGrantBadge('meditation_devotee', badges);
    if (meditationCount >= 60) this.checkAndGrantBadge('meditation_master', badges);
    if (meditationCount >= 100) this.checkAndGrantBadge('meditation_100', badges);
    if (meditationCount >= 200) this.checkAndGrantBadge('meditation_200', badges);

    // HAPPINESS
    if (happinessCount >= 50) this.checkAndGrantBadge('happiness_seeker', badges);
    if (happinessCount >= 150) this.checkAndGrantBadge('joy_master', badges);
    if (happinessCount >= 300) this.checkAndGrantBadge('happiness_300', badges);
    if (happinessCount >= 700) this.checkAndGrantBadge('happiness_700', badges);

    // WELLNESS
    if (wellnessCount >= 50) this.checkAndGrantBadge('wellness_champion', badges);
    if (wellnessCount >= 150) this.checkAndGrantBadge('wellness_guru', badges);
    if (wellnessCount >= 300) this.checkAndGrantBadge('wellness_300', badges);
    if (wellnessCount >= 700) this.checkAndGrantBadge('wellness_700', badges);

    // STREAK
    const streak = this.state.streak?.current || 0;
    if (streak >= 7) this.checkAndGrantBadge('perfect_week', badges);
    if (streak >= 30) this.checkAndGrantBadge('dedication_streak', badges);
    if (streak >= 60) this.checkAndGrantBadge('unstoppable', badges);
    if (streak >= 100) this.checkAndGrantBadge('legendary_streak', badges);

    // LEVEL
    const level = this.calculateLevel().level;
    if (level >= 5) this.checkAndGrantBadge('level_5_hero', badges);
    if (level >= 7) this.checkAndGrantBadge('level_7_hero', badges);
    if (level >= 10) this.checkAndGrantBadge('level_10_hero', badges);

    // CURRENCY
    if (this.state.karma >= 500) this.checkAndGrantBadge('karma_collector', badges);
    if (this.state.karma >= 2000) this.checkAndGrantBadge('karma_lord', badges);
    if (this.state.xp >= 10000) this.checkAndGrantBadge('xp_milestone', badges);
    if (this.state.xp >= 50000) this.checkAndGrantBadge('xp_titan', badges);

    // QUEST COMPLETION
    if (this.state.weeklyQuestCompletions >= 4) this.checkAndGrantBadge('weekly_warrior', badges);
    if (this.state.monthlyQuestCompletions >= 1) this.checkAndGrantBadge('monthly_master', badges);
    if (this.state.totalQuestCompletions >= 100) this.checkAndGrantBadge('quest_crusher', badges);
    if (this.state.dailyQuestCompletions >= 30) this.checkAndGrantBadge('daily_champion', badges);

    // CHAKRA (single session – call after chakra log)
    // CROSS-FEATURE (daily checks)
    this.checkCrossFeatureBadges(badges);
  }

  checkCrossFeatureBadges(badges) {
    if (!this.app.state?.data) return;
    const today = new Date().toDateString();
    const data = this.app.state.data;

    const todayGratitude = (data.gratitudeEntries || []).some(e => new Date(e.timestamp).toDateString() === today);
    const todayJournal = (data.journalEntries || []).some(e => new Date(e.timestamp).toDateString() === today);
    const todayEnergy = (data.energyEntries || []).some(e => new Date(e.timestamp).toDateString() === today);
    const todayTarot = (data.tarotReadings || []).some(e => new Date(e.timestamp).toDateString() === today);
    const todayMeditation = (data.meditationHistory || []).some(e => new Date(e.timestamp).toDateString() === today);

    const todayFeatures = [todayGratitude, todayJournal, todayEnergy, todayTarot, todayMeditation].filter(Boolean).length;
    if (todayFeatures >= 3) this.checkAndGrantBadge('triple_threat', badges);
    if (todayGratitude && todayJournal && todayEnergy && todayMeditation) this.checkAndGrantBadge('super_day', badges);

    const usedGratitude = (data.gratitudeEntries || []).length > 0;
    const usedJournal = (data.journalEntries || []).length > 0;
    const usedEnergy = (data.energyEntries || []).length > 0;
    const usedTarot = this.state.totalTarotSpreads > 0;
    const usedMeditation = (data.meditationHistory || []).length > 0;
    const usedHappiness = this.state.totalHappinessViews > 0;
    const usedWellness = this.state.totalWellnessRuns > 0;

    if (usedGratitude && usedJournal && usedEnergy && usedTarot && usedMeditation && usedHappiness && usedWellness) {
      this.checkAndGrantBadge('complete_explorer', badges);
    }

    const featureActions = [
      (data.gratitudeEntries || []).length,
      (data.journalEntries || []).length,
      (data.energyEntries || []).length,
      this.state.totalTarotSpreads || 0,
      (data.meditationHistory || []).length,
      this.state.totalHappinessViews || 0,
      this.state.totalWellnessRuns || 0
    ];
    const featuresWithTenPlus = featureActions.filter(count => count >= 10).length;
    if (featuresWithTenPlus >= 5) this.checkAndGrantBadge('renaissance_soul', badges);
  }

  checkChakraBadges(chakras) {
    const badges = this.getBadgeDefinitions();
    const chakraKeys = ['root', 'sacral', 'solar', 'heart', 'throat', 'thirdEye', 'crown'];
    const all8Plus = chakraKeys.every(key => (chakras[key] || 0) >= 8);
    const all9Plus = chakraKeys.every(key => (chakras[key] || 0) >= 9);
    if (all8Plus) this.checkAndGrantBadge('chakra_balancer', badges);
    if (all9Plus) this.checkAndGrantBadge('chakra_master', badges);
  }

  /* ---------------------------------------------------------
     STREAK
  --------------------------------------------------------- */
  updateStreak() {
    const today = new Date().toDateString();
    if (this.state.streak.lastCheckIn === today) return;
    const last = this.state.streak.lastCheckIn ? new Date(this.state.streak.lastCheckIn) : null;
    const diff = last ? (new Date(today) - last) / (1000 * 60 * 60 * 24) : null;
    if (!last || diff > this.state.settings.streakResetDays) {
      this.state.streak.current = 1;
    } else {
      this.state.streak.current += 1;
    }
    this.state.streak.lastCheckIn = today;
    this.emit('streakUpdated', { current: this.state.streak.current });
    this.checkAllBadges();
    this.saveState();
  }

  /* ---------------------------------------------------------
     QUESTS
  --------------------------------------------------------- */
  progressEnergyCheckin(timeOfDay) {
    const quest = this.state.quests.daily.find(q => q.id === 'energy_checkin');
    if (!quest || quest.completed) return;
    if (!quest.subProgress) quest.subProgress = { day: false, night: false };
    const key = timeOfDay === 'day' ? 'day' : timeOfDay === 'night' ? 'night' : null;
    if (!key || quest.subProgress[key]) return;
    quest.subProgress[key] = true;
    quest.progress += 1;
    this.addXP(10, 'Energy Check-in (' + key + ')');
    this.state.karma += 1;
    this.emit('questProgress', quest);
    if (quest.progress >= quest.target) {
      quest.completed = true;
      this.addXP(10, 'Energy Check-in Bonus (Both Complete)');
      this.state.karma += 2;
      if (quest.inspirational) this.emit('inspirationalMessage', quest.inspirational);
      this.emit('questCompleted', quest);
      if (this.state.quests.daily.every(q => q.completed)) {
        this.addXP(50, 'Daily Quest Streak Bonus');
        this.state.karma += 5;
        if (!this._bulkMode) this.app?.showToast('🎉 Daily quests finished! +50 XP +5 Karma', 'success');
        this.emit('dailyQuestsComplete', null);
      }
    }
    this.saveState();
  }

  progressQuest(questType, questId, increment = 1) {
    const quest = this.state.quests[questType]?.find(q => q.id === questId);
    if (!quest || quest.completed) return;
    quest.progress = Math.min(quest.target, quest.progress + increment);
    if (quest.progress >= quest.target) {
      quest.completed = true;
      this.addXP(quest.xpReward || 50, `Quest: ${quest.name}`);
      if (quest.karmaReward) this.state.karma += quest.karmaReward;
      if (quest.badge) this.grantBadge(quest.badge);
      if (quest.inspirational) this.emit('inspirationalMessage', quest.inspirational);
      if (!this._bulkMode) this.emit('questCompleted', quest);
      if (questType === 'daily' && this.state.quests.daily.every(q => q.completed)) {
        this.addXP(50, 'Daily Quest Streak Bonus');
        this.state.karma += 5;
        if (!this._bulkMode) this.app?.showToast('🎉 Daily quests finished! +50 XP +5 Karma', 'success');
        if (!this._bulkMode) this.emit('dailyQuestsComplete', null);
      }
      this.checkQuestBadges();
    } else {
      this.emit('questProgress', quest);
    }
    this.saveState();
  }

  completeQuest(questType, questId) {
    const quest = this.state.quests[questType]?.find(q => q.id === questId);
    if (!quest) return;
    this.progressQuest(questType, questId, quest.target - quest.progress);
  }

  completeChakraQuest(questType, questId, chakraName, increment = 1) {
    this.progressQuest(questType, questId, increment);
  }

  resetDailyQuests() { this._resetQuests('daily'); }
  resetWeeklyQuests() { this._resetQuests('weekly'); }
  resetMonthlyQuests() { this._resetQuests('monthly'); }

  _resetQuests(type) {
    const allComplete = this.state.quests[type]?.every(q => q.completed);
    if (allComplete) {
      if (type === 'daily') {
        if (!this.state.dailyQuestCompletions) this.state.dailyQuestCompletions = 0;
        this.state.dailyQuestCompletions++;
        if (!this.state.dailyQuestStreak) this.state.dailyQuestStreak = 0;
        this.state.dailyQuestStreak++;
      } else if (type === 'weekly') {
        this.addXP(200, 'Weekly Quest Completion Bonus');
        this.state.karma += 20;
        this.app?.showToast('🎉 Weekly quests finished! +200 XP +20 Karma', 'success');
        if (!this.state.weeklyQuestCompletions) this.state.weeklyQuestCompletions = 0;
        this.state.weeklyQuestCompletions++;
        this.state.dailyQuestStreak = 0;
      } else if (type === 'monthly') {
        this.addXP(800, 'Monthly Quest Completion Bonus');
        this.state.karma += 80;
        this.app?.showToast('🎉 Monthly quests finished! +800 XP +80 Karma', 'success');
        if (!this.state.monthlyQuestCompletions) this.state.monthlyQuestCompletions = 0;
        this.state.monthlyQuestCompletions++;
      }
      this.checkQuestBadges();
    }
    this.state.quests[type]?.forEach(q => {
      q.progress = 0; q.completed = false;
      if (q.id === 'energy_checkin') q.subProgress = { day: false, night: false };
    });
    this.emit('questsReset', type);
    this.saveState();
  }

  /* ----------  BULK-COMPLETE HELPERS  ---------- */
  completeAllDaily()   { this._completeBatch('daily');   }
  completeAllWeekly()  { this._completeBatch('weekly');  }
  completeAllMonthly() { this._completeBatch('monthly'); }

  _completeBatch(type) {
    const quests = this.state.quests[type];
    if (!quests?.length) return;
    let done = 0, xp = 0, karma = 0;
    this._bulkMode = true;
    quests.forEach(q => {
      if (!q.completed) {
        this.completeQuest(type, q.id);
        done++;
        xp   += q.xpReward   || 50;
        karma += q.karmaReward || 0;
      }
    });
    this._bulkMode = false;
    if (done) {
      this.emit('bulkQuestsComplete', { type, done, xp, karma });
    }
  }

  /* ---------------------------------------------------------
     UNLOCKS
  --------------------------------------------------------- */
  unlockFeature(featureId) {
    if (this.state.unlockedFeatures.includes(featureId)) return;
    this.state.unlockedFeatures.push(featureId);
    this.emit('featureUnlocked', featureId);
    this.saveState();
  }

  /* ---------------------------------------------------------
     LOGGING & STATUS
  --------------------------------------------------------- */
  logAction(type, details = {}) {
    this.state.logs.push({ timestamp: new Date().toISOString(), type, details });
    this.saveState();
  }

  getStatusSummary() {
    return {
      xp: this.state.xp,
      level: this.state.level,
      pointsToNext: this.calculateLevel().pointsToNext,
      levelTitle: this.calculateLevel().title,
      karma: this.state.karma,
      streak: this.state.streak,
      badges: this.state.badges,
      unlockedFeatures: this.state.unlockedFeatures,
      quests: this.state.quests,
      logs: this.state.logs,
      totalWellnessRuns: this.state.totalWellnessRuns,
      totalTarotSpreads: this.state.totalTarotSpreads,
      totalJournalEntries: this.state.totalJournalEntries,
      totalHappinessViews: this.state.totalHappinessViews
    };
  }

  reset() {
    localStorage.removeItem('gamificationState');
    this.state = this.defaultState();
    this.emit('reset', null);
  }
}

export default GamificationEngine;