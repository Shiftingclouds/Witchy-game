import { test, expect, _electron } from '@playwright/test';
import { mkdtempSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const fake = path.resolve('tests/fixtures/fake-claude.mjs');
const launch = (userData, mode) =>
  _electron.launch({
    args: ['.'],
    env: {
      ...process.env,
      LANTERNMERE_USER_DATA: userData,
      LANTERNMERE_CLAUDE_CMD: JSON.stringify([process.execPath, fake]),
      FAKE_CLAUDE_MODE: mode,
    },
  });

async function openSettings(win) {
  await win.getByText('Press any key').waitFor();
  await win.keyboard.press('Enter');
  await win.getByRole('button', { name: /The Story/ }).click();
  await win.getByRole('button', { name: /Read the book/ }).click();
  await win.getByRole('button', { name: /Begin your story/ }).click();
  await win.getByRole('button', { name: 'Leave the scene' }).click();
  await win.getByRole('button', { name: 'Settings & saves' }).click();
}

test('Settings tests the Claude connection through the bridge', async () => {
  const app = await launch(mkdtempSync(path.join(os.tmpdir(), 'lm-ai-')), 'ok');
  const win = await app.firstWindow();
  await openSettings(win);
  await expect(win.getByText(/Claude Code 9\.9\.9/)).toBeVisible();
  await win.getByRole('button', { name: 'Test connection' }).click();
  await expect(win.getByRole('status').filter({ hasText: 'Connected' })).toBeVisible();
  await app.close();
});

test('a signed-out Claude gets clear sign-in help', async () => {
  const app = await launch(mkdtempSync(path.join(os.tmpdir(), 'lm-ai-')), 'auth');
  const win = await app.firstWindow();
  await openSettings(win);
  await win.getByRole('button', { name: 'Test connection' }).click();
  await expect(win.getByText(/run claude once to sign in/)).toBeVisible();
  await app.close();
});
