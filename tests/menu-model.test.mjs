import test from 'node:test';
import assert from 'node:assert/strict';
import { continueTarget, MODE_LABELS } from '../src/features/opening/menu-model.mjs';
import { initialState } from '../src/engine.mjs';

const g = (mode) => initialState(mode, 'Avery', 'owlcombe', 'cat');

test('continue prefers the last played save', () => {
  assert.equal(
    continueTarget({ lastMode: 'book', saves: { book: g('book'), live: g('live') } }).mode,
    'book',
  );
  assert.equal(
    continueTarget({ lastMode: 'live', saves: { book: g('book'), live: g('live') } }).mode,
    'live',
  );
});

test('continue falls back when the last played save is missing or unreadable', () => {
  assert.equal(
    continueTarget({ lastMode: 'book', saves: { book: null, live: g('live') } }).mode,
    'live',
  );
  assert.equal(
    continueTarget({ lastMode: 'nonsense', saves: { book: g('book'), live: null } }).mode,
    'book',
  );
});

test('no saves, no continue', () => {
  assert.equal(continueTarget({ lastMode: null, saves: { book: null, live: null } }), null);
});

test('label names the player, mode and chapter', () => {
  const t = continueTarget({ lastMode: 'live', saves: { book: null, live: g('live') } });
  assert.match(t.label, /^Avery · Live the world · \S/);
  assert.equal(MODE_LABELS.book, 'Read the book');
});
