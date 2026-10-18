import test from 'node:test';
import assert from 'node:assert/strict';
import { moonPhase, moonWeek } from '../src/features/shell/moon.mjs';

// Known moons (UTC): new 2026-10-10, full 2026-10-26, new 2026-11-09.
test('a known new moon is close to 0 and a known full moon close to 0.5', () => {
  assert.ok(moonPhase('2026-10-10') < 0.04 || moonPhase('2026-10-10') > 0.96);
  assert.ok(Math.abs(moonPhase('2026-10-26') - 0.5) < 0.04);
});

test('the phase grows day by day through the month', () => {
  assert.ok(moonPhase('2026-10-14') > moonPhase('2026-10-12'));
  assert.ok(moonPhase('2026-10-14') < moonPhase('2026-10-20'));
});

test('moonWeek gives the next eight nights, starting from the given day', () => {
  const week = moonWeek('2026-10-14', 8);
  assert.equal(week.length, 8);
  assert.equal(week[0].date, '2026-10-14');
  assert.equal(week[7].date, '2026-10-21');
  assert.ok(week.every((n) => n.phase >= 0 && n.phase < 1));
});
