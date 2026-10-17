import test from 'node:test';
import assert from 'node:assert/strict';
import { spoken } from '../src/scene-beats.mjs';

test('spoken lines are wrapped in curly quotes, once', () => {
  assert.equal(spoken('You made it.'), '“You made it.”');
  assert.equal(spoken('“Already quoted.”'), '“Already quoted.”');
});
