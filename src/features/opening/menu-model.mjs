import { chapters } from '../../content.mjs';

export const MODE_LABELS = { book: 'Read the book', live: 'Live the world' };
export const LAST_MODE_KEY = 'lanternmere.last-mode';

/** Which save "Continue" opens: the last one played if it still loads, otherwise any other save. */
export function continueTarget({ lastMode, saves }) {
  const order = [lastMode, ...Object.keys(MODE_LABELS)].filter((m) => m in MODE_LABELS);
  const mode = order.find((m) => saves[m]);
  if (!mode) return null;
  const game = saves[mode];
  const chapter = chapters[game.ending ? chapters.length - 1 : game.chapter];
  return { mode, label: `${game.name} · ${MODE_LABELS[mode]} · ${chapter?.title ?? 'First year'}` };
}
