# Scene Player, Arrival Paintings and New Opening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the story play full screen like a game (framed portraits over the place's painting, a fixed dialogue box), show each new place full screen on arrival, and replace the rushed opening with a slow one where house and familiar are chosen inside the story.

**Architecture:**
- A new `src/features/scene/` module replaces `SceneReader`:
  - pure staging logic in `stage.mjs`;
  - a line-reveal hook keyed to the line id;
  - small components: `PortraitFrame`, `DialogueBox`, `ArrivalPainting`, `ScenePlayer`.
- `main.jsx` renders `ScenePlayer` full screen instead of the "performance" modal, and forces it during the opening while the house or familiar is still unchosen.
- Story choice options gain an `effects` field that sets house and familiar. Saves move to v6.

**Tech Stack:** React 19, Vite 6, vanilla CSS with `--lm-*` tokens, node:test, Playwright (`npm run test:browser`), Electron tests (`npm run test:electron`).

**Spec:** `docs/superpowers/specs/2026-10-17-scene-player-and-opening-design.md`. Visual references: Superdesign drafts A (`8040c880-8805-45d7-b284-5227da267a11`) and B (`6d083bd6-c96b-4210-9972-21a7966a617e`); their HTML is in `.superdesign/tmp/scene-a.html` and `scene-b.html`, screenshots in `.superpowers/review/sd-scene-{a,b}.png`.

## Global Constraints

- Lamplight tokens only (`src/theme/tokens.mjs`). Gold is hairline jewellery: no gradient text, no pill buttons, no glassmorphism cards, no emoji.
- Fonts: Cormorant Garamond for names, EB Garamond for dialogue, Cormorant SC for small labels. Dialogue 21px, 1.55 leading.
- Speech is always wrapped with `spoken()` from `src/scene-beats.mjs`; narration is plain.
- The scene shows none of these: "Your story", line numbers, "speaking"/"listening" labels, chapter titles or subtitles, section titles, a window title.
- Next and Back sit at fixed positions inside a fixed-size dialogue box. Their bounding boxes never move between lines.
- Portrait frames always crop the art: anchored to the bottom and zoomed slightly (`transform: scale(1.06)`, `transform-origin: bottom center`), so the cut shoulders and sides never show.
- Reduced motion (device or in-game) means no typing animation (full line at once), no shrink animation (a cut), and no glow pulse.
- Existing arrival decision keys and option ids stay unchanged: `arrival:first-observation`, `arrival:corridor-job`, `arrival:common-room-rule`, `arrival:watering-method`, `arrival:night-intention`.
- The repo is public: nothing private is committed. Commit after each task (owner's choice); never push.

## Review Focus

1. **A ChatGPT reply that drops or renames a decision.** The import must refuse it and name what is missing, so the save callbacks never break. Test in Task 8.
2. **An old v5 save in the middle of chapter 0.** It must migrate to v6 with its house and familiar answered, and must never see or block on the new crossing, house and familiar decisions. Test in Task 5.
3. **Rapid clicking or holding Enter.** Each press either finishes the current line or advances exactly one line. It never skips a decision and never shows an empty box. Test in Task 2.
4. **A section where only the narrator speaks.** There are no portrait frames, the box is full width, and nothing crashes. Test in Task 1 (`staging([]) === 'none'`) and Task 3.
5. **A 1024×700 window.** The stage row plus the box fits without covering the text or overflowing. Test in Task 3.
6. **The opening interrupted (app closed after choosing a house, before a familiar).** It resumes in the forced player at the familiar decision with the house kept. Test in Task 5.

---

### Task 1: Staging logic

**Files:**
- Create: `src/features/scene/stage.mjs`
- Test: `tests/scene-stage.test.mjs`

**Interfaces:**
- Produces:
  - `sectionCast(beats, index) -> string[]`: character ids for everyone who speaks or is listed in `actors` on any beat sharing `beats[index].section.id` (or the whole list if the beats have no section). Ordered by first appearance, no duplicates.
  - `staging(cast) -> 'group' | 'single' | 'none'`: two or more is `'group'`, one is `'single'`, none is `'none'`.
  - `timeOfDay(period) -> 'morning' | 'afternoon' | 'evening' | 'night'`: period 0 to 3 maps in order; anything else gives `'evening'`.
  - `emotionOf(beat, id) -> string`: the `emotion` from the beat's `actors` entry for `id`, else `'neutral'`.

- [ ] **Step 1: Write the failing tests**

```js
test('everyone in a section is on stage from its first line', () => {
  const beats = chapterBeats(0, initialState('book', 'A', 'owlcombe', 'cat'));
  const i = beats.findIndex((b) => b.speaker === 'rowan');
  assert.ok(sectionCast(beats, i).includes('imogen'));
});
test('staging follows how many people are present', () => {
  assert.equal(staging(['rowan', 'imogen']), 'group');
  assert.equal(staging(['rowan']), 'single');
  assert.equal(staging([]), 'none');
});
test('time of day comes from the period', () => {
  assert.deepEqual([0, 1, 2, 3, 9].map(timeOfDay), ['morning', 'afternoon', 'evening', 'night', 'evening']);
});
```

- [ ] **Step 2:** `node --test tests/scene-stage.test.mjs`. Expected: FAIL (module missing).
- [ ] **Step 3:** Implement the four functions in `stage.mjs`.
- [ ] **Step 4:** Same command. Expected: 3 pass.
- [ ] **Step 5:** Commit "Add scene staging logic".

### Task 2: Line reveal and the dialogue box

**Files:**
- Create: `src/features/scene/useLineReveal.mjs`, `src/features/scene/DialogueBox.jsx`, `src/features/scene/scene.css`
- Test: `tests/browser/scene-player.spec.js` (new)

**Interfaces:**
- Consumes: `textCharacters`, `letterDelay` and `textSpeeds` from `src/scene-beats.mjs`; `spoken`.
- Produces:
  - `useLineReveal(lineId, text, { speed, reduced, paused }) -> { visible: string, complete: boolean, reveal(): void }`. State is keyed to `lineId`: for a new id, the first render already has `complete === false` (or `true` under reduced motion) and `visible` is the start of the new text, never the old line.
  - `DialogueBox({ speakerName, text, reveal, choice, onNext, onBack, canBack, nextLabel, children })`. A fixed 230px box with `.scene-next` at the bottom right and `.scene-back` at the bottom left. A choice renders as framed option buttons inside the box. When `speakerName` is null, no name plate is shown.

- [ ] **Step 1: Write the failing browser tests.** They open the Book and land in the scene player, which Task 4 makes the default. Until then, open it through the existing "Play scene" button.

```js
test('Next stays put from line to line', async ({ page }) => { /* record .scene-next boundingBox on 4 consecutive lines; all x/y equal */ });
test('the first press finishes a line, the second moves on, and no line is ever blank', async ({ page }) => {
  /* press Enter: .dialogue-text text length grows to full and the same line stays; press Enter: line id changes; after 10 rapid Enter presses, .dialogue-text is never empty and a pending decision is still shown */
});
test('the scene shows no meta labels', async ({ page }) => {
  for (const t of [/Your story/, /Line \d+/, /speaking/i, /listening/i]) await expect(page.locator('.scene-player')).not.toContainText(t);
});
```

- [ ] **Step 2:** `npm run build && npx playwright test tests/browser/scene-player.spec.js`. Expected: FAIL.
- [ ] **Step 3:** Implement the hook and `DialogueBox`, and style per draft A's box: umber `--lm-backing` at 88%, a gold double hairline, 2px radius, fixed height, the text area scrolling inside if a line is long. Wire them into a minimal `ScenePlayer` (Task 3 completes it).
- [ ] **Step 4:** Same command. Expected: PASS.
- [ ] **Step 5:** Commit "Add the fixed dialogue box and keyed line reveal".

### Task 3: Portrait frames and staging

**Files:**
- Create: `src/features/scene/PortraitFrame.jsx`, `src/features/scene/ScenePlayer.jsx`
- Modify: `src/features/scene/scene.css`
- Test: `tests/browser/scene-player.spec.js`

**Interfaces:**
- Consumes: Task 1 (`sectionCast`, `staging`, `timeOfDay`, `emotionOf`); `sceneArt`, `art`, `Portrait`, `resolveExpression`.
- Produces:
  - `PortraitFrame({ id, emotion, location, period, size: 'stage' | 'box' | 'cameo', speaking })`. A gold double-hairline frame containing the place's painting (via `sceneArt`) with a `data-time={timeOfDay(period)}` tint overlay, and the portrait cropped per the Global Constraints. The name plate sits below the frame and is never overlapped.
  - `ScenePlayer({ game, act, reading, onExit })`. Full window (`.scene-player`, `position: fixed; inset: 0`):
    - the place's painting behind everything, with a vignette and a bottom shadow;
    - staging `'group'`: a row of `stage` frames seated directly on top of the box, the speaker `.speaking` (scaled 1.06, gold glow) and the others `.shadowed` (`filter: brightness(0.62)`);
    - staging `'single'`: one `box` frame inside the left of the box, overlapping its top edge by 40px;
    - staging `'none'`: a full-width box.
  - Tints (CSS, overlay `mix-blend-mode: multiply` plus a soft-light warm layer): `morning` rgba(240,214,150,.18); `afternoon` rgba(255,196,120,.14); `evening` rgba(196,104,92,.30); `night` rgba(30,36,72,.48).

- [ ] **Step 1: Write the failing tests**

```js
test('Imogen is on stage in the opening supper from its first line', async ({ page }) => { /* reach first rowan line; expect .portrait-frame[data-id="imogen"] visible */ });
test('a group scene seats every frame on the dialogue box, name plates clear', async ({ page }) => { /* frame bottom === box top ± 2px; each .name-plate box does not intersect any frame */ });
test('at 1024×700 the stage and box fit inside the window', async ({ page }) => { /* all frames and the box within the viewport; .dialogue-text not covered */ });
test('narration-only sections show no frames', async ({ page }) => { /* on a beat whose section has no cast, .portrait-frame count 0 */ });
```

- [ ] **Step 2:** Run the spec. Expected: FAIL.
- [ ] **Step 3:** Implement. Draw on draft B for the group row and draft A for single. Fix the two draft flaws: name plates covered, and the frame backdrop not being the location.
- [ ] **Step 4:** Run the spec. Expected: PASS.
- [ ] **Step 5:** Commit "Stage scenes with framed portraits over the place".

### Task 4: Make it the default, with settings and history

**Files:**
- Create: `src/features/scene/SceneMenu.jsx` (gear popover and history drawer)
- Modify: `src/main.jsx` (the `'performance'` modal, `Story` book actions, the `book` view, the footer), `src/dialogue-presentation.jsx` (delete `SceneReader` and `PortraitStage` once unused), `src/features/story/AuthoredChapter.jsx`, `src/features/dialogue/Conversation.jsx`
- Test: `tests/browser/scene-player.spec.js`, plus updates to `tests/browser/reading-surfaces.spec.js` and `app.spec.js` where they open "Play scene"

**Interfaces:**
- Produces:
  - preference `lanternmere.scene-view`: `'play'` (default) or `'page'`, read and written with try/catch;
  - the `book` view renders `<ScenePlayer onExit={…} />` when it is `'play'`, and the existing page when it is `'page'`;
  - the gear holds text speed, text size and motion (reusing `useReadingPreferences`) and a **Read as a page** toggle;
  - the history drawer lists the lines so far, with speech `spoken()`;
  - exit (top left) returns to Your day in Live-like modes, or the main menu in Book-like modes;
  - keys: Space or Enter for next, Backspace for back, Esc to exit;
  - chapter titles and kickers are removed from the book page heading and from the footer status line;
  - one-on-one conversations (`src/features/dialogue/Conversation.jsx`) show the person in a `PortraitFrame` (`size="box"`) with the current place tinted for the time of day, replacing the bare portrait.

- [ ] **Step 1: Failing tests:** opening The story shows `.scene-player` by default; the gear's "Read as a page" switches to the book page and the choice survives a reload; the reading controls under the box are gone; Esc exits; the page and the footer contain no "Chapter" text; a conversation shows `.portrait-frame`.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement. Remove the "Play scene" and "Reading settings" buttons from the book page; the page view gets a small gear too.
- [ ] **Step 4:** `npm run build && npm run test:browser`. Expected: all pass, with the updated older tests.
- [ ] **Step 5:** Commit "Play the story full screen by default".

### Task 5: Engine for the in-story opening

**Files:**
- Modify:
  - `src/engine/state.mjs` (`SAVE_VERSION = 6`; `initialState(mode, name, house = null, familiar = null, opts)`);
  - `src/engine/migrations.mjs` (add 5 → 6);
  - `src/engine/save.mjs` (`parseSave` accepts a null house or familiar, but if one is set it must be valid);
  - `src/engine/systems/story.mjs` (apply `option.effects`);
  - `src/engine/selectors.mjs` (`needsOpening`);
  - `src/features/opening/CharacterCreation.jsx` (name only, plus the time mode for the Open World);
  - `src/main.jsx` (`start(mode, name, timeMode)`; force `ScenePlayer` when `needsOpening`);
  - `src/World.jsx` and `src/ai/context.mjs` (guard a null house).
- Test: `tests/opening-engine.test.mjs`, `tests/browser/title-menu.spec.js` (creation), `tests/browser/scene-player.spec.js`

**Interfaces:**
- Produces:
  - `needsOpening(state) -> boolean` is `!state.house || !state.familiar`;
  - a choice option may carry `effects: { house?: houseId, familiar?: familiarId }`. `story-choice` sets `s.house` or `s.familiar` when the id is valid;
  - decision keys `arrival:crossing` (options `toby`, `castle`), `arrival:house` (option ids are house ids) and `arrival:familiar` (option ids are familiar ids);
  - migration 5 → 6: when `house` is set and missing from storyChoices, set `storyChoices['arrival:house'] = house`, `['arrival:familiar'] = familiar` and `['arrival:crossing'] = 'castle'`.

- [ ] **Step 1: Failing tests**

```js
test('a new game starts without a house or familiar and needs the opening', () => {
  const g = initialState('book', 'Avery'); assert.equal(g.house, null); assert.ok(needsOpening(g));
});
test('choosing in the story sets house and familiar', () => { /* story-choice arrival:house owlcombe → g.house === 'owlcombe'; arrival:familiar fox → g.familiar === 'fox' */ });
test('an old v5 save mid-chapter-0 migrates with the new decisions answered', () => { /* v5 save with house rookhallow → v6, storyChoices['arrival:house'] === 'rookhallow', pendingStoryChoice is not the crossing/house/familiar beat */ });
test('a half-finished opening survives a reload', () => { /* house set, familiar null → parseSave ok, needsOpening true */ });
```

Browser test: creation asks only "Your name" (no house or familiar selects), then lands in `.scene-player`; the sidebar is hidden until the familiar is chosen.

- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement. The forced player has no exit except Main menu.
- [ ] **Step 4:** `npm run check && npm run build && npm run test:browser`. Expected: PASS.
- [ ] **Step 5:** Commit "Choose house and familiar inside the story".

### Task 6: Arrival paintings

**Files:**
- Create: `src/features/scene/ArrivalPainting.jsx`
- Modify: `ScenePlayer.jsx`, `src/main.jsx` (`visit`), `scene.css`
- Test: `tests/browser/scene-player.spec.js`, `tests/browser/world-screens.spec.js`

**Interfaces:**
- Produces: `ArrivalPainting({ location, period, reduced, onDone })`.
  - It shows the place's painting full window with only its name, in Cormorant SC 13px letterspaced, at the bottom centre.
  - Click, Enter or Space calls `onDone` after a 700ms shrink: `transform: scale` to the scene layout, then fades out. Under reduced motion it calls `onDone` at once.
  - `ScenePlayer` shows it before the first line of any section whose `location` differs from the previous section's.
  - In `main.jsx`, `visit(location)` shows it over Your day on each travel.

- [ ] **Step 1: Failing tests:** opening the story shows `.arrival-painting` with the place name and no dialogue box; one click reveals the box. Travelling to another place on Your day shows `.arrival-painting` for that place. Under reduced motion it is gone within 100ms of the click.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run. Expected: PASS.
- [ ] **Step 5:** Commit "Show each new place full screen on arrival".

### Task 7: House crests, and pictures beside the arrival choices

**Files:**
- Create: `src/components/lamplight/HouseCrest.jsx`
- Modify: `src/World.jsx` (house card), the scratchpad brief generator, `docs/design/CHATGPT_CHARACTER_PORTRAITS.md` (regenerated) and `docs/design/CHARACTER_ART_REQUESTS.md` (crest rows, so slots exist)
- Test: `tests/browser/world-screens.spec.js`, `tests/art-slots.test.mjs`

**Interfaces:**
- Produces: `HouseCrest({ house, size = 64 })`.
  - It renders `art('crest-' + house)` when the art manifest entry exists and is not a placeholder.
  - Otherwise it renders an inline SVG fallback: a gold hairline shield with the house's bird name initial in Cormorant SC, on `--lm-backing`.
  - Files requested: `crest-owlcombe.png`, `crest-rookhallow.png`, `crest-heronmere.png`, `crest-larkspire.png` (1024×1024, transparent, gold-and-ink heraldic badge featuring the house bird: owl, rook, heron, lark).

- **Owner request (17 October): pictures beside the arrival choices.**
  - When choosing your familiar, each option shows that familiar's painting (`fam-<id>`, the art already in the game) in a small framed box (gold double hairline, the same frame style as portraits) beside its label.
  - The house decision shows each house's crest (`HouseCrest`) beside its option the same way.
  - A decision option may carry `image: <art id>` or `crest: <house id>`. `SceneDecision` renders the framed picture to the left of the label, in both the scene player and the page view. Options without one are unchanged.
- Test (add to Step 1): the familiar decision shows eight `.choice-picture img` (one per familiar, alt "<Familiar>"); the house decision shows four `.choice-picture` crests.

- [ ] **Step 1: Failing test:** the house card on Your day contains `.house-crest svg` (fallback) for a new Live game whose house is chosen; `slots.json` includes the four crest files.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement, and append the crest section to the ChatGPT brief (before the app icon).
- [ ] **Step 4:** Run. Expected: PASS.
- [ ] **Step 5:** Commit "Add house crests and request their art".

### Task 8: Story skeleton, the ChatGPT rewrite brief, and the importer

The owner prefers ChatGPT's prose. I build the structure; ChatGPT writes every line of the story, the new opening first.

**Files:**
- Create:
  - `story-drafts/00-opening-skeleton.md`: the new opening as a beat-by-beat outline in the export's script format. Sections `crossing` (`mere`, period 2), `landing` (`boathouse`, 2), `hall` (`lantern-hall`, 2), `house` (`lantern-hall`, 2), `familiar` (`lantern-hall`, 2), then the supper (`lantern-hall`, 2), where Rowan and Imogen meet the player as strangers. Each beat is a one-line stage direction, not finished prose;
  - `src/story/arrival-prologue.mjs`: placeholder beats generated from the skeleton, so Tasks 5–7 and the forced opening run before ChatGPT delivers;
  - `scripts/story-script.mjs`: parser and writer for the script format;
  - `scripts/import-story.mjs`: imports a ChatGPT reply into the game;
  - `docs/design/CHATGPT_STORY_REWRITE.md`: the single brief the owner gives ChatGPT.
- Modify: `src/story/arrival.mjs` (prepend the prologue), `src/story/choices.mjs` (introductions for `arrival:crossing` → `['toby', 'cas', 'tully']`), `package.json` (`"import:story": "node scripts/import-story.mjs"`)
- Test: `tests/story-script.test.mjs`, `tests/opening-story.test.mjs`

**Interfaces:**
- **The script format** extends the existing `story/*.md` export:
  - `## <Section title>` followed by `<!-- section: <id> | place: <locationId> | period: <0-3> -->`;
  - narration as plain paragraphs, one beat per paragraph;
  - speech as `**<Name> (<emotion>):** <line>`, with the name matching `characters` and the emotion one of that character's `expressions` (else `neutral`);
  - a decision block as `**Choice — <prompt>**`, then `Decision: \`<key>\``, then one `- <option id>: <label> — <hint>` line per option and an optional `Journal (<option id>): <text>`;
  - `> Branch: (\`<key>\` = \`<option id>\`)` before branch beats, and `> All routes rejoin here.` after them.
- `parseStoryScript(markdown) -> { sections: Section[], errors: string[] }` and `writeStoryScript(stagedScene) -> markdown`.
- `node scripts/import-story.mjs <file.md> [--chapter N]`:
  - it validates: every section id, decision key and option id in the skeleton is present (extra beats are allowed), every speaker and emotion is known, every place exists, and no beat is empty;
  - only on a clean validation does it write `src/story/chapters/<NN>-<scene>.mjs` (a staged scene). Non-prose metadata (`remember`, `effects`, `when` gates, `introductions`) is merged from the current scene by key and option id;
  - the scene registry prefers `src/story/chapters/` over the hand-written modules when a chapter file exists.
- **The brief contains:**
  - the owner's writing standard;
  - the format above with a short example;
  - per character, their house, voice and allowed emotions;
  - per chapter, the mystery facts it may reveal (from `src/ai/world/mystery.mjs`, stated as limits, never the hidden truth), the decision keys, option ids and branch gates that must survive, and the callbacks later chapters rely on;
  - the delivery order: opening first (attach `story-drafts/00-opening-skeleton.md`); after the owner approves the voice, chapters 1–8 and the epilogues one at a time (attach the matching `story/*.md` as the content to rewrite).

- [ ] **Step 1: Failing tests:**
  - `parseStoryScript(writeStoryScript(scene))` round-trips every current staged scene: same section ids, decision keys, option ids and branch gates;
  - an import of a reply missing `arrival:corridor-job` fails with that key named;
  - an unknown speaker fails with the name;
  - the opening's first five sections are `crossing, landing, hall, house, familiar`;
  - Rowan's first line in the supper does not match `/You made it/`.
- [ ] **Step 2:** `node --test tests/story-script.test.mjs tests/opening-story.test.mjs`. Expected: FAIL.
- [ ] **Step 3:** Implement the parser, writer and importer; write the opening skeleton and the brief; generate the placeholder prologue.
- [ ] **Step 4:** `npm run check` and `npm run test:browser`. Expected: PASS.
- [ ] **Step 5:** Commit "Add the story script format, importer and ChatGPT rewrite brief".

### Task 9: Import ChatGPT's story, with owner review

- [ ] **Step 1:** The owner gives ChatGPT `docs/design/CHATGPT_STORY_REWRITE.md` with the opening skeleton and saves the reply as `story-drafts/00-opening.md`.
- [ ] **Step 2:** `npm run import:story -- story-drafts/00-opening.md --chapter 0`. Expected: "Imported chapter 0: N sections, M decisions", with no errors. On errors, list them for the owner to paste back to ChatGPT.
- [ ] **Step 3:** `npm run export:story && npm run check && npm run test:browser`. Expected: PASS. Then capture screenshots of each opening section in the scene player.
- [ ] **Step 4: Owner review gate.** The owner plays the opening and approves the voice. **Stop until approved.**
- [ ] **Step 5:** Repeat Steps 1–3 for chapters 1–8 and the epilogues as they arrive, one commit per chapter.

### Task 10: Claude writes in ChatGPT's voice

ChatGPT writes the authored story; Claude writes the living moments in the AI modes and must sound like the same author.

**Files:**
- Modify: `scripts/make-style-samples.mjs`, `src/ai/world/style.mjs` (generated), `src/ai/storyteller.mjs`, `src/ai/context.mjs`
- Create: `src/ai/world/voice.mjs` (the style profile)
- Test: `tests/ai-context.test.mjs`

**Interfaces:**
- `STYLE_SAMPLES` is rebuilt from the imported ChatGPT chapters (chapters 0–2 only, to avoid leaking later plot). It covers narration, at least one passage of dialogue for each of Rowan, Imogen and Saoirse, and one decision moment.
- `VOICE_PROFILE: string` is a written description derived from those chapters: sentence length and rhythm, how description is anchored, how speech and action interleave, characteristic word choices, things the author never does. A voice or style plugin the owner installs may be used to derive it.
- `buildTurnContext` includes `VOICE_PROFILE` directly before the samples in the system layer.

- [ ] **Step 1: Failing test:** the system prompt contains the profile and at least one sample from the imported chapter files; no sample comes from chapter 3 or later.
- [ ] **Step 2:** `node --test tests/ai-context.test.mjs`. Expected: FAIL.
- [ ] **Step 3:** Implement; derive the profile.
- [ ] **Step 4:** Same command. Expected: PASS. Then one real `claude -p` turn on the owner's subscription (sonnet, one short Guided interlude) set beside a ChatGPT passage, for the owner to judge by ear.
- [ ] **Step 5:** Commit "Teach the storyteller ChatGPT's voice".

### Task 11: Design review, docs, screens

**Files:**
- Modify: `scripts/capture-screens.mjs` (add `scene-group`, `scene-single`, `scene-choice`, `arrival-painting`, `opening-house`), `tests/design-tools.test.mjs` (screen count), `docs/design/REVIEW.md`, `START_HERE.md`, `CLAUDE_START_HERE.md`, `docs/ENGINE.md` (v6, effects, opening)

- [ ] **Step 1:** Add the screens and update the count test. `npm test`. Expected: PASS.
- [ ] **Step 2:** `npm run design:screens` and `npm run design:detect`. Read every new screen in all three reading modes at both sizes. Run the Impeccable critique on the scene player. Fix real findings and log them in REVIEW.md.
- [ ] **Step 3:** `npm run check`, `npm run test:browser` and `npm run test:electron`. Expected: all pass.
- [ ] **Step 4:** Commit "Review and document the scene player and opening".

---

## Added on 17 October (owner requests while playing)

Done already: arrival paintings (Task 6); characters step on stage at their first line; **on narrator lines nobody is on screen, only the box**; the two-button title menu (Continue / New game); Read as a page removed.

### Task 12: Places for the new beginning

Add `home-kitchen`, `home-street` and `train-carriage` as story-only places (art `home-kitchen`, `home-street-night`, `train-carriage`; region "Away"), excluded from the map, travel, routines and the AI's place list. Add the three new paintings (`train-carriage`, `cg-acceptance-letter`, `journey-countryside`) to the art slots so they show "ART NEEDED" placeholders. Test: importing a scene that uses these places passes; the map and the AI place list do not include them.

### Task 13: Honoria's house questionnaire

ChatGPT writes 5–10 questions (`arrival:sorting-1…N`, options are the four house ids). The game tallies the answers; at the final `arrival:house` decision the leading house is shown first and marked "Honoria's suggestion" (ties: the earliest-answered leader). The player still chooses. Old saves and games that already know their house treat the questions as answered. Test: answers leaning Heronmere mark Heronmere; choosing another house still sets that house.

### Task 14: Sound and music list

Write `docs/design/SOUND_AND_MUSIC.md`: for every scene and place (title screen, the letter, the train, the platform, the crossing, Lantern Hall, each house common room, the village, the glasshouses, the mere at night, festivals, the mystery's key moments, the endings), list the instrumental track and ambient sounds it needs, with filename, mood, instruments, tempo, loop or one-shot, and a ready-to-paste prompt for Suno/Udio plus free-library search terms (Pixabay, FreePD, Incompetech). Also the small sounds (page turn, choice, lantern lighting, a familiar's sound per animal). This list feeds the later music player (see `docs/BACKLOG.md`).

### Then

Task 7 (house crests and framed familiar pictures), importing ChatGPT's rewritten chapters as they arrive (Task 9), Task 10 (Claude learns ChatGPT's voice) and Task 11 (design review).
