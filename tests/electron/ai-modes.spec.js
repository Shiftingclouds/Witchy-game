import { test, expect, _electron } from '@playwright/test';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { finishOpening } from './opening.js';

const fake = path.resolve('tests/fixtures/fake-claude.mjs');
const replyFile = path.join(mkdtempSync(path.join(os.tmpdir(), 'lm-reply-')), 'reply.json');
writeFileSync(
  replyFile,
  JSON.stringify({
    beats: [
      { speaker: null, text: 'The mere is glass-still under the evening.', expression: 'neutral' },
      { speaker: 'rowan', text: 'Thought I’d find you here.', expression: 'warm' },
    ],
    location: 'lantern-hall',
    present: ['rowan'],
    suggestions: ['Walk back together'],
    proposals: [{ type: 'bond', character: 'rowan', delta: 2 }],
    memoryNotes: '',
  }),
);
const launch = (userData) =>
  _electron.launch({
    args: ['.'],
    env: {
      ...process.env,
      LANTERNMERE_USER_DATA: userData,
      LANTERNMERE_CLAUDE_CMD: JSON.stringify([process.execPath, fake]),
      FAKE_CLAUDE_MODE: 'ok',
      FAKE_CLAUDE_REPLY: replyFile,
    },
  });

test('an Open World turn survives quitting, and no log is written unless asked', async () => {
  const userData = mkdtempSync(path.join(os.tmpdir(), 'lm-aimodes-'));
  let app = await launch(userData);
  let win = await app.firstWindow();
  await win.getByText('Press any key').waitFor();
  await win.keyboard.press('Enter');
  await win.getByRole('button', { name: /^New game/ }).click();
  await win.getByRole('button', { name: /The Open World/ }).click();
  await win.getByRole('button', { name: /Begin your story/ }).click();
  await finishOpening(win);
  const box = win.getByRole('textbox', { name: 'What do you do?' });
  await box.fill('I walk down to the water.');
  await box.press('Enter');
  await expect(win.getByText('The mere is glass-still under the evening.')).toBeVisible();
  await app.close();

  expect(existsSync(path.join(userData, 'logs', 'claude.jsonl'))).toBe(false);
  const saved = readFileSync(path.join(userData, 'saves', 'lanternmere.save.sandbox.json'), 'utf8');
  expect(saved).toContain('I walk down to the water.');

  app = await launch(userData);
  win = await app.firstWindow();
  await win.getByText('Press any key').waitFor();
  await win.keyboard.press('Enter');
  await win.getByRole('button', { name: /^Continue/ }).click();
  await win.locator('.title-menu .vine-button').first().click();
  await expect(win.getByText('The mere is glass-still under the evening.')).toBeVisible();
  await app.close();
});

test('with the debug log turned on, exchanges are logged under userData', async () => {
  const userData = mkdtempSync(path.join(os.tmpdir(), 'lm-aidebug-'));
  const app = await launch(userData);
  const win = await app.firstWindow();
  await win.getByText('Press any key').waitFor();
  await win.keyboard.press('Enter');
  await win.getByRole('button', { name: /^New game/ }).click();
  await win.getByRole('button', { name: /The Open World/ }).click();
  await win.getByRole('button', { name: /Begin your story/ }).click();
  await finishOpening(win);
  await win.getByRole('button', { name: 'Settings & saves' }).click();
  await win.getByRole('combobox', { name: 'Debug log' }).selectOption('on');
  await win.keyboard.press('Escape');
  const box = win.getByRole('textbox', { name: 'What do you do?' });
  await box.fill('I look at the lanterns.');
  await box.press('Enter');
  await expect(win.getByText('The mere is glass-still under the evening.')).toBeVisible();
  await app.close();
  const log = readFileSync(path.join(userData, 'logs', 'claude.jsonl'), 'utf8');
  expect(log).toContain('I look at the lanterns.');
});
