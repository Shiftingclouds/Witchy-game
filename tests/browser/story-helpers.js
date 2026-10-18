const LABELS = {
  book: /Read the book/,
  live: /Live the world/,
  guided: /The Guided Tale/,
  sandbox: /The Open World/,
};

/** Make sure the current chapter is playing as a scene (from the return card if needed). */
async function ensureScene(page) {
  if (await page.locator('.scene-player').count()) return;
  await page.getByRole('button', { name: /Return to the story/ }).click();
  await page.locator('.scene-player').waitFor();
}

/**
 * Play the rest of the chapter in the scene, taking option `optionIndex` at each decision, until the
 * chapter's ways forward appear.
 */
export async function chooseRemainingScenes(page, optionIndex = 0) {
  await ensureScene(page);
  for (let safety = 0; safety < 800; safety++) {
    if (await page.locator('.scene-exits').count()) return;
    const options = page.locator('.scene-choice-panel .scene-decision button:not([disabled])');
    const n = await options.count();
    if (n) await options.nth(Math.min(optionIndex, n - 1)).click();
    else await page.keyboard.press('Enter');
  }
  throw Error('The chapter never reached its end');
}

/** Play on to the decision with this key and choose option `index` there. */
export async function decide(page, key, index = 0) {
  await ensureScene(page);
  const decision = page.locator(`.scene-choice-panel .scene-decision[data-choice="${key}"]`);
  for (let safety = 0; safety < 800 && !(await decision.count()); safety++) {
    const other = page.locator('.scene-choice-panel .scene-decision button:not([disabled])');
    if (await other.count()) await other.first().click();
    else await page.keyboard.press('Enter');
  }
  await decision.locator('button').nth(index).click();
}

/** At a chapter's end, take way forward `index`. */
export async function nextChapter(page, index = 0) {
  await chooseRemainingScenes(page, 0);
  await page.locator('.scene-exits button').nth(index).click();
}

/**
 * From the title screen: continue this mode's save if it has one, otherwise start a new game in it
 * (skipping the opening for tests that only need to be past it).
 */
export async function enterMode(page, mode, { name } = {}) {
  await page.keyboard.press('Enter');
  const resume = page.getByRole('button', { name: /^Continue/ });
  if (await resume.count()) {
    await resume.click();
    const pick = page.getByRole('button', { name: LABELS[mode] });
    if (await pick.count()) {
      await pick.click();
      await page.locator('.app-shell').waitFor();
      return;
    }
    await page.getByRole('button', { name: 'Back' }).click();
  }
  await page.getByRole('button', { name: /^New game/ }).click();
  await page.getByRole('button', { name: LABELS[mode] }).click();
  const over = page.getByRole('button', { name: /Start over/ });
  if (await over.count()) await over.click();
  await page.locator('.character-creation').waitFor();
  if (name) await page.getByLabel('Your name').fill(name);
  await page.getByRole('button', { name: /Begin your story/ }).click();
  await finishOpening(page);
  await page.locator('.app-shell').waitFor();
}

/**
 * Skip arrival night for tests that only need to be past it: answer the three opening decisions in
 * the save (watching the castle, Owlcombe, a cat), place the bookmark at supper, and continue.
 * The opening itself is played for real in scene-player.spec.js.
 */
export async function finishOpening(page) {
  const { chapterBeats } = await import('../../src/scene-beats.mjs');
  await page.locator('.scene-player.opening').waitFor();
  await page.waitForFunction(() =>
    Object.keys(localStorage).some((k) => k.startsWith('lanternmere.save.')),
  );
  const supper = (game) => chapterBeats(0, game).find((b) => b.section?.id === 'place-at-table');
  const answered = {
    'arrival:crossing': 'castle',
    'arrival:house': 'owlcombe',
    'arrival:familiar': 'cat',
  };
  const { first } = await page.evaluate((answers) => {
    const key = Object.keys(localStorage).find((k) => k.startsWith('lanternmere.save.'));
    const game = JSON.parse(localStorage.getItem(key));
    Object.assign(game, { house: 'owlcombe', familiar: 'cat' });
    game.storyChoices = { ...game.storyChoices, ...answers };
    localStorage.setItem(key, JSON.stringify(game));
    localStorage.setItem('lanternmere.last-mode', game.mode);
    return { first: game };
  }, answered);
  const beat = supper({
    ...first,
    house: 'owlcombe',
    familiar: 'cat',
    storyChoices: { ...first.storyChoices, ...answered },
  });
  await page.evaluate((id) => {
    const key = Object.keys(localStorage).find((k) => k.startsWith('lanternmere.save.'));
    const game = JSON.parse(localStorage.getItem(key));
    game.bookmark = { scene: 'arrival', beat: id };
    localStorage.setItem(key, JSON.stringify(game));
  }, beat.id);
  await page.reload();
  await continueGame(page);
}

/** From the title screen: Continue, then the most recently played save. */
export async function continueGame(page) {
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: /^Continue/ }).click();
  await page.locator('.title-menu .vine-button').first().click();
  await page.locator('.app-shell').waitFor();
}

export async function reachBookChapter(page, chapter, optionIndex = 0) {
  await page.goto('/');
  await enterMode(page, 'book');
  for (let index = 0; index < chapter; index++) {
    await chooseRemainingScenes(page, optionIndex);
    await nextChapter(page, 0);
  }
}

/** The story no longer has a page view; kept so older test files read unchanged. */
export const startOnPage = () => {};

/** Make sure the scene is playing, with text appearing at once. */
export async function playScene(page) {
  await ensureScene(page);
  await page.getByRole('button', { name: 'Scene settings' }).click();
  await page.getByLabel('Text reveal speed').selectOption('instant');
  await page.getByRole('button', { name: 'Scene settings' }).click();
}

/** Leave the scene (in the book, for the card that returns to it). */
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
