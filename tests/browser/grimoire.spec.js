import { test, expect } from './fixtures.js';
import { enterMode } from './story-helpers.js';

test('the Grimoire holds only spells you have learned in class', async ({ page }) => {
  await page.goto('/');
  await enterMode(page, 'live');
  await page.getByRole('button', { name: 'Grimoire', exact: true }).first().click();
  await expect(page.locator('.spell-card')).toHaveCount(0);
  await expect(page.getByText(/learned in class/i).first()).toBeVisible();
});
