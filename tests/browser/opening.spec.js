import { test, expect } from './fixtures.js';
import { motion, frames, difference } from './pixels.js';

// The camera push-in, glow, ripple rings, twinkle and sparks are paused so only the scene effects move.
const STILL_CAMERA =
  '.opening .op-scene, .opening .glow, .opening .twinkle circle { animation: none !important; }' +
  '.opening .ring { animation: none !important; opacity: 0 !important; } .opening canvas { display: none !important; }';

const LANTERN_BASE = [0.47, 0.72, 0.53, 0.8];
const ROCKS_LEFT = [0, 0.88, 0.2, 1];
const ROCKS_RIGHT = [0.84, 0.88, 1, 1];
const MOUNTAIN_PEAKS = [0.02, 0.36, 0.25, 0.45];
const CASTLE = [0.8, 0.4, 0.97, 0.6];
const OPEN_LAKE = [0.3, 0.72, 0.4, 0.8];
const VALLEYS = [0, 0.44, 1, 0.63];

async function openScene(page, { reduce = false, still = true } = {}) {
  if (reduce) await page.addInitScript(() => localStorage.setItem('lanternmere.motion', 'reduce'));
  await page.goto('/?opening');
  await page.locator('.opening').waitFor();
  if (still) await page.addStyleTag({ content: STILL_CAMERA });
  await page.waitForTimeout(2000);
}

test.describe('the living opening', () => {
  test.use({ viewport: { width: 1600, height: 900 } });

  test('still things stay still and the lake moves', async ({ page }) => {
    await openScene(page);
    expect(await motion(page, LANTERN_BASE, 3000)).toBeLessThan(0.3);
    expect(await motion(page, ROCKS_LEFT, 3000)).toBeLessThan(0.3);
    expect(await motion(page, ROCKS_RIGHT, 3000)).toBeLessThan(0.3);
    expect(await motion(page, MOUNTAIN_PEAKS, 3000)).toBeLessThan(0.3);
    expect(await motion(page, CASTLE, 3000)).toBeLessThan(0.3);
    // The ripple swings on a 14 s cycle; one of two samples is always away from a turnaround.
    const lake = Math.max(await motion(page, OPEN_LAKE, 3000), await motion(page, OPEN_LAKE, 3000));
    expect(lake).toBeGreaterThan(2);
  });

  test('in-app reduce motion stills everything', async ({ page }) => {
    await openScene(page, { reduce: true, still: false });
    expect(await motion(page, [0, 0, 1, 1], 3000)).toBeLessThan(0.1);
  });

  test('no flicker: consecutive frames change smoothly', async ({ page }) => {
    await openScene(page);
    const shots = await frames(page, VALLEYS, 22, 100);
    const steps = shots.slice(3).map((s, i) => difference(shots[i + 2], s));
    const median = [...steps].sort((a, b) => a - b)[Math.floor(steps.length / 2)];
    for (const step of steps) expect(step).toBeLessThan(Math.max(3 * median, 1));
  });
});

for (const size of [
  { width: 1024, height: 700 },
  { width: 2560, height: 1080 },
]) {
  test(`overlays stay on the painted lantern at ${size.width}×${size.height}`, async ({ page }) => {
    await page.setViewportSize(size);
    await openScene(page, { still: false });
    const glow = await page.locator('.opening .glow').boundingBox();
    const scale = Math.max(size.width / 1672, size.height / 941);
    const expectedX = size.width / 2;
    const expectedY = (size.height - 941 * scale) / 2 + 0.69 * 941 * scale;
    expect(Math.abs(glow.x + glow.width / 2 - expectedX)).toBeLessThan(size.width * 0.01);
    expect(Math.abs(glow.y + glow.height / 2 - expectedY)).toBeLessThan(size.height * 0.01);
  });
}
