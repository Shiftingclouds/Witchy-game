import { test, expect } from '@playwright/test';
import {
  chooseRemainingScenes,
  continueGame,
  decide,
  enterMode,
  leaveScene,
  nextChapter,
  playScene,
  playSection,
  setInGear,
  startOnPage,
} from './story-helpers.js';

test.beforeEach(({ page }) => startOnPage(page));

async function openRegister(page) {
  await page.goto('/');
  await enterMode(page, 'book');
  for (let chapter = 0; chapter < 2; chapter++) {
    await chooseRemainingScenes(page);
    await nextChapter(page, 0);
  }
  await decide(page, 'register:search-method', 0);
}

test('register illustration and its written evidence resume offline in the scene', async ({
  page,
}) => {
  await openRegister(page);
  await playSection(page, 'What the page does not say');
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(dialog.locator('img.scene-painting')).toHaveAttribute(
    'src',
    '/art/register-study.webp',
  );
  await expect(dialog.locator('.portrait-frame')).toHaveCount(0);
  await page.reload();
  await continueGame(page);
  await playScene(page);
  await expect(dialog.locator('.dialogue-text')).toContainText(
    'Dates and payment amounts continue',
  );
  await expect
    .poll(() =>
      dialog.locator('.scene-painting').evaluate((img) => img.complete && img.naturalWidth > 0),
    )
    .toBe(true);
  await page.screenshot({
    path: '/tmp/lanternmere-review/register-desktop.png',
    animations: 'disabled',
  });
  await page.setViewportSize({ width: 1024, height: 700 });
  await setInGear(page, 'Story text size', 'largest');
  await setInGear(page, 'Reading motion', 'reduce');
  expect(
    await dialog.locator('.scene-painting').evaluate((el) => getComputedStyle(el).objectFit),
  ).toBe('contain');
  expect(await page.locator('body').evaluate((el) => el.scrollWidth)).toBe(1024);
  expect(await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
  await page.screenshot({
    path: '/tmp/lanternmere-review/register-mobile.png',
    animations: 'disabled',
  });
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('lanternmere.save.book')),
  );
  expect(saved.bookmark).toEqual({ scene: 'register', beat: 'register-detail' });
  expect(saved.storyChoices['register:search-method']).toBe('dates');
});

test('new portrait expressions decode, keep listener positions, and appear in the register scene', async ({
  page,
}) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await openRegister(page);
  await playSection(page, 'What the page does not say');
  const dialog = page.getByRole('dialog');
  for (let step = 0; step < 3; step++)
    await dialog.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(dialog.getByAltText('Dunne, neutral expression')).toBeVisible();
  const dunne = dialog.locator('.portrait-frame[data-id="dunne"]');
  const before = (await dunne.boundingBox()).x;
  await dialog.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(dialog.getByAltText('Dunne, attentive expression')).toBeVisible();
  await expect(dunne).toHaveClass(/speaking/);
  await expect(dialog.locator('.portrait-frame[data-id="imogen"]')).toHaveClass(/shadowed/);
  expect((await dunne.boundingBox()).x).toBe(before);
  for (let step = 0; step < 6; step++)
    await dialog.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(dialog.getByAltText('Maelin Quill, reflective expression')).toBeVisible();
  await page.waitForFunction(() =>
    [...document.querySelectorAll('.scene-player img')].every(
      (img) => img.complete && img.naturalWidth > 0,
    ),
  );
  await page.screenshot({
    path: '/tmp/lanternmere-review/register-portraits.png',
    animations: 'disabled',
  });
  expect(errors).toEqual([]);
});
