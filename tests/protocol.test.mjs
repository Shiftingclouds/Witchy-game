import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { resolveAppPath } from '../electron/protocol.mjs';

const dist = path.resolve('dist');

test('maps app URLs into dist', () => {
  assert.equal(resolveAppPath(dist, 'app://lanternmere/'), path.join(dist, 'index.html'));
  assert.equal(
    resolveAppPath(dist, 'app://lanternmere/art/mere-day.webp'),
    path.join(dist, 'art', 'mere-day.webp'),
  );
  assert.equal(resolveAppPath(dist, 'app://lanternmere/book'), path.join(dist, 'index.html'));
});

test('refuses paths outside dist', () => {
  assert.equal(resolveAppPath(dist, 'app://lanternmere/../../package.json'), null);
  assert.equal(resolveAppPath(dist, 'app://lanternmere/%2e%2e/%2e%2e/package.json'), null);
  assert.equal(resolveAppPath(dist, 'app://lanternmere/..%5c..%5cpackage.json'), null);
  assert.equal(resolveAppPath(dist, 'app://lanternmere/%E0%A4%A'), null);
});
