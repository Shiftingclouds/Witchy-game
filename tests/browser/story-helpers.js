export async function chooseRemainingScenes(page, optionIndex = 0) {
  for (let safety = 0; safety < 20; safety++) {
    const pending = page.locator('.authored-chapter .scene-decision button:not([disabled])');
    if (!(await pending.count())) return;
    await pending.nth(optionIndex).click();
  }
  throw Error('Too many unanswered scene choices');
}

/** From the title screen: wake it, open The Story, choose a mode, and create a character if the slot is empty. */
export async function enterMode(page, mode, { name } = {}) {
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: /The Story/ }).click();
  await page
    .getByRole('button', { name: mode === 'book' ? /Read the book/ : /Live the world/ })
    .click();
  await page.locator('.character-creation, .app-shell').first().waitFor();
  if (await page.locator('.character-creation').count()) {
    if (name) await page.getByLabel('Your name').fill(name);
    await page.getByRole('button', { name: /Begin your story/ }).click();
  }
  await page.locator('.app-shell').waitFor();
}

/** From the title screen: wake it and choose Continue. */
export async function continueGame(page) {
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: /^Continue/ }).click();
  await page.locator('.app-shell').waitFor();
}

export async function reachBookChapter(page, chapter, optionIndex = 0) {
  await page.goto('/');
  await enterMode(page, 'book');
  for (let index = 0; index < chapter; index++) {
    await chooseRemainingScenes(page, optionIndex);
    await page.locator('.story-choices button').first().click();
  }
}

/** Start every test in this file on the book page rather than the full-screen scene. */
export const startOnPage = (page) =>
  page.addInitScript(() => {
    if (!sessionStorage.getItem('lanternmere.test-page-set')) {
      localStorage.setItem('lanternmere.scene-view', 'page');
      sessionStorage.setItem('lanternmere.test-page-set', '1');
    }
  });

/** From the book page: play the current chapter as a full-screen scene, text appearing at once. */
export async function playScene(page) {
  const back = page.getByRole('button', { name: /Return to the scene/ });
  if (await back.count()) await back.click();
  else if (!(await page.locator('.scene-player').count())) {
    await page.getByRole('button', { name: 'Scene settings' }).click();
    await page.getByRole('button', { name: 'Play as a scene' }).click();
  }
  await page.locator('.scene-player').waitFor();
  await page.getByRole('button', { name: 'Scene settings' }).click();
  await page.getByLabel('Text reveal speed').selectOption('instant');
  await page.getByRole('button', { name: 'Scene settings' }).click();
}

/** Leave the scene for the book page. */
export async function leaveScene(page) {
  await page.getByRole('button', { name: 'Leave the scene' }).click();
  await page.locator('.scene-player').waitFor({ state: 'detached' });
}

/** Open the scene at the first line of the section with this title (as a saved place would). */
export async function playSection(page, title) {
  const { chapterBeats, chapterSceneId } = await import('../../src/scene-beats.mjs');
  const save = await page.evaluate(() => {
    const mode = localStorage.getItem('lanternmere.last-mode') || 'book';
    return { mode, game: JSON.parse(localStorage.getItem('lanternmere.save.' + mode)) };
  });
  const beat = chapterBeats(save.game.chapter, save.game).find((b) => b.section?.title === title);
  if (!beat) throw new Error('No section titled ' + title);
  await page.evaluate(
    ({ mode, bookmark }) => {
      const game = JSON.parse(localStorage.getItem('lanternmere.save.' + mode));
      game.bookmark = bookmark;
      localStorage.setItem('lanternmere.save.' + mode, JSON.stringify(game));
    },
    { mode: save.mode, bookmark: { scene: chapterSceneId(save.game.chapter), beat: beat.id } },
  );
  await page.reload();
  await continueGame(page);
  await playScene(page);
}

/** Change a reading setting through the gear (in the scene or on the page). */
export async function setInGear(page, label, value) {
  await page.getByRole('button', { name: 'Scene settings' }).click();
  await page.getByLabel(label).selectOption(value);
  await page.getByRole('button', { name: 'Scene settings' }).click();
}
