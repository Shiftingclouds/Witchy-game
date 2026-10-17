import { test, expect } from '@playwright/test';
import {
  continueGame,
  enterMode,
  leaveScene,
  playScene,
  playSection,
  reachBookChapter,
  setInGear,
  startOnPage,
} from './story-helpers.js';

test.beforeEach(({ page }) => startOnPage(page));

test('Emberfall uses night scenery and new portraits, then resumes its petal comparison offline', async ({
  page,
}) => {
  await reachBookChapter(page, 3, 1);
  await page.locator('[data-choice="emberfall:work-plan"] button').nth(1).click();
  await expect(page.locator('[data-story-beat="shared-handover"]')).toBeVisible();
  await expect(page.locator('[data-story-beat="simple-handover"]')).toHaveCount(0);
  await playSection(page, 'The flowers keep their own hour');
  const dialog = page.getByRole('dialog');
  await expect(dialog.locator('.scene-painting')).toHaveAttribute(
    'src',
    '/art/glasshouses-night.webp',
  );
  await dialog.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(dialog.getByAltText('Rhys, warm expression')).toBeVisible();
  await dialog.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(dialog.getByAltText('Saoirse, attentive expression')).toBeVisible();
  await page.waitForFunction(() =>
    [...document.querySelectorAll('.scene-player img')].every(
      (img) => img.complete && img.naturalWidth > 0,
    ),
  );
  await expect(page.locator('.toast')).toHaveCount(0, { timeout: 8000 });
  await page.screenshot({
    path: '/tmp/lanternmere-review/emberfall-cast.png',
    animations: 'disabled',
  });
  for (let step = 0; step < 4; step++)
    await dialog.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(dialog.locator('.scene-painting')).toHaveAttribute(
    'src',
    '/art/moonflower-study.webp',
  );
  await expect(dialog.locator('.dialogue-text')).toContainText('Two fallen petals lie');
  await page.reload();
  await continueGame(page);
  await playScene(page);
  await expect(dialog.locator('.dialogue-text')).toContainText('Two fallen petals lie');
  await expect
    .poll(() =>
      dialog.locator('.scene-painting').evaluate((img) => img.complete && img.naturalWidth > 0),
    )
    .toBe(true);
  await page.screenshot({
    path: '/tmp/lanternmere-review/emberfall-evidence.png',
    animations: 'disabled',
  });
  await page.setViewportSize({ width: 1024, height: 700 });
  await setInGear(page, 'Story text size', 'largest');
  await setInGear(page, 'Reading motion', 'reduce');
  expect(await page.locator('body').evaluate((el) => el.scrollWidth)).toBe(1024);
  await page.screenshot({
    path: '/tmp/lanternmere-review/emberfall-mobile.png',
    animations: 'disabled',
  });
  await dialog.getByRole('button', { name: 'Next', exact: true }).click();
  await dialog
    .getByRole('button', { name: 'Exchange the saucers, then shade the lamp.', exact: false })
    .click();
  await expect(dialog.locator('.dialogue-text')).toContainText('You exchange the saucers');
  const save = await page.evaluate(() => JSON.parse(localStorage.getItem('lanternmere.save.book')));
  expect(save.storyChoices['emberfall:observation']).toBe('exchange');
  expect(save.characterMemories.rhys.map((memory) => memory.key)).toContain(
    'scene:emberfall:observation:exchange',
  );
});

test('Longnight loads winter art, preserves a seven-light reading offline, and carries winter work forward', async ({
  page,
}) => {
  await reachBookChapter(page, 4, 1);
  await playSection(page, 'The work of arriving');
  const dialog = page.getByRole('dialog');
  await expect(dialog.locator('.scene-painting')).toHaveAttribute(
    'src',
    '/art/tully-cottage-winter.webp',
  );
  await dialog.getByRole('button', { name: 'Next', exact: true }).click();
  await dialog.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(dialog.getByAltText('Tully, warm expression')).toBeVisible();
  await leaveScene(page);
  await page.locator('[data-choice="longnight:shore-work"] button').nth(1).click();
  await playSection(page, 'What the water has kept');
  for (let i = 0; i < 3; i++)
    await dialog.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(dialog.locator('.scene-painting')).toHaveAttribute(
    'src',
    '/art/lake-seven-lights.webp',
  );
  await expect(dialog.locator('.dialogue-text')).toContainText('Seven small amber flames');
  await page.reload();
  await continueGame(page);
  await playScene(page);
  await expect(dialog.locator('.dialogue-text')).toContainText('Seven small amber flames');
  await expect
    .poll(() =>
      dialog.locator('.scene-painting').evaluate((img) => img.complete && img.naturalWidth > 0),
    )
    .toBe(true);
  await page.screenshot({
    path: '/tmp/lanternmere-review/longnight-evidence.png',
    animations: 'disabled',
  });
  await page.setViewportSize({ width: 1024, height: 700 });
  await setInGear(page, 'Story text size', 'largest');
  await setInGear(page, 'Reading motion', 'reduce');
  expect(await page.locator('body').evaluate((el) => el.scrollWidth)).toBe(1024);
  await page.screenshot({
    path: '/tmp/lanternmere-review/longnight-mobile.png',
    animations: 'disabled',
  });
  await leaveScene(page);
  await page.locator('[data-choice="longnight:echo-record"] button').nth(1).click();
  await playSection(page, 'What the school would lose');
  await dialog.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(dialog.getByAltText('Kestrel, grave expression')).toBeVisible();
  await leaveScene(page);
  await page.locator('[data-choice="longnight:winter-duty"] button').nth(1).click();
  await expect(page.locator('[data-story-beat="archive-start"]')).toBeVisible();
  await page.locator('.story-choices button').nth(1).click();
  const save = await page.evaluate(() => JSON.parse(localStorage.getItem('lanternmere.save.book')));
  expect(save.chapter).toBe(5);
  expect(save.storyChoices['longnight:winter-duty']).toBe('archive');
  expect(save.clues).toContain('lake');
});

test('First Thaw pays off winter research, presents the inscription offline, and teaches a voluntary return', async ({
  page,
}) => {
  await reachBookChapter(page, 5, 1);
  await expect(page.locator('[data-story-beat="archive-result"]')).toBeVisible();
  await expect(page.locator('[data-story-beat="handover-result"]')).toHaveCount(0);
  await page.locator('[data-choice="thaw:reading-method"] button').nth(1).click();
  await playSection(page, 'The words weather left behind');
  const dialog = page.getByRole('dialog');
  await expect(dialog.locator('.scene-painting')).toHaveAttribute(
    'src',
    '/art/candlestones-day.webp',
  );
  for (let step = 0; step < 5; step++)
    await dialog.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(dialog.locator('.scene-painting')).toHaveAttribute(
    'src',
    '/art/candlestones-inscription.webp',
  );
  await expect(dialog.locator('.dialogue-text')).toContainText('A space for whoever comes next.');
  await page.reload();
  await continueGame(page);
  await playScene(page);
  await expect(dialog.locator('.dialogue-text')).toContainText(
    'The restored reading is two sentences',
  );
  await expect
    .poll(() =>
      dialog.locator('.scene-painting').evaluate((img) => img.complete && img.naturalWidth > 0),
    )
    .toBe(true);
  await page.screenshot({
    path: '/tmp/lanternmere-review/thaw-evidence.png',
    animations: 'disabled',
  });
  await page.setViewportSize({ width: 1024, height: 700 });
  await setInGear(page, 'Story text size', 'largest');
  await setInGear(page, 'Reading motion', 'reduce');
  expect(await page.locator('body').evaluate((el) => el.scrollWidth)).toBe(1024);
  await page.screenshot({
    path: '/tmp/lanternmere-review/thaw-mobile.png',
    animations: 'disabled',
  });
  await leaveScene(page);
  await playSection(page, 'A lesson with a way out');
  await dialog.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(dialog.getByAltText('Kestrel, warm expression')).toBeVisible();
  await leaveScene(page);
  await page.locator('[data-choice="thaw:practice-role"] button').nth(1).click();
  await expect(page.locator('[data-story-beat="holding-first"]')).toBeVisible();
  await page.locator('[data-choice="thaw:rejoining"] button').nth(1).click();
  await expect(page.locator('[data-story-beat="space-card"]')).toBeVisible();
  await page.locator('.story-choices button').first().click();
  const save = await page.evaluate(() => JSON.parse(localStorage.getItem('lanternmere.save.book')));
  expect(save.chapter).toBe(6);
  expect(save.spells).toContain('thread');
  expect(save.clues).toContain('stones');
  expect(save.storyChoices['thaw:rejoining']).toBe('space');
});

test('Bloomtide stages the rehearsal and saves a private conversation and a concrete lantern plan', async ({
  page,
}) => {
  await reachBookChapter(page, 6, 1);
  await playSection(page, 'An invitation that can be accepted');
  const dialog = page.getByRole('dialog');
  for (let step = 0; step < 5; step++)
    await dialog.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(dialog.getByAltText('Okoro, warm expression')).toBeVisible();
  await expect(dialog.getByAltText('Grey, attentive expression')).toBeVisible();
  await page.waitForFunction(() =>
    [...document.querySelectorAll('.scene-player img')].every(
      (img) => img.complete && img.naturalWidth > 0,
    ),
  );
  await expect(page.locator('.toast')).toHaveCount(0, { timeout: 8000 });
  await page.screenshot({
    path: '/tmp/lanternmere-review/bloom-rehearsal.png',
    animations: 'disabled',
  });
  await leaveScene(page);
  await page.locator('[data-choice="bloom:rehearsal-plan"] button').nth(1).click();
  await expect(page.locator('[data-story-beat="relay-payoff"]')).toBeVisible();
  await page.locator('[data-choice="bloom:rowan-support"] button').nth(1).click();
  await expect(page.locator('[data-story-beat="stay-company"]')).toBeVisible();
  await page.locator('[data-choice="bloom:lantern-use"] button').first().click();
  const save = await page.evaluate(() => JSON.parse(localStorage.getItem('lanternmere.save.book')));
  expect(save.storyChoices['bloom:lantern-use']).toBe('welcome');
  expect(save.characterMemories.rowan.map((memory) => memory.key)).toContain(
    'scene:bloom:rowan-support:stay',
  );
  expect(save.characterMemories.saoirse.map((memory) => memory.key)).not.toContain(
    'scene:bloom:rowan-support:stay',
  );
  await page.locator('.story-choices button').first().click();
  // Chapter titles are no longer shown; the save confirms Midsummer has begun.
  expect(
    await page.evaluate(() => JSON.parse(localStorage.getItem('lanternmere.save.book')).chapter),
  ).toBe(7);
});
