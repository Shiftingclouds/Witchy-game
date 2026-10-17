# Desktop Shell Implementation Plan (Plan 1 of 4)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lanternmere's existing Prebuilt play (Book + Live) runs as a double-clickable Windows `.exe`, saves to files in the Windows user folder, and has no old AI connection left.

**Architecture:** Electron main process serves the Vite `dist/` build over a privileged `app://` protocol (so the game's root-absolute paths like `/art/x.webp` keep working) and owns save files. The renderer reaches saves through a minimal preload bridge using synchronous IPC, so the existing synchronous `createSaveRepository` interface is unchanged. In a plain browser (`npm run dev`, Playwright browser tests) the game keeps using `localStorage`.

**Tech Stack:** Electron (current stable), electron-builder, React 19, Vite 6, Node 24 `node:test`, Playwright (browser + `_electron`).

**Spec:** `docs/superpowers/specs/2026-10-16-desktop-and-ai-modes-design.md`

**Later plans (not this one):** 2 — Claude bridge, reply contract, context/memory, `world/` lore pack. 3 — Sandbox (Timeless/Timed). 4 — Guided. Save v5, the `guided`/`sandbox` slots and the three-option menu arrive with plans 2–4.

## Global Constraints

- Windows 11, single user, personal use. Unsigned build is fine.
- Repo is public: saves, logs, build output, `.exe` files and credentials never go in Git. Save/log paths must resolve outside the repo directory.
- Prebuilt modes never call Claude and never need Internet or a login.
- Remove all API-key providers, the setup page/setup code, and the "Use ChatGPT or another AI" copy/paste bridge. Prebuilt drops the free-text AI chat box; prepared dialogue only.
- AI dialogue already stored in v4 saves (`conversations`, `conversationSequence`) is kept in the save but no longer shown. Save schema stays version 4 in this plan.
- Engine rules in `docs/ENGINE.md` still hold: deterministic commands, stable IDs, validated saves.
- Electron security: `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`; preload is CommonJS (`.cjs`) because sandboxed preloads cannot be ESM.
- Git identity is not configured on this machine. Commit steps fail until the owner sets it — stop and ask; never set it yourself.

## Review Focus

1. **Corrupt save file on disk** — read reports the existing "could not be read" error and the file is left byte-for-byte untouched (test in Task 3).
2. **Crash or power loss mid-write** — writes go to `<slot>.json.tmp` then rename; a leftover `.tmp` never replaces or blocks the real save (test in Task 3).
3. **Path traversal through `app://`** — `app://lanternmere/../../package.json` or encoded `%2e%2e` never serves a file outside `dist/` (test in Task 4).
4. **Running from the repo in dev** — the save directory still resolves under the Windows user data folder, not the repo (test in Task 3 and Task 5).
5. **Double-launching the .exe** — a second instance focuses the first window and exits, so two processes never write the same save (test in Task 5).

---

### Task 1: Windows baseline

Make the existing project install, check and build on this Windows machine before changing anything.

**Files:**
- Modify: `playwright.config.js` (only use `executablePath` when `CHROMIUM_PATH` is set; drop `--no-sandbox` unless set)
- Modify: `START_HERE.md` (Windows requirements section)

- [ ] **Step 1: Install dependencies**

Run: `npm ci` then `python3 -m pip install -r requirements-art.txt`
Expected: both succeed. If Pillow has no wheel for Python 3.15, stop and report to the owner (options: install Python 3.13 alongside, or port `scripts/prepare_art.py` to Node `sharp` — owner decides).

- [ ] **Step 2: Run the existing checks**

Run: `npm run check`
Expected: format check, character/story validation, story-export freshness and all 49 unit/API tests pass. Fix only Windows-specific breakage (path separators, line endings — prefer a `.gitattributes` with `* text=auto eol=lf` if Prettier fails on CRLF). Do not change game behavior.

- [ ] **Step 3: Build and run browser tests**

Run: `npm run build` then `npx playwright install chromium` then `npm run test:browser`
Expected: build succeeds; all 27 browser scenarios pass using Playwright's bundled Chromium.

- [ ] **Step 4: Commit**

```bash
git add playwright.config.js START_HERE.md .gitattributes
git commit -m "Make the existing build and tests run on Windows"
```

---

### Task 2: Retire the old AI connection and the HTTP server

**Files:**
- Delete: `server.mjs`, `server/` (all), `src/ai/` (all), `src/features/ai/` (all), `scripts/ai-setup-code.mjs`, `scripts/dev.mjs`, `scripts/test-server.mjs`, `scripts/build-sw.mjs`, `.env.example`, `tests/ai-setup.test.mjs`, `tests/api.test.mjs`, `tests/browser/ai-setup.spec.js`, `docs/AI_SETUP.md`
- Modify: `src/main.jsx` (remove `AISetup` lazy import, `ai` state, `/api/status` fetch, `/setup` route, service-worker registration and `offline` state, `onSetup` prop and its "AI setup & connection help" button; landing foot text no longer mentions offline download)
- Modify: `src/features/dialogue/Conversation.jsx` (remove the whole `.ai-conversation` block, `send`, bridge/paste state, `apiRequest`/`copiedCharacterContext` imports, `ai`/`online` props; initial line always comes from `talkLine(id, 'hello', game)`)
- Modify: `src/features/settings/SettingsPanel.jsx` (remove "OPTIONAL AI CONVERSATIONS" section and `ai`/`setAi`/`offline` props; storage note no longer says "Browser storage")
- Modify: `src/styles.css` (remove `.ai-conversation`, `.ai-bridge`, `.setup-page` and setup-page rules)
- Modify: `package.json` scripts: `dev` → `python3 scripts/prepare_art.py && vite`; `build` drops `&& node scripts/build-sw.mjs`; remove `start`, `ai:setup-code`; format globs drop `server/**`, `server.mjs`
- Modify: `vite.config.js` (remove `/api` proxy)
- Modify: `playwright.config.js` (`webServer.command: 'npx vite preview --port 4173 --strictPort'`)
- Modify: `tests/browser/app.spec.js` (delete the "fully cached app reloads offline" and "a reply from any AI can be pasted" tests)
- Modify: `tests/browser/character-memory.spec.js` (delete the two AI tests; keep the version-two upgrade test)
- Modify: `.gitignore` (remove `.local/` only if nothing else uses it — keep it; harmless)
- Modify docs: `START_HERE.md`, `CLAUDE_START_HERE.md`, `docs/ENGINE.md`, `characters/README.md`, `OBJECTIVES.md` — replace AI-provider/setup/offline-cache text with one line: "AI play is being rebuilt on Claude Code (`claude -p`); Prebuilt modes use prepared dialogue only." Point to the spec.

Leave `src/character-context.mjs`, `src/conversation-memory.jsx`, the engine `conversation` command and the `conversations` save fields in place — Plan 2 reuses them.

- [ ] **Step 1: Write the failing test** in `tests/no-legacy-ai.test.mjs`

```js
test('no legacy AI provider code or setup route remains', async () => {
  for (const p of ['server.mjs', 'server', 'src/ai', 'src/features/ai', '.env.example'])
    assert.equal(existsSync(p), false, p);
  const main = await readFile('src/main.jsx', 'utf8');
  assert.doesNotMatch(main, /api\/status|AISetup|serviceWorker/);
  const talk = await readFile('src/features/dialogue/Conversation.jsx', 'utf8');
  assert.doesNotMatch(talk, /apiRequest|ChatGPT|ai-bridge/);
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `node --test tests/no-legacy-ai.test.mjs`
Expected: FAIL on `server.mjs`.

- [ ] **Step 3: Make the deletions and edits listed above**

- [ ] **Step 4: Verify**

Run: `npm run format` then `npm run check` then `npm run build` then `npm run test:browser`
Expected: all pass; `grep -rn "api/\|AI_API_KEY\|setup code" src tests` returns nothing relevant. Open a conversation in `npm run dev`: prepared topics, "spend time", and "Your history with…" still work; no text box.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Remove API-key AI providers, setup page, copy bridge and HTTP server"
```

---

### Task 3: File-backed save storage

A Node module the Electron main process uses. It mirrors the `Storage`-like `getItem/setItem` shape so `createSaveRepository` (unchanged) sits on top of it.

**Files:**
- Create: `electron/save-files.mjs`
- Create: `electron/paths.mjs`
- Test: `tests/save-files.test.mjs`

**Interfaces:**
- Produces: `createFileStorage(directory: string): { getItem(key: string): string|null, setItem(key: string, value: string): void }` — key `lanternmere.save.book` maps to `<directory>/lanternmere.save.book.json`; keys must match `/^lanternmere\.[a-z.-]+$/` else throw. `setItem` writes `<file>.tmp`, then renames over `<file>`, after first copying the existing `<file>` to `<file>.bak`. Synchronous (`fs.*Sync`) because IPC is synchronous.
- Produces: `saveDirectory(userDataPath: string): string` → `path.join(userDataPath, 'saves')`; `assertOutsideRepo(dir: string, repoRoot: string): void` throws if `dir` is inside `repoRoot` (case-insensitive on Windows).

- [ ] **Step 1: Write the failing tests** (each uses a fresh `mkdtempSync(os.tmpdir())`)

```js
test('round-trips a save and keeps one backup', () => {
  const s = createFileStorage(dir);
  assert.equal(s.getItem('lanternmere.save.book'), null);
  s.setItem('lanternmere.save.book', '{"a":1}');
  s.setItem('lanternmere.save.book', '{"a":2}');
  assert.equal(s.getItem('lanternmere.save.book'), '{"a":2}');
  assert.equal(readFileSync(join(dir, 'lanternmere.save.book.json.bak'), 'utf8'), '{"a":1}');
});
test('a leftover .tmp from a crashed write is ignored', () => {
  writeFileSync(join(dir, 'lanternmere.save.live.json'), '{"ok":true}');
  writeFileSync(join(dir, 'lanternmere.save.live.json.tmp'), '{"half');
  assert.equal(createFileStorage(dir).getItem('lanternmere.save.live'), '{"ok":true}');
});
test('a corrupt save is reported by the repository and left untouched', () => {
  writeFileSync(join(dir, 'lanternmere.save.live.json'), 'not json');
  const repo = createSaveRepository(createFileStorage(dir));
  assert.throws(() => repo.read('live'), /could not be read/);
  assert.equal(readFileSync(join(dir, 'lanternmere.save.live.json'), 'utf8'), 'not json');
});
test('rejects keys that could escape the directory', () => {
  assert.throws(() => createFileStorage(dir).setItem('../evil', 'x'));
});
test('save directory is outside the repo', () => {
  assert.throws(() => assertOutsideRepo(join(process.cwd(), 'saves'), process.cwd()));
  assert.doesNotThrow(() => assertOutsideRepo(saveDirectory(os.tmpdir()), process.cwd()));
});
```

- [ ] **Step 2: Run to verify they fail**

Run: `node --test tests/save-files.test.mjs`
Expected: FAIL, module not found.

- [ ] **Step 3: Implement `electron/save-files.mjs` and `electron/paths.mjs`** per the Interfaces block. `mkdirSync(directory, {recursive: true})` on creation.

- [ ] **Step 4: Run to verify they pass**

Run: `node --test tests/save-files.test.mjs` then `npm test`
Expected: PASS. Add `electron/**/*.{mjs,cjs}` to the `format`/`format:check` globs and run `npm run format:check`.

- [ ] **Step 5: Commit**

```bash
git add electron tests/save-files.test.mjs package.json
git commit -m "Add atomic file-backed save storage outside the repo"
```

---

### Task 4: Electron window, app protocol and save bridge

**Files:**
- Create: `electron/main.mjs`, `electron/preload.cjs`, `electron/protocol.mjs`
- Create: `src/storage/platform.mjs`
- Modify: `src/main.jsx:76-79` (use `platformStorage()` instead of the inline `localStorage` object)
- Modify: `package.json` (`"main": "electron/main.mjs"`; scripts `"app": "npm run build && electron ."`; devDependency `electron`)
- Test: `tests/protocol.test.mjs`

**Interfaces:**
- Consumes: `createFileStorage`, `saveDirectory`, `assertOutsideRepo` (Task 3).
- Produces: `resolveAppPath(distDir: string, requestUrl: string): string|null` in `electron/protocol.mjs` — decodes the pathname, returns an absolute path inside `distDir`, `index.html` for `/` and for extensionless paths, `null` for anything resolving outside `distDir`.
- Produces: preload exposes `window.lanternmere = { platform: 'desktop', storage: { getItem(key), setItem(key, value) } }` via `contextBridge`, backed by `ipcRenderer.sendSync('storage:get'|'storage:set', ...)`. `setItem` throws in the renderer if main reports failure (so the existing "storage is full or unavailable" message still shows).
- Produces: `platformStorage(): {getItem, setItem}` in `src/storage/platform.mjs` — returns `window.lanternmere.storage` when present, else a `localStorage` wrapper.

`electron/main.mjs` responsibilities: `protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { standard: true, secure: true, supportFetchAPI: true } }])` before ready; on ready `protocol.handle('app', …)` using `resolveAppPath` + `net.fetch(pathToFileURL(p))`, 404 on `null`; save directory from `saveDirectory(app.getPath('userData'))`, overridable by env `LANTERNMERE_USER_DATA` (calls `app.setPath('userData', …)` first — used by tests), checked with `assertOutsideRepo` against the app path in dev; `BrowserWindow` 1440×1000, min 1024×700, title "Lanternmere", `backgroundColor` matching the landing paper colour, no menu bar, `webPreferences: { preload, contextIsolation: true, nodeIntegration: false, sandbox: true }`, loads `app://lanternmere/`; block navigation away from `app://` and open external links in the default browser; `requestSingleInstanceLock()` — second instance quits, first restores and focuses its window.

- [ ] **Step 1: Write the failing tests** in `tests/protocol.test.mjs`

```js
const dist = path.resolve('dist');
test('maps app URLs into dist', () => {
  assert.equal(resolveAppPath(dist, 'app://lanternmere/'), path.join(dist, 'index.html'));
  assert.equal(resolveAppPath(dist, 'app://lanternmere/art/mere-day.webp'), path.join(dist, 'art', 'mere-day.webp'));
  assert.equal(resolveAppPath(dist, 'app://lanternmere/book'), path.join(dist, 'index.html'));
});
test('refuses paths outside dist', () => {
  assert.equal(resolveAppPath(dist, 'app://lanternmere/../../package.json'), null);
  assert.equal(resolveAppPath(dist, 'app://lanternmere/%2e%2e/%2e%2e/package.json'), null);
  assert.equal(resolveAppPath(dist, 'app://lanternmere/..%5c..%5cpackage.json'), null);
});
```

- [ ] **Step 2: Run to verify they fail**

Run: `node --test tests/protocol.test.mjs`
Expected: FAIL, module not found.

- [ ] **Step 3: Implement `electron/protocol.mjs`, `electron/preload.cjs`, `electron/main.mjs`, `src/storage/platform.mjs`, and wire `src/main.jsx`**

- [ ] **Step 4: Verify**

Run: `npm test` then `npm run test:browser` (browser path still on localStorage) then `npm run app`
Expected: tests pass; the window opens on the landing art with crest and fonts, Book and Live both start, art loads in scenes, closing and reopening shows "Continue your story/life", and `%APPDATA%\lanternmere-academy\saves\lanternmere.save.book.json` exists. DevTools console shows no errors.

- [ ] **Step 5: Commit**

```bash
git add electron src/storage/platform.mjs src/main.jsx package.json package-lock.json tests/protocol.test.mjs
git commit -m "Run Lanternmere in an Electron window with file saves"
```

---

### Task 5: Windows .exe packaging and desktop smoke tests

**Files:**
- Create: `electron-builder.yml`
- Create: `playwright.electron.config.js`, `tests/electron/app.spec.js`
- Modify: `package.json` (devDependency `electron-builder`; scripts `"dist:win": "npm run build && electron-builder --win portable"`, `"test:electron": "npm run build && playwright test -c playwright.electron.config.js"`)
- Modify: `.gitignore` (add `release/`, `*.exe`, `*.blockmap`)
- Modify: `START_HERE.md` (how to build and run the `.exe`; where saves live)

`electron-builder.yml`: `appId: local.lanternmere`, `productName: Lanternmere`, `directories.output: release`, `files: [dist/**, electron/**, package.json]` (no originals, docs, tests, story sources), `win.target: portable`, `asar: true`. Icon: use `public/crest.svg` converted to a 256px `build/icon.png` only if electron-builder requires one; otherwise default.

- [ ] **Step 1: Write the failing smoke tests** in `tests/electron/app.spec.js` (each test launches with `_electron.launch({ args: ['.'], env: { ...process.env, LANTERNMERE_USER_DATA: tmp } })` using a fresh temp dir)

```js
test('book save survives a restart and lands in the user data folder', async () => {
  let app = await launch(tmp);
  let win = await app.firstWindow();
  await win.getByRole('button', { name: 'Read the book', exact: false }).click();
  await win.locator('.story-choices button, .book-page').first().waitFor();
  await app.close();
  expect(existsSync(join(tmp, 'saves', 'lanternmere.save.book.json'))).toBe(true);
  app = await launch(tmp);
  win = await app.firstWindow();
  await expect(win.getByRole('button', { name: /Continue your story/ })).toBeVisible();
  await app.close();
});
test('artwork loads through the app protocol', async () => {
  const app = await launch(tmp);
  const win = await app.firstWindow();
  const ok = await win.evaluate(async () => (await fetch('/art/manifest.json')).ok);
  expect(ok).toBe(true);
  await app.close();
});
test('a second instance exits instead of opening another window', async () => {
  const first = await launch(tmp);
  await first.firstWindow();
  const second = spawn(electronPath, ['.'], { env: { ...process.env, LANTERNMERE_USER_DATA: tmp } });
  const code = await new Promise((r) => second.on('exit', r));
  expect(code).toBe(0);
  expect(first.windows()).toHaveLength(1);
  await first.close();
});
```

- [ ] **Step 2: Run to verify** the first test fails or the suite fails for a missing config

Run: `npm run test:electron`
Expected: FAIL until `playwright.electron.config.js` exists (`testDir: './tests/electron'`, `workers: 1`, no `webServer`).

- [ ] **Step 3: Add the config, `electron-builder.yml`, scripts and `.gitignore` entries**

- [ ] **Step 4: Verify**

Run: `npm run test:electron` then `npm run dist:win` then `git status --porcelain`
Expected: 3 smoke tests pass; `release/Lanternmere <version>.exe` exists and double-clicking it opens the game without a terminal; `git status` shows nothing under `release/`.

- [ ] **Step 5: Commit**

```bash
git add electron-builder.yml playwright.electron.config.js tests/electron package.json package-lock.json .gitignore START_HERE.md
git commit -m "Package Lanternmere as a portable Windows exe with desktop smoke tests"
```
