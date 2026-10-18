import { houses, familiars } from '../content.mjs';
import { emptyAi } from './ai-state.mjs';
import { isAiMode } from './modes.mjs';
export const SAVE_VERSION = 6;
/** Who you are is chosen on arrival night; a game that already knows both skips those decisions. */
export const openingAnswered = (house, familiar) =>
  houses.some((h) => h.id === house) && familiars.includes(familiar)
    ? { 'arrival:crossing': 'castle', 'arrival:house': house, 'arrival:familiar': familiar }
    : {};
export const periods = ['Morning', 'Afternoon', 'Evening', 'Night'];
export const initialState = (
  mode = 'live',
  name = 'Avery',
  house = null,
  familiar = null,
  { timeMode = null } = {},
) => ({
  version: SAVE_VERSION,
  mode,
  name: name.trim().slice(0, 24) || 'Avery',
  // Chosen inside the story on arrival night; null until then.
  house: houses.some((h) => h.id === house) ? house : null,
  familiar: familiars.includes(familiar) ? familiar : null,
  date: '2026-09-01',
  period: 0,
  location: 'lantern-hall',
  chapter: 0,
  ending: null,
  points: 0,
  bonds: {},
  spells: [],
  clues: [],
  visited: ['lantern-hall'],
  rewards: [],
  journal: [
    { date: '2026-09-01', text: 'I arrived at Lanternmere. There was a place waiting for me.' },
  ],
  notes: '',
  bookmark: null,
  storyChoices: openingAnswered(house, familiar),
  characterMemories: {},
  conversations: {},
  conversationSequence: 0,
  daily: { date: '2026-09-01', checkins: [], event: null },
  feedback: '',
  // Playthrough memory, AI modes only (Guided: no time mode; Open World: timeless or timed).
  ai: isAiMode(mode)
    ? emptyAi(mode === 'sandbox' ? (timeMode === 'timed' ? 'timed' : 'timeless') : null)
    : null,
});
