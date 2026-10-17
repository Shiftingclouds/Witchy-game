import { chooseRemainingScenes, enterMode, continueGame } from './story-helpers.js';
import { test, expect } from '@playwright/test';

async function openScene(page) {
  await page.goto('/');
  await enterMode(page, 'book');
  await page.getByRole('button', { name: 'Play scene', exact: true }).click();
}

test('one keyboard action reveals the line; a second advances without choosing or earning rewards', async ({
  page,
}) => {
  await openScene(page);
  await page.getByRole('dialog').getByLabel('Text reveal speed').selectOption('slow');
  const box = page.locator('.speech-box');
  await expect(box).toHaveAttribute('data-beat', '0');
  await expect(box).toHaveAttribute('data-revealing', 'true');
  const height = (await box.boundingBox()).height;
  await page.locator('.speech-text').focus();
  await page.keyboard.press('Enter');
  await expect(box).toHaveAttribute('data-revealing', 'false');
  await expect(box).toHaveAttribute('data-beat', '0');
  expect((await box.boundingBox()).height).toBeCloseTo(height, 2);
  await page.keyboard.press('Enter');
  await expect(box).toHaveAttribute('data-beat', '1');
  const save = await page.evaluate(() => JSON.parse(localStorage.getItem('lanternmere.save.book')));
  expect(save.chapter).toBe(0);
  expect(save.points).toBe(0);
  expect(save.bonds).toEqual({});
  expect(save.bookmark.beat).toBe('unclaimed-seat');
});

test('authored speaker turns retain the listener and use the correct expressions', async ({
  page,
}) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await openScene(page);
  await page.getByRole('dialog').getByLabel('Text reveal speed').selectOption('instant');
  for (let i = 0; i < 4; i++)
    await page.getByRole('button', { name: 'Next line', exact: true }).click();
  await expect(page.locator('.stage-actor.present')).toHaveCount(2);
  await expect(page.locator('[data-character=imogen]')).toHaveClass(/speaking/);
  await expect(page.locator('[data-character=rowan]')).toHaveClass(/listening/);
  await expect(page.getByAltText('Imogen, amused expression')).toBeVisible();
  const rowanX = (await page.locator('[data-character=rowan]').boundingBox()).x;
  const fade = page.evaluate(
    () =>
      new Promise((resolve) => {
        const listener = (event) => {
          if (event.target.classList.contains('expression-current')) {
            document.removeEventListener('animationstart', listener);
            resolve(event.animationName);
          }
        };
        document.addEventListener('animationstart', listener);
      }),
  );
  await page.getByRole('button', { name: 'Next line', exact: true }).click();
  expect(await fade).toBe('expression-dissolve');
  await expect(page.locator('[data-character=rowan]')).toHaveClass(/speaking/);
  await expect(page.locator('[data-character=imogen]')).toHaveClass(/listening/);
  expect((await page.locator('[data-character=rowan]').boundingBox()).x).toBe(rowanX);
  await expect(page.getByAltText('Rowan, laugh expression')).toBeVisible();
  await expect(page.locator('.expression-previous')).toHaveCount(0);
  await page.getByText('Read the conversation so far', { exact: true }).click();
  await expect(page.locator('.scene-transcript li')).toHaveCount(6);
  expect(errors).toEqual([]);
});

test('scene bookmarks and reading preference reload offline with the same line available', async ({
  page,
}) => {
  await openScene(page);
  await page.getByRole('dialog').getByLabel('Text reveal speed').selectOption('instant');
  for (let i = 0; i < 5; i++)
    await page.getByRole('button', { name: 'Next line', exact: true }).click();
  await page.reload();
  await continueGame(page);
  await page.getByRole('button', { name: 'Play scene', exact: true }).click();
  await expect(page.locator('.speech-box')).toHaveAttribute('data-beat', '5');
  await expect(page.locator('.speech-box')).toHaveAttribute('data-revealing', 'false');
  await expect(page.getByRole('dialog').getByLabel('Text reveal speed')).toHaveValue('instant');
  await expect(page.getByAltText('Rowan, laugh expression')).toBeVisible();
  await page.waitForFunction(() =>
    [...document.querySelectorAll('.performance-scene img')].every(
      (img) => img.complete && img.naturalWidth > 0,
    ),
  );
  await page.getByRole('button', { name: 'Close dialog' }).click();
  expect(
    await page.evaluate(() => JSON.parse(localStorage.getItem('lanternmere.save.book')).points),
  ).toBe(0);
});

test('reduced motion shows full text and disables ambient and portrait animation', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openScene(page);
  await expect(page.locator('.speech-box')).toHaveAttribute('data-revealing', 'false');
  await expect(
    page.getByRole('dialog').getByText('Reduced motion: text appears immediately.'),
  ).toBeVisible();
  expect(
    await page.locator('.scene-light').evaluate((el) => getComputedStyle(el).animationName),
  ).toBe('none');
  await page.getByRole('button', { name: 'Next line', exact: true }).click();
  await page.getByRole('button', { name: 'Next line', exact: true }).click();
  expect(
    await page.locator('.stage-actor').evaluate((el) => getComputedStyle(el).animationName),
  ).toBe('none');
});

test('two-person scene remains readable and operable on narrow phones', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await openScene(page);
  await page.getByRole('dialog').getByLabel('Text reveal speed').selectOption('instant');
  for (let i = 0; i < 4; i++)
    await page.getByRole('button', { name: 'Next line', exact: true }).click();
  await expect(page.locator('.stage-actor.present')).toHaveCount(2);
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await page.locator('body').evaluate((el) => el.scrollWidth)).toBe(width);
    expect(await page.getByRole('dialog').evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(
      true,
    );
    await page.getByRole('button', { name: 'Next line', exact: true }).click();
  }
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await chooseRemainingScenes(page);
  await page.locator('.story-choices button').first().click();
  expect(
    await page.evaluate(() => JSON.parse(localStorage.getItem('lanternmere.save.book')).chapter),
  ).toBe(1);
});

test('rapid topic changes keep the last reply expression without accumulating portrait layers', async ({
  page,
}) => {
  await page.goto('/');
  await enterMode(page, 'live');
  await page.getByRole('button', { name: 'Talk to Rowan', exact: true }).first().click();
  await page.getByRole('button', { name: 'Ask about the lanterns' }).click();
  await page.getByRole('button', { name: 'Ask how they’re feeling' }).click();
  await page.getByRole('button', { name: 'Share a little levity' }).click();
  await expect(page.getByAltText('Rowan, laugh expression')).toBeVisible();
  await expect(page.locator('.expression-previous')).toHaveCount(0);
  await expect(page.locator('.expression-current')).toHaveCount(1);
});
