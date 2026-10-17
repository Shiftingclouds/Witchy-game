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

export async function playSection(page, title) {
  await page
    .getByRole('navigation', { name: 'Chapter sections' })
    .getByRole('button', { name: title, exact: true })
    .click();
  await page.getByRole('button', { name: 'Play scene', exact: true }).click();
  await page.getByRole('dialog').getByLabel('Text reveal speed').selectOption('instant');
}
