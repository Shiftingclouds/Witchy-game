import { test, expect } from '@playwright/test';
import { chooseRemainingScenes } from './story-helpers.js';

test('book decisions reveal only the chosen branch and resume in the staged reader offline', async ({
  page,
  context,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Read the book', exact: false }).click();
  await expect(page.locator('.story-choices button')).toHaveCount(0);
  await page.getByRole('button', { name: 'Make a record with Imogen.', exact: false }).click();
  await expect(page.locator('[data-story-beat="record-columns"]')).toBeVisible();
  await expect(page.locator('[data-story-beat="frame-touch"]')).toHaveCount(0);
  await expect(
    page.locator('[data-choice="arrival:first-observation"] button').first(),
  ).toBeDisabled();
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await context.setOffline(true);
  await page.reload();
  await page.getByRole('button', { name: 'Continue your story' }).click();
  await page.getByRole('button', { name: 'Play scene', exact: true }).click();
  await expect(page.locator('.speech-text')).toContainText('Imogen rules three columns');
  const state = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('lanternmere.save.book')),
  );
  expect(state.storyChoices['arrival:first-observation']).toBe('record');
  expect(state.characterMemories.imogen[0].key).toBe('scene:arrival:first-observation:record');
  await context.setOffline(false);
});

test('staged choices work with keyboard focus and the transcript retains the decision', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Read the book', exact: false }).click();
  await page.getByRole('button', { name: 'Play scene', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Text reveal speed').selectOption('instant');
  for (let index = 0; index < 60; index++) {
    if (await dialog.locator('.scene-decision').count()) break;
    await dialog.getByRole('button', { name: 'Next line', exact: true }).click();
  }
  const decision = dialog.getByRole('button', {
    name: 'Check the outside with Rowan.',
    exact: false,
  });
  await decision.focus();
  await page.keyboard.press('Enter');
  await expect(dialog.locator('.speech-text')).toContainText('back of your fingers');
  await expect(dialog.locator('.speech-text')).toBeFocused();
  await dialog.getByRole('button', { name: 'Previous', exact: true }).click();
  await expect(dialog.locator('.scene-decision button').first()).toBeDisabled();
  await dialog.getByText('Read the conversation so far', { exact: true }).click();
  await expect(dialog.locator('.scene-transcript')).toContainText(
    'Your choice: Check the outside with Rowan.',
  );
});

test('large text and motion preferences persist and keep a two-person lesson usable on phones', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Read the book', exact: false }).click();
  await page.getByLabel('Story text size').selectOption('largest');
  await page.getByLabel('Reading motion').selectOption('reduce');
  await chooseRemainingScenes(page, 1);
  await page.locator('.story-choices button').first().click();
  await page.getByRole('button', { name: 'Play scene', exact: true }).click();
  const dialog = page.getByRole('dialog');
  for (let index = 0; index < 5; index++)
    await dialog.getByRole('button', { name: 'Next line', exact: true }).click();
  await expect(dialog.getByAltText('Elian Vale, neutral expression')).toBeVisible();
  await expect(dialog.locator('.stage-actor.present')).toHaveCount(2);
  expect(await dialog.locator('.speech-text').evaluate((el) => getComputedStyle(el).fontSize)).toBe(
    '26px',
  );
  expect(
    await dialog.locator('.scene-light').evaluate((el) => getComputedStyle(el).animationName),
  ).toBe('none');
  expect(await page.locator('body').evaluate((el) => el.scrollWidth)).toBe(320);
  expect(await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
  await page.screenshot({ path: '/tmp/lanternmere-review/lesson-mobile.png', fullPage: true });
  await page.reload();
  await page.getByRole('button', { name: 'Continue your story' }).click();
  await expect(page.getByLabel('Story text size')).toHaveValue('largest');
  await expect(page.getByLabel('Reading motion')).toHaveValue('reduce');
  await page.getByRole('button', { name: 'Play scene', exact: true }).click();
  await expect(page.locator('.speech-text')).toContainText('Elian Vale. Introductory charms');
});
