/**
 * SPRING-SOLAR-ROOM.JS (REFACTORED)
 * Spring Solar Practice Room - Lunar-Quality Architecture
 * Depends on: solar-constants.js, solar-config.js, solar-ui.js, solar-base-room.js
 */

const SpringSolarRoom = Object.create(BaseSolarRoom);

// ============================================================================
// CONFIGURATION
// ============================================================================

SpringSolarRoom.config = {
  name: 'spring',
  displayName: 'Spring',
  emoji: '🌸',
  seasonEmoji: '🌸',
  itemEmoji: '🌱',
  sessionTimes: 'sunrise and sunset',
  startMonth: 2, // March (0-indexed)
  startDay: 20,
  endMonth: 5, // June (0-indexed)
  endDay: 20,
  floatingEmojis: ['🌸', '🌱', '🌿'],
  wisdom: 'As the spring sun awakens the earth, we plant our intentions and embrace the season of growth and renewal.',
  modeDescription: 'Individual practices for renewal, growth, and planting intentions',
  collectiveFocus: 'planting collective intentions for growth',
  collectiveNoun: 'seeds of intention'
};

// ============================================================================
// USER DATA STRUCTURE
// ============================================================================

SpringSolarRoom.userData = {
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

SpringSolarRoom.prebuiltAffirmations = [
  'I welcome new beginnings with open arms',
  'I am ready to grow and expand',
  'I plant seeds of intention for my future',
  'I embrace the fresh energy of spring',
  'I trust in the cycle of renewal',
  'I awaken to new possibilities',
  'I am vibrant and full of life',
  'I celebrate growth in all its forms',
  'I honor my journey of transformation',
  'I bloom with grace and vitality'
];

// ============================================================================
// PRACTICE DEFINITIONS (8 practices)
// ============================================================================

SpringSolarRoom.practices = {
  intentionPlanting: {
    id: 'intentionPlanting',
    title: 'Intention and Planting',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
    description: 'Set clear priorities for growth',
    color: 'var(--ring-silent)',
    hasSaveData: true
  },
  futureAlignment: {
    id: 'futureAlignment',
    title: 'Future Alignment Visualization',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24"/></svg>`,
    description: 'Integrate vision and direction',
    color: 'var(--ring-available)'
  },
  bodyAwakening: {
    id: 'bodyAwakening',
    title: 'Body Awakening and Breath',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="3"/><path d="M12 11v10M8 15l4-4 4 4M8 21h8"/></svg>`,
    description: 'Energize and activate the body',
    color: 'var(--ring-deep)'
  },
  energyAwareness: {
    id: 'energyAwareness',
    title: 'Energy and Awareness',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    description: 'Activate energy for growth',
    color: 'var(--ring-resonant)'
  },
  environmentalClearing: {
    id: 'environmentalClearing',
    title: 'Environmental Clearing',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`,
    description: 'Create space for fresh energy',
    color: 'var(--ring-silent)'
  },
  roleExpansion: {
    id: 'roleExpansion',
    title: 'Role Expansion Practice',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8m-4-4h8"/></svg>`,
    description: 'Embrace roles that support growth',
    color: 'var(--ring-available)'
  },
  paceActivation: {
    id: 'paceActivation',
    title: 'Pace Activation Practice',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    description: 'Align with forward momentum',
    color: 'var(--ring-deep)'
  },
  relationshipSpringAudit: {
    id: 'relationshipSpringAudit',
    title: 'Relationship Spring Audit',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    description: 'Energize or refresh connections',
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
SpringSolarRoom.getPracticeContent = function(practiceId) {
  const contentMap = {
    intentionPlanting: () => this.getIntentionPlantingContent(),
    futureAlignment: () => this.getFutureAlignmentContent(),
    bodyAwakening: () => this.getBodyAwakeningContent(),
    energyAwareness: () => this.getEnergyAwarenessContent(),
    environmentalClearing: () => this.getEnvironmentalClearingContent(),
    roleExpansion: () => this.getRoleExpansionContent(),
    paceActivation: () => this.getPaceActivationContent(),
    relationshipSpringAudit: () => this.getRelationshipSpringAuditContent()
  };

  const generator = contentMap[practiceId];
  if (generator) {
    return generator.call(this);
  }

  console.error(`No content generator for practice: ${practiceId}`);
  return '<p>Practice content not available.</p>';
};

// Practice 1: Intention Planting (uses shared generator)
SpringSolarRoom.getIntentionPlantingContent = function() {
  return SolarConfig.generateIntentionPracticeContent(
    this.userData,
    this.prebuiltAffirmations,
    {
      purpose: 'Plant clear intentions for growth this season',
      intentionPrompt: 'What do you want to cultivate this Spring season?',
      intentionPlaceholder: 'This Spring, I choose to focus on...',
      affirmationTitle: 'Choose Growth Affirmation',
      listTitle: 'Seeds to Plant',
      listPrompt: 'Write 3 new projects, habits, or intentions you want to begin:',
      readAloudText: 'Say your intention and seeds out loud once.',
      closingLine: 'I honor what I plant this season and nurture it with care.'
    }
  );
};

// Practice 2: Future Alignment (uses shared generator)
SpringSolarRoom.getFutureAlignmentContent = function() {
  return SolarConfig.generateFutureAlignmentContent({
    purpose: 'Integrate vision and direction for the season',
    visualizationPrompt: 'Visualize yourself at the end of Spring feeling aligned, energized, and inspired.',
    feelingTitle: 'Feel Expansion',
    feelingPrompt: 'Do not visualize outcomes—simply feel the state of readiness and growth.',
    closingLine: 'I move through this season aligned with my true potential.'
  });
};

// Practice 3: Body Awakening (uses shared generator)
SpringSolarRoom.getBodyAwakeningContent = function() {
  return SolarConfig.generateBodyPracticeContent({
    purpose: 'Energize and activate the body for new beginnings',
    steps: [
      'Stand or sit comfortably, feet hip-width apart, knees soft',
      'Inhale slowly through the nose, exhale gently through the mouth',
      'Repeat 5 times'
    ],
    subtleMovement: 'Optionally, stretch arms overhead or roll shoulders to awaken energy.',
    closingLine: 'My body is energized and ready to grow this season.'
  });
};

// Practice 4: Energy Awareness (uses shared generator)
SpringSolarRoom.getEnergyAwarenessContent = function() {
  return SolarConfig.generateEnergyAwarenessContent({
    purpose: 'Activate and direct internal energy for growth',
    energySteps: [
      'Place hands on solar plexus',
      'Imagine energy radiating upward and outward, like new shoots emerging'
    ],
    energyQuality: 'Expansion',
    energyGuideline: 'Spring energy is about activation and outward growth.',
    closingLine: 'I open my energy to growth and new possibilities.'
  });
};

// Practice 5: Environmental Clearing (uses shared generator)
SpringSolarRoom.getEnvironmentalClearingContent = function() {
  return SolarConfig.generateEnvironmentalClearingContent({
    purpose: 'Create space for fresh energy and opportunities',
    removePrompt: 'Take 3 things that no longer serve you and remove or delete them. Make room for new energy.',
    closingLine: 'I create space for fresh growth and inspiration.'
  });
};

// Practice 6: Role Expansion (uses shared generator)
SpringSolarRoom.getRoleExpansionContent = function() {
  return SolarConfig.generateRolePracticeContent({
    purpose: 'Consciously embrace roles that support growth',
    roleExamples: ['Learner', 'Creator', 'Leader', 'Supporter', 'Explorer', 'Innovator'],
    actionTitle: 'Expand One Role',
    actionPrompt: 'Choose one role to consciously step into more fully this season.',
    closingLine: 'I step into my roles with openness and energy this season.'
  });
};

// Practice 7: Pace Activation (uses shared generator)
SpringSolarRoom.getPaceActivationContent = function() {
  return SolarConfig.generatePacePracticeContent({
    purpose: "Align personal tempo with the season's forward momentum",
    paceOptions: ['Slower than optimal', 'Appropriate', 'Already active'],
    adjustmentPrompt: 'Select one action to increase forward momentum:',
    adjustmentExamples: [
      'Start the day with energy',
      'Add a new activity',
      'Step into action sooner'
    ],
    closingLine: "I allow my pace to rise with the season's energy."
  });
};

// Practice 8: Relationship Audit (uses shared generator)
SpringSolarRoom.getRelationshipSpringAuditContent = function() {
  return SolarConfig.generateRelationshipAuditContent({
    purpose: 'Identify relationships to energize or refresh',
    identifyPrompt: 'List 2–3 key people in your life: one that feels alive and inspiring, one that feels stagnant or uninspiring.',
    actionExamples: [
      'Engage actively',
      'Show appreciation',
      'Energize connection',
      'Set fresh boundaries'
    ],
    integrationPrompt: 'Notice your energy as you consider these relationships. Observe how your choices create room for renewal.',
    closingLine: 'I nurture my connections with openness and clarity.'
  });
};

// ============================================================================
// INITIALIZATION
// ============================================================================

window.SpringSolarRoom = SpringSolarRoom;
SpringSolarRoom.init();

console.log('🌸 Spring Solar Room loaded (refactored with Lunar architecture)');
