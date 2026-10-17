import test from 'node:test';
import assert from 'node:assert/strict';
import {
  waterMaskDataUri,
  LANTERN_CUTOUT,
  ORBS,
  CALM_ZONE,
} from '../src/features/opening/geometry.mjs';

const svg = () => decodeURIComponent(waterMaskDataUri().replace(/^data:image\/svg\+xml;utf8,/, ''));

test('the calm zone is drawn before the lantern cut-out', () => {
  assert.ok(
    svg().indexOf("cy='86'") < svg().indexOf("cy='69'"),
    'calm patch must not reopen the lantern base',
  );
});

test('the lantern base is covered by a square-cornered cut-out', () => {
  const { base } = LANTERN_CUTOUT;
  assert.ok(base.y + base.h >= 80 && base.x <= 46.5 && base.x + base.w >= 53.5);
});

test('orbs are cut out of the water', () => {
  assert.equal(ORBS.length, 6);
  for (const o of ORBS) assert.ok(svg().includes(`cx='${o.cx}'`), `orb ${o.cx}`);
});

test('water under the lantern ripples at about a third of open water', () => {
  assert.equal(CALM_ZONE.level, '#222');
});
