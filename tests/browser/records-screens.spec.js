import { test, expect } from '@playwright/test';
import { enterMode } from './story-helpers.js';

test.use({ viewport: { width: 1440, height: 900 } });

test('records, settings and the art collection all sit in the reading mode', async ({ page }) => {
  await page.goto('/');
  await enterMode(page, 'live');
  const bodyBg = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  const tokenBg = await page.evaluate(() => {
    const probe = document.createElement('div');
    probe.style.background = 'var(--lm-bg)';
    document.body.append(probe);
    const value = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return value;
  });
  for (const label of ['Grimoire', 'Calendar', 'Journal']) {
    await page.getByRole('button', { name: label, exact: true }).click();
    expect(await bodyBg()).toBe(tokenBg);
  }
  await page.getByRole('button', { name: 'Settings & saves' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  expect(await dialog.evaluate((el) => getComputedStyle(el).borderTopLeftRadius)).toBe('1px');
  await expect(dialog.getByRole('button', { name: 'Import save' })).toBeVisible();
  await page.getByRole('button', { name: 'Browse the art collection' }).click();
  await page.getByRole('button', { name: /^Art needed · \d+/ }).click();
  await expect(page.getByText('ART NEEDED · c49-vesper-sen-neutral.png')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('dates to look forward to are all still ahead of today', async ({ page }) => {
  await page.goto('/');
  await enterMode(page, 'live');
  await page.getByRole('button', { name: 'Calendar', exact: true }).first().click();
  const first = page.locator('.festival-list > div').first();
  await expect(first).toBeVisible();
  await expect(first.locator('strong')).not.toHaveText('1');
});
