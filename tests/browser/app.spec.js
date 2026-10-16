import { chooseRemainingScenes } from './story-helpers.js';
import { test, expect } from '@playwright/test';
test('world navigation, expressions, lessons, journal, and save restore', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await page.getByRole('button', { name: 'Live the world', exact: false }).click();
  await expect(page.getByRole('heading', { name: 'Lantern Hall', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Talk to Rowan', exact: true }).first().click();
  await page.getByRole('button', { name: 'Share a little levity' }).click();
  await expect(page.getByRole('dialog').getByAltText('Rowan, laugh expression')).toBeVisible();
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await page.getByRole('button', { name: 'World map', exact: true }).click();
  await page.getByLabel('Find a place').fill('Charms');
  await page.getByRole('button', { name: /Charms Classroom Small spells/ }).click();
  await page.getByRole('button', { name: 'Learn Kindle', exact: true }).click();
  await page.getByRole('button', { name: 'B A steady warmth and room to breathe' }).click();
  await page.getByRole('button', { name: 'Try the spell' }).click();
  await page.getByRole('button', { name: 'Grimoire', exact: true }).click();
  await expect(page.getByText('In your grimoire')).toBeVisible();
  await page.getByRole('button', { name: 'Journal', exact: true }).click();
  await page
    .getByRole('textbox', { name: 'Personal journal notes' })
    .fill('Remember to ask Imogen about the old register.');
  await page.reload();
  await page.getByRole('button', { name: 'Continue your life' }).click();
  await page.getByRole('button', { name: 'Journal', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Personal journal notes' })).toHaveValue(
    'Remember to ask Imogen about the old register.',
  );
  const save = await page.evaluate(() => JSON.parse(localStorage.getItem('lanternmere.save.live')));
  expect(save.spells).toContain('kindle');
  expect(save.bonds.rowan).toBe(5);
  expect(errors).toEqual([]);
  await page.screenshot({ path: 'test-results/journal-desktop.png', fullPage: true });
});
test('book mode reaches a complete ending through all authored scenes and eight chapter decisions', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Read the book', exact: false }).click();
  for (let i = 0; i < 8; i++) {
    await chooseRemainingScenes(page);
    await expect(page.locator('.story-choices button')).toHaveCount(2);
    await page.locator('.story-choices button').first().click();
  }
  await expect(page.getByText('For now, this is enough. This is home.')).toBeVisible();
  const state = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('lanternmere.save.book')),
  );
  expect(state.ending).toBe('shared');
  expect(state.spells).toHaveLength(3);
});
test('fully cached app reloads offline and serves artwork and gameplay', async ({
  page,
  context,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Live the world', exact: false }).click();
  await page.waitForFunction(
    () => navigator.serviceWorker.controller !== null,
    {},
    { timeout: 60000 },
  );
  await expect(page.getByText('Saved for offline', { exact: true })).toBeVisible();
  await context.setOffline(true);
  await page.reload();
  await page.getByRole('button', { name: 'Continue your life' }).click();
  await page.getByRole('button', { name: 'World map', exact: true }).click();
  await expect(page.locator('.atlas>img')).toBeVisible();
  await page.waitForFunction(() => document.querySelector('.atlas>img')?.naturalWidth > 0);
  await page.getByLabel('Find a place').fill('Glasshouses');
  await page.locator('.location-tile').first().click();
  await page.getByRole('button', { name: 'Tend moonflowers' }).click();
  const save = await page.evaluate(() => JSON.parse(localStorage.getItem('lanternmere.save.live')));
  expect(save.clues).toContain('flower');
  await context.setOffline(false);
});
test('mobile layout, navigation, map and conversations remain usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('body')).toHaveJSProperty('scrollWidth', 390);
  await page.getByRole('button', { name: 'Live the world', exact: false }).click();
  await expect(page.locator('body')).toHaveJSProperty('scrollWidth', 390);
  await page.getByRole('button', { name: 'Toggle navigation' }).click();
  await page.getByRole('button', { name: 'People', exact: true }).click();
  await page.getByRole('button', { name: /YOUR STORY Imogen/ }).click();
  await page.getByRole('button', { name: 'Join Imogen at The Library' }).click();
  await page.getByRole('button', { name: 'Talk to Imogen', exact: true }).first().click();
  await page.getByRole('button', { name: 'Get to know them' }).click();
  await expect(page.getByRole('dialog').getByAltText('Imogen, attentive expression')).toBeVisible();
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await page.screenshot({ path: 'test-results/people-mobile.png', fullPage: true });
});
test('gathering choices persist offline and the next day offers a new event', async ({
  page,
  context,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Live the world', exact: false }).click();
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await context.setOffline(true);
  await page.getByRole('button', { name: 'Take part', exact: true }).click();
  await page.getByRole('button', { name: /Make room at your table/ }).click();
  await expect(page.getByText('A little memory made today')).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: 'Continue your life' }).click();
  await expect(page.getByText('A little memory made today')).toBeVisible();
  await page.getByRole('button', { name: 'Rest until tomorrow', exact: true }).click();
  await expect(page.getByText('A little memory made today')).toHaveCount(0);
  const state = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('lanternmere.save.live')),
  );
  expect(state.date).toBe('2026-09-02');
  expect(state.daily.event).toBeNull();
  await context.setOffline(false);
});
test('profiles find moving characters and daily friendship is limited to once a day', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Live the world', exact: false }).click();
  await page.getByRole('button', { name: 'People', exact: true }).click();
  await page.getByLabel('Find a person').fill('Noor');
  await page.locator('.person-card').click();
  await expect(page.getByRole('dialog')).toContainText('Where to find them today');
  await page.getByRole('button', { name: 'Join Noor at The Rookery' }).click();
  await page.getByRole('button', { name: 'Talk to Noor', exact: true }).first().click();
  await page.getByRole('button', { name: 'Get to know them' }).click();
  await expect(page.locator('blockquote')).toContainText('promising perch');
  await page.getByRole('button', { name: 'Spend a little time together' }).click();
  await expect(page.getByRole('button', { name: 'Time well spent today' })).toBeDisabled();
  expect(
    await page.evaluate(() => JSON.parse(localStorage.getItem('lanternmere.save.live')).bonds.noor),
  ).toBe(8);
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await page.getByRole('button', { name: 'People', exact: true }).click();
  await page.getByLabel('Find a person').fill('Noor');
  await expect(page.locator('.person-where')).toContainText('Heronmere Common Room');
});
test('a version-one save resumes in the browser with its progress preserved', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Live the world', exact: false }).click();
  await page.getByRole('button', { name: 'Look around' }).click();
  await page.evaluate(() => {
    const key = 'lanternmere.save.live';
    const save = JSON.parse(localStorage.getItem(key));
    save.version = 1;
    delete save.daily;
    save.notes = 'A memory from before the update.';
    localStorage.setItem(key, JSON.stringify(save));
  });
  await page.reload();
  await page.getByRole('button', { name: 'Continue your life' }).click();
  await page.getByRole('button', { name: 'Journal', exact: true }).click();
  await expect(page.getByLabel('Personal journal notes')).toHaveValue(
    'A memory from before the update.',
  );
  const save = await page.evaluate(() => JSON.parse(localStorage.getItem('lanternmere.save.live')));
  expect(save.version).toBe(4);
  expect(save.points).toBe(3);
  expect(save.daily.date).toBe(save.date);
});
test('export and import transfer progress and invalid imports leave the save intact', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Live the world', exact: false }).click();
  await page.getByRole('button', { name: 'Look around' }).click();
  await page.getByRole('button', { name: 'Settings & saves' }).click();
  const downloaded = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export save', exact: true }).click();
  const file = await downloaded;
  const path = await file.path();
  await page
    .getByRole('dialog')
    .locator('input[type=file]')
    .setInputFiles({
      name: 'broken.json',
      mimeType: 'application/json',
      buffer: Buffer.from('{"version":1}'),
    });
  await expect(page.getByRole('status')).toContainText('not a valid Lanternmere save');
  await page.getByRole('dialog').locator('input[type=file]').setInputFiles(path);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  expect(
    await page.evaluate(() => JSON.parse(localStorage.getItem('lanternmere.save.live')).points),
  ).toBe(3);
  expect(await page.evaluate(() => localStorage.getItem('lanternmere.import-backup'))).toBeTruthy();
});
test('a reply from any AI can be pasted with a supported expression, without changing progress', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Live the world', exact: false }).click();
  await page.getByRole('button', { name: 'Talk to Rowan', exact: true }).first().click();
  await page.getByRole('button', { name: 'Use ChatGPT or another AI' }).click();
  await page
    .getByRole('textbox', { name: 'Paste the AI’s reply' })
    .fill('There is always another chair by the fire.');
  await page.getByLabel('Expression', { exact: true }).selectOption('warm');
  await page.getByRole('button', { name: 'Read their reply' }).click();
  await expect(page.locator('blockquote')).toContainText('another chair by the fire');
  await expect(page.getByRole('dialog').getByAltText('Rowan, warm expression')).toBeVisible();
  expect(
    await page.evaluate(() => JSON.parse(localStorage.getItem('lanternmere.save.live')).points),
  ).toBe(0);
});
