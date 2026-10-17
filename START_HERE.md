# Lanternmere

A web game built around the uploaded artwork. The new story and implementation do not depend on the abandoned project's README, JSON sidecars, rules, or lore. Lanternmere is a working title.

## Find the story and development handoff

Read **[CLAUDE_START_HERE.md](CLAUDE_START_HERE.md)** for the exact stopping point. **[STORY.md](STORY.md)** links the actual prose, exported from the playable sources into [story/](story/). The canonical chapters live in `src/story/`; they are substantially longer than the retired summaries in `src/content.mjs`.

## Run

Requirements: Node 22.6+ (tested with Node 24.19 and 24.22), npm, Python 3, and Pillow (`python3 -m pip install -r requirements-art.txt`).

On Windows (tested on Windows 11, Python 3.15, Pillow 12.3): run `npx playwright install chromium` once for browser tests; Playwright uses its bundled Chromium unless `CHROMIUM_PATH` is set. `.gitattributes` keeps text files LF so formatting and story-export checks pass.

```sh
cd Witchy-game
npm ci
# If Pillow is missing, install requirements-art.txt in your Python environment.
npm run dev
```

Development runs Vite on port 5173. `npm run dev` prepares browser-sized artwork first. A full first conversion can take several minutes; subsequent runs reuse existing derivatives. `npm run build` produces the static app in `dist/`.

## What you can play

- **Live the world:** visit 37 illustrated locations, meet the cast, learn and cast three spells, uncover clues, gain house points, and complete an eight-chapter first-year mystery with two endings.
- **Read the book:** the same complete arc told through illustrated scenes and choices, with progression handled by the story. It has a separate save.
- **Play scene:** open a chapter's scene view from The story. Chapters 1–7 have 43 scene sections, 22 saved local decisions, and later callbacks. Book and scene views share the same text. Chapter 8 still uses compact prototype prose. Previous, transcript, and saved bookmarks support returning to a line without replaying rewards.
- Prepared conversations also use text reveal and expression transitions. Set reveal speed, story text size, and motion preferences in Settings, the book, or the scene reader. Tap Show full text to reveal immediately. Both device and in-game reduced-motion preferences are respected.
- All 47 characters have distinct profiles, introductions, and daily routines. Rowan, Imogen, and Saoirse have authored conversations and matching expression changes using the supplied art; 14 supporting characters also have fuller conversations, with more personal replies as trust grows. Individual character arcs remain future content.
- Find people through their profiles and the People page as they move between four periods of the day. Some routines change at weekends, and gathering hosts stay at their event. Spend time with each friend once per day to keep building the relationship beyond the introductory conversations.
- Eight rotating everyday gatherings and six festival activities offer authored choices, friendship, house points, and journal memories. Each day's gathering can be completed once; both choices are valid ways to help.
- Four houses and eight familiar choices use the existing common rooms and animal artwork. House points currently track the player's contribution, rather than simulating a full competitive league.
- A real calendar, six annual occasions, four seasons, seasonal scene variants where supplied, a journal, and save export/import.
- The register chapter includes a new evidence close-up, Dunne’s attentive expression, and Maelin’s neutral/reflective portraits, derived from the supplied visual style.
- All 142 originals are accessible through Settings → Art collection, including variants and the contemporary environments that are not part of the academy route.

The map is clickable; exploration travels between illustrated scenes rather than using a walking avatar. Character routines follow game time in four daily periods. Minigames, romance routes, procedural quests, and multiple years are not implemented. Chapters 1–7 are expanded; chapter 8 and the epilogues retain compact playable prose while production continues.

The current brief is [OBJECTIVES.md](OBJECTIVES.md). The new production target is at least **250,000 unique authored story words**, with a 270,000-word scene/quest budget. The current measured corpus is **35,379 words**, not a full novel-length game. The roadmap, cast roles, and proposed art queue are in `docs/STORY_EXPANSION.md`, `docs/ART_COMPLETION.md`, and `docs/PRESENTATION_DIRECTION.md`. Use `npm run count:words` for a reproducible audit; the methodology and playthrough-length distinction are in `docs/WORD_COUNT.md`.

The original 45 characters are a starting cast. `docs/CAST_EXPANSION.md` proposes 15 additions and maps faculty, classes, house companions, complete Glimmer squads, shopkeepers, and further relationship candidates. Elian Vale and Maelin Quill are now playable, with portraits, teaching scenes, dialogue, and routines. The other 13 additions remain planned.

All 60 identities now have individual [character sheets](characters/README.md). The 47 active sheets supply names, profiles, personality, voice, boundaries, NPC connections, and gated story knowledge. The 13 proposed sheets remain outside gameplay. Each save separately tracks friendship scores and shared moments. Open “Your history with…” in a conversation to review shared events.

## Saves

Progress is automatically stored in this browser. Export it in Settings or Journal to move devices or keep a backup. Browser storage eviction, clearing site data, or private browsing can remove local progress. Imported saves are validated; the current save is backed up to `lanternmere.import-backup` before replacement. Version-one, version-two, and version-three saves automatically upgrade to version four, preserving progress, friendship scores, and notes. Recoverable topic memories carry an unknown date; missing old conversation history and story decisions stay unknown. Scene decisions and confirmed introductions persist into character context. No account or cloud sync is configured.

## AI

AI play is being rebuilt on Claude Code (`claude -p`); Prebuilt modes use prepared dialogue only. See [the design](docs/superpowers/specs/2026-10-16-desktop-and-ai-modes-design.md).

## Development and verification

```sh
npm run check         # formatting + character validation + unit tests
npm test             # gameplay, routines, gatherings, saves, assets
npm run check:characters # active/proposed character sheets and their game references
npm run build
npm run test:browser # Chromium: UI, book ending, profiles, saves, mobile
npm run count:words   # unique authored words, categories, and reading-path estimates
npm run check:story-length # release-length gate; intentionally fails below 250,000 words
```

Browser tests use Playwright's bundled Chromium; set `CHROMIUM_PATH` for another installed Chromium executable. They serve `dist/` with `vite preview` on port 4173, so this port must be free. Use `npm run format` to apply the repository's code style.

Read [ENGINE.md](docs/ENGINE.md) for module ownership, feature commands, state migrations, and save handling. Existing versions 1–3 upgrade to version 4 without inventing decisions.

Main files:

- `src/content.mjs`: locations, characters, conversations, spells, holidays, chapters.
- `characters/active/` and `characters/proposed/`: editable canon, voices, knowledge gates, and planned cast additions; see [editing instructions](characters/README.md).
- `src/character-context.mjs`: character and relationship context builder (to be reused by the Claude AI modes).
- `src/character-memory.mjs`: per-save shared moments, recent dialogue, limits, and migration validation.
- `src/cast.mjs`: routines and supporting-character conversations; active sheets override the original profile seeds.
- `src/life.mjs`: daily gatherings, festival activities, and character whereabouts.
- `src/engine.mjs`: stable public engine API; `src/engine/` contains the runtime, four feature systems, selectors, time, effects, migrations, and save validation.
- `src/storage/saves.mjs`: browser save repository, validation before import, per-mode backups, export.
- `src/features/dialogue/` and `src/features/settings/` contain their respective UI features.
- `src/main.jsx` and `src/styles.css`: the responsive application.
- `src/World.jsx` and `src/daily-life.jsx`: exploration, profiles, and daily activities.
- `src/components.jsx`: shared controls, portraits, and accessible dialogs.
- `src/story/`: shared authored scenes, explicit decisions, conditions, and introductions. See [STORY_AUTHORING.md](docs/STORY_AUTHORING.md).
- `src/scene-beats.mjs`: scene registry, stable beat IDs, resolved reading paths, and text pacing.
- `src/dialogue-presentation.jsx` and its CSS: scene player, portrait transitions, text reveal, transcript, and reading preferences.
- `scripts/count-story-words.mjs`: source-labelled, deduplicated authored-word audit.
- `scripts/prepare_art.py`: derivative generation; original PNGs remain intact.
- `ART_REVIEW.md`: asset inventory and the design decisions it supports.

Local Git checkpoints save reviewed work under the user’s instruction. Pushes, public deployment, and environment publication remain separate actions.
