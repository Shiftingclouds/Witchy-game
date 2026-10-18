import { test, expect } from './fixtures.js';
import { enterMode } from './story-helpers.js';

test.use({ viewport: { width: 1440, height: 900 } });

export async function openScene(page) {
  await page.goto('/');
  await enterMode(page, 'book');
  const play = page.getByRole('button', { name: /Play scene/ });
  if (await play.count()) await play.click();
  await page.locator('.scene-player .dialogue-box').waitFor();
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
  await page.addInitScript(() => localStorage.setItem('lanternmere.text-speed', 'instant'));
  await openScene(page);
  for (
    let i = 0;
    i < 300 && !(await page.locator('.scene-choice-panel .scene-decision').count());
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

const overlap = (a, b) =>
  a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;

test('at supper, people step onto the stage at their first line and stay', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('lanternmere.text-speed', 'instant'));
  await openScene(page);
  await expect(page.locator('.portrait-frame[data-id="imogen"]')).toHaveCount(0);
  for (let i = 0; i < 60 && !(await page.locator('.portrait-frame[data-id="imogen"]').count()); i++)
    await finishAndAdvance(page);
  await expect(page.locator('.portrait-frame[data-id="imogen"]')).toBeVisible();
  await expect(page.locator('.portrait-frame[data-id="rowan"]')).toBeVisible();
  await finishAndAdvance(page);
  await expect(page.locator('.portrait-frame[data-id="imogen"]')).toBeVisible();
});

test('a group scene seats every frame on the dialogue box, name plates clear', async ({ page }) => {
  await openScene(page);
  for (let i = 0; i < 80 && (await page.locator('.stage-row .portrait-frame').count()) < 2; i++)
    await finishAndAdvance(page);
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
  await page.locator('.title-menu .vine-button').first().click();
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

test('the gear holds reading settings, and there is no page view', async ({ page }) => {
  await openScene(page);
  await expect(page.locator('.scene-player .reading-controls')).toHaveCount(0);
  await page.getByRole('button', { name: 'Scene settings' }).click();
  await expect(page.locator('.scene-menu .reading-controls')).toBeVisible();
  await expect(page.getByRole('button', { name: /Read as a page/ })).toHaveCount(0);
});

test('Esc leaves the scene for the page, and history lists the lines so far', async ({ page }) => {
  await openScene(page);
  await page.getByRole('button', { name: 'Lines so far' }).click();
  const before = await page.locator('.scene-history li').count();
  await page.getByRole('button', { name: 'Lines so far' }).click();
  await finishAndAdvance(page);
  await page.getByRole('button', { name: 'Lines so far' }).click();
  await expect(page.locator('.scene-history li')).toHaveCount(before + 1);
  await page.getByRole('button', { name: 'Lines so far' }).click();
  await page.keyboard.press('Escape');
  await expect(page.locator('.scene-player')).toHaveCount(0);
  await expect(page.getByRole('button', { name: /Return to the story/ })).toBeVisible();
});

test('no chapter names on the page or in the footer', async ({ page }) => {
  await openScene(page);
  await page.keyboard.press('Escape');
  await expect(page.locator('.story-return')).not.toContainText(/Chapter/);
  await expect(page.locator('.app-footer')).not.toContainText(/Chapter|Arrival/);
});

test('a conversation shows the person in a framed portrait over the place', async ({ page }) => {
  await page.goto('/');
  await enterMode(page, 'live');
  await page.getByRole('button', { name: 'Talk to Rowan', exact: true }).first().click();
  await expect(page.getByRole('dialog').locator('.portrait-frame')).toBeVisible();
});

test('creation asks only your name, then the story begins on the lake with no way out', async ({
  page,
}) => {
  await page.goto('/');
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: /^New game/ }).click();
  await page.getByRole('button', { name: /Read the book/ }).click();
  await expect(page.getByLabel('Your name')).toBeVisible();
  await expect(page.getByLabel('Your house')).toHaveCount(0);
  await expect(page.getByLabel('Your familiar')).toHaveCount(0);
  await page.getByRole('button', { name: /Begin your story/ }).click();
  await expect(page.locator('.scene-player.opening')).toBeVisible();
  await expect(page.locator('.scene-player')).toHaveAttribute('data-section', 'crossing');
  await expect(page.getByRole('button', { name: 'Leave the scene' })).toHaveCount(0);
  await expect(page.locator('.app-shell')).toHaveCount(0);
});

test('choosing a house and a familiar in the story opens the world', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('lanternmere.text-speed', 'instant'));
  await page.goto('/');
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: /^New game/ }).click();
  await page.getByRole('button', { name: /Live the world/ }).click();
  await page.getByRole('button', { name: /Begin your story/ }).click();
  const pick = async (text) => {
    for (let i = 0; i < 300 && !(await page.getByRole('button', { name: text }).count()); i++) {
      // Key presses are not for the story while a place's painting is still fading.
      await page.locator('.arrival-painting').waitFor({ state: 'detached' });
      await page.keyboard.press('Enter');
    }
    await page.getByRole('button', { name: text }).click();
  };
  await pick(/Watch for the academy/);
  await pick(/Find out who needs help looking/);
  await expect(page.locator('.scene-player.opening')).toBeVisible();
  await pick(/young fox/i);
  await expect(page.locator('.app-shell')).toBeVisible();
  const save = await page.evaluate(() => JSON.parse(localStorage.getItem('lanternmere.save.live')));
  expect([save.house, save.familiar]).toEqual(['heronmere', 'fox']);
});

test.describe('arrival paintings', () => {
  test.use({ autoArrive: false });
  test('a new game opens on the lake alone: no box and no people until the first click', async ({
    page,
  }) => {
    await page.goto('/');
    await page.keyboard.press('Enter');
    await page.getByRole('button', { name: /^New game/ }).click();
    await page.getByRole('button', { name: /Read the book/ }).click();
    await page.getByRole('button', { name: /Begin your story/ }).click();
    const painting = page.locator('.arrival-painting');
    await expect(painting).toBeVisible();
    await expect(painting).toContainText('The Mere');
    await expect(page.locator('.portrait-frame')).toHaveCount(0);
    await expect(page.locator('.dialogue-box')).toBeHidden();
    await page.keyboard.press('Enter');
    await expect(painting).toHaveCount(0);
    await expect(page.locator('.dialogue-box')).toBeVisible();
    await expect(page.locator('.portrait-frame')).toHaveCount(0);
  });
});

test.describe('arrival paintings', () => {
  test.use({ autoArrive: false });
  test('travelling on Your day arrives with the place full screen first', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await enterMode(page, 'live');
    await page.getByRole('button', { name: 'World map', exact: true }).first().click();
    await page
      .getByRole('button', { name: /The Library/ })
      .first()
      .click();
    const painting = page.locator('.arrival-painting');
    await expect(painting).toContainText('The Library');
    await page.mouse.click(400, 300);
    await expect(painting).toHaveCount(0, { timeout: 100 });
  });
});

test('on a narrator line nobody is on screen, only the box', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('lanternmere.text-speed', 'instant'));
  await openScene(page);
  let checked = 0;
  for (let i = 0; i < 40 && checked < 3; i++) {
    const speaking = await page.locator('.dialogue-text .revealed-text').innerText();
    if (!speaking.trim().startsWith('“')) {
      await expect(page.locator('.portrait-frame')).toHaveCount(0);
      checked++;
    }
    await finishAndAdvance(page);
  }
  expect(checked).toBe(3);
});
