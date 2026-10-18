import { test, expect } from '@playwright/test';
import { finishOpening } from './story-helpers.js';

// The desktop preload exposes window.lanternmere.ai; in the browser a test can provide a stand-in.
const withBridge = (page) =>
  page.addInitScript(() => {
    window.lanternmere = {
      ai: {
        status: async () => ({ available: true, version: 'test' }),
        request: async () => ({ ok: false, error: 'failed' }),
        cancel: async () => {},
      },
    };
  });

test('the AI modes join the menu when Claude is available', async ({ page }) => {
  await withBridge(page);
  await page.goto('/');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: /The Guided Tale/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /The Open World/ })).toBeVisible();
});

test('without the desktop app the AI modes explain where they live', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: /The Open World/ })).toHaveCount(0);
  await expect(page.getByText('AI modes run in the desktop app')).toBeVisible();
});

test('starting the Open World asks how time should pass and remembers it', async ({ page }) => {
  await withBridge(page);
  await page.goto('/');
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: /The Open World/ }).click();
  await expect(page.getByRole('heading', { name: 'Who are you?' })).toBeVisible();
  await page.getByRole('radio', { name: /Timed/ }).click();
  await page.getByRole('button', { name: /Begin your story/ }).click();
  await finishOpening(page);
  const save = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('lanternmere.save.sandbox')),
  );
  expect(save.mode).toBe('sandbox');
  expect(save.ai.timeMode).toBe('timed');
  await page.reload();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: /^Continue.*The Open World/ })).toBeVisible();
});

test('starting the Guided Tale goes straight to creating a character', async ({ page }) => {
  await withBridge(page);
  await page.goto('/');
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: /The Guided Tale/ }).click();
  await expect(page.getByRole('radio')).toHaveCount(0);
  await page.getByRole('button', { name: /Begin your story/ }).click();
  await finishOpening(page);
  expect(
    await page.evaluate(() => JSON.parse(localStorage.getItem('lanternmere.save.guided')).mode),
  ).toBe('guided');
});
