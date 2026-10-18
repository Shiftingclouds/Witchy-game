import test from 'node:test';
import assert from 'node:assert/strict';
import { MODE_LABELS, saveLine } from '../src/features/opening/menu-model.mjs';
import { initialState } from '../src/engine.mjs';

test('the four ways to play are labelled', () => {
  assert.deepEqual(Object.keys(MODE_LABELS), ['book', 'live', 'guided', 'sandbox']);
});

test('a save is named by who and when, never by a spoiler chapter title', () => {
  const g = initialState('book', 'Wren', 'rookhallow', 'owl');
  assert.equal(saveLine(g), 'Wren · 1 September');
  assert.equal(saveLine({ ...g, ending: 'shared' }), 'Wren · First year complete');
  assert.equal(saveLine(null), '');
});
