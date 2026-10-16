import {
  characters,
  characterById,
  locations,
  locationById,
  houses,
  spells,
  familiars,
} from '../content.mjs';
import { eventById } from '../life.mjs';
import { chapterBeats, chapterSceneId } from '../scene-beats.mjs';
import { isGameDate, validateCharacterState } from '../character-memory.mjs';
import { initialState, SAVE_VERSION } from './state.mjs';
import { migrateSave } from './migrations.mjs';
export function parseSave(value) {
  let s = migrateSave(typeof value === 'string' ? JSON.parse(value) : value);
  if (s && s.bookmark === undefined) s = { ...s, bookmark: null };
  if (
    !s ||
    s.version !== SAVE_VERSION ||
    !['live', 'book'].includes(s.mode) ||
    typeof s.name !== 'string' ||
    !s.name.trim() ||
    s.name.length > 24 ||
    !houses.some((h) => h.id === s.house) ||
    !familiars.includes(s.familiar) ||
    !Object.hasOwn(locationById, s.location)
  )
    throw new Error('This is not a supported Lanternmere save.');
  if (
    !/^20\d\d-\d\d-\d\d$/.test(s.date) ||
    Number.isNaN(Date.parse(s.date + 'T12:00:00Z')) ||
    new Date(s.date + 'T12:00:00Z').toISOString().slice(0, 10) !== s.date
  )
    throw new Error('Invalid save date.');
  for (const [key, max] of [
    ['period', 3],
    ['chapter', 7],
    ['points', 1000000],
  ])
    if (!Number.isInteger(s[key]) || s[key] < 0 || s[key] > max)
      throw new Error('Invalid progress.');
  if (![null, 'shared', 'keeper'].includes(s.ending) || (s.ending && s.chapter !== 7))
    throw new Error('Invalid ending.');
  if (
    !s.bonds ||
    typeof s.bonds !== 'object' ||
    Array.isArray(s.bonds) ||
    Object.entries(s.bonds).some(
      ([id, n]) => !Object.hasOwn(characterById, id) || !Number.isFinite(n) || n < 0 || n > 100,
    )
  )
    throw new Error('Invalid friendships.');
  const allowed = {
    spells: spells.map((x) => x.id),
    clues: ['archive', 'flower', 'lake', 'stones', 'restored'],
    visited: locations.map((x) => x.id),
  };
  for (const [key, values] of Object.entries(allowed))
    if (!Array.isArray(s[key]) || s[key].length > 100 || s[key].some((v) => !values.includes(v)))
      throw new Error('Invalid discoveries.');
  if (
    !Array.isArray(s.rewards) ||
    s.rewards.length > 1000 ||
    s.rewards.some((v) => typeof v !== 'string' || v.length > 100)
  )
    throw new Error('Invalid rewards.');
  if (
    !Array.isArray(s.journal) ||
    s.journal.length > 150 ||
    s.journal.some(
      (e) =>
        !e ||
        !isGameDate(e.date) ||
        e.date > s.date ||
        typeof e.text !== 'string' ||
        e.text.length > 2000,
    )
  )
    throw new Error('Invalid journal.');
  if (typeof s.notes !== 'string' || s.notes.length > 12000) throw new Error('Invalid notes.');
  if (
    !s.daily ||
    s.daily.date !== s.date ||
    !Array.isArray(s.daily.checkins) ||
    s.daily.checkins.length > characters.length ||
    s.daily.checkins.some((id) => !Object.hasOwn(characterById, id)) ||
    new Set(s.daily.checkins).size !== s.daily.checkins.length
  )
    throw new Error('Invalid daily progress.');
  if (s.daily.event !== null) {
    const event = s.daily.event;
    if (
      !event ||
      !Object.hasOwn(eventById, event.id) ||
      !Number.isInteger(event.choice) ||
      !eventById[event.id].choices[event.choice]
    )
      throw new Error('Invalid gathering.');
  }
  if (s.bookmark !== null) {
    if (
      !s.bookmark ||
      typeof s.bookmark !== 'object' ||
      typeof s.bookmark.scene !== 'string' ||
      s.bookmark.scene.length > 100 ||
      typeof s.bookmark.beat !== 'string' ||
      s.bookmark.beat.length > 100
    )
      throw new Error('Invalid reading bookmark.');
    // Content revisions can retire a beat. Keep the player's game and restart only that scene.
    if (
      s.bookmark.scene !== chapterSceneId(s.chapter) ||
      !chapterBeats(s.chapter).some((beat) => beat.id === s.bookmark.beat)
    )
      s = { ...s, bookmark: null };
  }
  const characterState = validateCharacterState(s);
  const clean = initialState(s.mode, s.name, s.house, s.familiar);
  for (const key of Object.keys(clean))
    if (key !== 'feedback') clean[key] = structuredClone(s[key]);
  Object.assign(clean, characterState);
  return clean;
}
