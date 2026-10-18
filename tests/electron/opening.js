// New games begin with arrival night. Tests that only need to be past it answer its three decisions
// in the save (watching the castle, Owlcombe, a cat) and reload; scene-player.spec.js plays it for real.
export async function finishOpening(win) {
  await win.locator('.scene-player.opening').waitFor();
  await win.waitForFunction(() =>
    ['book', 'live', 'guided', 'sandbox'].some((m) =>
      window.lanternmere.storage.getItem('lanternmere.save.' + m),
    ),
  );
  await win.evaluate(() => {
    const store = window.lanternmere.storage;
    for (const mode of ['book', 'live', 'guided', 'sandbox']) {
      const raw = store.getItem('lanternmere.save.' + mode);
      if (!raw) continue;
      const game = JSON.parse(raw);
      if (game.house && game.familiar) continue;
      Object.assign(game, { house: 'owlcombe', familiar: 'cat' });
      game.storyChoices = {
        ...game.storyChoices,
        'arrival:crossing': 'castle',
        'arrival:house': 'owlcombe',
        'arrival:familiar': 'cat',
      };
      game.bookmark = null;
      store.setItem('lanternmere.save.' + mode, JSON.stringify(game));
    }
  });
  await win.reload();
  await win.getByText('Press any key').waitFor();
  await win.keyboard.press('Enter');
  await win.getByRole('button', { name: /^Continue/ }).click();
  await win.locator('.app-shell').waitFor();
}
