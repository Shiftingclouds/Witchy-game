# Engine architecture and feature development

The game has a deterministic engine shared by Book and Live modes. React renders state and dispatches commands. Saves, network requests, animation, and game rules have separate owners.

```text
React controls → command → engine registry → isolated state draft → new state
                         ↳ world / relationships / magic / story
new state → UI + browser save repository
```

## Files and responsibilities

| Module                                   | Responsibility                                                                                     |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `src/engine.mjs`                         | Stable public exports for UI, tests, and content tools.                                            |
| `src/engine/runtime.mjs`                 | Builds the command registry, rejects duplicate names, clones state, and discards rejected changes. |
| `src/engine/transition.mjs`              | Registers systems and prepares each command.                                                       |
| `src/engine/systems/world.mjs`           | Exploration, discoveries, resting, waiting, journal notes.                                         |
| `src/engine/systems/relationships.mjs`   | Authored topics, check-ins, gatherings, shared memories, stored (hidden) legacy AI dialogue.       |
| `src/engine/systems/magic.mjs`           | Lessons, spell prerequisites, casting, restoration requirements.                                   |
| `src/engine/systems/story.mjs`           | Local decisions, introductions, chapter choices, endings, bookmarks, and Book-mode progression.    |
| `src/engine/state.mjs`                   | New-game defaults and save schema version.                                                         |
| `src/engine/effects.mjs`                 | Shared journal, reward, and friendship operations.                                                 |
| `src/engine/time.mjs`                    | Game calendar, seasons, festivals, day changes.                                                    |
| `src/engine/selectors.mjs`               | Read-only requirements, scene art, and prepared dialogue selection.                                |
| `src/engine/migrations.mjs` / `save.mjs` | Sequential save upgrades, validation, and removal of unknown fields.                               |
| `src/storage/saves.mjs`                  | Browser persistence, mode slots, import backups, export. Storage is injectable for tests.          |
| `src/features/`                          | Dialogue UI, settings, and authored epilogue data.                                                 |

## Add a gameplay feature

1. Put content in a data module, with stable IDs. Add art references to the asset pipeline when needed. Never use an image filename as a mutable save identity.
2. Add commands to the relevant system, or create a new `{id, commands}` system and register it in `transition.mjs`. Each handler receives `(draft, action)` and may update the draft. Returning `false` discards the entire command; returning normally commits the draft. Unknown commands leave the original object unchanged.
3. Validate action values and prerequisites before awarding anything. Use stable reward keys to prevent repeat rewards. Calendar and relationships belong to the engine, not click handlers or animation callbacks.
4. Render controls from the current state and dispatch a command. Keep timers, browser APIs, storage, and network calls outside systems. A command must give the same result for the same state and input. If a future minigame needs randomness, save its seed or pass a validated result; do not hide `Math.random()` inside a reducer.
5. Add meaningful tests for valid progress, rejected actions, replay/reward limits, and an achievable completion path. Use the extension test in `tests/runtime.test.mjs` as a small example.

New persistent fields also need defaults in `state.mjs`, a validation rule, a new `SAVE_VERSION`, and a one-step migration from the prior version. Keep the earlier migrations. Imported saves must preserve existing progress and use known defaults, rather than inventing completed events. Retired scene beats can reset a bookmark without discarding the whole save.

## Character and AI boundaries

Character sheets define personality and canon. Per-save bonds, verified shared moments, and recent unverified dialogue stay separate. See [the character guide](../characters/README.md). `character-context.mjs` builds bounded character context; future writing notes and unreached facts are excluded.

Prebuilt modes never call AI and remain fully deterministic. The AI modes (`guided`, `sandbox`) keep the engine authoritative:

- `src/ai/context.mjs` builds layered context (rules, lore, mystery stage, style samples, cast, memory, recent turns) within a 60,000-token budget, trimming from the bottom.
- Claude replies through a JSON schema (`src/ai/contract.mjs`). `validateReply` checks speakers, places, expressions and proposals. An invalid reply is retried once with the problems listed, then shown as a calm error; the save is untouched.
- Accepted proposals are applied only by the `ai-turn` command (`src/engine/systems/ai.mjs`): bond changes are clamped to ±5, and invented people get `p-` ids with no portrait and no new places. Threads, memories and time moves are recorded with provenance in `game.ai`.
- `src/ai/memory.mjs` folds older turns into a chronicle on the housekeeping model so long games keep their history.
- `electron/claude-bridge.mjs` runs `claude -p` one request at a time, with no tools, no MCP, no settings and no session persistence, in an empty working folder under userData.

## Persistence and failure behavior

Book and Live retain separate version-four saves. The repository validates an import before replacing data. It backs up the current game and the target slot when switching modes. Malformed existing data is preserved and reported, rather than silently replaced by a new game. Browser quota errors leave current in-memory play available and display an export warning.

The UI has an error boundary.

## Checks

```sh
npm run check          # formatting, character/scene references, engine tests
npm run build          # art derivatives, validation, production app
npm run test:browser   # vite preview + Chromium
npm run count:words    # actual authored prose, excluding setup and engine documentation
```

Use `npm run format` before checking. Generated character imports are excluded from formatting; regenerate them with `npm run sync:characters`. Port 4173 must be free. `CHROMIUM_PATH` can select another installed Chromium binary.

The shared scene engine now supports the expanded opening; it does not implement all planned content, romance, minigames, accounts, or the 250,000-word manuscript. Those additions should use these extension points and their own acceptance tests.

## Authored scene progression

See [STORY_AUTHORING.md](STORY_AUTHORING.md) for the data contract. Both readers use `chapterBeats(chapter, state)`, which stops at the first unanswered decision and filters unchosen passages. `story-choice` validates order, applies an explicit introduction at most once, records eligible memories, advances to a later authored date when necessary, and bookmarks the chosen continuation. It never rewinds Live time. Replaying a line has no gameplay effect. Old saves use unknown-decision fallback prose; they do not receive fabricated choice history.
