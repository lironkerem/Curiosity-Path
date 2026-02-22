/**
 * WINTER-SOLAR-ROOM.JS (REFACTORED)
 * Winter Solar Practice Room - Lunar-Quality Architecture
 * Depends on: solar-constants.js, solar-config.js, solar-ui.js, solar-base-room.js
 */

const WinterSolarRoom = Object.create(BaseSolarRoom);

// ============================================================================
// CONFIGURATION
// ============================================================================

WinterSolarRoom.config = {
  name: 'winter',
  displayName: 'Winter',
  emoji: '❄️',
  seasonEmoji: '❄️',
  itemEmoji: '⛄',
  sessionTimes: 'twilight hours',
  startMonth: 11, // December (0-indexed)
  startDay: 21,
  endMonth: 1, // February (0-indexed)
  endDay: 19,
  floatingEmojis: ['❄️', '⛄', '🌨️'],
  wisdom: 'In the quiet stillness of winter, we rest deeply and listen to the wisdom that emerges from silence.',
  closure: {
    title: 'Winter Completion',
    intro: 'As the winter season draws to a close, take a moment to honor the stillness and wisdom you have gathered in the quiet.',
    placeholder: 'What did you discover in the silence? What wisdom emerged from this period of rest? What are you ready to carry forward into spring?',
    buttonText: 'Complete Winter',
    closingLine: 'I honor the wisdom gathered in stillness and carry it gently into the light.'
  },
  modeDescription: 'Individual practices for rest, contemplation, and inner wisdom',
  collectiveFocus: 'honoring collective rest and inner wisdom',
  collectiveNoun: 'whispers of wisdom'
};

// ============================================================================
// USER DATA STRUCTURE
// ============================================================================

WinterSolarRoom.userData = {
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

WinterSolarRoom.prebuiltAffirmations = [
  'I embrace the stillness within',
  'I rest deeply and restore fully',
  'I trust the wisdom of quiet contemplation',
  'I honor my need for pause and reflection',
  'I find peace in the darkness',
  'I am held in the gentle silence of winter',
  'I surrender to the cycle of rest',
  'I listen to the whispers of my inner wisdom',
  'I am complete in this moment of stillness',
  'I trust the regenerative power of winter'
];

// ============================================================================
// PRACTICE DEFINITIONS (8 practices)
// ============================================================================

WinterSolarRoom.practices = {
  intentionReflection: {
    id: 'intentionReflection',
    title: 'Intention and Reflection',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
    description: 'Consolidate insights and prepare for renewal',
    color: 'var(--ring-silent)',
    hasSaveData: true
  },
  futureAlignment: {
    id: 'futureAlignment',
    title: 'Future Alignment Visualization',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24"/></svg>`,
    description: 'Integrate insight and prepare for future growth',
    color: 'var(--ring-available)'
  },
  bodyGrounding: {
    id: 'bodyGrounding',
    title: 'Body Grounding and Breath',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="3"/><path d="M12 11v10M8 15l4-4 4 4M8 21h8"/></svg>`,
    description: 'Signal safety, stability, and rejuvenation',
    color: 'var(--ring-deep)'
  },
  energyAwareness: {
    id: 'energyAwareness',
    title: 'Energy and Awareness',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    description: 'Consolidate internal energy and protect vital reserves',
    color: 'var(--ring-resonant)'
  },
  environmentalClearing: {
    id: 'environmentalClearing',
    title: 'Environmental Clearing',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`,
    description: 'Create supportive external space for inner calm',
    color: 'var(--ring-silent)'
  },
  roleShedding: {
    id: 'roleShedding',
    title: 'Role Shedding Practice',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8m-4-4h8"/></svg>`,
    description: 'Consciously release or soften roles that drain energy',
    color: 'var(--ring-available)'
  },
  paceRecalibration: {
    id: 'paceRecalibration',
    title: 'Pace Recalibration Practice',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    description: "Align personal tempo with Winter's stillness",
    color: 'var(--ring-deep)'
  },
  relationshipWinterAudit: {
    id: 'relationshipWinterAudit',
    title: 'Relationship Winter Audit',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    description: 'Identify connections to rest, nurture, or let go',
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
WinterSolarRoom.getPracticeContent = function(practiceId) {
  const contentMap = {
    intentionReflection: () => this.getIntentionReflectionContent(),
    futureAlignment: () => this.getFutureAlignmentContent(),
    bodyGrounding: () => this.getBodyGroundingContent(),
    energyAwareness: () => this.getEnergyAwarenessContent(),
    environmentalClearing: () => this.getEnvironmentalClearingContent(),
    roleShedding: () => this.getRoleSheddingContent(),
    paceRecalibration: () => this.getPaceRecalibrationContent(),
    relationshipWinterAudit: () => this.getRelationshipWinterAuditContent()
  };

  const generator = contentMap[practiceId];
  if (generator) {
    return generator.call(this);
  }

  console.error(`No content generator for practice: ${practiceId}`);
  return '<p>Practice content not available.</p>';
};

// Practice 1: Intention Reflection (uses shared generator)
WinterSolarRoom.getIntentionReflectionContent = function() {
  return SolarConfig.generateIntentionPracticeContent(
    this.userData,
    this.prebuiltAffirmations,
    {
      purpose: 'Consolidate insights and prepare for renewal',
      intentionPrompt: 'What do you want to focus on this Winter season?',
      intentionPlaceholder: 'This Winter, I choose to focus on...',
      affirmationTitle: 'Choose Stillness Affirmation',
      listTitle: 'Reflection List',
      listPrompt: 'Write 3 insights or lessons you wish to integrate:',
      readAloudText: 'Say your intention and reflections out loud once.',
      closingLine: 'I honor my inner wisdom and hold it with care this season.'
    }
  );
};

// Practice 2: Future Alignment (uses shared generator)
WinterSolarRoom.getFutureAlignmentContent = function() {
  return SolarConfig.generateFutureAlignmentContent({
    purpose: 'Integrate insight and prepare for future growth',
    visualizationPrompt: 'Visualize yourself at the end of Winter feeling restored, aligned, and centered.',
    feelingTitle: 'Feel Integration',
    feelingPrompt: 'Do not visualize outcomes—simply feel inner stability and readiness.',
    closingLine: 'I move through this season in harmony with my inner truth.'
  });
};

// Practice 3: Body Grounding (uses shared generator)
WinterSolarRoom.getBodyGroundingContent = function() {
  return SolarConfig.generateBodyPracticeContent({
    purpose: 'Signal safety, stability, and rejuvenation',
    steps: [
      'Stand or sit comfortably, feet hip-width apart, knees soft',
      'Inhale deeply through the nose, exhale slowly through the mouth',
      'Repeat 5 times'
    ],
    subtleMovement: 'Optionally, gently stretch or roll shoulders to release tension and encourage circulation.',
    closingLine: 'My body is grounded, calm, and ready to rest this season.'
  });
};

// Practice 4: Energy Awareness (uses shared generator)
WinterSolarRoom.getEnergyAwarenessContent = function() {
  return SolarConfig.generateEnergyAwarenessContent({
    purpose: 'Consolidate internal energy and protect vital reserves',
    energySteps: [
      'Place hands on heart and lower belly',
      'Imagine energy gathering inward and settling into the center'
    ],
    energyQuality: 'Containment',
    energyGuideline: 'Winter energy is about inward focus, replenishment, and stillness.',
    closingLine: 'I hold my energy with care, honoring my need for restoration.'
  });
};

// Practice 5: Environmental Clearing (uses shared generator)
WinterSolarRoom.getEnvironmentalClearingContent = function() {
  return SolarConfig.generateEnvironmentalClearingContent({
    purpose: 'Create supportive external space for inner calm',
    removePrompt: 'Take 3 things that no longer serve you and remove or delete them. Do not reorganize—simply create space.',
    closingLine: 'I create stillness in my environment to support inner clarity.'
  });
};

// Practice 6: Role Shedding (uses shared generator)
WinterSolarRoom.getRoleSheddingContent = function() {
  return SolarConfig.generateRolePracticeContent({
    purpose: 'Consciously release or soften roles that drain energy',
    roleExamples: ['Leader', 'Caregiver', 'Worker', 'Supporter', 'Creator', 'Learner'],
    actionTitle: 'Soften One Role',
    actionPrompt: 'Choose one role to consciously step back from or pause this season.',
    closingLine: 'I allow my roles to rest and restore my energy this season.'
  });
};

// Practice 7: Pace Recalibration (uses shared generator)
WinterSolarRoom.getPaceRecalibrationContent = function() {
  return SolarConfig.generatePacePracticeContent({
    purpose: "Align personal tempo with Winter's stillness",
    paceOptions: ['Faster than sustainable', 'Appropriate', 'Already slowed'],
    adjustmentPrompt: 'Select one action to slow or restore balance:',
    adjustmentExamples: [
      'Pause before starting tasks',
      'Reduce transitions',
      'Allow more rest periods'
    ],
    closingLine: 'I allow my pace to align with the natural rhythm of this season.'
  });
};

// Practice 8: Relationship Winter Audit (uses shared generator)
WinterSolarRoom.getRelationshipWinterAuditContent = function() {
  return SolarConfig.generateRelationshipAuditContent({
    purpose: 'Identify connections to rest, nurture, or let go',
    identifyPrompt: 'List 2–3 key people in your life: one that feels supportive and nourishing, one that feels heavy or draining.',
    actionExamples: [
      'Express gratitude',
      'Limit interaction',
      'Step back',
      'Simply observe'
    ],
    integrationPrompt: 'Notice how your energy shifts as you consider these relationships. Observe the space created for calm and restoration.',
    closingLine: 'I tend my connections with care and preserve my energy this season.'
  });
};

// ============================================================================
// INITIALIZATION
// ============================================================================

window.WinterSolarRoom = WinterSolarRoom;
WinterSolarRoom.init();

console.log('❄️ Winter Solar Room loaded (refactored with Lunar architecture)');
