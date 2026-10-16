import { test, expect } from '@playwright/test';

test('AI requests use the character sheet context and conversation survives reload without changing bonds', async ({
  page,
}) => {
  const requests = [];
  await page.route('**/api/status', (route) =>
    route.fulfill({ json: { configured: true, model: 'local-test' } }),
  );
  await page.route('**/api/dialogue', (route) => {
    requests.push(route.request().postDataJSON());
    return route.fulfill({
      json: { text: 'I remember our talk beside the fire.', emotion: 'warm' },
    });
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Live the world', exact: false }).click();
  await page.getByRole('button', { name: 'Talk to Rowan', exact: true }).first().click();
  await page.getByRole('button', { name: 'Get to know them' }).click();
  await page.getByLabel('Or say something in your own words').fill('I like rainy afternoons.');
  await page.getByRole('button', { name: 'Send to AI', exact: true }).click();
  await expect(page.locator('blockquote')).toContainText('our talk beside the fire');
  expect(requests[0].context.bond).toBe(5);
  expect(requests[0].context.memories[0].key).toBe('talk:hello');
  expect(requests[0].context.notes).toBeUndefined();
  await page.reload();
  await page.getByRole('button', { name: 'Continue your life' }).click();
  await page.getByRole('button', { name: 'Talk to Rowan', exact: true }).first().click();
  await expect(page.locator('blockquote')).toContainText('our talk beside the fire');
  await page.getByLabel('Or say something in your own words').fill('What did we talk about?');
  await page.getByRole('button', { name: 'Send to AI', exact: true }).click();
  await expect.poll(() => requests.length).toBe(2);
  expect(requests[1].context.turns[0].player).toBe('I like rainy afternoons.');
  await expect
    .poll(() =>
      page.evaluate(
        () => JSON.parse(localStorage.getItem('lanternmere.save.live')).conversations.rowan.length,
      ),
    )
    .toBe(2);
  await page.getByText('Your history with Rowan', { exact: true }).click();
  await page.getByRole('button', { name: 'Clear saved AI conversation' }).click();
  const save = await page.evaluate(() => JSON.parse(localStorage.getItem('lanternmere.save.live')));
  expect(save.conversations.rowan).toBeUndefined();
  expect(save.bonds.rowan).toBe(5);
  expect(save.characterMemories.rowan[0].key).toBe('talk:hello');
});

test('the external-AI context and pasted conversation remain available offline', async ({
  page,
  context,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Live the world', exact: false }).click();
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await context.setOffline(true);
  await page.getByRole('button', { name: 'Talk to Rowan', exact: true }).first().click();
  await page.getByRole('button', { name: 'Get to know them' }).click();
  await page.getByLabel('Or say something in your own words').fill('May I sit beside you?');
  await page.getByRole('button', { name: 'Use ChatGPT or another AI' }).click();
  await page.getByRole('button', { name: 'Copy conversation context' }).click();
  const copied = await page.getByLabel('Character context to copy').inputValue();
  expect(copied).toContain('Warm, conversational sentences');
  expect(copied).toContain('"score": 5');
  expect(copied).toContain('May I sit beside you?');
  expect(copied).not.toContain('futureArc');
  await page.getByLabel('Paste the AI’s reply').fill('Of course. The chair is yours.');
  await page.getByRole('button', { name: 'Read their reply' }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Continue your life' }).click();
  await page.getByRole('button', { name: 'Talk to Rowan', exact: true }).first().click();
  await expect(page.locator('blockquote')).toContainText('The chair is yours.');
  const save = await page.evaluate(() => JSON.parse(localStorage.getItem('lanternmere.save.live')));
  expect(save.bonds.rowan).toBe(5);
  expect(save.conversations.rowan[0].source).toBe('pasted');
  await context.setOffline(false);
});

test('a version-two save upgrades its relationships without inventing old conversations', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Live the world', exact: false }).click();
  await page.getByRole('button', { name: 'Talk to Rowan', exact: true }).first().click();
  await page.getByRole('button', { name: 'Get to know them' }).click();
  await page.evaluate(() => {
    const key = 'lanternmere.save.live',
      save = JSON.parse(localStorage.getItem(key));
    save.version = 2;
    delete save.characterMemories;
    delete save.conversations;
    delete save.conversationSequence;
    save.notes = 'An older save.';
    localStorage.setItem(key, JSON.stringify(save));
  });
  await page.reload();
  await page.getByRole('button', { name: 'Continue your life' }).click();
  const save = await page.evaluate(() => JSON.parse(localStorage.getItem('lanternmere.save.live')));
  expect(save.version).toBe(4);
  expect(save.bonds.rowan).toBe(5);
  expect(save.notes).toBe('An older save.');
  expect(save.characterMemories.rowan).toEqual([{ key: 'talk:hello', date: null }]);
  expect(save.conversations).toEqual({});
});
