// Screenshot every screen in every reading mode at two window sizes for design review.
// Output: .superpowers/review/<size>/<mode>/<screen>.png (git-ignored). Usage: npm run design:screens
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const MODES = ['lamplight', 'parchment', 'night'];
const SIZES = [
  [1440, 900],
  [1024, 700],
];

const wake = (p) => p.keyboard.press('Enter');
const enter = async (p, mode = 'live') => {
  await wake(p);
  await p.getByRole('button', { name: /The Story/ }).click();
  await p
    .getByRole('button', { name: mode === 'book' ? /Read the book/ : /Live the world/ })
    .click();
  await p.getByRole('button', { name: /Begin your story/ }).click();
  await p.locator('.app-shell').waitFor();
};
// AI screens use a stand-in bridge: `bridge` is the reply every request gets ({ ok:false, error } for errors).
const MOMENT = {
  ok: true,
  data: {
    beats: [
      {
        speaker: null,
        text: 'Supper noise rolls through Lantern Hall: cutlery, laughter, a kettle insisting on attention.',
        expression: 'neutral',
      },
      {
        speaker: 'rowan',
        text: 'There you are. I saved you a seat — and half a plum cake.',
        expression: 'warm',
      },
      {
        speaker: 'Bettany Crisp',
        text: 'Mind the crumbs. Grey sweeps at nine.',
        expression: 'warm',
      },
    ],
    location: 'lantern-hall',
    present: ['rowan'],
    suggestions: ['Ask about the dark lantern', 'Eat the plum cake'],
    proposals: [
      {
        type: 'person',
        name: 'Bettany Crisp',
        description: 'A tall woman with flour to her elbows.',
        role: 'kitchen baker',
        home: 'lantern-hall',
      },
    ],
    memoryNotes: '',
    interludeComplete: false,
  },
};
// The Guided Tale has no invented people, so its moment keeps to the cast.
const GUIDED_MOMENT = {
  ok: true,
  data: {
    ...MOMENT.data,
    beats: MOMENT.data.beats.slice(0, 2),
    proposals: [],
  },
};
const enterAi = async (p, label) => {
  await wake(p);
  await p.getByRole('button', { name: label }).click();
  await p.getByRole('button', { name: /Begin your story/ }).click();
  await p.locator('.app-shell').waitFor();
};
const nav = (p, label) => p.getByRole('button', { name: label, exact: true }).first().click();

export const SCREENS = [
  { id: 'title', go: async () => {} },
  { id: 'menu', go: wake },
  {
    id: 'story-choice',
    go: async (p) => (await wake(p), p.getByRole('button', { name: /The Story/ }).click()),
  },
  {
    id: 'character-creation',
    go: async (p) => {
      await wake(p);
      await p.getByRole('button', { name: /The Story/ }).click();
      await p.getByRole('button', { name: /Live the world/ }).click();
    },
  },
  { id: 'your-day', go: (p) => enter(p) },
  { id: 'map', go: async (p) => (await enter(p), nav(p, 'World map')) },
  { id: 'people', go: async (p) => (await enter(p), nav(p, 'People')) },
  {
    id: 'profile',
    go: async (p) => (
      await enter(p),
      await nav(p, 'People'),
      p.locator('.person-card').first().click()
    ),
  },
  {
    id: 'conversation',
    go: async (p) => (
      await enter(p),
      p.getByRole('button', { name: 'Talk to Rowan', exact: true }).first().click()
    ),
  },
  { id: 'book', go: (p) => enter(p, 'book') },
  {
    id: 'scene-reader',
    go: async (p) => (
      await enter(p, 'book'),
      p.getByRole('button', { name: 'Play scene', exact: true }).click()
    ),
  },
  { id: 'grimoire', go: async (p) => (await enter(p), nav(p, 'Grimoire')) },
  {
    id: 'lesson',
    go: async (p) => {
      await enter(p);
      await nav(p, 'World map');
      await p.getByLabel('Find a place').fill('Charms');
      await p.getByRole('button', { name: /Charms Classroom/ }).click();
      await p.getByRole('button', { name: 'Learn Kindle', exact: true }).click();
    },
  },
  { id: 'calendar', go: async (p) => (await enter(p), nav(p, 'Calendar')) },
  { id: 'journal', go: async (p) => (await enter(p), nav(p, 'Journal')) },
  {
    id: 'gathering',
    go: async (p) => (
      await enter(p),
      p.getByRole('button', { name: 'Take part', exact: true }).first().click()
    ),
  },
  {
    id: 'settings',
    go: async (p) => (await enter(p), p.getByRole('button', { name: 'Settings & saves' }).click()),
  },
  {
    id: 'gallery',
    go: async (p) => {
      await enter(p);
      await p.getByRole('button', { name: 'Settings & saves' }).click();
      await p.getByRole('button', { name: 'Browse the art collection' }).click();
    },
  },
  {
    id: 'epilogue',
    go: async (p) => {
      await enter(p, 'book');
      for (let chapter = 0; chapter < 8; chapter++) {
        for (let i = 0; i < 20; i++) {
          const pending = p.locator('.authored-chapter .scene-decision button:not([disabled])');
          if (!(await pending.count())) break;
          await pending.first().click();
        }
        const next = p.locator('.story-choices button').first();
        if (await next.count()) await next.click();
      }
    },
  },
  { id: 'patterns', path: '/?patterns', go: async () => {} },
  {
    id: 'open-world',
    bridge: MOMENT,
    go: async (p) => {
      await enterAi(p, /The Open World/);
      const box = p.getByRole('textbox', { name: 'What do you do?' });
      await box.fill('I look for Rowan at supper.');
      await box.press('Enter');
      await p.getByText('Mind the crumbs.', { exact: false }).waitFor();
      await p.locator('.ai-scene').scrollIntoViewIfNeeded();
    },
  },
  {
    id: 'ai-error',
    bridge: { ok: false, error: 'usage-limit' },
    go: async (p) => {
      await enterAi(p, /The Open World/);
      const box = p.getByRole('textbox', { name: 'What do you do?' });
      await box.fill('I walk to the lake.');
      await box.press('Enter');
      await p.getByRole('alert').waitFor();
      await p.locator('.ai-scene').scrollIntoViewIfNeeded();
    },
  },
  {
    id: 'guided-interlude',
    bridge: GUIDED_MOMENT,
    go: async (p) => {
      await enterAi(p, /The Guided Tale/);
      for (let i = 0; i < 12 && !(await p.locator('.interlude').count()); i++) {
        const pending = p.locator('.authored-chapter .scene-decision button:not([disabled])');
        if (!(await pending.count())) break;
        await pending.first().click();
      }
      const interlude = p.locator('.interlude').first();
      await interlude.getByRole('button', { name: /Linger here a while/ }).click();
      const box = interlude.getByRole('textbox');
      await box.fill('I stay by the fire.');
      await box.press('Enter');
      await interlude.getByText('half a plum cake', { exact: false }).waitFor();
      await interlude.scrollIntoViewIfNeeded();
    },
  },
];

async function main() {
  const { chromium } = await import('@playwright/test');
  const server = spawn('npx vite preview --host 127.0.0.1 --port 4174 --strictPort', {
    shell: true,
  });
  await new Promise((r) => setTimeout(r, 3000));
  const browser = await chromium.launch();
  let count = 0;
  try {
    for (const [w, h] of SIZES)
      for (const mode of MODES) {
        const dir = `.superpowers/review/${w}x${h}/${mode}`;
        mkdirSync(dir, { recursive: true });
        for (const screen of SCREENS) {
          const page = await browser.newPage({ viewport: { width: w, height: h } });
          await page.addInitScript(
            (m) => localStorage.setItem('lanternmere.reading-mode', m),
            mode,
          );
          if (screen.bridge)
            await page.addInitScript((reply) => {
              window.lanternmere = {
                ai: {
                  status: async () => ({ available: true, version: 'review' }),
                  cancel: async () => {},
                  request: async () => reply,
                },
              };
            }, screen.bridge);
          await page.goto('http://127.0.0.1:4174' + (screen.path || '/'));
          await page.waitForTimeout(700);
          try {
            await screen.go(page);
            await page.waitForTimeout(1200);
            await page.screenshot({ path: `${dir}/${screen.id}.png` });
            count++;
          } catch (error) {
            console.error(`${w}x${h} ${mode} ${screen.id}: ${error.message.split('\n')[0]}`);
          }
          await page.close();
        }
      }
  } finally {
    await browser.close();
    server.kill();
  }
  console.log(`Captured ${count} screens into .superpowers/review/`);
  process.exit(0);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
