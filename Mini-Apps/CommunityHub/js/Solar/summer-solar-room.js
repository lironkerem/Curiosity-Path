/**
 * SUMMER-SOLAR-ROOM.JS (REFACTORED)
 * Summer Solar Practice Room - Lunar-Quality Architecture
 * Depends on: solar-constants.js, solar-config.js, solar-ui.js, solar-base-room.js
 */

const SummerSolarRoom = Object.create(BaseSolarRoom);

// ============================================================================
// CONFIGURATION
// ============================================================================

SummerSolarRoom.config = {
  name: 'summer',
  displayName: 'Summer',
  emoji: '☀️',
  seasonEmoji: '☀️',
  itemEmoji: '🌻',
  sessionTimes: 'midday and golden hour',
  startMonth: 5, // June (0-indexed)
  startDay: 21,
  endMonth: 7, // August (0-indexed)
  endDay: 20,
  floatingEmojis: ['☀️', '🌻', '🌺'],
  wisdom: 'As the summer sun shines at its brightest, we celebrate the fullness of life and embrace our radiant potential.',
  modeDescription: 'Individual practices for vitality, expansion, and celebration',
  collectiveFocus: 'celebrating collective vitality and abundance',
  collectiveNoun: 'expressions of joy'
};

// ============================================================================
// USER DATA STRUCTURE
// ============================================================================

SummerSolarRoom.userData = {
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

SummerSolarRoom.prebuiltAffirmations = [
  'I shine brightly with confidence and joy',
  'I embrace the fullness of life',
  'I am abundant and overflowing with energy',
  'I celebrate my vitality and strength',
  'I trust in the power of expansion',
  'I radiate warmth and positivity',
  'I am vibrant and alive',
  'I honor the peak of my potential',
  'I bask in the light of abundance',
  'I embody the energy of summer'
];

// ============================================================================
// PRACTICE DEFINITIONS (8 practices)
// ============================================================================

SummerSolarRoom.practices = {
  intentionRadiance: {
    id: 'intentionRadiance',
    title: 'Intention and Radiance',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
    description: 'Set intentions for expressing energy',
    color: 'var(--ring-silent)',
    hasSaveData: true
  },
  futureAlignment: {
    id: 'futureAlignment',
    title: 'Future Alignment Visualization',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24"/></svg>`,
    description: 'Integrate clarity for joyful expression',
    color: 'var(--ring-available)'
  },
  bodyActivation: {
    id: 'bodyActivation',
    title: 'Body Activation and Breath',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="3"/><path d="M12 11v10M8 15l4-4 4 4M8 21h8"/></svg>`,
    description: 'Energize and enliven presence',
    color: 'var(--ring-deep)'
  },
  energyAwareness: {
    id: 'energyAwareness',
    title: 'Energy and Awareness',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    description: 'Amplify energy for expansion',
    color: 'var(--ring-resonant)'
  },
  environmentalClearing: {
    id: 'environmentalClearing',
    title: 'Environmental Clearing',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`,
    description: 'Create space for abundance',
    color: 'var(--ring-silent)'
  },
  roleExpansion: {
    id: 'roleExpansion',
    title: 'Role Expansion Practice',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8m-4-4h8"/></svg>`,
    description: 'Express roles with creativity',
    color: 'var(--ring-available)'
  },
  paceAlignment: {
    id: 'paceAlignment',
    title: 'Pace Alignment Practice',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    description: 'Harmonize with vibrant energy',
    color: 'var(--ring-deep)'
  },
  relationshipSummerAudit: {
    id: 'relationshipSummerAudit',
    title: 'Relationship Summer Audit',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    description: 'Energize or celebrate connections',
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
SummerSolarRoom.getPracticeContent = function(practiceId) {
  const contentMap = {
    intentionRadiance: () => this.getIntentionRadianceContent(),
    futureAlignment: () => this.getFutureAlignmentContent(),
    bodyActivation: () => this.getBodyActivationContent(),
    energyAwareness: () => this.getEnergyAwarenessContent(),
    environmentalClearing: () => this.getEnvironmentalClearingContent(),
    roleExpansion: () => this.getRoleExpansionContent(),
    paceAlignment: () => this.getPaceAlignmentContent(),
    relationshipSummerAudit: () => this.getRelationshipSummerAuditContent()
  };

  const generator = contentMap[practiceId];
  if (generator) {
    return generator.call(this);
  }

  console.error(`No content generator for practice: ${practiceId}`);
  return '<p>Practice content not available.</p>';
};

// Practice 1: Intention Radiance (uses shared generator)
SummerSolarRoom.getIntentionRadianceContent = function() {
  return SolarConfig.generateIntentionPracticeContent(
    this.userData,
    this.prebuiltAffirmations,
    {
      purpose: 'Set intentions for full self-expression this season',
      intentionPrompt: 'What do you want to radiate this Summer season?',
      intentionPlaceholder: 'This Summer, I choose to focus on...',
      affirmationTitle: 'Choose Radiance Affirmation',
      listTitle: 'Celebration List',
      listPrompt: 'Write 3 ways you want to express your energy and joy:',
      readAloudText: 'Say your intention and celebrations out loud once.',
      closingLine: 'I honor my light and allow it to shine brightly this season.'
    }
  );
};

// Practice 2: Future Alignment (uses shared generator)
SummerSolarRoom.getFutureAlignmentContent = function() {
  return SolarConfig.generateFutureAlignmentContent({
    purpose: 'Integrate clarity and direction for joyful expression',
    visualizationPrompt: 'Visualize yourself at the height of Summer feeling vibrant, energized, and fully present.',
    feelingTitle: 'Feel Radiance',
    feelingPrompt: 'Do not visualize outcomes—simply feel the fullness of presence and joy.',
    closingLine: 'I move through this season in alignment with my true radiance.'
  });
};

// Practice 3: Body Activation (uses shared generator)
SummerSolarRoom.getBodyActivationContent = function() {
  return SolarConfig.generateBodyPracticeContent({
    purpose: 'Energize the body and enliven presence',
    steps: [
      'Stand or sit comfortably, feet hip-width apart, knees soft',
      'Inhale fully through the nose, exhale gently through the mouth',
      'Repeat 5 times'
    ],
    subtleMovement: 'Optionally, stretch arms outward or sway gently to open the body.',
    closingLine: 'My body is vibrant, energized, and ready to express joy.'
  });
};

// Practice 4: Energy Awareness (uses shared generator)
SummerSolarRoom.getEnergyAwarenessContent = function() {
  return SolarConfig.generateEnergyAwarenessContent({
    purpose: 'Amplify and circulate energy for expansion',
    energySteps: [
      'Place hands on heart and crown',
      'Imagine energy radiating outward from the heart and upward from the crown'
    ],
    energyQuality: 'Expansion',
    energyGuideline: 'Summer energy is about full expression, openness, and circulation.',
    closingLine: 'I let my energy flow freely, fully embracing this season.'
  });
};

// Practice 5: Environmental Clearing (uses shared generator)
SummerSolarRoom.getEnvironmentalClearingContent = function() {
  return SolarConfig.generateEnvironmentalClearingContent({
    purpose: 'Create space for abundance and creative energy',
    removePrompt: 'Take 3 things that no longer serve you and remove or delete them. Make room for joy and inspiration.',
    closingLine: 'I create space for abundance and new possibilities.'
  });
};

// Practice 6: Role Expansion (uses shared generator)
SummerSolarRoom.getRoleExpansionContent = function() {
  return SolarConfig.generateRolePracticeContent({
    purpose: 'Consciously express roles that reflect energy and creativity',
    roleExamples: ['Creator', 'Leader', 'Supporter', 'Explorer', 'Teacher', 'Artist'],
    actionTitle: 'Amplify One Role',
    actionPrompt: 'Choose one role to step into fully this season, expressing energy and joy.',
    closingLine: 'I step into my roles with confidence and radiance this season.'
  });
};

// Practice 7: Pace Alignment (uses shared generator)
SummerSolarRoom.getPaceAlignmentContent = function() {
  return SolarConfig.generatePacePracticeContent({
    purpose: "Harmonize your tempo with Summer's vibrant energy",
    paceOptions: ['Slower than desired', 'Appropriate', 'Already energized'],
    adjustmentPrompt: 'Select one action to increase flow and presence:',
    adjustmentExamples: [
      'Start the day energetically',
      'Add movement',
      'Fully engage in an activity'
    ],
    closingLine: "I allow my pace to align with the energy of this season."
  });
};

// Practice 8: Relationship Audit (uses shared generator)
SummerSolarRoom.getRelationshipSummerAuditContent = function() {
  return SolarConfig.generateRelationshipAuditContent({
    purpose: 'Identify relationships to energize or celebrate',
    identifyPrompt: 'List 2–3 key people in your life: one that feels inspiring and alive, one that feels neutral or stagnant.',
    actionExamples: [
      'Engage fully',
      'Express appreciation',
      'Energize connection',
      'Set playful boundaries'
    ],
    integrationPrompt: 'Notice how your energy shifts as you consider these relationships. Observe the expansion or contraction of joy.',
    closingLine: 'I nurture my connections with vibrancy and clarity.'
  });
};

// ============================================================================
// INITIALIZATION
// ============================================================================

window.SummerSolarRoom = SummerSolarRoom;
SummerSolarRoom.init();

console.log('☀️ Summer Solar Room loaded (refactored with Lunar architecture)');
