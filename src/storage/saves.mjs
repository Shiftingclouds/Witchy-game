import { parseSave } from '../engine/save.mjs';
import { MODES } from '../engine/modes.mjs';

export const MAX_SAVE_BYTES = 1_048_576;
export const saveSlot = (mode) => {
  if (!MODES.includes(mode)) throw new Error('Unknown save slot.');
  return 'lanternmere.save.' + mode;
};

/** Inject a Storage-compatible object so save behavior can be tested without a browser. */
export function createSaveRepository(storage) {
  return {
    read(mode) {
      const raw = storage.getItem(saveSlot(mode));
      if (raw === null) return null;
      try {
        return parseSave(raw);
      } catch {
        throw new Error(
          'This saved game could not be read. Restore a valid exported save; the original data has been left untouched.',
        );
      }
    },
    write(game) {
      storage.setItem(saveSlot(game.mode), JSON.stringify({ ...game, feedback: '' }));
    },
    import(raw, current = null) {
      if (typeof raw !== 'string' || new TextEncoder().encode(raw).length > MAX_SAVE_BYTES)
        throw new Error('That save file is too large. Choose a Lanternmere JSON export.');
      const imported = parseSave(raw);
      // Back up the target slot as well when importing across Book/Live modes.
      const target = saveSlot(imported.mode);
      const previousTarget = storage.getItem(target);
      if (previousTarget !== null)
        storage.setItem('lanternmere.import-backup.' + imported.mode, previousTarget);
      if (current) storage.setItem('lanternmere.import-backup', JSON.stringify(current));
      storage.setItem(target, JSON.stringify(imported));
      return imported;
    },
  };
}

export function downloadSave(game) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(game, null, 2)], { type: 'application/json' }),
  );
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `lanternmere-${game.mode}-${game.date}.json`;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
