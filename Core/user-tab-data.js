/**
 * user-tab-data.js – Badge and progression data
 * Extracted from templates for better maintainability
 */

// ============== BADGE CATEGORIES ==============

export const BADGE_CATEGORIES = [
  {
    title: 'FIRST-WINS',
    badges: [
      { icon: '🌱', name: 'First Step', desc: 'do any single action', xp: 10, karma: 3, rarity: 'common' },
      { icon: '💚', name: 'First Gratitude', desc: 'log 1 gratitude entry', xp: 10, karma: 3, rarity: 'common' },
      { icon: '📓', name: 'First Journal', desc: 'save 1 journal entry', xp: 10, karma: 3, rarity: 'common' },
      { icon: '⚡', name: 'First Energy', desc: 'log 1 energy check-in', xp: 10, karma: 3, rarity: 'common' },
      { icon: '🃏', name: 'First Reading', desc: 'complete 1 tarot spread', xp: 10, karma: 3, rarity: 'common' },
      { icon: '🧘', name: 'First Meditation', desc: 'finish 1 meditation session', xp: 10, karma: 3, rarity: 'common' },
      { icon: '🛒', name: 'First Purchase', desc: 'buy anything in Karma Shop', xp: 50, karma: 3, rarity: 'common' }
    ]
  },
  {
    title: 'GRATITUDE',
    badges: [
      { icon: '❤️', name: 'Gratitude Warrior', desc: '30 entries', xp: 50, karma: 5, rarity: 'uncommon' },
      { icon: '💕', name: 'Gratitude Legend', desc: '100 entries', xp: 100, karma: 10, rarity: 'rare' },
      { icon: '💖', name: 'Gratitude Sage', desc: '200 entries', xp: 200, karma: 15, rarity: 'epic' },
      { icon: '💘', name: 'Gratitude Titan', desc: '500 entries', xp: 500, karma: 30, rarity: 'legendary' }
    ]
  },
  {
    title: 'JOURNAL',
    badges: [
      { icon: '📓', name: 'Journal Keeper', desc: '20 entries', xp: 50, karma: 5, rarity: 'uncommon' },
      { icon: '📚', name: 'Journal Master', desc: '75 entries', xp: 100, karma: 10, rarity: 'rare' },
      { icon: '📖', name: 'Journal Sage', desc: '150 entries', xp: 200, karma: 15, rarity: 'epic' },
      { icon: '📜', name: 'Journal Titan', desc: '400 entries', xp: 500, karma: 30, rarity: 'legendary' }
    ]
  },
  {
    title: 'ENERGY',
    badges: [
      { icon: '⚡', name: 'Energy Tracker', desc: '30 logs', xp: 50, karma: 5, rarity: 'uncommon' },
      { icon: '🔋', name: 'Energy Sage', desc: '100 logs', xp: 100, karma: 10, rarity: 'rare' },
      { icon: '🔌', name: 'Energy Titan', desc: '300 logs', xp: 300, karma: 15, rarity: 'epic' },
      { icon: '⚡️', name: 'Energy Legend', desc: '600 logs', xp: 600, karma: 30, rarity: 'legendary' }
    ]
  },
  {
    title: 'TAROT',
    badges: [
      { icon: '🔮', name: 'Tarot Apprentice', desc: '10 spreads', xp: 25, karma: 3, rarity: 'common' },
      { icon: '🃏', name: 'Tarot Mystic', desc: '25 spreads', xp: 50, karma: 5, rarity: 'uncommon' },
      { icon: '🌙', name: 'Tarot Oracle', desc: '75 spreads', xp: 100, karma: 10, rarity: 'rare' },
      { icon: '🧙', name: 'Tarot Sage', desc: '150 spreads', xp: 200, karma: 15, rarity: 'epic' },
      { icon: '🔮', name: 'Tarot Titan', desc: '400 spreads', xp: 500, karma: 30, rarity: 'legendary' }
    ]
  },
  {
    title: 'MEDITATION',
    badges: [
      { icon: '🧘', name: 'Meditation Devotee', desc: '20 sessions', xp: 50, karma: 5, rarity: 'uncommon' },
      { icon: '🕉️', name: 'Meditation Master', desc: '60 sessions', xp: 100, karma: 10, rarity: 'rare' },
      { icon: '🧘‍♂️', name: 'Meditation Sage', desc: '100 sessions', xp: 300, karma: 15, rarity: 'epic' },
      { icon: '🧘‍♀️', name: 'Meditation Titan', desc: '200 sessions', xp: 700, karma: 30, rarity: 'legendary' }
    ]
  },
  {
    title: 'STREAKS',
    badges: [
      { icon: '⭐', name: 'Perfect Week', desc: '7 days all quests', xp: 75, karma: 10, rarity: 'rare' },
      { icon: '💎', name: 'Dedication', desc: '30-day login', xp: 100, karma: 15, rarity: 'epic' },
      { icon: '🔱', name: 'Unstoppable', desc: '60-day login', xp: 150, karma: 15, rarity: 'epic' },
      { icon: '👑', name: 'Legendary Streak', desc: '100-day login', xp: 200, karma: 30, rarity: 'legendary' }
    ]
  }
];

// ============== LEVEL PROGRESSION ==============

export const LEVEL_PROGRESSION = [
  ['Seeker', 0],
  ['Practitioner', 300],
  ['Adept', 800],
  ['Healer', 1600],
  ['Master', 3200],
  ['Sage', 6500],
  ['Enlightened', 20000],
  ['Buddha', 50000],
  ['Light', 150000],
  ['Emptiness', 400000]
];

// ============== RARITY COLORS ==============

export const RARITY_COLORS = {
  common: '#9ca3af',
  uncommon: '#10b981',
  rare: '#3b82f6',
  epic: '#a855f7',
  legendary: '#f59e0b'
};