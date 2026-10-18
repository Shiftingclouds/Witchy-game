import test from 'node:test';
import assert from 'node:assert/strict';
import { createSaveRepository } from '../src/storage/saves.mjs';
import { initialState } from '../src/engine.mjs';

const memory = () => {
  const data = new Map();
  return {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => data.set(k, String(v)),
    removeItem: (k) => data.delete(k),
    data,
  };
};

test('starting over keeps the old save as a backup, then replaces it', () => {
  const storage = memory();
  const saves = createSaveRepository(storage);
  saves.write(initialState('book', 'Wren', 'rookhallow', 'owl'));
  saves.beginAgain(initialState('book', 'Avery'));
  assert.equal(saves.read('book').name, 'Avery');
  assert.equal(JSON.parse(storage.getItem('lanternmere.replaced-backup.book')).name, 'Wren');
});

test('starting a first game in an empty slot makes no backup', () => {
  const storage = memory();
  createSaveRepository(storage).beginAgain(initialState('live', 'Avery'));
  assert.equal(storage.getItem('lanternmere.replaced-backup.live'), null);
});
