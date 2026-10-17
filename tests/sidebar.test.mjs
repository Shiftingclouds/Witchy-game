import test from 'node:test';
import assert from 'node:assert/strict';
import { SIDEBAR_STATES, nextSidebarState, lastVisible } from '../src/features/shell/sidebar.mjs';

test('the sidebar cycles open → rail → hidden → open', () => {
  assert.deepEqual(SIDEBAR_STATES, ['open', 'rail', 'hidden']);
  assert.equal(nextSidebarState('open'), 'rail');
  assert.equal(nextSidebarState('rail'), 'hidden');
  assert.equal(nextSidebarState('hidden'), 'open');
});

test('unknown states fall back to open', () => {
  assert.equal(nextSidebarState('sideways'), 'open');
  assert.equal(lastVisible('sideways'), 'open');
});

test('restoring from hidden returns to the last visible state', () => {
  assert.equal(lastVisible('rail'), 'rail');
  assert.equal(lastVisible('hidden'), 'open');
});
