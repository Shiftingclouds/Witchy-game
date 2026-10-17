import { test, expect } from '@playwright/test';
import { enterMode } from './story-helpers.js';

test.use({ viewport: { width: 1440, height: 900 } });

export async function openScene(page) {
  await page.goto('/');
  await enterMode(page, 'book');
  const play = page.getByRole('button', { name: /Play scene/ });
  if (await play.count()) await play.click();
  await page.locator('.scene-player').waitFor();
}
const lineId = (page) => page.locator('.dialogue-box').getAttribute('data-line');
async function finishAndAdvance(page) {
  const before = await lineId(page);
  for (let i = 0; i < 3 && (await lineId(page)) === before; i++) await page.keyboard.press('Enter');
}

test('Next stays put from line to line', async ({ page }) => {
  await openScene(page);
  const boxes = [];
  for (let i = 0; i < 4; i++) {
    boxes.push(await page.locator('.scene-next').boundingBox());
    await finishAndAdvance(page);
  }
  for (const b of boxes) expect([b.x, b.y]).toEqual([boxes[0].x, boxes[0].y]);
});

test('the first press finishes a line, the second moves on, and no line is ever blank', async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.setItem('lanternmere.text-speed', 'slow'));
  await openScene(page);
  const first = await lineId(page);
  await page.keyboard.press('Enter');
  await expect(page.locator('.dialogue-box')).toHaveAttribute('data-revealing', 'false');
  expect(await lineId(page)).toBe(first);
  await page.keyboard.press('Enter');
  await expect.poll(() => lineId(page)).not.toBe(first);
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press('Enter');
    expect(
      (await page.locator('.dialogue-text .revealed-text').innerText()).trim().length,
    ).toBeGreaterThan(0);
  }
});

test('mashing Enter never skips past a decision', async ({ page }) => {
  await openScene(page);
  for (let i = 0; i < 120 && !(await page.locator('.dialogue-box .scene-decision').count()); i++)
    await page.keyboard.press('Enter');
  await expect(page.locator('.dialogue-box .scene-decision')).toBeVisible();
  const at = await lineId(page);
  for (let i = 0; i < 6; i++) await page.keyboard.press('Enter');
  expect(await lineId(page)).toBe(at);
});

test('the scene shows no meta labels', async ({ page }) => {
  await openScene(page);
  for (let i = 0; i < 6; i++) {
    for (const t of [/Your story/, /Line \d+/, /speaking/i, /listening/i, /Chapter/])
      await expect(page.locator('.scene-player')).not.toContainText(t);
    await finishAndAdvance(page);
  }
});

test('speech in the dialogue box is set in quotation marks', async ({ page }) => {
  await openScene(page);
  for (let i = 0; i < 20 && !(await page.locator('.dialogue-box .name-plate').count()); i++)
    await finishAndAdvance(page);
  await expect(page.locator('.dialogue-text')).toContainText('“');
});
