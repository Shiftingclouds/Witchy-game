import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, transition } from '../src/engine.mjs';
import { metCharacters } from '../src/engine/selectors.mjs';

test('a new game has met only the people who speak in the opening', () => {
  const met = metCharacters(initialState('live', 'A', 'owlcombe', 'cat'));
  assert.ok(met.has('rowan') && met.has('imogen'));
  assert.ok(!met.has('honoria') && !met.has('fitch'));
});

test('talking to someone, or hearing them in an AI scene, means you have met them', () => {
  let g = initialState('live', 'A', 'owlcombe', 'cat');
  g = { ...g, bonds: { ...g.bonds, fitch: 3 } };
  assert.ok(metCharacters(g).has('fitch'));
  let s = initialState('sandbox', 'A', 'owlcombe', 'cat', { timeMode: 'timeless' });
  s = transition(s, {
    type: 'ai-turn',
    player: 'Hello',
    reply: { beats: [{ speaker: 'moll', text: 'Soup?', expression: 'warm' }] },
  });
  assert.ok(metCharacters(s).has('moll'));
});
