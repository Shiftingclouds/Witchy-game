import { test, expect, _electron } from '@playwright/test';
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync } from 'node:fs';
import os from 'node:os';
import { join } from 'node:path';
import electronPath from 'electron';

const launch = (userData) =>
  _electron.launch({ args: ['.'], env: { ...process.env, LANTERNMERE_USER_DATA: userData } });
let tmp;
test.beforeEach(() => {
  tmp = mkdtempSync(join(os.tmpdir(), 'lanternmere-desktop-'));
});

test('book save survives a restart and lands in the user data folder', async () => {
  let app = await launch(tmp);
  let win = await app.firstWindow();
  await win.getByText('Press any key').waitFor();
  await win.keyboard.press('Enter');
  await win.getByRole('button', { name: /The Story/ }).click();
  await win.getByRole('button', { name: /Read the book/ }).click();
  await win.getByRole('button', { name: /Begin your story/ }).click();
  await expect(win.locator('.scene-player')).toBeVisible();
  await app.close();
  expect(existsSync(join(tmp, 'saves', 'lanternmere.save.book.json'))).toBe(true);
  app = await launch(tmp);
  win = await app.firstWindow();
  await win.getByText('Press any key').waitFor();
  await win.keyboard.press('Enter');
  await expect(win.getByRole('button', { name: /^Continue.*Read the book/ })).toBeVisible();
  await app.close();
});

test('artwork loads through the app protocol', async () => {
  const app = await launch(tmp);
  const win = await app.firstWindow();
  await win.waitForLoadState('load');
  const ok = await win.evaluate(async () => (await fetch('/art/manifest.json')).ok);
  expect(ok).toBe(true);
  await app.close();
});

test('a second instance exits instead of opening another window', async () => {
  const first = await launch(tmp);
  await first.firstWindow();
  const second = spawn(electronPath, ['.'], {
    env: { ...process.env, LANTERNMERE_USER_DATA: tmp },
  });
  const code = await new Promise((resolve) => second.on('exit', resolve));
  expect(code).toBe(0);
  expect(first.windows()).toHaveLength(1);
  await first.close();
});

test('the app name, and so the save folder, is Lanternmere in dev and the exe', async () => {
  const app = await launch(tmp);
  expect(await app.evaluate(({ app }) => app.getName())).toBe('Lanternmere');
  await app.close();
});

test('the window opens on the dark opening colour, not a pale flash', async () => {
  const app = await launch(tmp);
  await app.firstWindow();
  const colour = await app.evaluate(({ BrowserWindow }) =>
    BrowserWindow.getAllWindows()[0].getBackgroundColor(),
  );
  expect(colour.toLowerCase()).toBe('#140b06');
  await app.close();
});
