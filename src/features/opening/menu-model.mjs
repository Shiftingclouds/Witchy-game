import { dateLabel } from '../../engine.mjs';

export const MODE_LABELS = {
  book: 'Read the book',
  live: 'Live the world',
  guided: 'The Guided Tale',
  sandbox: 'The Open World',
};
export const LAST_MODE_KEY = 'lanternmere.last-mode';

/** How a save is named in Continue: who, and how far into the year (no spoiler chapter titles). */
export const saveLine = (game) =>
  game ? `${game.name} · ${game.ending ? 'First year complete' : dateLabel(game.date)}` : '';
