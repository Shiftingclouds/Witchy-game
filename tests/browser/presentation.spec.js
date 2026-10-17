import { enterMode, continueGame } from './story-helpers.js';
import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 1440, height: 900 } });

async function openScene(page) {
  await page.goto('/');
  await enterMode(page, 'book');
  await page.locator('.scene-player').waitFor();
}
const save = (page) =>
  page.evaluate(() => JSON.parse(localStorage.getItem('lanternmere.save.book')));
async function advance(page, lines) {
  for (let i = 0; i < lines; i++) {
    const before = await page.locator('.dialogue-box').getAttribute('data-line');
    for (let j = 0; j < 3; j++) {
      if ((await page.locator('.dialogue-box').getAttribute('data-line')) !== before) break;
      await page.keyboard.press('Enter');
    }
  }
}

test('one press reveals the line, a second advances, and reading earns no rewards', async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.setItem('lanternmere.text-speed', 'slow'));
  await openScene(page);
  const box = page.locator('.dialogue-box');
  await expect(box).toHaveAttribute('data-revealing', 'true');
  const height = (await box.boundingBox()).height;
  const first = await box.getAttribute('data-line');
  await page.keyboard.press('Enter');
  await expect(box).toHaveAttribute('data-revealing', 'false');
  expect(await box.getAttribute('data-line')).toBe(first);
  expect((await box.boundingBox()).height).toBe(height);
  await page.keyboard.press('Enter');
  await expect(box).not.toHaveAttribute('data-line', first);
  const s = await save(page);
  expect([s.chapter, s.points, s.bonds]).toEqual([0, 0, {}]);
  expect(s.bookmark.beat).toBe(await box.getAttribute('data-line'));
});

test('each speaker shows their authored expression and frames hold their places', async ({
  page,
}) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.addInitScript(() => localStorage.setItem('lanternmere.text-speed', 'instant'));
  await openScene(page);
  await advance(page, 4);
  await expect(page.locator('.stage-row .portrait-frame[data-id="imogen"]')).toHaveClass(
    /speaking/,
  );
  await expect(page.locator('.stage-row .portrait-frame[data-id="rowan"]')).toHaveClass(/shadowed/);
  await expect(page.getByAltText('Imogen, amused expression')).toBeVisible();
  const rowanX = (await page.locator('.portrait-frame[data-id="rowan"]').boundingBox()).x;
  await advance(page, 1);
  await expect(page.locator('.portrait-frame[data-id="rowan"]')).toHaveClass(/speaking/);
  await expect(page.getByAltText('Rowan, laugh expression')).toBeVisible();
  const movedX = (await page.locator('.portrait-frame[data-id="rowan"]').boundingBox()).x;
  expect(Math.abs(movedX - rowanX)).toBeLessThan(16);
  expect(errors).toEqual([]);
});

test('your place and reading speed come back after a reload', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('lanternmere.text-speed', 'instant'));
  await openScene(page);
  await advance(page, 5);
  const at = await page.locator('.dialogue-box').getAttribute('data-line');
  await page.reload();
  await continueGame(page);
  await page.locator('.scene-player').waitFor();
  await expect(page.locator('.dialogue-box')).toHaveAttribute('data-line', at);
  await page.getByRole('button', { name: 'Scene settings' }).click();
  await expect(page.getByLabel('Text reveal speed')).toHaveValue('instant');
  expect((await save(page)).points).toBe(0);
});

test('reduced motion shows whole lines and keeps the frames still', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openScene(page);
  await expect(page.locator('.dialogue-box')).toHaveAttribute('data-revealing', 'false');
  expect(
    await page
      .locator('.portrait-frame')
      .first()
      .evaluate((el) => parseFloat(getComputedStyle(el).transitionDuration)),
  ).toBeLessThan(0.01);
});

test('rapid topic changes keep only the last reply expression', async ({ page }) => {
  await page.goto('/');
  await enterMode(page, 'live');
  await page.getByRole('button', { name: 'Talk to Rowan', exact: true }).first().click();
  await page.getByRole('button', { name: 'Ask about the lanterns' }).click();
  await page.getByRole('button', { name: 'Ask how they’re feeling' }).click();
  await page.getByRole('button', { name: 'Share a little levity' }).click();
  await expect(page.getByAltText('Rowan, laugh expression')).toBeVisible();
  await expect(page.getByRole('dialog').locator('.frame-portrait')).toHaveCount(1);
});
