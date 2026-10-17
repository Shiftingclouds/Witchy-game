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
  for (
    let i = 0;
    i < 120 && !(await page.locator('.scene-choice-panel .scene-decision').count());
    i++
  )
    await page.keyboard.press('Enter');
  await expect(page.locator('.scene-choice-panel .scene-decision')).toBeVisible();
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
  for (
    let i = 0;
    i < 20 && !(await page.locator('.dialogue-box .name-plate, .stage-row .speaking').count());
    i++
  )
    await finishAndAdvance(page);
  await expect(page.locator('.dialogue-text')).toContainText('“');
});

async function toSpeaker(page, name) {
  for (let i = 0; i < 40; i++) {
    if (
      (
        await page
          .locator('.dialogue-box .name-plate, .stage-row .speaking .name-plate')
          .allInnerTexts()
      ).some((t) => t.includes(name))
    )
      return;
    await finishAndAdvance(page);
  }
  throw new Error('never reached ' + name);
}
const overlap = (a, b) =>
  a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;

test('Imogen is on stage at supper from its very first line', async ({ page }) => {
  await openScene(page);
  await expect(page.locator('.portrait-frame[data-id="imogen"]')).toBeVisible();
  await expect(page.locator('.portrait-frame[data-id="rowan"]')).toBeVisible();
});

test('a group scene seats every frame on the dialogue box, name plates clear', async ({ page }) => {
  await openScene(page);
  await toSpeaker(page, 'Rowan');
  const box = await page.locator('.dialogue-box').boundingBox();
  const frames = page.locator('.stage-row .portrait-frame');
  expect(await frames.count()).toBeGreaterThanOrEqual(2);
  for (const f of await frames.all()) {
    const b = await f.locator('.frame-window').boundingBox();
    expect(Math.abs(b.y + b.height - box.y)).toBeLessThanOrEqual(40);
  }
  const plates = await page.locator('.stage-row .name-plate').all();
  for (const p of plates) {
    const pb = await p.boundingBox();
    for (const f of await frames.all())
      expect(overlap(pb, await f.locator('.frame-window').boundingBox())).toBe(false);
  }
  await expect(page.locator('.stage-row .speaking')).toHaveCount(1);
});

test('at 1024×700 the stage and the box fit inside the window', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 700 });
  await openScene(page);
  for (const el of await page.locator('.portrait-frame, .dialogue-box').all()) {
    const b = await el.boundingBox();
    expect(b.y).toBeGreaterThanOrEqual(0);
    expect(b.y + b.height).toBeLessThanOrEqual(700);
    expect(b.x + b.width).toBeLessThanOrEqual(1024);
  }
  const text = await page.locator('.dialogue-text').boundingBox();
  for (const f of await page.locator('.stage-row .frame-window').all())
    expect(overlap(text, await f.boundingBox())).toBe(false);
});

test('narration-only scenes show no frames and a full-width box', async ({ page }) => {
  const { initialState } = await import('../../src/engine.mjs');
  const g = { ...initialState('book', 'Avery', 'owlcombe', 'cat'), chapter: 7 };
  await page.addInitScript((save) => {
    localStorage.setItem('lanternmere.save.book', save);
    localStorage.setItem('lanternmere.last-mode', 'book');
  }, JSON.stringify(g));
  await page.goto('/');
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: /^Continue/ }).click();
  const play = page.getByRole('button', { name: /Play scene/ });
  if (await play.count()) await play.click();
  await page.locator('.scene-player').waitFor();
  await expect(page.locator('.portrait-frame')).toHaveCount(0);
  await expect(page.locator('.dialogue-box.framed')).toHaveCount(0);
});

test('the story opens as a full-screen scene by default', async ({ page }) => {
  await page.goto('/');
  await enterMode(page, 'book');
  await expect(page.locator('.scene-player')).toBeVisible();
  await expect(page.getByRole('button', { name: /Play scene/ })).toHaveCount(0);
});

test('the gear switches to reading as a page, and that choice is remembered', async ({ page }) => {
  await openScene(page);
  await expect(page.locator('.scene-player .reading-controls')).toHaveCount(0);
  await page.getByRole('button', { name: 'Scene settings' }).click();
  await expect(page.locator('.scene-menu .reading-controls')).toBeVisible();
  await page.getByRole('button', { name: 'Read as a page' }).click();
  await expect(page.locator('.scene-player')).toHaveCount(0);
  await expect(page.locator('.book-page')).toBeVisible();
  await page.reload();
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: /^Continue/ }).click();
  await expect(page.locator('.book-page')).toBeVisible();
  await expect(page.locator('.scene-player')).toHaveCount(0);
});

test('Esc leaves the scene for the page, and history lists the lines so far', async ({ page }) => {
  await openScene(page);
  await finishAndAdvance(page);
  await page.getByRole('button', { name: 'Lines so far' }).click();
  await expect(page.locator('.scene-history li')).toHaveCount(2);
  await page.getByRole('button', { name: 'Lines so far' }).click();
  await page.keyboard.press('Escape');
  await expect(page.locator('.scene-player')).toHaveCount(0);
  await expect(page.getByRole('button', { name: /Return to the scene/ })).toBeVisible();
});

test('no chapter names on the page or in the footer', async ({ page }) => {
  await openScene(page);
  await page.keyboard.press('Escape');
  await expect(page.locator('.book-layout')).not.toContainText(/Chapter/);
  await expect(page.locator('.app-footer')).not.toContainText(/Chapter|Arrival/);
  await expect(page.locator('.page-heading')).not.toContainText(/Chapter/);
});

test('a conversation shows the person in a framed portrait over the place', async ({ page }) => {
  await page.goto('/');
  await enterMode(page, 'live');
  await page.getByRole('button', { name: 'Talk to Rowan', exact: true }).first().click();
  await expect(page.getByRole('dialog').locator('.portrait-frame')).toBeVisible();
});
