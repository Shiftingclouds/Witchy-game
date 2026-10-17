import test, { beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import { join } from 'node:path';
import { createFileStorage } from '../electron/save-files.mjs';
import { saveDirectory, assertOutsideRepo } from '../electron/paths.mjs';
import { createSaveRepository } from '../src/storage/saves.mjs';

let dir;
beforeEach(() => {
  dir = mkdtempSync(join(os.tmpdir(), 'lanternmere-saves-'));
});

test('round-trips a save and keeps one backup', () => {
  const s = createFileStorage(dir);
  assert.equal(s.getItem('lanternmere.save.book'), null);
  s.setItem('lanternmere.save.book', '{"a":1}');
  s.setItem('lanternmere.save.book', '{"a":2}');
  assert.equal(s.getItem('lanternmere.save.book'), '{"a":2}');
  assert.equal(readFileSync(join(dir, 'lanternmere.save.book.json.bak'), 'utf8'), '{"a":1}');
});

test('a leftover .tmp from a crashed write is ignored', () => {
  writeFileSync(join(dir, 'lanternmere.save.live.json'), '{"ok":true}');
  writeFileSync(join(dir, 'lanternmere.save.live.json.tmp'), '{"half');
  assert.equal(createFileStorage(dir).getItem('lanternmere.save.live'), '{"ok":true}');
});

test('a corrupt save is reported by the repository and left untouched', () => {
  writeFileSync(join(dir, 'lanternmere.save.live.json'), 'not json');
  const repo = createSaveRepository(createFileStorage(dir));
  assert.throws(() => repo.read('live'), /could not be read/);
  assert.equal(readFileSync(join(dir, 'lanternmere.save.live.json'), 'utf8'), 'not json');
});

test('rejects keys that could escape the directory', () => {
  assert.throws(() => createFileStorage(dir).setItem('../evil', 'x'));
  assert.throws(() => createFileStorage(dir).getItem('lanternmere/../../evil'));
});

test('save directory is outside the repo', () => {
  assert.throws(() => assertOutsideRepo(join(process.cwd(), 'saves'), process.cwd()));
  assert.throws(() => assertOutsideRepo(join(process.cwd().toUpperCase(), 'saves'), process.cwd()));
  assert.doesNotThrow(() => assertOutsideRepo(saveDirectory(os.tmpdir()), process.cwd()));
  const userData = join(os.tmpdir(), 'AppData');
  assert.equal(saveDirectory(userData), join(userData, 'saves'));
});

test('flushes the temporary file to disk before it replaces the save', () => {
  const calls = [];
  const spy = {
    ...fs,
    fsyncSync: (fd) => (calls.push('fsync'), fs.fsyncSync(fd)),
    renameSync: (a, b) => (calls.push('rename'), fs.renameSync(a, b)),
  };
  createFileStorage(dir, spy).setItem('lanternmere.save.book', '{"a":1}');
  assert.deepEqual(calls, ['fsync', 'rename']);
  assert.equal(readFileSync(join(dir, 'lanternmere.save.book.json'), 'utf8'), '{"a":1}');
});
