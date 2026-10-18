import test from 'node:test';
import assert from 'node:assert/strict';
import { longDate } from '../src/features/shell/long-date.mjs';

test('a game date reads as words in the book', () => {
  assert.equal(longDate('2026-10-14'), 'Wednesday, the fourteenth of October');
  assert.equal(longDate('2026-09-01'), 'Tuesday, the first of September');
  assert.equal(longDate('2027-03-31'), 'Wednesday, the thirty-first of March');
});
