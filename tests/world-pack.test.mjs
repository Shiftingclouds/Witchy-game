import test from 'node:test';
import assert from 'node:assert/strict';
import { LORE } from '../src/ai/world/lore.mjs';
import { MYSTERY_STAGES, MYSTERY_TRUTH } from '../src/ai/world/mystery.mjs';
import { STYLE_SAMPLES } from '../src/ai/world/style.mjs';

test('lore covers the world without future plans', () => {
  for (const term of [
    'Lanternmere',
    'Owlcombe',
    'Rookhallow',
    'Heronmere',
    'Larkspire',
    'Kindle',
    'Echosight',
    'Threadbind',
    'Emberfall',
    'Longnight',
  ])
    assert.ok(LORE.includes(term), term);
  assert.doesNotMatch(LORE, /romance route|planned|TODO|not yet written/i);
});

test('the mystery has a stage per chapter and a storyteller-only truth', () => {
  assert.deepEqual(
    MYSTERY_STAGES.map((s) => s.chapter),
    [0, 1, 2, 3, 4, 5, 6, 7],
  );
  assert.match(MYSTERY_TRUTH, /never state this outright/i);
});

test('style samples include narration and the central trio', () => {
  assert.ok(STYLE_SAMPLES.narration.length >= 6);
  for (const id of ['rowan', 'imogen', 'saoirse'])
    assert.ok(STYLE_SAMPLES.voices[id]?.length >= 2, id);
  for (const p of STYLE_SAMPLES.narration) assert.ok(p.split(/\s+/).length <= 90);
});
