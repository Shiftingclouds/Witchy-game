export async function chooseRemainingScenes(page, optionIndex = 0) {
  for (let safety = 0; safety < 20; safety++) {
    const pending = page.locator('.authored-chapter .scene-decision button:not([disabled])');
    if (!(await pending.count())) return;
    await pending.nth(optionIndex).click();
  }
  throw Error('Too many unanswered scene choices');
}
