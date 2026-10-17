import { test, expect } from '@playwright/test';
import {
  chooseRemainingScenes,
  continueGame,
  enterMode,
  leaveScene,
  playScene,
  playSection,
  setInGear,
  startOnPage,
} from './story-helpers.js';

test.beforeEach(({ page }) => startOnPage(page));

test('book decisions reveal only the chosen branch and resume in the staged reader offline', async ({
  page,
}) => {
  await page.goto('/');
  await enterMode(page, 'book');
  await expect(page.locator('.story-choices button')).toHaveCount(0);
  await page.getByRole('button', { name: 'Make a record with Imogen.', exact: false }).click();
  await expect(page.locator('[data-story-beat="record-columns"]')).toBeVisible();
  await expect(page.locator('[data-story-beat="frame-touch"]')).toHaveCount(0);
  await expect(
    page.locator('[data-choice="arrival:first-observation"] button').first(),
  ).toBeDisabled();
  await page.reload();
  await continueGame(page);
  await playScene(page);
  await expect(page.locator('.dialogue-text')).toContainText('Imogen rules three columns');
  const state = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('lanternmere.save.book')),
  );
  expect(state.storyChoices['arrival:first-observation']).toBe('record');
  expect(state.characterMemories.imogen.map((memory) => memory.key)).toContain(
    'scene:arrival:first-observation:record',
  );
});

test('staged choices work with keyboard focus and the transcript retains the decision', async ({
  page,
}) => {
  await page.goto('/');
  await enterMode(page, 'book');
  await playScene(page);
  const dialog = page.getByRole('dialog');
  for (let index = 0; index < 60; index++) {
    if (await dialog.locator('.scene-decision').count()) break;
    await dialog.getByRole('button', { name: 'Next', exact: true }).click();
  }
  const decision = dialog.getByRole('button', {
    name: 'Check the outside with Rowan.',
    exact: false,
  });
  await decision.focus();
  await page.keyboard.press('Enter');
  await expect(dialog.locator('.dialogue-text')).toContainText('back of your fingers');
  await expect(dialog.locator('.dialogue-text')).toBeFocused();
  await dialog.getByRole('button', { name: 'Previous line', exact: true }).click();
  await expect(dialog.locator('.scene-decision button').first()).toBeDisabled();
  await dialog.getByRole('button', { name: 'Lines so far' }).click();
  await expect(dialog.locator('.scene-history')).toContainText(
    'Your choice: Check the outside with Rowan.',
  );
});

test('large text and motion preferences persist and keep a two-person lesson usable on phones', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 700 });
  await page.goto('/');
  await enterMode(page, 'book');
  await setInGear(page, 'Story text size', 'largest');
  await setInGear(page, 'Reading motion', 'reduce');
  await chooseRemainingScenes(page, 1);
  await page.locator('.story-choices button').first().click();
  await playScene(page);
  const dialog = page.getByRole('dialog');
  for (let index = 0; index < 5; index++)
    await dialog.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(dialog.getByAltText('Elian Vale, neutral expression')).toBeVisible();
  await expect(dialog.locator('.portrait-frame')).toHaveCount(2);
  expect(
    await dialog.locator('.dialogue-text').evaluate((el) => getComputedStyle(el).fontSize),
  ).toBe('26px');
  expect(await page.locator('body').evaluate((el) => el.scrollWidth)).toBe(1024);
  expect(await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
  await page.screenshot({
    path: '/tmp/lanternmere-review/lesson-mobile.png',
    animations: 'disabled',
    fullPage: false,
  });
  await page.reload();
  await continueGame(page);
  await page.getByRole('button', { name: 'Scene settings' }).click();
  await expect(page.getByLabel('Story text size')).toHaveValue('largest');
  await expect(page.getByLabel('Reading motion')).toHaveValue('reduce');
  await page.getByRole('button', { name: 'Scene settings' }).click();
  await playScene(page);
  await expect(page.locator('.dialogue-text')).toContainText('Elian Vale. Introductory charms');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await setInGear(page, 'Story text size', 'standard');
  await page.screenshot({
    path: '/tmp/lanternmere-review/lesson-desktop.png',
    animations: 'disabled',
    fullPage: false,
  });
});
