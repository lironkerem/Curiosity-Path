/**
 * AUTUMN-SOLAR-ROOM.JS (REFACTORED)
 * Autumn Solar Practice Room - Lunar-Quality Architecture
 * Depends on: solar-constants.js, solar-config.js, solar-ui.js, solar-base-room.js
 */

const AutumnSolarRoom = Object.create(BaseSolarRoom);

// ============================================================================
// CONFIGURATION
// ============================================================================

AutumnSolarRoom.config = {
  name: 'autumn',
  displayName: 'Autumn',
  emoji: '🍂',
  seasonEmoji: '🍂',
  itemEmoji: '🍁',
  sessionTimes: 'sunrise and sunset',
  startMonth: 8, // September (0-indexed)
  startDay: 21,
  endMonth: 10, // November (0-indexed)
  endDay: 20,
  floatingEmojis: ['🍂', '🍁', '🌾'],
  wisdom: 'As the autumn sun sets earlier each day, we gather our harvest and give thanks for the abundance we have received.',
  modeDescription: 'Individual practices for gratitude, harvest, and preparation',
  collectiveFocus: 'sharing collective gratitude and harvest',
  collectiveNoun: 'harvests of gratitude'
};

// ============================================================================
// USER DATA STRUCTURE
// ============================================================================

AutumnSolarRoom.userData = {
  intention: '',
  affirmation: '',
  releaseList: '',
  practiceCount: 0,
  closureReflection: '',
  completedDate: null,
  privateIntention: '',
  collectiveWord: '',
  intentionShared: false
};

// ============================================================================
// PREBUILT AFFIRMATIONS
// ============================================================================

AutumnSolarRoom.prebuiltAffirmations = [
  'I celebrate the harvest of my efforts',
  'I am grateful for the abundance in my life',
  'I honor the cycle of growth and rest',
  'I release what no longer serves me with grace',
  'I trust the wisdom of seasonal change',
  'I gather strength for the quieter months ahead',
  'I embrace transformation and letting go',
  'I am rooted in gratitude and presence',
  'I honor my growth and prepare for renewal',
  'I welcome the wisdom of autumn'
];

// ============================================================================
// PRACTICE DEFINITIONS (8 practices)
// ============================================================================

AutumnSolarRoom.practices = {
  intentionHarvest: {
    id: 'intentionHarvest',
    title: 'Intention and Harvest',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
    description: 'Consolidate seasonal priorities',
    color: 'var(--ring-silent)',
    hasSaveData: true
  },
  futureAlignment: {
    id: 'futureAlignment',
    title: 'Future Alignment Visualization',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24"/></svg>`,
    description: 'Integrate clarity and direction',
    color: 'var(--ring-available)'
  },
  bodyGrounding: {
    id: 'bodyGrounding',
    title: 'Body Grounding and Breath',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="3"/><path d="M12 11v10M8 15l4-4 4 4M8 21h8"/></svg>`,
    description: 'Signal safety and stability',
    color: 'var(--ring-deep)'
  },
  energyAwareness: {
    id: 'energyAwareness',
    title: 'Energy and Awareness',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    description: 'Consolidate and protect energy',
    color: 'var(--ring-resonant)'
  },
  environmentalClearing: {
    id: 'environmentalClearing',
    title: 'Environmental Clearing',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`,
    description: 'Create external order',
    color: 'var(--ring-silent)'
  },
  roleShedding: {
    id: 'roleShedding',
    title: 'Role Shedding Practice',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>`,
    description: 'Consciously prune roles',
    color: 'var(--ring-available)'
  },
  paceRecalibration: {
    id: 'paceRecalibration',
    title: 'Pace Recalibration',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    description: 'Align tempo with seasonal slowing',
    color: 'var(--ring-deep)'
  },
  relationshipAudit: {
    id: 'relationshipAudit',
    title: 'Seasonal Relationship Audit',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    description: 'Prune or nurture connections',
    color: 'var(--ring-resonant)'
  }
};

// ============================================================================
// PRACTICE CONTENT GENERATORS (Using SolarConfig - DRY approach)
// ============================================================================

/**
 * Get practice content using shared generators
 * Routes to SolarConfig methods instead of inline HTML
 */
AutumnSolarRoom.getPracticeContent = function(practiceId) {
  const contentMap = {
    intentionHarvest: () => this.getIntentionHarvestContent(),
    futureAlignment: () => this.getFutureAlignmentContent(),
    bodyGrounding: () => this.getBodyGroundingContent(),
    energyAwareness: () => this.getEnergyAwarenessContent(),
    environmentalClearing: () => this.getEnvironmentalClearingContent(),
    roleShedding: () => this.getRoleSheddingContent(),
    paceRecalibration: () => this.getPaceRecalibrationContent(),
    relationshipAudit: () => this.getRelationshipAuditContent()
  };

  const generator = contentMap[practiceId];
  if (generator) {
    return generator.call(this);
  }

  console.error(`No content generator for practice: ${practiceId}`);
  return '<p>Practice content not available.</p>';
};

// Practice 1: Intention Harvest (uses shared generator)
AutumnSolarRoom.getIntentionHarvestContent = function() {
  return SolarConfig.generateIntentionPracticeContent(
    this.userData,
    this.prebuiltAffirmations,
    {
      purpose: 'Consolidate seasonal priorities and harvest learnings',
      intentionPrompt: 'What do you want to focus on this Autumn season?',
      intentionPlaceholder: 'This Autumn, I choose to focus on...',
      affirmationTitle: 'Choose Gratitude Affirmation',
      listTitle: 'Harvest List',
      listPrompt: 'Write 3 achievements, learnings, or resources you want to carry forward:',
      readAloudText: 'Say your intention and harvest list out loud once.',
      closingLine: 'I honor what I have gathered and carry it with care.'
    }
  );
};

// Practice 2: Future Alignment (uses shared generator)
AutumnSolarRoom.getFutureAlignmentContent = function() {
  return SolarConfig.generateFutureAlignmentContent({
    purpose: 'Integrate clarity and direction for the season',
    visualizationPrompt: 'Visualize yourself at the end of Autumn feeling aligned, grounded, and at ease.',
    feelingTitle: 'Feel Alignment',
    feelingPrompt: 'Do not visualize outcomes—simply feel the state of integration.',
    closingLine: 'I move through this season in harmony with my true path.'
  });
};

// Practice 3: Body Grounding (uses shared generator)
AutumnSolarRoom.getBodyGroundingContent = function() {
  return SolarConfig.generateBodyPracticeContent({
    purpose: 'Signal safety and stability before seasonal change',
    steps: [
      'Stand or sit comfortably, feet hip-width apart, knees soft',
      'Inhale slowly through the nose, exhale gently through the mouth',
      'Repeat 5 times'
    ],
    subtleMovement: 'Optionally, gently roll shoulders or stretch arms to release tension.',
    closingLine: 'My body is grounded and ready to receive this season.'
  });
};

// Practice 4: Energy Awareness (uses shared generator)
AutumnSolarRoom.getEnergyAwarenessContent = function() {
  return SolarConfig.generateEnergyAwarenessContent({
    purpose: 'Consolidate internal energy and protect what is harvested',
    energySteps: [
      'Place hands on lower belly',
      'Imagine energy collecting inward rather than radiating outward'
    ],
    energyQuality: 'Containment',
    energyGuideline: 'Autumn energy is about holding and integrating, not expanding.',
    closingLine: 'I contain my energy with care, honoring what I have gathered.'
  });
};

// Practice 5: Environmental Clearing (uses shared generator)
AutumnSolarRoom.getEnvironmentalClearingContent = function() {
  return SolarConfig.generateEnvironmentalClearingContent({
    purpose: 'Create external order to support internal consolidation',
    removePrompt: 'Take 3 things that no longer serve you and remove or delete them. Do not reorganize—only subtraction.',
    closingLine: 'I create space by letting go.'
  });
};

// Practice 6: Role Shedding (uses shared generator)
AutumnSolarRoom.getRoleSheddingContent = function() {
  return SolarConfig.generateRolePracticeContent({
    purpose: 'Consciously prune seasonal roles',
    roleExamples: ['Parent', 'Leader', 'Fixer', 'Supporter', 'Creator', 'Learner'],
    actionTitle: 'Soften One Role',
    actionPrompt: 'Choose one role to consciously step back from or soften this season.',
    closingLine: 'I allow my roles to rest and breathe this season.'
  });
};

// Practice 7: Pace Recalibration (uses shared generator)
AutumnSolarRoom.getPaceRecalibrationContent = function() {
  return SolarConfig.generatePacePracticeContent({
    purpose: 'Align personal tempo with seasonal slowing',
    paceOptions: ['Faster than sustainable', 'Appropriate', 'Already slowed'],
    adjustmentPrompt: 'Select one action to recalibrate your pace today:',
    adjustmentExamples: [
      'Start the day slower',
      'Reduce transitions',
      'Leave earlier',
      'Do fewer things per day'
    ],
    closingLine: 'I allow my pace to change with the season.'
  });
};

// Practice 8: Relationship Audit (uses shared generator)
AutumnSolarRoom.getRelationshipAuditContent = function() {
  return SolarConfig.generateRelationshipAuditContent({
    purpose: 'Identify relationships to prune or nurture',
    identifyPrompt: 'List 2–3 key people in your life: one that feels alive, inspiring, or supportive, and one that feels heavy, draining, or unresolved.',
    actionExamples: [
      'Show gratitude',
      'Limit interaction',
      'Step back',
      'Simply observe'
    ],
    integrationPrompt: 'Notice your energy and tension as you consider these relationships. Observe how your choices affect internal space.',
    closingLine: 'I tend my connections with care and clarity.'
  });
};

// ============================================================================
// INITIALIZATION
// ============================================================================

window.AutumnSolarRoom = AutumnSolarRoom;
AutumnSolarRoom.init();

console.log('🍂 Autumn Solar Room loaded (refactored with Lunar architecture)');
