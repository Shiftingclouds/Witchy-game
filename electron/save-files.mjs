import * as nodeFs from 'node:fs';
import path from 'node:path';

const KEY = /^lanternmere\.[a-z.-]+$/;

/** A synchronous Storage-like store: one JSON file per key, atomic writes, one backup. */
export function createFileStorage(directory, fs = nodeFs) {
  fs.mkdirSync(directory, { recursive: true });
  const file = (key) => {
    if (typeof key !== 'string' || !KEY.test(key) || key.includes('..'))
      throw new Error('Unknown save key.');
    return path.join(directory, key + '.json');
  };
  return {
    getItem(key) {
      const target = file(key);
      return fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : null;
    },
    setItem(key, value) {
      const target = file(key);
      const temporary = target + '.tmp';
      // Flush before renaming so a power cut cannot leave an empty save behind the new name.
      const fd = fs.openSync(temporary, 'w');
      try {
        fs.writeSync(fd, String(value));
        fs.fsyncSync(fd);
      } finally {
        fs.closeSync(fd);
      }
      if (fs.existsSync(target)) fs.copyFileSync(target, target + '.bak');
      fs.renameSync(temporary, target);
    },
  };
}
