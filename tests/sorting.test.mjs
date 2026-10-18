import test from 'node:test';
import assert from 'node:assert/strict';
import {
  houseLeaning,
  fillSorting,
  orderBySuggestion,
  sortingKeys,
} from '../src/engine/sorting.mjs';

const keys = ['arrival:sorting-1', 'arrival:sorting-2', 'arrival:sorting-3', 'arrival:sorting-4'];

test('the house with the most answers is Honoria’s suggestion', () => {
  const choices = {
    'arrival:sorting-1': 'owlcombe',
    'arrival:sorting-2': 'heronmere',
    'arrival:sorting-3': 'heronmere',
    'arrival:sorting-4': 'larkspire',
  };
  assert.equal(houseLeaning(choices, keys), 'heronmere');
});

test('a tie goes to the house that took the lead first', () => {
  const choices = {
    'arrival:sorting-1': 'rookhallow',
    'arrival:sorting-2': 'larkspire',
    'arrival:sorting-3': 'larkspire',
    'arrival:sorting-4': 'rookhallow',
  };
  assert.equal(houseLeaning(choices, keys), 'larkspire');
});

test('no answers, no suggestion', () => {
  assert.equal(houseLeaning({}, keys), null);
});

test('a game that already has its house counts the questions as answered', () => {
  const filled = fillSorting(
    { house: 'rookhallow', storyChoices: { 'arrival:sorting-1': 'owlcombe' } },
    keys,
  );
  assert.deepEqual(filled.storyChoices, {
    'arrival:sorting-1': 'owlcombe',
    'arrival:sorting-2': 'rookhallow',
    'arrival:sorting-3': 'rookhallow',
    'arrival:sorting-4': 'rookhallow',
  });
  const fresh = { house: null, storyChoices: {} };
  assert.equal(fillSorting(fresh, keys), fresh);
});

test('the suggested house is listed first and marked; the rest keep their order', () => {
  const options = ['owlcombe', 'rookhallow', 'heronmere', 'larkspire'].map((id) => ({ id }));
  const ordered = orderBySuggestion(options, 'heronmere');
  assert.deepEqual(
    ordered.map((o) => o.id),
    ['heronmere', 'owlcombe', 'rookhallow', 'larkspire'],
  );
  assert.equal(ordered[0].suggested, true);
  assert.equal(ordered[1].suggested, undefined);
  assert.deepEqual(orderBySuggestion(options, null), options);
});

test('the questions are read from the scene in number order (10 after 9)', () => {
  const ids = ['sorting-10', 'house', 'sorting-2', 'sorting-1', 'sorting-9'];
  const scene = { id: 'arrival', beats: ids.map((id) => ({ id, choice: { options: [] } })) };
  assert.deepEqual(sortingKeys(scene), [
    'arrival:sorting-1',
    'arrival:sorting-2',
    'arrival:sorting-9',
    'arrival:sorting-10',
  ]);
});
