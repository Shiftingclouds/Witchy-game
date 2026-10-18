import { test, expect } from './fixtures.js';
import { enterMode, continueGame } from './story-helpers.js';

const mainWidth = (page) =>
  page.locator('.main-content').evaluate((el) => el.getBoundingClientRect().width);

test('the sidebar collapses to a rail, hides, comes back with Ctrl+B and is remembered', async ({
  page,
}) => {
  await page.goto('/');
  await enterMode(page, 'live');
  const shell = page.locator('.app-shell');
  await expect(shell).toHaveAttribute('data-sidebar', 'open');
  const openWidth = await mainWidth(page);

  await page.getByRole('button', { name: 'Collapse sidebar' }).click();
  await expect(shell).toHaveAttribute('data-sidebar', 'rail');
  await page.waitForTimeout(400);
  expect(await mainWidth(page)).toBeGreaterThan(openWidth + 100);
  await page.getByRole('button', { name: 'Journal', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Personal journal notes' })).toBeVisible();

  await page.getByRole('button', { name: 'Hide sidebar' }).click();
  await expect(shell).toHaveAttribute('data-sidebar', 'hidden');
  await page.waitForTimeout(400);
  expect(await mainWidth(page)).toBeGreaterThan(1440 - 120);

  await page.keyboard.press('Control+b');
  await expect(shell).toHaveAttribute('data-sidebar', 'rail');
  await page.keyboard.press('Control+b');
  await expect(shell).toHaveAttribute('data-sidebar', 'hidden');
  await page.getByRole('button', { name: 'Show sidebar' }).click();
  await expect(shell).toHaveAttribute('data-sidebar', 'rail');

  await page.reload();
  await continueGame(page);
  await expect(page.locator('.app-shell')).toHaveAttribute('data-sidebar', 'rail');
});

test('Ctrl+B is ignored while typing in the journal', async ({ page }) => {
  await page.goto('/');
  await enterMode(page, 'live');
  await page.getByRole('button', { name: 'Journal', exact: true }).click();
  await page.getByRole('textbox', { name: 'Personal journal notes' }).focus();
  await page.keyboard.press('Control+b');
  await expect(page.locator('.app-shell')).toHaveAttribute('data-sidebar', 'open');
});

test('the sidebar has no player badge', async ({ page }) => {
  await page.goto('/');
  await enterMode(page, 'live');
  await expect(page.locator('.player-card')).toHaveCount(0);
});
