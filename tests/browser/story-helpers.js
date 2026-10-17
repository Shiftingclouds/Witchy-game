export async function chooseRemainingScenes(page, optionIndex = 0) {
  for (let safety = 0; safety < 20; safety++) {
    const pending = page.locator('.authored-chapter .scene-decision button:not([disabled])');
    if (!(await pending.count())) return;
    await pending.nth(optionIndex).click();
  }
  throw Error('Too many unanswered scene choices');
}

export async function reachBookChapter(page, chapter, optionIndex = 0) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Read the book', exact: false }).click();
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
