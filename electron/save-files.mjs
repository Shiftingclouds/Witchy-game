import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';

const KEY = /^lanternmere\.[a-z.-]+$/;

/** A synchronous Storage-like store: one JSON file per key, atomic writes, one backup. */
export function createFileStorage(directory) {
  mkdirSync(directory, { recursive: true });
  const file = (key) => {
    if (typeof key !== 'string' || !KEY.test(key) || key.includes('..'))
      throw new Error('Unknown save key.');
    return path.join(directory, key + '.json');
  };
  return {
    getItem(key) {
      const target = file(key);
      return existsSync(target) ? readFileSync(target, 'utf8') : null;
    },
    setItem(key, value) {
      const target = file(key);
      const temporary = target + '.tmp';
      writeFileSync(temporary, String(value));
      if (existsSync(target)) copyFileSync(target, target + '.bak');
      renameSync(temporary, target);
    },
  };
}
