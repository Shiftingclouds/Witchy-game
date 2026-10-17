import { test, expect } from '@playwright/test';
import { enterMode, continueGame } from './story-helpers.js';

test('Enter or Space wakes the title and shows the menu', async ({ page }) => {
  for (const key of ['Enter', 'Space']) {
    await page.goto('/');
    await expect(page.getByText('Press any key')).toBeVisible();
    await page.keyboard.press(key);
    await expect(page.getByRole('button', { name: /The Story/ })).toBeVisible();
  }
});

test('keyboard focus on a menu button shows its vine', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  const focused = page.locator('.vine-button:focus-visible');
  await expect(focused).toHaveCount(1);
  await page.waitForTimeout(1300);
  const opacity = await focused
    .locator('.vine')
    .first()
    .evaluate((el) => Number(getComputedStyle(el).opacity));
  expect(opacity).toBeGreaterThan(0.9);
});

test('a new player creates a character, and Continue later opens that save', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: /^Continue/ })).toHaveCount(0);
  await page.getByRole('button', { name: /The Story/ }).click();
  await page.getByRole('button', { name: /Live the world/ }).click();
  await expect(page.getByRole('heading', { name: 'Who are you?' })).toBeVisible();
  await page.getByLabel('Your name').fill('Wren');
  await page.getByRole('button', { name: /Begin your story/ }).click();
  await expect(page.getByRole('heading', { name: 'Lantern Hall', exact: true })).toBeVisible();
  await page.reload();
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('button', { name: /^Continue.*Wren · Live the world/ }),
  ).toBeVisible();
  await continueGame(page);
  await expect(page.getByRole('heading', { name: 'Lantern Hall', exact: true })).toBeVisible();
});

test('choosing a mode that already has a save continues it and never re-creates', async ({
  page,
}) => {
  await page.goto('/');
  await enterMode(page, 'live', { name: 'Wren' });
  await page.reload();
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: /The Story/ }).click();
  await page.getByRole('button', { name: /Live the world/ }).click();
  await expect(page.getByRole('heading', { name: 'Who are you?' })).toHaveCount(0);
  await expect(page.getByText('Wren', { exact: true }).first()).toBeVisible();
});

test('the menu never covers the lantern at 1024×700', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 700 });
  await page.goto('/');
  await enterMode(page, 'book');
  await page.goto('/');
  await page.keyboard.press('Enter');
  for (const step of [null, 'story']) {
    if (step) await page.getByRole('button', { name: /The Story/ }).click();
    await page.waitForTimeout(1600);
    const menu = await page.locator('.title-menu').boundingBox();
    const scale = Math.max(1024 / 1672, 700 / 941);
    const lanternTop = (700 - 941 * scale) / 2 + 0.58 * 941 * scale;
    expect(menu.y + menu.height).toBeLessThan(lanternTop);
  }
});
