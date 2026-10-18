// New games begin with arrival night; take the first option at each decision to reach the world.
export async function finishOpening(win) {
  await win.locator('.scene-player.opening').waitFor();
  for (let i = 0; i < 200 && (await win.locator('.scene-player.opening').count()); i++) {
    const option = win.locator('.scene-choice-panel .scene-decision button:not([disabled])');
    if (await option.count()) await option.first().click();
    else await win.keyboard.press('Enter');
  }
  await win.locator('.app-shell').waitFor();
}
