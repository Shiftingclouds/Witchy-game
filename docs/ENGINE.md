# Engine architecture and feature development

The game has a deterministic engine shared by Book and Live modes. React renders state and dispatches commands. Server code supplies optional dialogue. Saves, network requests, animation, and game rules have separate owners.

```text
React controls → command → engine registry → isolated state draft → new state
                         ↳ world / relationships / magic / story
new state → UI + browser save repository
AI reply → validated dialogue + expression → conversation command
```

## Files and responsibilities

| Module | Responsibility |
| --- | --- |
| `src/engine.mjs` | Stable public exports for UI, tests, and content tools. |
| `src/engine/runtime.mjs` | Builds the command registry, rejects duplicate names, clones state, and discards rejected changes. |
| `src/engine/transition.mjs` | Registers systems and prepares each command. |
| `src/engine/systems/world.mjs` | Exploration, discoveries, resting, waiting, journal notes. |
| `src/engine/systems/relationships.mjs` | Authored topics, check-ins, gatherings, shared memories, saved AI dialogue. |
| `src/engine/systems/magic.mjs` | Lessons, spell prerequisites, casting, restoration requirements. |
| `src/engine/systems/story.mjs` | Local decisions, introductions, chapter choices, endings, bookmarks, and Book-mode progression. |
| `src/engine/state.mjs` | New-game defaults and save schema version. |
| `src/engine/effects.mjs` | Shared journal, reward, and friendship operations. |
| `src/engine/time.mjs` | Game calendar, seasons, festivals, day changes. |
| `src/engine/selectors.mjs` | Read-only requirements, scene art, and prepared dialogue selection. |
| `src/engine/migrations.mjs` / `save.mjs` | Sequential save upgrades, validation, and removal of unknown fields. |
| `src/storage/saves.mjs` | Browser persistence, mode slots, import backups, export. Storage is injectable for tests. |
| `src/features/` | Dialogue UI, settings, AI setup, and authored epilogue data. |
| `server/app.mjs` | HTTP hosting and error boundary; no gameplay decisions. |
| `server/ai/` | Provider configuration, authorization, adapters, bounded requests, dialogue routes. |

## Add a gameplay feature

1. Put content in a data module, with stable IDs. Add art references to the asset pipeline when needed. Never use an image filename as a mutable save identity.
2. Add commands to the relevant system, or create a new `{id, commands}` system and register it in `transition.mjs`. Each handler receives `(draft, action)` and may update the draft. Returning `false` discards the entire command; returning normally commits the draft. Unknown commands leave the original object unchanged.
3. Validate action values and prerequisites before awarding anything. Use stable reward keys to prevent repeat rewards. Calendar and relationships belong to the engine, not click handlers or animation callbacks.
4. Render controls from the current state and dispatch a command. Keep timers, browser APIs, storage, and network calls outside systems. A command must give the same result for the same state and input. If a future minigame needs randomness, save its seed or pass a validated result; do not hide `Math.random()` inside a reducer.
5. Add meaningful tests for valid progress, rejected actions, replay/reward limits, and an achievable completion path. Use the extension test in `tests/runtime.test.mjs` as a small example.

New persistent fields also need defaults in `state.mjs`, a validation rule, a new `SAVE_VERSION`, and a one-step migration from the prior version. Keep the earlier migrations. Imported saves must preserve existing progress and use known defaults, rather than inventing completed events. Retired scene beats can reset a bookmark without discarding the whole save.

## Character and AI boundaries

Character sheets define personality and canon. Per-save bonds, verified shared moments, and recent unverified dialogue stay separate. See [the character guide](../characters/README.md). Both AI paths use `character-context.mjs`; future writing notes and unreached facts are excluded.

Providers return text and an available expression. Their output cannot choose a chapter, award points, learn a spell, invent a verified memory, or alter the save schema. Add a provider preset in `src/ai/providers.mjs`; use an existing protocol adapter or add one in `server/ai/providers.mjs`. Keep authentication, transport, and parsing tests with it. New fields containing secrets must never appear in `publicConfig`, browser storage, logs, or save exports.

## Persistence and failure behavior

Book and Live retain separate version-four saves. The repository validates an import before replacing data. It backs up the current game and the target slot when switching modes. Malformed existing data is preserved and reported, rather than silently replaced by a new game. Browser quota errors leave current in-memory play available and display an export warning.

The setup page tests a real short provider response before replacing its active configuration. Test-only never saves. Failed tests leave the prior configuration intact. Configuration writes are atomic and serialized; a server restart reads the saved settings. Keys are stored only in an ignored server file with owner-only permissions, or supplied by the server environment. This is a single-server configuration, not a per-user account system.

The UI has an error boundary, and AI requests have timeouts and cancellation. Provider responses and chat history are bounded. Service-worker caching includes every application chunk and illustration, including the lazy-loaded setup page, so a first offline visit to that page works after caching completes.

## Checks

```sh
npm run check          # formatting, character/scene references, engine and API tests
npm run build          # art derivatives, validation, production app, offline cache
npm run test:browser   # isolated local server + Chromium, including a fake provider
npm run count:words    # actual authored prose, excluding setup and engine documentation
```

Use `npm run format` before checking. Generated character imports are excluded from formatting; regenerate them with `npm run sync:characters`. The browser server deliberately uses a temporary AI configuration and fake setup code so tests cannot spend a real provider key. Port 4173 must be free. `CHROMIUM_PATH` can select another installed Chromium binary.

The shared scene engine now supports the expanded opening; it does not implement all planned content, romance, minigames, accounts, or the 250,000-word manuscript. Those additions should use these extension points and their own acceptance tests.

## Authored scene progression

See [STORY_AUTHORING.md](STORY_AUTHORING.md) for the data contract. Both readers use `chapterBeats(chapter, state)`, which stops at the first unanswered decision and filters unchosen passages. `story-choice` validates order, applies an explicit introduction at most once, records eligible memories, advances to a later authored date when necessary, and bookmarks the chosen continuation. It never rewinds Live time. Replaying a line has no gameplay effect. Old saves use unknown-decision fallback prose; they do not receive fabricated choice history.
