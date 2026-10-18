import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, transition } from '../src/engine.mjs';
import { chapterBeats } from '../src/scene-beats.mjs';

const fullOpening = () => {
  let g = initialState('book', 'Avery');
  for (const [key, option] of [
    ['arrival:crossing', 'castle'],
    ['arrival:house', 'owlcombe'],
    ['arrival:familiar', 'cat'],
  ])
    g = transition(g, { type: 'story-choice', key, option });
  return chapterBeats(0, g);
};

test('the opening crosses the lake, lands, sees the hall, then chooses house and familiar before supper', () => {
  const ids = [...new Set(fullOpening().map((b) => b.section?.id))];
  assert.deepEqual(ids.slice(0, 6), [
    'crossing',
    'landing',
    'hall',
    'house',
    'familiar',
    'place-at-table',
  ]);
});

test('Rowan meets the player as a stranger', () => {
  const first = fullOpening().find((b) => b.speaker === 'rowan');
  assert.doesNotMatch(first.text, /You made it/);
});

test('the boat crossing introduces Toby, Cas and Tully', () => {
  let g = initialState('book', 'Avery');
  g = transition(g, { type: 'story-choice', key: 'arrival:crossing', option: 'toby' });
  for (const id of ['toby', 'cas', 'tully']) assert.ok(g.bonds[id] >= 1, id);
});
