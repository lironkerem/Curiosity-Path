/**
 * user-tab-data.js – Badge and progression data
 * Extracted from templates for better maintainability.
 * All exports are frozen to prevent accidental mutation at runtime.
 */

// ─── Badge categories ─────────────────────────────────────────────────────────

export const BADGE_CATEGORIES = Object.freeze([
  Object.freeze({
    title: 'FIRST-WINS',
    badges: Object.freeze([
      { icon: '🌱', name: 'First Step',        desc: 'do any single action',           xp: 10,  karma: 3,  rarity: 'common'    },
      { icon: '💚', name: 'First Gratitude',   desc: 'log 1 gratitude entry',           xp: 10,  karma: 3,  rarity: 'common'    },
      { icon: '📓', name: 'First Journal',     desc: 'save 1 journal entry',            xp: 10,  karma: 3,  rarity: 'common'    },
      { icon: '⚡', name: 'First Energy',      desc: 'log 1 energy check-in',           xp: 10,  karma: 3,  rarity: 'common'    },
      { icon: '🃏', name: 'First Reading',     desc: 'complete 1 tarot spread',         xp: 10,  karma: 3,  rarity: 'common'    },
      { icon: '🧘', name: 'First Meditation',  desc: 'finish 1 meditation session',     xp: 10,  karma: 3,  rarity: 'common'    },
      { icon: '🛒', name: 'First Purchase',    desc: 'buy anything in Karma Shop',      xp: 50,  karma: 3,  rarity: 'common'    }
    ])
  }),
  Object.freeze({
    title: 'GRATITUDE',
    badges: Object.freeze([
      { icon: '❤️', name: 'Gratitude Warrior', desc: '30 entries',  xp: 50,  karma: 5,  rarity: 'uncommon'  },
      { icon: '💕', name: 'Gratitude Legend',  desc: '100 entries', xp: 100, karma: 10, rarity: 'rare'      },
      { icon: '💖', name: 'Gratitude Sage',    desc: '200 entries', xp: 200, karma: 15, rarity: 'epic'      },
      { icon: '💘', name: 'Gratitude Titan',   desc: '500 entries', xp: 500, karma: 30, rarity: 'legendary' }
    ])
  }),
  Object.freeze({
    title: 'JOURNAL',
    badges: Object.freeze([
      { icon: '📓', name: 'Journal Keeper', desc: '20 entries',  xp: 50,  karma: 5,  rarity: 'uncommon'  },
      { icon: '📚', name: 'Journal Master', desc: '75 entries',  xp: 100, karma: 10, rarity: 'rare'      },
      { icon: '📖', name: 'Journal Sage',   desc: '150 entries', xp: 200, karma: 15, rarity: 'epic'      },
      { icon: '📜', name: 'Journal Titan',  desc: '400 entries', xp: 500, karma: 30, rarity: 'legendary' }
    ])
  }),
  Object.freeze({
    title: 'ENERGY',
    badges: Object.freeze([
      { icon: '⚡',  name: 'Energy Tracker', desc: '30 logs',  xp: 50,  karma: 5,  rarity: 'uncommon'  },
      { icon: '🔋',  name: 'Energy Sage',    desc: '100 logs', xp: 100, karma: 10, rarity: 'rare'      },
      { icon: '🔌',  name: 'Energy Titan',   desc: '300 logs', xp: 300, karma: 15, rarity: 'epic'      },
      { icon: '⚡️', name: 'Energy Legend',  desc: '600 logs', xp: 600, karma: 30, rarity: 'legendary' }
    ])
  }),
  Object.freeze({
    title: 'TAROT',
    badges: Object.freeze([
      { icon: '🔮', name: 'Tarot Apprentice', desc: '10 spreads',  xp: 25,  karma: 3,  rarity: 'common'    },
      { icon: '🃏', name: 'Tarot Mystic',     desc: '25 spreads',  xp: 50,  karma: 5,  rarity: 'uncommon'  },
      { icon: '🌙', name: 'Tarot Oracle',     desc: '75 spreads',  xp: 100, karma: 10, rarity: 'rare'      },
      { icon: '🧙', name: 'Tarot Sage',       desc: '150 spreads', xp: 200, karma: 15, rarity: 'epic'      },
      { icon: '🔮', name: 'Tarot Titan',      desc: '400 spreads', xp: 500, karma: 30, rarity: 'legendary' }
    ])
  }),
  Object.freeze({
    title: 'MEDITATION',
    badges: Object.freeze([
      { icon: '🧘',    name: 'Meditation Devotee', desc: '20 sessions',  xp: 50,  karma: 5,  rarity: 'uncommon'  },
      { icon: '🕉️',  name: 'Meditation Master',  desc: '60 sessions',  xp: 100, karma: 10, rarity: 'rare'      },
      { icon: '🧘‍♂️', name: 'Meditation Sage',    desc: '100 sessions', xp: 300, karma: 15, rarity: 'epic'      },
      { icon: '🧘‍♀️', name: 'Meditation Titan',   desc: '200 sessions', xp: 700, karma: 30, rarity: 'legendary' }
    ])
  }),
  Object.freeze({
    title: 'STREAKS',
    badges: Object.freeze([
      { icon: '⭐', name: 'Perfect Week',     desc: '7 days all quests', xp: 75,  karma: 10, rarity: 'rare'      },
      { icon: '💎', name: 'Dedication',       desc: '30-day login',      xp: 100, karma: 15, rarity: 'epic'      },
      { icon: '🔱', name: 'Unstoppable',      desc: '60-day login',      xp: 150, karma: 15, rarity: 'epic'      },
      { icon: '👑', name: 'Legendary Streak', desc: '100-day login',     xp: 200, karma: 30, rarity: 'legendary' }
    ])
  })
]);

// ─── Level progression ────────────────────────────────────────────────────────

/** [title, xpRequired] tuples, index = level - 1 */
export const LEVEL_PROGRESSION = Object.freeze([
  ['Seeker',       0],
  ['Practitioner', 300],
  ['Adept',        800],
  ['Healer',       1_600],
  ['Master',       3_200],
  ['Sage',         6_500],
  ['Enlightened',  20_000],
  ['Buddha',       50_000],
  ['Light',        150_000],
  ['Emptiness',    400_000]
]);

// ─── Rarity colours ───────────────────────────────────────────────────────────

export const RARITY_COLORS = Object.freeze({
  common:    '#9ca3af',
  uncommon:  '#10b981',
  rare:      '#3b82f6',
  epic:      '#a855f7',
  legendary: '#f59e0b'
});
