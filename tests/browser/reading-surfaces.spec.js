import { test, expect } from '@playwright/test';
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
    const paragraph = page.locator('.authored-chapter p').first();
    await expect(paragraph).toBeVisible();
    const { family, width, probe } = await paragraph.evaluate((p) => {
      const s = document.createElement('span');
      s.style.cssText = `font:${getComputedStyle(p).font};white-space:nowrap;position:absolute;visibility:hidden`;
      s.textContent =
        'Your name is written on the handle of a small brass lantern. You turn it ove';
      document.body.append(s);
      const probeWidth = s.getBoundingClientRect().width;
      s.remove();
      return {
        family: getComputedStyle(p).fontFamily,
        width: p.getBoundingClientRect().width,
        probe: probeWidth,
      };
    });
    expect(family).toMatch(/^"?EB Garamond/);
    const pageBg = await page
      .locator('.book-page')
      .evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(rgb(pageBg).slice(0, 3)).toEqual(hexRgb(tokens[mode].backing));
    expect(width).toBeLessThanOrEqual(probe * 1.05);

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

test('in the book, what people say is set in quotation marks', async ({ page }) => {
  await page.goto('/');
  await enterMode(page, 'book');
  const line = page.locator('.authored-dialogue').first();
  await expect(line).toContainText('“');
  await expect(line).toContainText('”');
});
