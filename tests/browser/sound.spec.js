import { test, expect } from './fixtures.js';

const scape = (page) => page.locator('.soundscape').first();

test('the title screen has the lake under it', async ({ page }) => {
  await page.goto('/');
  await expect(scape(page)).toHaveAttribute('data-ambience', 'ambience/amb-lake');
});

test('the boat crossing plays its own music over the water', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: /^New game/ }).click();
  await page.getByRole('button', { name: /Read the book/ }).click();
  await page.getByRole('button', { name: /Begin your story/ }).click();
  await expect(page.locator('.scene-player')).toHaveAttribute('data-section', 'crossing');
  await expect(scape(page)).toHaveAttribute('data-music', 'music/moment-the-crossing');
  await expect(scape(page)).toHaveAttribute('data-ambience', 'ambience/amb-lake');
});

test('music can be turned off, and stays off', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await page.getByLabel('Music volume').selectOption('off');
  await expect(scape(page)).toHaveAttribute('data-music-volume', 'off');
  await page.reload();
  await expect(scape(page)).toHaveAttribute('data-music-volume', 'off');
});
