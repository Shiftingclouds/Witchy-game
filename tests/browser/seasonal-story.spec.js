import { test, expect } from '@playwright/test';
import { reachBookChapter, playSection } from './story-helpers.js';

test('Emberfall uses night scenery and new portraits, then resumes its petal comparison offline', async ({
  page,
  context,
}) => {
  await reachBookChapter(page, 3, 1);
  await page.locator('[data-choice="emberfall:work-plan"] button').nth(1).click();
  await expect(page.locator('[data-story-beat="shared-handover"]')).toBeVisible();
  await expect(page.locator('[data-story-beat="simple-handover"]')).toHaveCount(0);
  await playSection(page, 'The flowers keep their own hour');
  const dialog = page.getByRole('dialog');
  await expect(dialog.locator('.performance-background')).toHaveAttribute(
    'src',
    '/art/glasshouses-night.webp',
  );
  await dialog.getByRole('button', { name: 'Next line', exact: true }).click();
  await expect(dialog.getByAltText('Rhys, warm expression')).toBeVisible();
  await dialog.getByRole('button', { name: 'Next line', exact: true }).click();
  await expect(dialog.getByAltText('Saoirse, attentive expression')).toBeVisible();
  await page.waitForFunction(() =>
    [...document.querySelectorAll('.performance-scene img')].every(
      (img) => img.complete && img.naturalWidth > 0,
    ),
  );
  await expect(page.locator('.toast')).toHaveCount(0, { timeout: 8000 });
  await page.screenshot({
    path: '/tmp/lanternmere-review/emberfall-cast.png',
    animations: 'disabled',
  });
  for (let step = 0; step < 4; step++)
    await dialog.getByRole('button', { name: 'Next line', exact: true }).click();
  await expect(dialog.locator('.performance-background')).toHaveAttribute(
    'src',
    '/art/moonflower-study.webp',
  );
  await expect(dialog.locator('.speech-text')).toContainText('Two fallen petals lie');
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await context.setOffline(true);
  await page.reload();
  await page.getByRole('button', { name: 'Continue your story' }).click();
  await page.getByRole('button', { name: 'Play scene', exact: true }).click();
  await expect(dialog.locator('.speech-text')).toContainText('Two fallen petals lie');
  await expect
    .poll(() =>
      dialog
        .locator('.performance-background')
        .evaluate((img) => img.complete && img.naturalWidth > 0),
    )
    .toBe(true);
  await page.screenshot({
    path: '/tmp/lanternmere-review/emberfall-evidence.png',
    animations: 'disabled',
  });
  await page.setViewportSize({ width: 320, height: 740 });
  await dialog.getByLabel('Story text size').selectOption('largest');
  await dialog.getByLabel('Reading motion').selectOption('reduce');
  await dialog.locator('.scene-reader').evaluate((el) => el.scrollTo(0, 0));
  expect(await page.locator('body').evaluate((el) => el.scrollWidth)).toBe(320);
  await page.screenshot({
    path: '/tmp/lanternmere-review/emberfall-mobile.png',
    animations: 'disabled',
  });
  await dialog.getByRole('button', { name: 'Next line', exact: true }).click();
  await dialog
    .getByRole('button', { name: 'Exchange the saucers, then shade the lamp.', exact: false })
    .click();
  await expect(dialog.locator('.speech-text')).toContainText('You exchange the saucers');
  const save = await page.evaluate(() => JSON.parse(localStorage.getItem('lanternmere.save.book')));
  expect(save.storyChoices['emberfall:observation']).toBe('exchange');
  expect(save.characterMemories.rhys.map((memory) => memory.key)).toContain(
    'scene:emberfall:observation:exchange',
  );
  await context.setOffline(false);
});
