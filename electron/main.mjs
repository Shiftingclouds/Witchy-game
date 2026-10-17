import { app, BrowserWindow, ipcMain, net, protocol, shell } from 'electron';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolveAppPath } from './protocol.mjs';
import { createFileStorage } from './save-files.mjs';
import { assertOutsideRepo, saveDirectory } from './paths.mjs';
import { appendFileSync, mkdirSync } from 'node:fs';
import { createClaudeBridge } from './claude-bridge.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const APP_URL = 'app://lanternmere/';

// Tests point the app at a temporary profile; this must happen before anything reads userData.
if (process.env.LANTERNMERE_USER_DATA) app.setPath('userData', process.env.LANTERNMERE_USER_DATA);

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { standard: true, secure: true, supportFetchAPI: true } },
]);

let win = null;

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (!win) return;
    if (win.isMinimized()) win.restore();
    win.focus();
  });
  app.whenReady().then(start);
  app.on('window-all-closed', () => app.quit());
}

function reply(event, work) {
  try {
    event.returnValue = { ok: true, value: work() };
  } catch (error) {
    event.returnValue = { ok: false, error: error.message };
  }
}

function start() {
  const dist = path.join(app.getAppPath(), 'dist');
  const saves = saveDirectory(app.getPath('userData'));
  if (!app.isPackaged) assertOutsideRepo(saves, app.getAppPath());
  const storage = createFileStorage(saves);

  protocol.handle('app', (request) => {
    const file = resolveAppPath(dist, request.url);
    if (!file) return new Response('Not found', { status: 404 });
    return net.fetch(pathToFileURL(file).toString());
  });
  ipcMain.on('storage:get', (event, key) => reply(event, () => storage.getItem(key)));
  ipcMain.on('storage:set', (event, key, value) => reply(event, () => storage.setItem(key, value)));

  // Claude for the AI modes. Prompts and replies stay under userData; the debug log is opt-in.
  const userData = app.getPath('userData');
  if (!app.isPackaged) assertOutsideRepo(userData, app.getAppPath());
  const logDir = path.join(userData, 'logs');
  let debugLog = false;
  const claude = createClaudeBridge({
    workDir: path.join(userData, 'claude-work'),
    log: (entry) => {
      if (!debugLog) return;
      mkdirSync(logDir, { recursive: true });
      appendFileSync(path.join(logDir, 'claude.jsonl'), JSON.stringify(entry) + '\n');
    },
  });
  ipcMain.handle('ai:status', () => claude.status());
  ipcMain.handle('ai:request', (_event, options) => {
    debugLog = Boolean(options?.debug);
    return claude.request({
      system: String(options.system),
      prompt: String(options.prompt),
      schema: options.schema,
      model: String(options.model || 'opus'),
      timeoutMs: Math.min(Number(options.timeoutMs) || 240_000, 600_000),
    });
  });
  ipcMain.handle('ai:cancel', () => claude.cancel());
  app.on('before-quit', () => claude.dispose());

  win = new BrowserWindow({
    width: 1440,
    height: 1000,
    minWidth: 1024,
    minHeight: 700,
    title: 'Lanternmere',
    backgroundColor: '#140b06',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(here, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  win.removeMenu();
  win.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith(APP_URL)) event.preventDefault();
  });
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
  win.on('closed', () => (win = null));
  win.loadURL(APP_URL);
}
