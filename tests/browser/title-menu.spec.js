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

test('restoring a save is a real button the keyboard can reach', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Enter');
  const restore = page.getByRole('button', { name: 'Restore a save' });
  await expect(restore).toBeVisible();
  for (let i = 0; i < 6 && !(await restore.evaluate((el) => el === document.activeElement)); i++)
    await page.keyboard.press('Tab');
  await expect(restore).toBeFocused();
});

test('in-app reduce motion stills the whole title screen', async ({ page }) => {
  const { motion } = await import('./pixels.js');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addInitScript(() => localStorage.setItem('lanternmere.motion', 'reduce'));
  await page.goto('/');
  await page.waitForTimeout(1500);
  expect(await motion(page, [0, 0, 1, 1], 3000)).toBeLessThan(0.1);
});

test('the focus outline on the opening stays bright in Parchment', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('lanternmere.reading-mode', 'parchment'));
  await page.goto('/');
  await page.keyboard.press('Enter');
  const settings = page.getByRole('button', { name: 'Settings', exact: true });
  for (let i = 0; i < 6 && !(await settings.evaluate((el) => el === document.activeElement)); i++)
    await page.keyboard.press('Tab');
  await expect(settings).toBeFocused();
  expect(await settings.evaluate((el) => getComputedStyle(el).outlineColor)).toBe(
    'rgb(246, 212, 142)',
  );
});

test('keyboard focus grows the vine on a button that is not the lead', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  const read = page.getByRole('button', { name: /Read the book/ });
  const live = page.getByRole('button', { name: /Live the world/ });
  await expect(read).toBeFocused();
  await page.waitForTimeout(1300);
  const vine = (b) =>
    b
      .locator('.vine')
      .first()
      .evaluate((el) => Number(getComputedStyle(el).opacity));
  expect(await vine(read)).toBeGreaterThan(0.9);
  expect(await vine(live)).toBeLessThan(0.1);
});

test('an unreadable save is never mistaken for an empty slot', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('lanternmere.save.book', '{"broken": true'));
  await page.goto('/');
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: /The Story/ }).click();
  const read = page.getByRole('button', { name: /Read the book/ });
  await expect(read).toContainText('This save could not be read');
  await read.click();
  await expect(page.getByRole('heading', { name: 'Who are you?' })).toHaveCount(0);
  await expect(page.getByRole('status')).toContainText('restore');
});

test('browser shortcuts with Ctrl do not wake the title', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Control+b');
  await expect(page.getByText('Press any key')).toBeVisible();
});
