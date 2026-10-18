import { test, expect } from '@playwright/test';
import {
  chooseRemainingScenes,
  continueGame,
  decide,
  enterMode,
  leaveScene,
  nextChapter,
  playScene,
  playSection,
  setInGear,
  startOnPage,
} from './story-helpers.js';

test.beforeEach(({ page }) => startOnPage(page));

// The opening's lines come from ChatGPT's draft; read them from the story rather than hard-coding prose.
async function firstObservation() {
  const { stagedScenes } = await import('../../src/scene-beats.mjs');
  const beats = stagedScenes.find((s) => s.id === 'arrival').beats;
  const branch = (option) =>
    beats.find((b) => b.when?.choice === 'arrival:first-observation' && b.when.equals === option);
  const decision = beats.find((b) => b.id === 'first-observation');
  const label = (option) => decision.choice.options.find((o) => o.id === option).label;
  return { branch, label };
}

test('book decisions reveal only the chosen branch and resume in the staged reader offline', async ({
  page,
}) => {
  const { branch, label } = await firstObservation();
  await page.goto('/');
  await enterMode(page, 'book');
  await expect(page.locator('.scene-exits')).toHaveCount(0);
  await decide(page, 'arrival:first-observation', 1);
  await page.reload();
  await continueGame(page);
  await playScene(page);
  await expect(page.locator('.dialogue-text')).toContainText(branch('record').text.slice(0, 30));
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
  const { branch, label } = await firstObservation();
  await page.goto('/');
  await enterMode(page, 'book');
  await playScene(page);
  const dialog = page.getByRole('dialog');
  for (let index = 0; index < 200; index++) {
    if (await dialog.locator('.scene-decision').count()) break;
    await dialog.getByRole('button', { name: 'Next', exact: true }).click();
  }
  await dialog.getByRole('button', { name: label('frame'), exact: false }).focus();
  await page.keyboard.press('Enter');
  await expect(dialog.locator('.dialogue-text')).toContainText(branch('frame').text.slice(0, 30));
  await expect(dialog.locator('.dialogue-text')).toBeFocused();
  await dialog.getByRole('button', { name: 'Previous line', exact: true }).click();
  await expect(dialog.locator('.scene-decision button').first()).toBeDisabled();
  await dialog.getByRole('button', { name: 'Lines so far' }).click();
  await expect(dialog.locator('.scene-history')).toContainText(`Your choice: ${label('frame')}`);
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
  await nextChapter(page, 0);
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
