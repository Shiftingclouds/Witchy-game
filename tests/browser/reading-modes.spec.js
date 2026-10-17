import { test, expect } from '@playwright/test';
import { enterMode, continueGame } from './story-helpers.js';

test('reading mode changes the whole page and survives reload', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-reading-mode', 'lamplight');
  await enterMode(page, 'live');
  await page.getByRole('button', { name: 'Settings & saves' }).click();
  const before = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  await page.getByLabel('Reading mode').selectOption('parchment');
  await expect(page.locator('html')).toHaveAttribute('data-reading-mode', 'parchment');
  const after = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(after).not.toBe(before);
  expect(after).toBe('rgb(241, 230, 207)');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-reading-mode', 'parchment');
});
