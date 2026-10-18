import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, transition, SAVE_VERSION } from '../src/engine.mjs';
import { parseSave } from '../src/engine/save.mjs';
import { needsOpening } from '../src/engine/selectors.mjs';
import { pendingStoryChoice } from '../src/scene-beats.mjs';

const choose = (g, key, option) => transition(g, { type: 'story-choice', key, option });

test('a new game starts without a house or familiar and needs the opening', () => {
  const g = initialState('book', 'Avery');
  assert.equal(g.house, null);
  assert.equal(g.familiar, null);
  assert.ok(needsOpening(g));
  assert.equal(pendingStoryChoice(g)?.id, 'crossing');
});

test('choosing in the story sets house and familiar', () => {
  let g = initialState('book', 'Avery');
  g = choose(g, 'arrival:crossing', 'toby');
  g = choose(g, 'arrival:house', 'heronmere');
  assert.equal(g.house, 'heronmere');
  g = choose(g, 'arrival:familiar', 'fox');
  assert.equal(g.familiar, 'fox');
  assert.ok(!needsOpening(g));
});

test('an old v5 save in chapter 0 migrates with the new decisions already answered', () => {
  const v5 = { ...initialState('book', 'Wren', 'rookhallow', 'owl'), version: 5 };
  v5.storyChoices = {};
  const g = parseSave(JSON.stringify(v5));
  assert.equal(SAVE_VERSION, 6);
  assert.equal(g.storyChoices['arrival:house'], 'rookhallow');
  assert.equal(g.storyChoices['arrival:familiar'], 'owl');
  assert.ok(!['crossing', 'house', 'familiar'].includes(pendingStoryChoice(g)?.id));
  assert.ok(!needsOpening(g));
});

test('a half-finished opening survives a reload', () => {
  let g = initialState('book', 'Avery');
  g = choose(g, 'arrival:crossing', 'castle');
  g = choose(g, 'arrival:house', 'larkspire');
  const back = parseSave(JSON.stringify(g));
  assert.equal(back.house, 'larkspire');
  assert.equal(back.familiar, null);
  assert.ok(needsOpening(back));
  assert.equal(pendingStoryChoice(back)?.id, 'familiar');
});

test('a save naming a house that does not exist is still refused', () => {
  const bad = { ...initialState('book', 'Avery'), house: 'dragonkeep' };
  assert.throws(() => parseSave(JSON.stringify(bad)));
});
