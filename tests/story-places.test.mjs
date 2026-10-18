import test from 'node:test';
import assert from 'node:assert/strict';
import { locations, locationById, storyPlaces } from '../src/content.mjs';
import { sceneArt } from '../src/engine/selectors.mjs';
import { initialState } from '../src/engine.mjs';

test('the places of the new beginning exist for scenes, with their paintings', () => {
  const g = initialState('book', 'A');
  assert.equal(sceneArt(g, 'home-kitchen'), 'home-kitchen');
  assert.equal(sceneArt(g, 'home-street'), 'home-street-night');
  assert.equal(sceneArt(g, 'train-carriage'), 'train-carriage');
  for (const id of ['home-kitchen', 'home-street', 'train-carriage'])
    assert.ok(locationById[id], id);
});

test('story-only places never join the map, travel or the AI place list', () => {
  const mapped = new Set(locations.map((l) => l.id));
  for (const p of storyPlaces) assert.ok(!mapped.has(p.id), p.id);
});
