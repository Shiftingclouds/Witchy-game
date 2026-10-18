import { test, expect } from './fixtures.js';
import { enterMode } from './story-helpers.js';

test('People lists only those you have met', async ({ page }) => {
  await page.goto('/');
  await enterMode(page, 'live');
  await page.getByRole('button', { name: 'People', exact: true }).first().click();
  const grid = page.locator('.people-grid');
  await expect(grid.getByText('Rowan', { exact: true })).toBeVisible();
  await expect(grid.getByText('Fitch', { exact: false })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /Everyone · 47/ })).toHaveCount(0);
});
