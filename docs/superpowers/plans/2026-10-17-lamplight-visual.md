# Lamplight Visual Design Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every Lanternmere screen adopts the approved warm "Lamplight" look, starting with the animated lantern-on-the-lake opening and a menu that never overwrites saves, with three reading modes, a collapsible sidebar, reusable patterns for the coming AI screens, and a documented page-by-page design review.

**Architecture:** Design tokens live in one JS module (testable for contrast) and are applied as CSS variables keyed by a reading mode on `<html>`. The opening is a self-contained feature (`src/features/opening/`) that layers CSS/SVG/canvas effects over the painting, with geometry in a pure module and derived masks generated from the painting by a script at build time. Existing screens are restyled in place within `src/styles.css` / `src/dialogue-presentation.css`, section by section.

**Tech Stack:** React 19, Vite 6, CSS variables, inline SVG filters/masks, canvas, `@fontsource` fonts, Python + Pillow (asset script), Node `node:test`, Playwright (+ `pngjs` for pixel checks), Impeccable plugin (design system, critique, audit, detector), Electron (existing).

**Spec:** `docs/superpowers/specs/2026-10-17-lamplight-visual-design.md` (companion: `docs/superpowers/specs/2026-10-16-desktop-and-ai-modes-design.md`). Approved spike and captures: `docs/design/opening-reference/` — `opening-spike.html` is the behavioral reference for every opening effect; port behavior, not code.

## Global Constraints

- Art first; light has a source; reading is sacred; one typographic voice; restrained motion with meaning; consistency through tokens; vines are an accent (spec "Design principles" 1–7).
- No gradient-filled text, no purple/blue neon, no glow on everything, no generic icon-card grids. Glow only on light sources and special moments (title, choices, chapter openings, spells, the lantern).
- Opening: trees, mountains, ridges, rocks, castle and lantern (body and base) never move; clouds/mist animate by drifting light, never pixel displacement; no flicker; fog is dusty rose, translucent, one-way drift ≈ 2.5 min, two counter-drifting layers, absent over castle and mountain slopes; water under the lantern ≈ 1/3 open-water ripple.
- Every animation stops when either the OS or the in-app "Reduce motion" setting is on (`reading.reduced`).
- Story text: ~60–75 character measure, WCAG AA (≥ 4.5:1) in all three modes; gold never used for body text.
- Fonts bundled locally; no runtime network requests.
- Desktop target 1024×700 and up; below 1024px a simple stacked fallback that keeps the existing phone browser tests green (update selectors only where markup legitimately changes; never delete those tests).
- Saves are never overwritten from the menu; save schema unchanged (version 4).
- Impeccable findings are fixed or recorded as the narrowest scoped ignore with a reason (`impeccable hooks ignore-value <rule> <value> --reason "…"` or `--file <path>`); never `ignore-file`/`ignore-rule` without asking the owner.
- Review screenshots go to `.superpowers/review/` (git-ignored); nothing private is committed.
- `npm run check`, `npm run test:browser` and `npm run test:electron` stay green at the end of every task.

## Review Focus

1. **In-app Reduce motion (OS setting off)** — the opening must be fully still, not only when the OS asks (test in Task 2).
2. **Window sizes 1024×700 and 2560×1080** — the effect overlays stay registered on the painted lantern and windows, and the title/menu never cover the lantern (tests in Task 2 and Task 3).
3. **Keyboard-only player** — Enter or Space wakes the title; Tab reaches every menu item with a visible focus mark (the vine) (test in Task 3).
4. **Most recent save unreadable** — Continue falls back to the other valid save or is hidden; the menu never crashes (test in Task 3).
5. **Parchment and Night legibility** — every text/surface token pair meets 4.5:1, including story text on the scene-reader backing (test in Task 1).

---

### Task 1: Tokens, fonts, reading modes and the design system

**Files:**
- Create: `src/theme/tokens.mjs`, `src/theme/apply.mjs`, `src/theme/lamplight.css`
- Modify: `src/dialogue-presentation.jsx` (`useReadingPreferences`: add `mode`/`setMode`), `src/main.jsx` (apply mode; import fonts and `lamplight.css` first), `package.json` (fonts, `pngjs` dev dep)
- Create: `DESIGN.md` (+ Impeccable sidecar) via `/impeccable`
- Test: `tests/theme.test.mjs`, `tests/browser/reading-modes.spec.js`

**Interfaces:**
- Produces: `READING_MODES = ['lamplight', 'parchment', 'night']`; `tokens[mode]` with keys `bg, surface, surfaceStrong, backing, ink, inkSoft, gold, goldBright, line, wine, focus` (hex strings); `contrastRatio(a: string, b: string): number` (WCAG relative luminance); `themeVariables(mode): Record<string, string>` mapping each key to `--lm-<kebab-key>`, plus `--lm-display` and `--lm-read` font stacks.
- Produces: `applyReadingMode(mode, root = document.documentElement): void` — sets `data-reading-mode` and every variable from `themeVariables`.
- Produces: `reading.mode` (default `'lamplight'`, preference key `reading-mode`) and `reading.setMode(mode)` on `useReadingPreferences()`.
- Fonts: `@fontsource/cormorant-garamond` (400, 500, 600, 400-italic), `@fontsource/cormorant-sc` (500, 600) for display/labels; `@fontsource/eb-garamond` (400, 400-italic, 500) as the reading face. `--lm-display: 'Cormorant Garamond', Georgia, serif`; `--lm-read: 'EB Garamond', Georgia, serif`.

- [ ] **Step 1: Establish the system with Impeccable.** Run `/impeccable` (shape/init) seeded with the spec's Intent, principles and anti-goals plus `docs/design/opening-reference/title.png` and `menu.png`; consult `frontend-design` for type scale. Record the resulting palette in `tokens.mjs` (Lamplight values start from the spike: ink `#fbf0d6`, inkSoft `#ecd9b2`, gold `#e8bf6e`, deep umber/wine surfaces). Commit `DESIGN.md`.

- [ ] **Step 2: Write the failing tests** in `tests/theme.test.mjs`

```js
test('every mode defines every token', () => {
  const keys = Object.keys(tokens.lamplight);
  for (const m of READING_MODES) assert.deepEqual(Object.keys(tokens[m]).sort(), keys.sort());
});
test('text meets WCAG AA on every surface in every mode', () => {
  for (const m of READING_MODES)
    for (const text of ['ink', 'inkSoft'])
      for (const surface of ['bg', 'surface', 'surfaceStrong', 'backing'])
        assert.ok(contrastRatio(tokens[m][text], tokens[m][surface]) >= 4.5, `${m} ${text}/${surface}`);
});
test('contrastRatio matches known values', () => {
  assert.equal(Math.round(contrastRatio('#000000', '#ffffff') * 10) / 10, 21);
  assert.equal(contrastRatio('#777777', '#777777'), 1);
});
test('themeVariables names variables predictably', () => {
  assert.equal(themeVariables('night')['--lm-surface-strong'], tokens.night.surfaceStrong);
});
```

and `tests/browser/reading-modes.spec.js`: choosing Parchment in reading settings sets `html[data-reading-mode="parchment"]`, changes `getComputedStyle(body).backgroundColor`, and survives reload.

- [ ] **Step 3: Run them to verify they fail**

Run: `node --test tests/theme.test.mjs`
Expected: FAIL, module not found.

- [ ] **Step 4: Implement** `tokens.mjs`, `apply.mjs`, `lamplight.css` (base element styles from variables only: body background/ink, headings in `--lm-display`, body copy in `--lm-read`, focus ring in `--lm-focus`), `useReadingPreferences` mode, and a Reading-mode select inside `ReadingControls` (labels "Lamplight", "Parchment", "Night"). Call `applyReadingMode(reading.mode)` in an effect in `App`.

- [ ] **Step 5: Verify**

Run: `npm run check` then `npm run build` then `npm run test:browser`
Expected: all pass, including the new tests.

- [ ] **Step 6: Commit**

```bash
git add src/theme DESIGN.md src/dialogue-presentation.jsx src/main.jsx package.json package-lock.json tests/theme.test.mjs tests/browser/reading-modes.spec.js
git commit -m "Add Lamplight tokens, bundled fonts and reading modes"
```

---

### Task 2: The living opening scene

**Files:**
- Create: `scripts/make_opening_assets.py`, `src/features/opening/geometry.mjs`, `src/features/opening/OpeningScene.jsx`, `src/features/opening/opening.css`, `src/features/opening/sparks.mjs`
- Modify: `package.json` (`dev` and `build` run the asset script after `prepare_art.py`), `.gitignore` (`public/opening/`)
- Test: `tests/opening-geometry.test.mjs`, `tests/browser/opening.spec.js`, `tests/browser/pixels.js`

**Interfaces:**
- `make_opening_assets.py`: reads `art/opening-lantern-mere.png`; writes `public/opening/painting.webp` (full resolution, quality ≥ 90), `public/opening/wisps-mask.png`, `public/opening/fog-zone.png`, `public/opening/castle-lights.json` (`[[x, y, size], …]` in painting pixels). Port the derivations recorded in the spec ("Precision assets") so outputs match `docs/design/opening-reference/` within a few pixels.
- `geometry.mjs` (all in painting percent units, 0–100): `LAKE` (polygon points), `LANTERN_CUTOUT` (`{ ellipse: {cx: 50, cy: 69, rx: 4.3, ry: 12}, base: {x: 46.4, y: 71, w: 7.2, h: 10} }`), `ORBS` (from the spike's six orb centres), `CALM_ZONE` (`{cx: 50, cy: 86, rx: 7.5, ry: 10, level: '#222'}`), `waterMaskDataUri(): string`, `PAINTING = {w: 1672, h: 941}`.
- `OpeningScene({ reduced: boolean, awake: boolean }): JSX` — renders painting, sky drift, water, fog, cloud light, castle twinkle, glow, ripple rings, sparks canvas and vignette; class `awake` triggers the lantern brighten. All overlays use `viewBox="0 0 1672 941" preserveAspectRatio="xMidYMid slice"` (or CSS `cover`) so they stay registered at any window size. Every animation and the canvas loop are off when `reduced`.
- `tests/browser/pixels.js`: `async motion(page, box, ms): number` — mean absolute luminance difference between two `page.screenshot({clip: box})` captures `ms` apart, decoded with `pngjs`.

- [ ] **Step 1: Write the failing unit test** `tests/opening-geometry.test.mjs`

```js
test('the calm zone is drawn before the lantern cut-out', () => {
  const svg = decodeURIComponent(waterMaskDataUri());
  assert.ok(svg.indexOf("cy='86'") < svg.indexOf("cy='69'"), 'calm patch must not reopen the lantern base');
});
test('the lantern base is covered by a square-cornered cut-out', () => {
  const { base } = LANTERN_CUTOUT;
  assert.ok(base.y + base.h >= 80 && base.x <= 46.5 && base.x + base.w >= 53.5);
});
test('orbs are cut out of the water', () => {
  const svg = decodeURIComponent(waterMaskDataUri());
  for (const o of ORBS) assert.ok(svg.includes(`cx='${o.cx}'`));
});
```

- [ ] **Step 2: Write the failing browser test** `tests/browser/opening.spec.js` (the camera push-in is paused with an injected style `.opening .scene{animation:none!important}` so only effects move; twinkle and glow paused for the still-region checks)

```js
test('still things stay still and the lake moves', async ({ page }) => {
  // boxes as fractions of a 1600×900 viewport
  expect(await motion(page, LANTERN_BASE, 3000)).toBeLessThan(0.3);
  expect(await motion(page, ROCKS_LEFT, 3000)).toBeLessThan(0.3);
  expect(await motion(page, ROCKS_RIGHT, 3000)).toBeLessThan(0.3);
  expect(await motion(page, MOUNTAIN_PEAKS, 3000)).toBeLessThan(0.3);
  expect(await motion(page, CASTLE, 3000)).toBeLessThan(0.3);
  expect(await motion(page, OPEN_LAKE, 3000)).toBeGreaterThan(2);
});
test('in-app reduce motion stills everything', async ({ page }) => {
  // set localStorage lanternmere.motion = 'reduce' before load
  expect(await motion(page, FULL_VIEW, 3000)).toBeLessThan(0.1);
});
test('overlays stay on the painted lantern at 1024×700 and 2560×1080', async ({ page }) => {
  // the glow element's centre lies within 1% of the painted lantern's centre (painting 50%, 69%) mapped through cover
});
test('no flicker: consecutive frames change smoothly', async ({ page }) => {
  // 20 captures of the valley band 100 ms apart; no frame-to-frame jump exceeds 3× the median
});
```

- [ ] **Step 3: Run to verify they fail**

Run: `node --test tests/opening-geometry.test.mjs` then `npx playwright test tests/browser/opening.spec.js`
Expected: FAIL (modules / opening not present).

- [ ] **Step 4: Implement** the script, geometry, sparks loop (`startSparks(canvas, { reduced }) => stop()`), `OpeningScene` and its CSS, porting each effect's behavior and timing from the spike (sky 38 s drift, fog 140 s / 200 s counter-drift with no `baseFrequency` animation, cloud light 85 s, twinkle 5–13 s per window, push-in 70 s). Mount it temporarily as the landing background so it can be tested; Task 3 builds the menu on top.

- [ ] **Step 5: Verify**

Run: `npm run build` then `npm run test:browser` then `npm run check`
Expected: all pass. Capture `.superpowers/review/opening.png` and compare side by side with `docs/design/opening-reference/title.png`.

- [ ] **Step 6: Commit**

```bash
git add scripts/make_opening_assets.py src/features/opening package.json package-lock.json .gitignore tests/opening-geometry.test.mjs tests/browser/opening.spec.js tests/browser/pixels.js
git commit -m "Add the living lantern opening scene"
```

---

### Task 3: Title, menu, save routing and character creation

**Files:**
- Create: `src/features/opening/TitleScreen.jsx`, `src/features/opening/menu-model.mjs`, `src/features/opening/VineButton.jsx`, `src/features/opening/CharacterCreation.jsx`
- Modify: `src/main.jsx` (replace `Landing` and the landing import block; write `lanternmere.last-mode` on save), `src/styles.css` (delete `.landing*` rules), `tests/browser/story-helpers.js`, every browser spec that enters a mode, `tests/electron/app.spec.js`
- Test: `tests/menu-model.test.mjs`, `tests/browser/title-menu.spec.js`

**Interfaces:**
- `continueTarget({ lastMode: 'book'|'live'|null, saves: { book: Game|null, live: Game|null } }): { mode, label } | null` — prefers `lastMode` when that save exists, else the other existing save, else `null`. `label = \`${game.name} · ${MODE_LABELS[mode]} · ${chapters[game.chapter].kicker}\``, `MODE_LABELS = { book: 'Read the book', live: 'Live the world' }`.
- `TitleScreen({ reduced, saves, lastMode, onContinue(mode), onChooseMode(mode), onImport(file), onSettings(), onQuit?() })` — states `'title'` (press any key) → `'menu'` → `'story'` (sub-choice). Menu items: Continue (if `continueTarget`), "The Story" (subline "The tale as it was written"); the Guided and Open World entries are not rendered yet. Top-right: Settings, Restore a saved game, Quit (Quit only when `window.lanternmere` exists; calls `window.close()`).
- `VineButton({ title, subline, lead, onClick })` — the framed button with branching vine flourishes visible when `lead`, hovered or `:focus-visible`.
- `CharacterCreation({ mode, onBegin(name, house, familiar), onBack })` — name/house/familiar (existing defaults and validation), primary button "Begin your story".
- Routing in `App`: choosing a mode whose slot has a save calls the existing `start(mode)` (continues it); an empty slot shows `CharacterCreation`, then `start(mode, name, house, familiar)`.
- Test helpers: `enterMode(page, mode)` (goto `/`, press Enter, click "The Story", click the mode, click "Begin your story" if shown) and `continueGame(page)` (goto `/`, press Enter, click the Continue button).

- [ ] **Step 1: Write the failing unit tests** `tests/menu-model.test.mjs`

```js
test('continue prefers the last played save', () => {
  assert.equal(continueTarget({ lastMode: 'book', saves: { book: g('book'), live: g('live') } }).mode, 'book');
});
test('continue falls back when the last played save is missing or unreadable', () => {
  assert.equal(continueTarget({ lastMode: 'book', saves: { book: null, live: g('live') } }).mode, 'live');
});
test('no saves, no continue', () => {
  assert.equal(continueTarget({ lastMode: null, saves: { book: null, live: null } }), null);
});
test('label names the player, mode and chapter', () => {
  assert.match(continueTarget({ lastMode: 'live', saves: { book: null, live: g('live') } }).label, /^Avery · Live the world · /);
});
```

- [ ] **Step 2: Write the failing browser tests** `tests/browser/title-menu.spec.js`: press Enter and Space each wake the title; Tab focus on a menu button shows its vine (`.vine` computed opacity > 0.9); with no save, Continue is absent and "The Story" → "Live the world" shows character creation; after playing Live, reload → Continue says "Live the world" and opens the same save; choosing "Live the world" with an existing save continues it (journal note preserved) and never shows character creation; at 1024×700 the menu's bounding box does not intersect the lantern's (painting 46–54% × 58–79% mapped through cover).

- [ ] **Step 3: Run to verify they fail**

Run: `node --test tests/menu-model.test.mjs` then `npx playwright test tests/browser/title-menu.spec.js`
Expected: FAIL.

- [ ] **Step 4: Implement** the model, components and routing; migrate every spec and the Electron spec to `enterMode` / `continueGame` (behavioral assertions unchanged); delete the old landing CSS.

- [ ] **Step 5: Verify**

Run: `npm run check` then `npm run build` then `npm run test:browser` then `npm run test:electron`
Expected: all pass; the number of browser scenarios only grows.

- [ ] **Step 6: Commit**

```bash
git add src/features/opening src/main.jsx src/styles.css tests
git commit -m "Add the title menu, safe save routing and character creation"
```

---

### Task 4: Game shell and collapsible sidebar

**Files:**
- Create: `src/features/shell/sidebar.mjs`
- Modify: `src/main.jsx` (shell markup ~lines 305–420), `src/styles.css` (shell, sidebar, header, footer sections)
- Test: `tests/sidebar.test.mjs`, `tests/browser/shell.spec.js`

**Interfaces:**
- `SIDEBAR_STATES = ['open', 'rail', 'hidden']`; `nextSidebarState(state): state` (open→rail→hidden→open); `useSidebarState(): { state, cycle(), toggleHidden() }` persisted with preference key `sidebar` (same `lanternmere.` localStorage helpers as reading preferences). `toggleHidden()` switches between `hidden` and the last visible state. Shortcut: Ctrl+B calls `toggleHidden()` (ignored while focus is in a text field).
- Shell root gets `data-sidebar="<state>"`. Rail shows icons with accessible names and tooltips; hidden leaves a small lantern button at the top-left to reopen. Below 1024px the existing mobile drawer behavior stays.

- [ ] **Step 1: Write failing tests** — unit: `nextSidebarState` cycle order and unknown input → `'open'`. Browser: collapse to rail → main content wider and nav items still reachable by name; hide → main content spans the window; Ctrl+B restores; state survives reload; at 390px the drawer still opens (existing mobile test passes unchanged).
- [ ] **Step 2: Run to verify they fail** — `node --test tests/sidebar.test.mjs`, `npx playwright test tests/browser/shell.spec.js`; Expected: FAIL.
- [ ] **Step 3: Implement** the hook and restyle the shell in Lamplight (dark warm translucent sidebar over a softly darkened scene, thin gold rules, display-face brand, quiet header with date pill).
- [ ] **Step 4: Verify** — `npm run check`, `npm run build`, `npm run test:browser`, `npm run test:electron`; Expected: pass.
- [ ] **Step 5: Commit** — `git add src/features/shell src/main.jsx src/styles.css tests/sidebar.test.mjs tests/browser/shell.spec.js && git commit -m "Restyle the game shell with a collapsible sidebar"`

---

### Task 5: Reading surfaces — book, scene reader, conversation

**Files:**
- Modify: `src/features/story/AuthoredChapter.jsx` (markup only where needed), `src/dialogue-presentation.css`, `src/styles.css` (book/story and conversation sections), `src/features/dialogue/Conversation.jsx` (markup only where needed)
- Test: existing `tests/browser/story.spec.js`, `presentation.spec.js`, `register.spec.js`, `seasonal-story.spec.js`; add `tests/browser/reading-surfaces.spec.js`

**Interfaces:** consumes `--lm-*` variables (Task 1). Story text uses `--lm-read` on `--lm-backing`; decisions and chapter openings are the "special moments" that may glow.

- [ ] **Step 1: Write the failing test** `reading-surfaces.spec.js`: in each reading mode, the book's story paragraph has computed `font-family` starting with "EB Garamond", line length ≤ 75 characters at 1440px (measured via `getBoundingClientRect` width ÷ average glyph width of a 60-char probe span), and the scene reader's `.speech-text` foreground/background computed colors reach ≥ 4.5:1 (compute with `contrastRatio` from `src/theme/tokens.mjs` loaded in the page via a script tag in the test or duplicated helper).
- [ ] **Step 2: Run to verify it fails** — `npx playwright test tests/browser/reading-surfaces.spec.js`; Expected: FAIL on font/measure.
- [ ] **Step 3: Implement** the restyle: book page as a lamplit page on the scene, portraits and illustrations framed with hairline gold, decision buttons as `VineButton`-style choices, scene reader speech box on solid backing with display-face speaker names.
- [ ] **Step 4: Verify** — `npm run check`, `npm run build`, `npm run test:browser`; Expected: pass. Run `node scripts/design-detect.mjs src/dialogue-presentation.css src/styles.css` (Task 9 creates it; before then run the Impeccable CLI directly) and fix real findings.
- [ ] **Step 5: Commit** — `git commit -am "Restyle the book, scene reader and conversations in Lamplight"`

---

### Task 6: World and people screens

**Files:**
- Modify: `src/main.jsx` (`QuestCard`, `Atlas`, `People`, `PageHeading`), `src/World.jsx`, `src/daily-life.jsx` (`DailyCard`, `Gathering`, `CharacterProfile`, `Residents`), `src/styles.css` (matching sections)
- Test: existing `tests/browser/app.spec.js` world/map/people/gathering/profile scenarios; add `tests/browser/world-screens.spec.js`

- [ ] **Step 1: Write the failing test** `world-screens.spec.js`: on Your day, the scene image fills the hero at ≥ 60% of content width at 1440px; the map's location tiles show their art and names in the display face; no element on these screens has a non-`none` `text-shadow`/`box-shadow` with a chromatic colour except elements marked `data-light-source` (query all elements; assert the list is empty).
- [ ] **Step 2: Run to verify it fails** — Expected: FAIL.
- [ ] **Step 3: Implement** the restyle (scene-led hero, warm translucent cards with hairline frames, portraits on warm tinted grounds, gathering choices as vine-accented buttons, map as an illuminated atlas).
- [ ] **Step 4: Verify** — `npm run check`, `npm run build`, `npm run test:browser`; Impeccable detector on changed CSS clean apart from recorded scoped ignores.
- [ ] **Step 5: Commit** — `git commit -am "Restyle the world, map and people screens in Lamplight"`

---

### Task 7: Records, settings and dialogs

**Files:**
- Modify: `src/main.jsx` (`Grimoire`, `Lesson`, `Calendar`, `Journal`, `Gallery`), `src/features/settings/SettingsPanel.jsx` (reading mode lives with the other reading controls), `src/features/story/epilogue.mjs` presentation in `src/main.jsx`, `src/components.jsx` (`Button`, `Modal`, `Eyebrow`), `src/styles.css` (matching sections; remove now-unused legacy rules and the old `--paper/--green/--serif` tokens once nothing references them)
- Test: existing scenarios; add `tests/browser/records-screens.spec.js`

- [ ] **Step 1: Write the failing test** `records-screens.spec.js`: Grimoire, Calendar, Journal, Settings and Gallery each render with `html[data-reading-mode]` colours (body background equals `--lm-bg`); `grep`-style assertion in a Node test that `src/styles.css` no longer contains `--green` or `Arial`; modals trap focus and close on Escape (existing behavior preserved).
- [ ] **Step 2: Run to verify it fails** — Expected: FAIL on legacy tokens.
- [ ] **Step 3: Implement** the restyle and legacy cleanup.
- [ ] **Step 4: Verify** — `npm run check`, `npm run build`, `npm run test:browser`, `npm run test:electron`; detector clean apart from recorded ignores.
- [ ] **Step 5: Commit** — `git commit -am "Restyle records, settings and dialogs; remove legacy paper theme"`

---

### Task 8: Patterns for the AI screens

**Files:**
- Create: `src/components/lamplight/ThinkingVeil.jsx`, `src/components/lamplight/StoryInput.jsx`, `src/components/lamplight/ModeCard.jsx`, `src/components/lamplight/patterns.css`, `src/features/patterns/PatternShowcase.jsx`
- Modify: `src/main.jsx` (render `PatternShowcase` when the URL has `?patterns`)
- Test: `tests/browser/patterns.spec.js`

**Interfaces:**
- `ThinkingVeil({ active: boolean, label = 'The world is stirring…', reduced: boolean })` — overlays a scene with a slow warm shimmer and the label; `role="status"`, `aria-busy={active}`; static when `reduced`.
- `StoryInput({ value, onChange(value), onSubmit(value), disabled, placeholder = 'What do you do?', maxLength = 2000 })` — single field + send button; Enter submits non-empty trimmed text; Shift+Enter inserts a newline.
- `ModeCard({ title, description, selected, onSelect })` — a large framed choice (for Timeless/Timed); `role="radio"`, `aria-checked`.

- [ ] **Step 1: Write the failing test** `patterns.spec.js` on `/?patterns`: veil has `role=status` and `aria-busy=true`; typing "Open the door" + Enter calls submit (showcase echoes "Submitted: Open the door") and empty Enter does nothing; arrow keys move selection between two ModeCards and `aria-checked` follows; each pattern passes in all three reading modes (loop over modes).
- [ ] **Step 2: Run to verify it fails** — Expected: FAIL.
- [ ] **Step 3: Implement** the three components and the showcase.
- [ ] **Step 4: Verify** — `npm run check`, `npm run build`, `npm run test:browser`.
- [ ] **Step 5: Commit** — `git add src/components/lamplight src/features/patterns src/main.jsx tests/browser/patterns.spec.js && git commit -m "Add Lamplight patterns for the coming AI screens"`

---

### Task 9: Page-by-page design review

**Files:**
- Create: `scripts/capture-screens.mjs`, `scripts/design-detect.mjs`, `docs/design/REVIEW.md`
- Modify: `package.json` (`design:screens`, `design:detect`), `DESIGN.md` (refresh via `/impeccable document`), any CSS/markup the review fixes
- Test: `tests/design-tools.test.mjs`

**Interfaces:**
- `capture-screens.mjs`: starts `vite preview` on 4174, and for each mode in `READING_MODES` × screen in `SCREENS` (`title, menu, story-choice, character-creation, your-day, map, people, profile, conversation, book, scene-reader, grimoire, lesson, calendar, journal, gathering, settings, gallery, epilogue, patterns`) at 1440×900 and 1024×700 writes `.superpowers/review/<size>/<mode>/<screen>.png`. Exports `SCREENS`.
- `design-detect.mjs`: resolves the Impeccable CLI from `IMPECCABLE_BIN` or the newest `~/.claude/plugins/cache/impeccable/impeccable/*/skills/impeccable/scripts/impeccable`, runs `detect` on `src/**/*.css` and `src/**/*.jsx`, exits non-zero on any finding not covered by recorded ignores.

- [ ] **Step 1: Write the failing test** `tests/design-tools.test.mjs`: `SCREENS` has 20 unique entries; `design-detect.mjs --list` prints the resolved CLI path or a clear "Impeccable not found" error (exit code 2).
- [ ] **Step 2: Run to verify it fails** — Expected: FAIL, modules missing.
- [ ] **Step 3: Implement** both scripts and npm scripts.
- [ ] **Step 4: Review every screen.** Run `npm run design:screens`; for each screen × mode run `/impeccable critique` and `/impeccable audit` on the screenshot and its source; ask the professional's questions (hierarchy, rhythm, contrast, density, does the art lead, does anything look templated). Fix real findings; record intentional exceptions as scoped ignores with reasons. Log each screen, mode, finding and outcome in `docs/design/REVIEW.md`. Refresh `DESIGN.md` with `/impeccable document`.
- [ ] **Step 5: Verify** — `npm run design:detect` exits 0; `npm run check`, `npm run build`, `npm run test:browser`, `npm run test:electron` all pass; `git status` shows nothing under `.superpowers/`.
- [ ] **Step 6: Commit** — `git add scripts/capture-screens.mjs scripts/design-detect.mjs docs/design/REVIEW.md DESIGN.md package.json tests/design-tools.test.mjs src && git commit -m "Run and record the page-by-page Lamplight design review"`
