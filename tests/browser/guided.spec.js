import { test, expect } from '@playwright/test';
import { enterMode, finishOpening } from './story-helpers.js';

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
  await page.getByRole('button', { name: /^New game/ }).click();
  await page.getByRole('button', { name: /The Guided Tale/ }).click();
  await page.getByRole('button', { name: /Begin your story/ }).click();
  await finishOpening(page);
}
/** In the scene player, press on until a decision is offered (choosing the first option at others). */
async function toDecision(page) {
  for (let i = 0; i < 150; i++) {
    if (await page.locator('.scene-choice-panel textarea, .scene-choice-panel input').count())
      return;
    await page.keyboard.press('Enter');
  }
  throw new Error('no decision reached');
}

test('answering in your own words chooses an authored option and bridges to it', async ({
  page,
}) => {
  await withBridge(page);
  await page.addInitScript(() => localStorage.setItem('lanternmere.text-speed', 'instant'));
  await startGuided(page);
  await toDecision(page);
  const decision = page.locator('.scene-choice-panel .scene-decision');
  const key = await decision.getAttribute('data-choice');
  const box = page.getByRole('textbox', { name: 'Or answer in your own words' });
  await box.fill('I sit with Rowan and listen.');
  await box.press('Enter');
  await expect(page.locator('.dialogue-text')).toContainText(
    'You make your choice in your own way.',
  );
  const save = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('lanternmere.save.guided')),
  );
  expect(save.storyChoices[key]).toBeTruthy();
  await page.keyboard.press('Enter');
  await expect(page.locator('.dialogue-text')).not.toContainText('You make your choice');
});

test('between sections there is room to linger, and the story always continues', async ({
  page,
}) => {
  await withBridge(page);
  await page.addInitScript(() => localStorage.setItem('lanternmere.text-speed', 'instant'));
  await startGuided(page);
  for (let i = 0; i < 200 && !(await page.locator('.scene-interlude').count()); i++) {
    const option = page.locator('.scene-choice-panel .scene-decision button:not([disabled])');
    if (await option.count()) await option.first().click();
    else await page.keyboard.press('Enter');
  }
  const interlude = page.locator('.scene-interlude');
  await interlude.getByRole('button', { name: /Linger here a while/ }).click();
  const box = interlude.getByRole('textbox', { name: 'What do you do?' });
  await box.fill('I stay by the fire a little longer.');
  await box.press('Enter');
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
  await page.locator('.title-menu .vine-button').first().click();
  await page.locator('.app-shell').waitFor();
  await page.waitForTimeout(1500);
  const chronicles = await page.evaluate(
    () => window.__prompts.filter((p) => p.schema?.properties?.entry).length,
  );
  expect(chronicles).toBe(1);
});
