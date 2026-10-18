import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState } from '../src/engine.mjs';
import { chapterBeats } from '../src/scene-beats.mjs';
import { sectionCast, staging, timeOfDay, emotionOf } from '../src/features/scene/stage.mjs';

test('at supper, Rowan and Imogen are both on stage once Imogen has spoken', () => {
  const beats = chapterBeats(0, initialState('book', 'A', 'owlcombe', 'cat'));
  const i = beats.findIndex((b) => b.section?.id === 'place-at-table' && b.speaker === 'imogen');
  const cast = sectionCast(beats, i);
  assert.ok(cast.includes('imogen') && cast.includes('rowan'));
  assert.equal(new Set(cast).size, cast.length);
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

test('nobody is on stage before their first line in the section; once there, they stay', () => {
  const beats = [
    { id: 'a', section: { id: 's' }, speaker: null, actors: [] },
    { id: 'b', section: { id: 's' }, speaker: 'toby', actors: [{ id: 'toby' }] },
    { id: 'c', section: { id: 's' }, speaker: null, actors: [] },
    { id: 'd', section: { id: 's' }, speaker: 'cas', actors: [{ id: 'cas' }] },
  ];
  assert.deepEqual(sectionCast(beats, 0), []);
  assert.deepEqual(sectionCast(beats, 1), ['toby']);
  assert.deepEqual(sectionCast(beats, 2), ['toby']);
  assert.deepEqual(sectionCast(beats, 3), ['toby', 'cas']);
});
