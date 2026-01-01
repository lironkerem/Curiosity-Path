// =========================================================
//  GamificationEngine.js - COMPLETE WITH 40 BADGE SYSTEM
// =========================================================
export class GamificationEngine {
  constructor(app) {
    this.app = app;
    this.listeners = {};
    this.state = this.loadState() || this.defaultState();
    
    // Migrate existing badges and check all badges
    this.migrateBadgeIcons();
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
      achievements: [],
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
      return boosts.some(b => b.id === 'xp_boost' && b.expiresAt > now);
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
      this.grantAchievement({
        id: `level_${level}`,
        name: `Reached Level ${level}: ${title}`,
        xp: 50,
        inspirational: `You are evolving into ${title}!`
      });
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
     ACHIEVEMENTS
  --------------------------------------------------------- */
  grantAchievement(ach) {
    if (this.state.achievements.find(a => a.id === ach.id)) return;
    this.state.achievements.push({ ...ach, unlocked: true, date: new Date().toISOString() });
    this.emit('achievementUnlocked', ach);
    if (ach.xp) this.addXP(ach.xp, 'achievement');
    if (ach.inspirational) this.emit('inspirationalMessage', ach.inspirational);
    this.saveState();
  }

  /* ---------------------------------------------------------
     BADGES - 40 BADGE SYSTEM
  --------------------------------------------------------- */
  getBadgeDefinitions() {
    return {
      // Milestones - Gratitude
      gratitude_warrior: { name: 'Gratitude Warrior', icon: '❤️', description: 'Complete 30 gratitude entries' },
      gratitude_legend: { name: 'Gratitude Legend', icon: '💝', description: 'Complete 100 gratitude entries' },
      
      // Milestones - Journal
      journal_keeper: { name: 'Journal Keeper', icon: '📔', description: 'Write 20 journal entries' },
      journal_master: { name: 'Journal Master', icon: '📚', description: 'Write 75 journal entries' },
      
      // Milestones - Energy
      energy_tracker: { name: 'Energy Tracker', icon: '⚡', description: 'Log 30 energy check-ins' },
      energy_sage: { name: 'Energy Sage', icon: '🔋', description: 'Log 100 energy check-ins' },
      
      // Milestones - Tarot
      tarot_mystic: { name: 'Tarot Mystic', icon: '🔮', description: 'Complete 25 tarot spreads' },
      tarot_oracle: { name: 'Tarot Oracle', icon: '🌙', description: 'Complete 75 tarot spreads' },
      
      // Milestones - Meditation
      meditation_devotee: { name: 'Meditation Devotee', icon: '🧘', description: 'Complete 20 meditation sessions' },
      meditation_master: { name: 'Meditation Master', icon: '🕉️', description: 'Complete 60 meditation sessions' },
      
      // Milestones - Happiness
      happiness_seeker: { name: 'Happiness Seeker', icon: '😊', description: 'View 50 happiness boosters' },
      joy_master: { name: 'Joy Master', icon: '🎉', description: 'View 150 happiness boosters' },
      
      // Milestones - Wellness
      wellness_champion: { name: 'Wellness Champion', icon: '🌿', description: 'Complete 50 wellness exercises' },
      wellness_guru: { name: 'Wellness Guru', icon: '🌳', description: 'Complete 150 wellness exercises' },
      
      // Quest-Based
      weekly_warrior: { name: 'Weekly Warrior', icon: '🔥', description: 'Complete all weekly quests 4 times' },
      monthly_master: { name: 'Monthly Master', icon: '🌟', description: 'Complete all monthly quests once' },
      quest_crusher: { name: 'Quest Crusher', icon: '🎯', description: 'Complete 100 total quests' },
      daily_champion: { name: 'Daily Champion', icon: '⭐', description: 'Complete all daily quests 30 times' },
      
      // Streak
      perfect_week: { name: 'Perfect Week', icon: '⭐', description: 'Complete all daily quests 7 days in a row' },
      dedication_streak: { name: 'Dedication', icon: '💎', description: 'Maintain a 30-day streak' },
      unstoppable: { name: 'Unstoppable', icon: '🔱', description: 'Maintain a 60-day streak' },
      legendary_streak: { name: 'Legendary Streak', icon: '👑', description: 'Maintain a 100-day streak' },
      
      // Level
      level_5_hero: { name: 'Rising Star', icon: '🎯', description: 'Reach Level 5' },
      level_7_hero: { name: 'Enlightened Soul', icon: '🌟', description: 'Reach Level 7' },
      level_10_hero: { name: 'Enlightened Master', icon: '👑', description: 'Reach Level 10' },
      
      // Currency
      karma_collector: { name: 'Karma Collector', icon: '💰', description: 'Accumulate 500 Karma' },
      karma_lord: { name: 'Karma Lord', icon: '💎', description: 'Accumulate 2000 Karma' },
      xp_milestone: { name: 'XP Legend', icon: '⚡', description: 'Earn 10,000 XP' },
      xp_titan: { name: 'XP Titan', icon: '⚡', description: 'Earn 50,000 XP' },
      
      // Special
      chakra_balancer: { name: 'Chakra Balancer', icon: '🌈', description: 'Log all 7 chakras at 8+ in one session' },
      chakra_master: { name: 'Chakra Master', icon: '🎨', description: 'Log all 7 chakras at 9+ in one session' },
      
      // Time-Based
      early_bird: { name: 'Early Bird', icon: '🌅', description: 'Complete 10 morning energy check-ins' },
      night_owl: { name: 'Night Owl', icon: '🌙', description: 'Complete 10 evening energy check-ins' },
      dawn_master: { name: 'Dawn Master', icon: '☀️', description: 'Complete 30 morning energy check-ins' },
      midnight_sage: { name: 'Midnight Sage', icon: '🌌', description: 'Complete 30 evening energy check-ins' },
      
      // Cross-Feature
      triple_threat: { name: 'Triple Threat', icon: '🎪', description: 'Use 3 different features in one day' },
      super_day: { name: 'Super Day', icon: '💫', description: 'Complete gratitude, journal, energy, meditation in one day' },
      complete_explorer: { name: 'Complete Explorer', icon: '🗺️', description: 'Use all 7 main features at least once' },
      renaissance_soul: { name: 'Renaissance Soul', icon: '🎭', description: 'Complete 10+ actions in 5+ different features' },
      
      // Beginner
      first_step: { name: 'First Step', icon: '🌱', description: 'Complete your first action' }
    };
  }

  grantBadge(badge) {
    if (this.state.badges.find(b => b.id === badge.id)) return;
    
    if (!badge.icon) {
      const defs = this.getBadgeDefinitions();
      badge.icon = defs[badge.id]?.icon || '🎖️';
    }
    
    this.state.badges.push({ 
      ...badge, 
      unlocked: true, 
      date: new Date().toISOString() 
    });
    
    this.emit('badgeUnlocked', badge);
    this.saveState();
  }

  checkAndGrantBadge(badgeId, badgeDefinitions) {
    if (this.state.badges.find(b => b.id === badgeId)) return;
    
    const def = badgeDefinitions[badgeId];
    this.grantBadge({
      id: badgeId,
      name: def.name,
      icon: def.icon,
      description: def.description
    });
  }

  checkAllBadges() {
    if (!this.app.state?.data) return;
    
    const data = this.app.state.data;
    const badges = this.getBadgeDefinitions();
    
    // Get counts
    const gratitudeCount = (data.gratitudeEntries || []).length;
    const journalCount = (data.journalEntries || []).length;
    const energyCount = (data.energyEntries || []).length;
    const tarotCount = this.state.totalTarotSpreads || 0;
    const meditationCount = (data.meditationHistory || []).length;
    const happinessCount = this.state.totalHappinessViews || 0;
    const wellnessCount = this.state.totalWellnessRuns || 0;
    
    // Milestone badges
    if (gratitudeCount >= 30) this.checkAndGrantBadge('gratitude_warrior', badges);
    if (gratitudeCount >= 100) this.checkAndGrantBadge('gratitude_legend', badges);
    
    if (journalCount >= 20) this.checkAndGrantBadge('journal_keeper', badges);
    if (journalCount >= 75) this.checkAndGrantBadge('journal_master', badges);
    
    if (energyCount >= 30) this.checkAndGrantBadge('energy_tracker', badges);
    if (energyCount >= 100) this.checkAndGrantBadge('energy_sage', badges);
    
    if (tarotCount >= 25) this.checkAndGrantBadge('tarot_mystic', badges);
    if (tarotCount >= 75) this.checkAndGrantBadge('tarot_oracle', badges);
    
    if (meditationCount >= 20) this.checkAndGrantBadge('meditation_devotee', badges);
    if (meditationCount >= 60) this.checkAndGrantBadge('meditation_master', badges);
    
    if (happinessCount >= 50) this.checkAndGrantBadge('happiness_seeker', badges);
    if (happinessCount >= 150) this.checkAndGrantBadge('joy_master', badges);
    
    if (wellnessCount >= 50) this.checkAndGrantBadge('wellness_champion', badges);
    if (wellnessCount >= 150) this.checkAndGrantBadge('wellness_guru', badges);
    
    // Streak badges
    const streak = this.state.streak?.current || 0;
    if (streak >= 30) this.checkAndGrantBadge('dedication_streak', badges);
    if (streak >= 60) this.checkAndGrantBadge('unstoppable', badges);
    if (streak >= 100) this.checkAndGrantBadge('legendary_streak', badges);
    
    // Level badges
    const level = this.calculateLevel().level;
    if (level >= 5) this.checkAndGrantBadge('level_5_hero', badges);
    if (level >= 7) this.checkAndGrantBadge('level_7_hero', badges);
    if (level >= 10) this.checkAndGrantBadge('level_10_hero', badges);
    
    // Currency badges
    if (this.state.karma >= 500) this.checkAndGrantBadge('karma_collector', badges);
    if (this.state.karma >= 2000) this.checkAndGrantBadge('karma_lord', badges);
    if (this.state.xp >= 10000) this.checkAndGrantBadge('xp_milestone', badges);
    if (this.state.xp >= 50000) this.checkAndGrantBadge('xp_titan', badges);
    
    // Time-based badges
    const morningCheckins = (data.energyEntries || []).filter(e => e.timeOfDay === 'day').length;
    const nightCheckins = (data.energyEntries || []).filter(e => e.timeOfDay === 'night').length;
    
    if (morningCheckins >= 10) this.checkAndGrantBadge('early_bird', badges);
    if (morningCheckins >= 30) this.checkAndGrantBadge('dawn_master', badges);
    if (nightCheckins >= 10) this.checkAndGrantBadge('night_owl', badges);
    if (nightCheckins >= 30) this.checkAndGrantBadge('midnight_sage', badges);
    
    // Cross-feature badges
    this.checkCrossFeatureBadges(badges);
    
    // First step badge
    const totalActions = gratitudeCount + journalCount + energyCount + tarotCount + meditationCount;
    if (totalActions >= 1) this.checkAndGrantBadge('first_step', badges);
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
    
    if (todayGratitude && todayJournal && todayEnergy && todayMeditation) {
      this.checkAndGrantBadge('super_day', badges);
    }
    
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
    if (featuresWithTenPlus >= 5) {
      this.checkAndGrantBadge('renaissance_soul', badges);
    }
  }

  checkQuestBadges() {
    const badges = this.getBadgeDefinitions();
    
    if (this.state.weeklyQuestCompletions >= 4) {
      this.checkAndGrantBadge('weekly_warrior', badges);
    }
    
    if (this.state.monthlyQuestCompletions >= 1) {
      this.checkAndGrantBadge('monthly_master', badges);
    }
    
    if (this.state.totalQuestCompletions >= 100) {
      this.checkAndGrantBadge('quest_crusher', badges);
    }
    
    if (this.state.dailyQuestCompletions >= 30) {
      this.checkAndGrantBadge('daily_champion', badges);
    }
    
    if (this.state.dailyQuestStreak >= 7) {
      this.checkAndGrantBadge('perfect_week', badges);
    }
  }

  checkChakraBadges(chakras) {
    const badges = this.getBadgeDefinitions();
    const chakraKeys = ['root', 'sacral', 'solar', 'heart', 'throat', 'thirdEye', 'crown'];
    
    const all8Plus = chakraKeys.every(key => (chakras[key] || 0) >= 8);
    if (all8Plus) {
      this.checkAndGrantBadge('chakra_balancer', badges);
    }
    
    const all9Plus = chakraKeys.every(key => (chakras[key] || 0) >= 9);
    if (all9Plus) {
      this.checkAndGrantBadge('chakra_master', badges);
    }
  }

  migrateBadgeIcons() {
    const defs = this.getBadgeDefinitions();
    let updated = false;
    
    this.state.badges.forEach(badge => {
      if (!badge.icon && defs[badge.id]) {
        badge.icon = defs[badge.id].icon;
        badge.name = defs[badge.id].name;
        badge.description = defs[badge.id].description;
        updated = true;
      }
    });
    
    if (updated) {
      this.saveState();
      console.log('✅ Migrated existing badges with icons and descriptions');
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
      this.emit('questCompleted', quest);
      if (questType === 'daily' && this.state.quests.daily.every(q => q.completed)) {
        this.addXP(50, 'Daily Quest Streak Bonus');
        this.emit('dailyQuestsComplete', null);
      }
      
      if (!this.state.totalQuestCompletions) this.state.totalQuestCompletions = 0;
      this.state.totalQuestCompletions++;
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
        if (!this.state.weeklyQuestCompletions) this.state.weeklyQuestCompletions = 0;
        this.state.weeklyQuestCompletions++;
        this.state.dailyQuestStreak = 0;
      } else if (type === 'monthly') {
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
      achievements: this.state.achievements,
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