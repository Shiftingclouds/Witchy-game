# Claude: start here — Lanternmere development handoff

**Current ChatGPT rewrite, 19 October 2026 — branch `scene-player`:** The core manuscript now contains **eight chapters and eight complete epilogues**, including the new letter/train opening and recurring house friends. Read the actual prose through [story-drafts/README.md](story-drafts/README.md), then follow [CHATGPT_REWRITE_HANDOFF.md](CHATGPT_REWRITE_HANDOFF.md) for import details. The latest package is not yet in the runtime; only an earlier approved arrival has been imported. The owner has authorized this full rewrite and the eight endings. The old stopping instructions, word counts, and `main` publication target below are historical, not the current rewrite status.

## Archived development handoff

Updated 16 October 2026. The user asked to finish **Bloomtide**, publish the actual story to the repository, and then stop. Do not assume the later work described below has been completed or newly authorized.

## Read the story itself

**[STORY.md](STORY.md) is the chapter index. [story/](story/) contains the actual playable prose as readable Markdown**, including dialogue, choices and clearly labelled alternatives. These are complete exports of the implemented chapter sources, not synopses or production outlines.

The canonical editable story is in **[src/story/](src/story/)**. Each main chapter module imports its companion files when needed; read all of them:

| Chapter                   | Canonical files                                                 | Current state                                          |
| ------------------------- | --------------------------------------------------------------- | ------------------------------------------------------ |
| 1. A place at the table   | `arrival.mjs`, `arrival-evening.mjs`, `arrival-orientation.mjs` | Expanded                                               |
| 2. The smallest flame     | `kindle.mjs`                                                    | Expanded                                               |
| 3. Notes in the margins   | `register.mjs`                                                  | Expanded                                               |
| 4. A lantern for the lost | `emberfall.mjs`, `emberfall-preparations.mjs`                   | Expanded                                               |
| 5. The lake remembers     | `longnight.mjs`, `longnight-shore.mjs`                          | Expanded                                               |
| 6. An open circle         | `thaw.mjs`, `thaw-stones.mjs`                                   | Expanded                                               |
| 7. The light we carry     | `bloom.mjs`, `bloom-rehearsal.mjs`                              | Expanded; browser review passed                        |
| 8. A home made of light   | `src/content.mjs`, final chapter entry                          | Compact playable prototype; full expansion not started |
| Two endings               | `src/features/story/epilogue.mjs`                               | Compact playable epilogues                             |

Edit the canonical files, run `npm run export:story`, and commit the generated Markdown too. `npm run check:story-export` detects stale exports. `src/scene-beats.mjs` registers the expanded chapters. Do not mistake the retired short summaries in `src/content.mjs` for the prose used by chapters 1–7.

## Exact stopping point

Bloomtide is implemented in six sections. It has:

- A rehearsal schedule choice with actual earlier-session or group-handover payoffs. Grey's maintenance work and Noor's choice to observe are respected.
- A supervised group release/rejoin exercise led by Okoro.
- Rowan's private support choice; only Rowan receives that memory.
- Imogen's recovered working register and callbacks to her earlier correction.
- Saoirse's completed lantern and a choice of its Midsummer job: Grey's hall landing or Kestrel's outer practice station.
- New transparent portraits: `art/c13-grey-attentive.png` and `art/c16-okoro-warm.png`.

**Do not start the next package until the user resumes work.** The next planned chapter is Midsummer. It must pay off `bloom:rowan-support` and `bloom:lantern-use`, make the three-spell restoration concrete, and preserve both shared-stewardship and keeper endings. The group has a 21 June 2027 in-game renewal deadline; Live catch-up must remain possible after that date.

A dim Heartfire variant was generated and inspected at `/workspace/generated_images/exec-c7bf6731-6a3b-4f7a-85d5-da9eb31f0811.png`. It is **not integrated, not committed, and not guaranteed to exist in a different environment**. No Midsummer scene file has been written. Use the original `heartfire.png` cavern as the visual reference if this pending source must be regenerated. The previous build warned that the main JS chunk exceeded 500 kB; content chunking is a future improvement, not a runtime failure.

## AI modes (October 2026)

The Guided Tale and the Open World are implemented on Claude Code (`claude -p`) per [the spec](docs/superpowers/specs/2026-10-16-desktop-and-ai-modes-design.md) and [plan](docs/superpowers/plans/2026-10-17-ai-modes.md). Saves are version 5 (`game.ai`). Tests use a stand-in bridge in the browser and `tests/fixtures/fake-claude.mjs` in Electron; neither spends subscription usage.

Live smoke test, 17 October 2026: one Open World turn on `sonnet` through the real bridge returned a schema-valid reply in 8.9 s (context about 21k of the 60k budget), in voice, with sensible proposals (time advance, a "dark lantern" thread).

- **35,379 / 250,000** eligible whole-game words; **214,621 remain**.
- Expanded scenes: **31,328 words**, **43 sections**, **22 saved local decisions**.
- One current complete Book/staged path: **26,897–27,125 words**, excluding optional chats.
- Exact route audit: **4,194,304 combinations**, at most **32 simultaneous dependency states**. These are choice combinations, not millions of separately written stories.
- **47 active / 27 proposed characters** (proposed sheets expanded and 14 added in October 2026; portraits requested in `docs/design/CHARACTER_ART_REQUESTS.md`), **161 browser images / about 30.0 MiB**.
- Full personal arcs, house/community stories, adult romance, minigames, proposed cast and much of the art queue remain unfinished. Do not claim the game or manuscript is complete.

## Verification

The last full successful unit/API run was **47 tests** at Longnight. All **27 browser scenarios** at that checkpoint passed across the full run and a six-test presentation rerun; a subpixel comparison was corrected from strict equality to a 0.01px tolerance. First Thaw then passed **25 targeted tests** and **12 browser scenarios**, including offline artwork, saved branches, imports and the complete Book route.

Bloomtide passed **22 targeted engine/story/audit tests**, character/story validators and a production build. Its new browser scenario then passed, verifying Grey/Okoro expression loading, rehearsal payoff, Rowan's private memory and the lantern assignment. The [rehearsal capture](docs/bloom-rehearsal.png) was visually reviewed. The final **full check passed all 49 unit/API tests**, formatting, character/story validation and export freshness.

Automatic approval review initially blocked the browser run because of the account usage limit. Approval review became available again after the user's follow-up, and the same authorized test completed successfully. There is no outstanding Bloomtide browser-test blocker. The main-JS chunk warning and real-provider trial remain separate limitations.

Commands when execution is available:

```sh
npm ci
npm run build
npm run check
npm run test:browser -- tests/browser/seasonal-story.spec.js
npm run count:words
npm run check:story-export
```

`npm run check:story-length` intentionally fails below 250,000 words. AI play is being rebuilt on Claude Code (`claude -p`); Prebuilt modes use prepared dialogue only. See [the design](docs/superpowers/specs/2026-10-16-desktop-and-ai-modes-design.md).

## Architecture and canon that must survive

- Both Book and staged readers use the same authored beats and saved `storyChoices`. Do not create a second editable manuscript in the exported Markdown.
- Saves are version 4; older saves retain unknown choices as unknown. Keep stable scene, beat and option IDs. Local decisions cannot be replayed for rewards.
- NPC canon: `characters/active/*.json`; relationships, witnessed memories and unverified AI dialogue remain separate in saves. Run `npm run sync:characters` after sheet edits.
- Story introductions are explicit in `src/story/choices.mjs`. A portrait being visible is not proof of meeting or overhearing a private conversation.
- Early Echosight cannot unlock the lake before chapter index 4 or the stones before index 5. Gates use story progress, not season; old discoveries remain valid.
- Original uploaded PNGs and abandoned-project documents are preserved. The original README and JSON sidecars do not define the new game. Follow the user's art-led, cozy-mysterious brief.
- New art sources live in `art/`; `npm run build` prepares ignored WebP derivatives. No credentials, saves, logs or build output belong in Git.

Read [PROGRESS.md](PROGRESS.md), [YEAR_CONTINUITY.md](docs/YEAR_CONTINUITY.md), [STORY_AUTHORING.md](docs/STORY_AUTHORING.md), and [PRODUCTION_PLAN.md](docs/PRODUCTION_PLAN.md) for details. [START_HERE.md](START_HERE.md) covers running the app.

## Git and publication

The repository is `https://github.com/Shiftingclouds/Witchy-game.git`; the publication target for this handoff is **main**. Development checkpoints were made on local branch `work`. When checked before publication, remote `main` was still the original-art commit `8f4cbe2`, explaining why Claude could not find the implementation. All completed game/story checkpoints are descendants of it, so the requested push can fast-forward without replacing remote work.

On GitHub, select **main** and open this file or [STORY.md](STORY.md). If using an older clone, fetch/pull the remote before concluding that the story is missing. The publishing agent verifies the remote commit after pushing; a local-only copy of this document is not evidence that a network push succeeded.
