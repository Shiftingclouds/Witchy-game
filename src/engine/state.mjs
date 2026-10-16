import { houses, familiars } from '../content.mjs';
export const SAVE_VERSION = 3;
export const periods = ['Morning', 'Afternoon', 'Evening', 'Night'];
export const initialState = (
  mode = 'live',
  name = 'Avery',
  house = 'owlcombe',
  familiar = 'cat',
) => ({
  version: SAVE_VERSION,
  mode,
  name: name.trim().slice(0, 24) || 'Avery',
  house: houses.some((h) => h.id === house) ? house : 'owlcombe',
  familiar: familiars.includes(familiar) ? familiar : 'cat',
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
  characterMemories: {},
  conversations: {},
  conversationSequence: 0,
  daily: { date: '2026-09-01', checkins: [], event: null },
  feedback: '',
});
