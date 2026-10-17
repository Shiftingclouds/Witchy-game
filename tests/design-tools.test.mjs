import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { SCREENS } from '../scripts/capture-screens.mjs';

test('the review covers every screen once', () => {
  assert.equal(SCREENS.length, 20);
  assert.equal(new Set(SCREENS.map((s) => s.id)).size, 20);
});

test('design-detect resolves the Impeccable CLI or explains why not', () => {
  try {
    const out = execFileSync(process.execPath, ['scripts/design-detect.mjs', '--list'], {
      encoding: 'utf8',
    });
    assert.match(out, /impeccable/i);
  } catch (error) {
    assert.equal(error.status, 2);
    assert.match(String(error.stderr), /Impeccable not found/);
  }
});
