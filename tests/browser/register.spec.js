import { test, expect } from '@playwright/test';
import { chooseRemainingScenes } from './story-helpers.js';

async function openRegister(page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Read the book', exact: false }).click();
  for (let chapter = 0; chapter < 2; chapter++) {
    await chooseRemainingScenes(page);
    await page.locator('.story-choices button').first().click();
  }
  await expect(page.locator('[data-choice="register:search-method"]')).toBeVisible();
  await page.locator('[data-choice="register:search-method"] button').first().click();
}

test('register illustration and its written evidence resume offline in both readers on a narrow phone', async ({
  page,
}) => {
  await openRegister(page);
  const bookArt = page.locator('.story-illustration img');
  await bookArt.scrollIntoViewIfNeeded();
  await expect(bookArt).toBeVisible();
  await expect
    .poll(() => bookArt.evaluate((img) => img.complete && img.naturalWidth > 0))
    .toBe(true);
  await expect(page.locator('[data-story-beat="register-detail"]')).toContainText(
    'This page shows omissions.',
  );
  await page
    .getByRole('navigation', { name: 'Chapter sections' })
    .getByRole('button', { name: 'What the page does not say', exact: true })
    .click();
  await page.getByRole('button', { name: 'Play scene', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Text reveal speed').selectOption('instant');
  await dialog.getByRole('button', { name: 'Next line', exact: true }).click();
  await expect(dialog.locator('.performance-detail img.performance-background')).toHaveAttribute(
    'src',
    '/art/register-study.webp',
  );
  await expect(dialog.locator('.stage-actor.present')).toHaveCount(0);
  await page.reload();
  await page.getByRole('button', { name: 'Continue your story' }).click();
  await page.getByRole('button', { name: 'Play scene', exact: true }).click();
  await expect(dialog.locator('.speech-text')).toContainText('Dates and payment amounts continue');
  await expect
    .poll(() =>
      dialog
        .locator('.performance-background')
        .evaluate((img) => img.complete && img.naturalWidth > 0),
    )
    .toBe(true);
  await page.screenshot({
    path: '/tmp/lanternmere-review/register-desktop.png',
    animations: 'disabled',
  });
  await page.setViewportSize({ width: 320, height: 740 });
  await dialog.getByLabel('Story text size').selectOption('largest');
  await dialog.getByLabel('Reading motion').selectOption('reduce');
  await dialog.locator('.scene-reader').evaluate((el) => el.scrollTo(0, 0));
  expect(
    await dialog
      .locator('.performance-background')
      .evaluate((el) => getComputedStyle(el).objectFit),
  ).toBe('contain');
  expect(await page.locator('body').evaluate((el) => el.scrollWidth)).toBe(320);
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
  await page
    .getByRole('navigation', { name: 'Chapter sections' })
    .getByRole('button', { name: 'What the page does not say', exact: true })
    .click();
  await page.getByRole('button', { name: 'Play scene', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Text reveal speed').selectOption('instant');
  for (let step = 0; step < 3; step++)
    await dialog.getByRole('button', { name: 'Next line', exact: true }).click();
  await expect(dialog.getByAltText('Dunne, neutral expression')).toBeVisible();
  const dunne = dialog.locator('[data-character="dunne"].present');
  const before = (await dunne.boundingBox()).x;
  await dialog.getByRole('button', { name: 'Next line', exact: true }).click();
  await expect(dialog.getByAltText('Dunne, attentive expression')).toBeVisible();
  await expect(dunne).toHaveClass(/speaking/);
  await expect(dialog.locator('[data-character="imogen"].present')).toHaveClass(/listening/);
  expect((await dunne.boundingBox()).x).toBe(before);
  for (let step = 0; step < 6; step++)
    await dialog.getByRole('button', { name: 'Next line', exact: true }).click();
  await expect(dialog.getByAltText('Maelin Quill, reflective expression')).toBeVisible();
  await page.waitForFunction(() =>
    [...document.querySelectorAll('.performance-scene img')].every(
      (img) => img.complete && img.naturalWidth > 0,
    ),
  );
  await page.screenshot({
    path: '/tmp/lanternmere-review/register-portraits.png',
    animations: 'disabled',
  });
  expect(errors).toEqual([]);
});
