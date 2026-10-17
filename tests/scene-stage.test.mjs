import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState } from '../src/engine.mjs';
import { chapterBeats } from '../src/scene-beats.mjs';
import { sectionCast, staging, timeOfDay, emotionOf } from '../src/features/scene/stage.mjs';

test('everyone in a section is on stage from its first line', () => {
  const beats = chapterBeats(0, initialState('book', 'A', 'owlcombe', 'cat'));
  const i = beats.findIndex((b) => b.speaker === 'rowan');
  assert.ok(sectionCast(beats, i).includes('imogen'));
  assert.equal(new Set(sectionCast(beats, i)).size, sectionCast(beats, i).length);
});

test('staging follows how many people are present', () => {
  assert.equal(staging(['rowan', 'imogen']), 'group');
  assert.equal(staging(['rowan']), 'single');
  assert.equal(staging([]), 'none');
});

test('time of day comes from the period', () => {
  assert.deepEqual([0, 1, 2, 3, 9].map(timeOfDay), [
    'morning',
    'afternoon',
    'evening',
    'night',
    'evening',
  ]);
});

test('a character takes the emotion the line gives them, else neutral', () => {
  const beat = { actors: [{ id: 'rowan', emotion: 'warm' }] };
  assert.equal(emotionOf(beat, 'rowan'), 'warm');
  assert.equal(emotionOf(beat, 'imogen'), 'neutral');
});
