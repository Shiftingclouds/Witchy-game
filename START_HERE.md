# Lanternmere

A web game built around the uploaded artwork. The new story and implementation do not depend on the abandoned project's README, JSON sidecars, rules, or lore. Lanternmere is a working title.

## Find the story and development handoff

Read **[CLAUDE_START_HERE.md](CLAUDE_START_HERE.md)** for the exact stopping point. **[STORY.md](STORY.md)** links the actual prose, exported from the playable sources into [story/](story/). The canonical chapters live in `src/story/`; they are substantially longer than the retired summaries in `src/content.mjs`.

## Run

Requirements: Node 22.6+ (tested with Node 24.19), npm, Python 3, and Pillow. The cloud environment already has these.

```sh
cd /workspace/Witchy-game
npm ci
# If Pillow is missing, install requirements-art.txt in your Python environment.
npm run dev
```

Development runs Vite on port 5173 and the optional AI relay on port 3001. `npm run dev` prepares browser-sized artwork first. A full first conversion can take several minutes; subsequent runs reuse existing derivatives.

For a production build with offline support:

```sh
npm run build
npm start
```

The production server uses port 4173, configurable through `PORT`. Run behind HTTPS when hosting remotely: service workers require a secure context (localhost is allowed for local development).

## What you can play

- **Live the world:** visit 37 illustrated locations, meet the cast, learn and cast three spells, uncover clues, gain house points, and complete an eight-chapter first-year mystery with two endings.
- **Read the book:** the same complete arc told through illustrated scenes and choices, with progression handled by the story. It has a separate save.
- **Play scene:** open a chapter's scene view from The story. Chapters 1–7 have 43 scene sections, 22 saved local decisions, and later callbacks. Book and scene views share the same text. Chapter 8 still uses compact prototype prose. Previous, transcript, and saved bookmarks support returning to a line without replaying rewards.
- Prepared and optional AI conversations also use text reveal and expression transitions. Set reveal speed, story text size, and motion preferences in Settings, the book, or the scene reader. Tap Show full text to reveal immediately. Both device and in-game reduced-motion preferences are respected.
- All 47 characters have distinct profiles, introductions, and daily routines. Rowan, Imogen, and Saoirse have authored conversations and matching expression changes using the supplied art; 14 supporting characters also have fuller conversations, with more personal replies as trust grows. Individual character arcs remain future content.
- Find people through their profiles and the People page as they move between four periods of the day. Some routines change at weekends, and gathering hosts stay at their event. Spend time with each friend once per day to keep building the relationship beyond the introductory conversations.
- Eight rotating everyday gatherings and six festival activities offer authored choices, friendship, house points, and journal memories. Each day's gathering can be completed once; both choices are valid ways to help.
- Four houses and eight familiar choices use the existing common rooms and animal artwork. House points currently track the player's contribution, rather than simulating a full competitive league.
- A real calendar, six annual occasions, four seasons, seasonal scene variants where supplied, a journal, and save export/import.
- The register chapter includes a new evidence close-up, Dunne’s attentive expression, and Maelin’s neutral/reflective portraits, derived from the supplied visual style. All four work offline.
- All 142 originals are accessible through Settings → Art collection, including variants and the contemporary environments that are not part of the academy route.

The map is clickable; exploration travels between illustrated scenes rather than using a walking avatar. Character routines follow game time in four daily periods. Minigames, romance routes, procedural quests, and multiple years are not implemented. Chapters 1–7 are expanded; chapter 8 and the epilogues retain compact playable prose while production continues.

The current brief is [OBJECTIVES.md](OBJECTIVES.md). The new production target is at least **250,000 unique authored story words**, with a 270,000-word scene/quest budget. The current measured corpus is **35,379 words**, not a full novel-length game. The roadmap, cast roles, and proposed art queue are in `docs/STORY_EXPANSION.md`, `docs/ART_COMPLETION.md`, and `docs/PRESENTATION_DIRECTION.md`. Use `npm run count:words` for a reproducible audit; the methodology and playthrough-length distinction are in `docs/WORD_COUNT.md`.

The original 45 characters are a starting cast. `docs/CAST_EXPANSION.md` proposes 15 additions and maps faculty, classes, house companions, complete Glimmer squads, shopkeepers, and further relationship candidates. Elian Vale and Maelin Quill are now playable, with portraits, teaching scenes, dialogue, and routines. The other 13 additions remain planned.

All 60 identities now have individual [character sheets](characters/README.md). The 47 active sheets supply names, profiles, personality, voice, boundaries, NPC connections, and gated story knowledge. The 13 proposed sheets remain outside gameplay. Each save separately tracks friendship scores, shared moments, and recent AI exchanges. Open “Your history with…” in a conversation to review shared events or clear that character's saved AI chat.

## Offline and saves

On the first production visit, the service worker caches the entire app and approximately 30 MiB of artwork. Wait for **Saved for offline** before disconnecting. Both modes then reload and play without network access. Offline caching is intentionally disabled during Vite development.

Progress is automatically stored in this browser. Export it in Settings or Journal to move devices or keep a backup. Browser storage eviction, clearing site data, or private browsing can remove local progress. Imported saves are validated; the current save is backed up to `lanternmere.import-backup` before replacement. Version-one, version-two, and version-three saves automatically upgrade to version four, preserving progress, friendship scores, and notes. Recoverable topic memories carry an unknown date; missing old conversation history and story decisions stay unknown. Scene decisions and confirmed introductions persist into character context. No account or cloud sync is configured.

## Optional AI

Open **AI setup & connection help** on the main menu, or **Settings & saves → Open AI setup**. The page is also available at `/setup`. Run `npm run ai:setup-code` in the game server's terminal, enter that owner code in the page, choose a provider, and use **Test & save connection**. A sample Rowan greeting confirms the connection before it replaces your active settings. Failed tests preserve the current configuration; successful saves apply immediately.

The page includes OpenAI, native Anthropic/Claude, Google Gemini, OpenRouter, Ollama, LM Studio, and custom OpenAI-compatible providers. Local models can run without a paid API key. The page explains model installation, provider billing, network access, and the difference between the browser's machine and the game server. See [AI setup instructions](docs/AI_SETUP.md).

Alternatively, copy `.env.example` to an ignored `.env`, or inject server environment variables:

- `AI_PROVIDER`: `openai`, `anthropic`, `gemini`, `openrouter`, `ollama`, `lmstudio`, or `custom`.
- `AI_BASE_URL`: the provider API base URL. Hosted endpoints require HTTPS; loopback HTTP is allowed for local models.
- `AI_MODEL`: the model identifier supplied by that provider.
- `AI_API_KEY`: the provider credential. It stays on the server and is never included in the browser bundle or game exports.

Restart after changing environment variables. Setup-saved configuration takes precedence over environment configuration, including an explicit disconnect. It lives in ignored `.local/ai-config.json`, with owner-only file permissions. `AI_CONFIG_DIR` can select persistent private storage on a host; `AI_SETUP_TOKEN` can supply an owner code through hosting settings. Neither the API key nor setup code is included in game saves or browser storage. In restricted cloud networks, allow the selected API hostname in environment settings. A ChatGPT subscription alone does not supply an API credential. Any conversation still supports copying context to another AI and pasting its answer back.

Pressing Send transmits the player's message and the selected character's context: personality, permitted story knowledge, player name/house/familiar, friendship level, shared events, current chapter/location/date, and up to four recent exchanges. Private journal notes, other characters' conversations, and unreached authoring plans are excluded. The copy-to-another-AI flow uses the same context and lets you inspect it first. Prepared conversations make no provider request.

AI responses only supply dialogue and a validated expression; the deterministic game engine controls spells, scores, clues, and progress. Replies are saved as unverified conversation, never as proof that a quest or promise happened. Conversation storage retains up to four exchanges per character within a 60,000-character total; the oldest exchanges expire first. Character sheets and shared game events remain available for continuity. No provider credential is configured in the supplied environment. The relay is validated with a local mock; a live paid provider has not been exercised.

The included server is suitable for local development. Before a public deployment, add user authentication, a persistent rate limit and provider spending limits; the current limit is an in-memory ten AI requests per minute per client address.

## Development and verification

```sh
npm run check         # formatting + character validation + unit/API tests
npm test             # gameplay, routines, gatherings, saves, assets, local AI relay
npm run check:characters # active/proposed character sheets and their game references
npm run build
npm run test:browser # Chromium: UI, book ending, profiles, saves, mobile, offline play
npm run count:words   # unique authored words, categories, and reading-path estimates
npm run check:story-length # release-length gate; intentionally fails below 250,000 words
```

Browser tests default to `/usr/bin/chromium`; set `CHROMIUM_PATH` for another installed Chromium executable. They start an isolated test server on port 4173 with temporary AI configuration, so this port must be free. The setup test uses a local fake provider and cannot spend a real API key. Use `npm run format` to apply the repository's code style.

Read [ENGINE.md](docs/ENGINE.md) for module ownership, feature commands, state migrations, save handling, and provider adapters. Existing versions 1–3 upgrade to version 4 without inventing decisions.

Main files:

- `src/content.mjs`: locations, characters, conversations, spells, holidays, chapters.
- `characters/active/` and `characters/proposed/`: editable canon, voices, knowledge gates, and planned cast additions; see [editing instructions](characters/README.md).
- `src/character-context.mjs`: common character and relationship context for both AI paths.
- `src/character-memory.mjs`: per-save shared moments, recent dialogue, limits, and migration validation.
- `src/cast.mjs`: routines and supporting-character conversations; active sheets override the original profile seeds.
- `src/life.mjs`: daily gatherings, festival activities, and character whereabouts.
- `src/engine.mjs`: stable public engine API; `src/engine/` contains the runtime, four feature systems, selectors, time, effects, migrations, and save validation.
- `src/storage/saves.mjs`: browser save repository, validation before import, per-mode backups, export.
- `src/features/ai/AISetup.jsx`: provider setup page; `src/features/dialogue/` and `src/features/settings/` contain their respective UI features.
- `src/main.jsx` and `src/styles.css`: the responsive application.
- `src/World.jsx` and `src/daily-life.jsx`: exploration, profiles, and daily activities.
- `src/components.jsx`: shared controls, portraits, and accessible dialogs.
- `src/story/`: shared authored scenes, explicit decisions, conditions, and introductions. See [STORY_AUTHORING.md](docs/STORY_AUTHORING.md).
- `src/scene-beats.mjs`: scene registry, stable beat IDs, resolved reading paths, and text pacing.
- `src/dialogue-presentation.jsx` and its CSS: scene player, portrait transitions, text reveal, transcript, and reading preferences.
- `scripts/count-story-words.mjs`: source-labelled, deduplicated authored-word audit.
- `server.mjs`: server startup; `server/app.mjs` handles HTTP and `server/ai/` owns configuration, credentials, adapters, and dialogue routes.
- `scripts/prepare_art.py`: derivative generation; original PNGs remain intact.
- `scripts/build-sw.mjs`: versioned complete offline cache.
- `ART_REVIEW.md`: asset inventory and the design decisions it supports.

Local Git checkpoints save reviewed work under the user’s instruction. Pushes, public deployment, and environment publication remain separate actions.
