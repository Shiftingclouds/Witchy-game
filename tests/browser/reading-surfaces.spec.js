import { test, expect } from './fixtures.js';
import { enterMode, leaveScene, playScene, playSection, startOnPage } from './story-helpers.js';
import { tokens } from '../../src/theme/tokens.mjs';

test.beforeEach(({ page }) => startOnPage(page));

const hexRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

const luminance = ([r, g, b]) => {
  const c = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * c(r) + 0.7152 * c(g) + 0.0722 * c(b);
};
const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
// Computed colours arrive as rgb()/rgba() or, for relative colours, color(srgb r g b / a) in 0–1.
const rgb = (css) => {
  const n = css
    .match(/[\d.]+/g)
    .slice(0, 4)
    .map(Number);
  if (!css.startsWith('color(srgb')) return n;
  return [...n.slice(0, 3).map((v) => Math.round(v * 255)), ...n.slice(3)];
};

for (const mode of ['lamplight', 'parchment', 'night']) {
  test(`book and scene reader are comfortable to read in ${mode}`, async ({ page }) => {
    await page.addInitScript((m) => localStorage.setItem('lanternmere.reading-mode', m), mode);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await enterMode(page, 'book');
    await playSection(page, 'A place at the table');
    const box = page.locator('.dialogue-box');
    await expect(box).toBeVisible();
    const [fg, bg] = await box.evaluate((el) => [
      getComputedStyle(el.querySelector('.dialogue-text')).color,
      getComputedStyle(el).backgroundColor,
    ]);
    const background = rgb(bg);
    expect(background[3] ?? 1).toBeGreaterThan(0.9);
    expect(background.slice(0, 3)).toEqual(hexRgb(tokens[mode].backing));
    expect(ratio(rgb(fg), background)).toBeGreaterThanOrEqual(4.5);
  });
}
