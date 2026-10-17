import { test, expect } from '@playwright/test';

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
