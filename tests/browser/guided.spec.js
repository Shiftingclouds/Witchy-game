import { test, expect } from '@playwright/test';
import { enterMode } from './story-helpers.js';

// Stand-in bridge: answers decisions with the first authored option, everything else with a small moment.
async function withBridge(page) {
  await page.addInitScript(() => {
    window.__prompts = [];
    window.lanternmere = {
      ai: {
        status: async () => ({ available: true, version: 'test' }),
        cancel: async () => {},
        request: async (options) => {
          window.__prompts.push(options);
          if (options.schema.properties.entry)
            return {
              ok: true,
              data: { entry: 'They lingered in the hall.', memories: [], events: [] },
            };
          const decision = options.schema.properties.mappedOption?.enum;
          return {
            ok: true,
            data: {
              beats: decision
                ? [
                    {
                      speaker: null,
                      text: 'You make your choice in your own way.',
                      expression: 'neutral',
                    },
                  ]
                : [
                    {
                      speaker: null,
                      text: 'For a moment the hall is only warm light and quiet talk.',
                      expression: 'neutral',
                    },
                    {
                      speaker: 'rowan',
                      text: 'Stay a minute. The story will keep.',
                      expression: 'warm',
                    },
                  ],
              location: 'lantern-hall',
              present: ['rowan'],
              suggestions: ['Ask Rowan about home'],
              proposals: [],
              memoryNotes: '',
              interludeComplete: false,
              ...(decision ? { mappedOption: decision[0] } : {}),
            },
          };
        },
      },
    };
  });
}

async function startGuided(page) {
  await page.goto('/');
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: /The Guided Tale/ }).click();
  await page.getByRole('button', { name: /Begin your story/ }).click();
  await page.locator('.app-shell').waitFor();
}
const authored = (page) => page.locator('[data-story-beat] > p').allTextContents();

test('the authored story reads word for word as it does in the Book', async ({ page, browser }) => {
  await withBridge(page);
  await startGuided(page);
  const guidedText = (await authored(page)).slice(0, 8);
  const other = await browser.newPage();
  await other.goto('/');
  await enterMode(other, 'book');
  expect((await authored(other)).slice(0, 8)).toEqual(guidedText);
  await other.close();
});

test('answering in your own words chooses an authored option and bridges to it', async ({
  page,
}) => {
  await withBridge(page);
  await startGuided(page);
  const decision = page.locator('.scene-decision').first();
  const key = await decision.getAttribute('data-choice');
  const firstOption = decision.locator('button').first();
  await page
    .getByRole('textbox', { name: 'Or answer in your own words' })
    .fill('I sit with Rowan and listen.');
  await page.getByRole('textbox', { name: 'Or answer in your own words' }).press('Enter');
  await expect(firstOption).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByText('You make your choice in your own way.')).toBeVisible();
  const save = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('lanternmere.save.guided')),
  );
  expect(save.storyChoices[key]).toBeTruthy();
});

test('between sections there is room to linger, and the story always continues', async ({
  page,
}) => {
  await withBridge(page);
  await startGuided(page);
  for (let i = 0; i < 12 && !(await page.locator('.interlude').count()); i++) {
    const pending = page.locator('.authored-chapter .scene-decision button:not([disabled])');
    if (!(await pending.count())) break;
    await pending.first().click();
  }
  const interlude = page.locator('.interlude').first();
  await expect(interlude).toBeVisible();
  await interlude.getByRole('button', { name: /Linger here a while/ }).click();
  await interlude
    .getByRole('textbox', { name: 'What do you do?' })
    .fill('I stay by the fire a little longer.');
  await interlude.getByRole('textbox', { name: 'What do you do?' }).press('Enter');
  await expect(interlude.getByText('Stay a minute. The story will keep.')).toBeVisible();
  await interlude.getByRole('button', { name: 'Continue the story' }).click();
  await expect(interlude.getByRole('textbox')).toHaveCount(0);
});

test('the Guided Tale keeps to its path: no free travel', async ({ page }) => {
  await withBridge(page);
  await startGuided(page);
  await expect(page.getByRole('button', { name: 'World map', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Your day', exact: true })).toHaveCount(0);
});

test('the "make your decision" hint is plain text, not a drop-capped paragraph', async ({
  page,
}) => {
  await withBridge(page);
  await startGuided(page);
  const sizes = await page
    .locator('.story-gate')
    .evaluate((el) => [
      getComputedStyle(el).fontSize,
      getComputedStyle(el, '::first-letter').fontSize,
    ]);
  expect(sizes[1]).toBe(sizes[0]);
});

test('a long Guided chapter folds its history into one chronicle, asked for once', async ({
  page,
}) => {
  const { initialState, transition } = await import('../../src/engine.mjs');
  const { chapterBeats, chapterSceneId, choiceKey } = await import('../../src/scene-beats.mjs');
  let g = initialState('guided', 'Avery', 'owlcombe', 'cat');
  // Every decision in the chapter already made, as after a full read-through.
  for (let i = 0; i < 20; i++) {
    const beat = chapterBeats(g.chapter, g).find(
      (b) => b.choice && !g.storyChoices?.[choiceKey(chapterSceneId(g.chapter), b.id)],
    );
    if (!beat) break;
    g = transition(g, {
      type: 'story-choice',
      key: choiceKey(chapterSceneId(g.chapter), beat.id),
      option: beat.choice.options[0].id,
    });
  }
  for (let i = 0; i < 17; i++)
    g = transition(g, {
      type: 'ai-turn',
      player: 'I linger ' + i,
      reply: { beats: [{ speaker: null, text: 'Moment ' + i, expression: 'neutral' }] },
    });
  await page.addInitScript((save) => {
    localStorage.setItem('lanternmere.save.guided', save);
    localStorage.setItem('lanternmere.last-mode', 'guided');
  }, JSON.stringify(g));
  await withBridge(page);
  await page.goto('/');
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: /^Continue/ }).click();
  await page.locator('.app-shell').waitFor();
  await page.waitForTimeout(1500);
  const chronicles = await page.evaluate(
    () => window.__prompts.filter((p) => p.schema?.properties?.entry).length,
  );
  expect(chronicles).toBe(1);
});
