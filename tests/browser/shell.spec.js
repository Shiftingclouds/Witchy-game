import { test, expect } from './fixtures.js';
import { enterMode } from './story-helpers.js';

test('the grimoire: ribbons open each section and mark the open one', async ({ page }) => {
  await page.goto('/');
  await enterMode(page, 'live');
  const ribbons = page.getByRole('navigation', { name: 'Main navigation' });
  await expect(ribbons.getByRole('button', { name: 'Your day' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await expect(page.locator('.gm-today .scene')).toBeVisible();
  await ribbons.getByRole('button', { name: 'Journal' }).click();
  await expect(page.getByRole('textbox', { name: 'Personal journal notes' })).toBeVisible();
  await expect(ribbons.getByRole('button', { name: 'Journal' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await page.getByRole('button', { name: 'Settings & saves' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Main menu', exact: true }).click();
  await expect(page.getByText('Press any key')).toBeVisible();
});

test('the familiar keeps you company on the desk', async ({ page }) => {
  await page.goto('/');
  await enterMode(page, 'live');
  await expect(page.locator('.gm-familiar')).toHaveAttribute('alt', 'Your cat familiar');
});

test('at the smallest window the book fits without scrolling sideways', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 700 });
  await page.goto('/');
  await enterMode(page, 'live');
  await expect(page.locator('body')).toHaveJSProperty('scrollWidth', 1024);
  const book = await page.locator('.gm-pages').boundingBox();
  expect(book.y + book.height).toBeLessThanOrEqual(700);
  const ribbon = await page.getByRole('button', { name: 'Journal', exact: true }).boundingBox();
  expect(ribbon.x + ribbon.width).toBeLessThanOrEqual(1024);
});

test('less motion: no drifting motes on the desk', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('lanternmere.motion', 'reduce'));
  await page.goto('/');
  await enterMode(page, 'live');
  await expect(page.locator('.gm-motes')).toHaveCount(0);
});

test('the shell has no player badge', async ({ page }) => {
  await page.goto('/');
  await enterMode(page, 'live');
  await expect(page.locator('.player-card')).toHaveCount(0);
});
