import { test, expect } from '@playwright/test';
import { finishOpening } from './story-helpers.js';

// A stand-in for the desktop Claude bridge: replies come from a queue the test fills.
async function withBridge(page) {
  await page.addInitScript(() => {
    window.__replies = [];
    window.__prompts = [];
    window.lanternmere = {
      ai: {
        status: async () => ({ available: true, version: 'test' }),
        cancel: async () => {},
        request: async (options) => {
          window.__prompts.push(options);
          const next = window.__replies.shift() || { ok: false, error: 'failed' };
          if (next.delay) await new Promise((r) => setTimeout(r, next.delay));
          return next;
        },
      },
    };
  });
}
const queue = (page, ...replies) => page.evaluate((r) => window.__replies.push(...r), replies);
const scene = (beats, proposals = [], extra = {}) => ({
  ok: true,
  data: {
    beats,
    location: 'lantern-hall',
    present: [],
    suggestions: ['Look for Imogen', 'Sit down'],
    proposals,
    memoryNotes: '',
    ...extra,
  },
});

async function startOpenWorld(page, timeMode = 'Timeless') {
  await page.goto('/');
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: /The Open World/ }).click();
  await page.getByRole('radio', { name: new RegExp(timeMode) }).click();
  await page.getByRole('button', { name: /Begin your story/ }).click();
  await finishOpening(page);
}
const input = (page) => page.getByRole('textbox', { name: 'What do you do?' });
const save = (page) =>
  page.evaluate(() => JSON.parse(localStorage.getItem('lanternmere.save.sandbox')));

test.beforeEach(async ({ page }) => withBridge(page));

test('a typed action becomes a scene, and earned friendship is saved', async ({ page }) => {
  await startOpenWorld(page);
  await queue(
    page,
    scene(
      [
        { speaker: null, text: 'Supper noise rolls through the hall.', expression: 'neutral' },
        { speaker: 'rowan', text: 'There you are — I saved you a seat.', expression: 'warm' },
      ],
      [{ type: 'bond', character: 'rowan', delta: 3 }],
    ),
  );
  await input(page).fill('I look for Rowan.');
  await input(page).press('Enter');
  await expect(page.getByText('There you are — I saved you a seat.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Look for Imogen' })).toBeVisible();
  expect((await save(page)).bonds.rowan).toBe(3);
  expect(await page.evaluate(() => window.__prompts[0].prompt)).toContain('I look for Rowan.');
});

test('someone Claude invents appears in words, with a description', async ({ page }) => {
  await startOpenWorld(page);
  await queue(
    page,
    scene(
      [{ speaker: 'Bettany Crisp', text: 'Fresh from the oven, love.', expression: 'warm' }],
      [
        {
          type: 'person',
          name: 'Bettany Crisp',
          description: 'A tall baker with flour to her elbows.',
          role: 'baker',
          home: 'lantern-hall',
        },
      ],
    ),
  );
  await input(page).fill('I follow the smell of bread.');
  await input(page).press('Enter');
  await expect(page.getByText('Bettany Crisp', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('A tall baker with flour to her elbows.').first()).toBeVisible();
  expect((await save(page)).ai.people[0].name).toBe('Bettany Crisp');
});

test('when Claude needs a rest the words are kept and retry works', async ({ page }) => {
  await startOpenWorld(page);
  await queue(page, { ok: false, error: 'usage-limit' });
  await input(page).fill('I walk to the lake.');
  await input(page).press('Enter');
  await expect(page.getByText(/Claude needs a rest/)).toBeVisible();
  await expect(input(page)).toHaveValue('I walk to the lake.');
  await queue(
    page,
    scene([{ speaker: null, text: 'The mere is glass-still.', expression: 'neutral' }]),
  );
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.getByText('The mere is glass-still.')).toBeVisible();
  await expect(input(page)).toHaveValue('');
});

test('the world can ask to let time move; the player decides', async ({ page }) => {
  await startOpenWorld(page);
  await queue(
    page,
    scene(
      [{ speaker: null, text: 'Somewhere a clock begins to tick.', expression: 'neutral' }],
      [{ type: 'time-mode' }],
    ),
  );
  await input(page).fill('I wind the old clock.');
  await input(page).press('Enter');
  await expect(page.getByRole('dialog', { name: 'Let the year begin to move?' })).toBeVisible();
  await page.getByRole('button', { name: 'Let time move' }).click();
  expect((await save(page)).ai.timeMode).toBe('timed');
});

test('while the world thinks a veil says so, and reduced motion keeps it still', async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.setItem('lanternmere.motion', 'reduce'));
  await startOpenWorld(page);
  await queue(page, {
    ...scene([{ speaker: null, text: 'Done.', expression: 'neutral' }]),
    delay: 1500,
  });
  await input(page).fill('I wait.');
  await input(page).press('Enter');
  const veil = page.locator('.thinking-veil.active');
  await expect(veil).toBeVisible();
  await expect(veil).toHaveClass(/still/);
  await expect(page.getByText('Done.', { exact: true })).toBeVisible();
});

test('conversations become free talk, and "The story" becomes your own', async ({ page }) => {
  await startOpenWorld(page);
  await page.getByRole('button', { name: 'Talk to Rowan', exact: true }).first().click();
  await expect(
    page.getByRole('dialog').getByRole('textbox', { name: 'Say something…' }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Your story', exact: true }).click();
  await expect(page.getByRole('heading', { name: /Your story/ }).first()).toBeVisible();
});

test('a slow answer can be stopped: words kept, nothing changes', async ({ page }) => {
  await startOpenWorld(page);
  await queue(page, {
    ...scene([{ speaker: null, text: 'Too late.', expression: 'neutral' }]),
    delay: 2000,
  });
  await input(page).fill('I wait by the door.');
  await input(page).press('Enter');
  await page.getByRole('button', { name: 'Stop' }).click();
  await expect(page.getByText(/You stopped that moment/)).toBeVisible();
  await expect(input(page)).toHaveValue('I wait by the door.');
  await page.waitForTimeout(2500);
  await expect(page.getByText('Too late.')).toHaveCount(0);
  expect((await save(page)).ai.turns).toHaveLength(0);
});
