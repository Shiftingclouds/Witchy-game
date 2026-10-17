# Lanternmere desktop app and AI modes — design

Date: 16 October 2026. Status: approved by owner, 16 October 2026.

## Intent

Lanternmere is a cozy, mysterious witch-academy story game the owner is building **for personal use only**. It already exists as a React/Vite web game with a shared deterministic engine, two non-AI ways to play (Book and Live), seven expanded chapters, and 47 character sheets (see `CLAUDE_START_HERE.md`, `docs/ENGINE.md`).

This design covers three things:

1. Wrapping the existing game in an **Electron window** that builds into a Windows `.exe`.
2. Replacing the current AI connection (API-key providers, setup page, copy/paste bridge) with **Claude Code headless mode (`claude -p`)** running on the owner's computer, so AI play uses their Claude subscription with no API key.
3. Adding **two new AI modes** that go far beyond today's "type to a character" chat: one guided along the authored story, one a full sandbox.

The feeling the owner wants: on launch you're immediately wrapped in the vibe — warm, comforting, mysterious, magical, never overwhelming. Prebuilt play feels like a wonderful ride you don't control. AI play feels extra magical: characters more alive, free text instead of only multiple choice, choices that visibly matter, and discoveries, paths and endings you'd never find in the prebuilt story.

The repo is **public**. Nothing private may ever be committed.

## Goals

- Keep everything that exists. Do not start over.
- One double-clickable Windows app; no terminal needed to play.
- Three options on the main menu:
  1. **Prebuilt (no AI)** — the existing **Book** reader and the existing **Live the world** mode, both unchanged in behavior. Fully offline, never calls Claude.
  2. **Guided AI** — built on the Book reader. Same chapters, same major story beats, the same general endings. Claude fills the space between and around the authored beats: characters respond to anything typed, new small scenes, conversations and side moments appear, and the route to each beat changes with how you play.
  3. **Sandbox AI** — built on Live the world. No fixed track. Claude uses all world data (characters, lore, locations, the authored chapters as background) to run a living world: go anywhere, talk to anyone, build a life, make story happen — including storylines and endings that do not exist in the prebuilt story.
- Quality over speed in both AI modes. Thinking time is expected and acceptable.
- Characters stay in character and the world remembers what matters, through deliberate context and memory management (the core engineering problem of this design).
- The authored story and the player's record are never confused (see "Three kinds of information").

## Non-goals

- **No new places invented by AI.** Claude may invent events, scenes, conversations and storylines, but only at existing locations, so every scene has real art. (Missing places may be added by hand later, before packaging a "complete" game — separate work.)
- Writing the rest of the manuscript (chapter 8 expansion, 250,000-word target), romance, minigames, proposed cast. Those continue under the existing production docs.
- Converting `src/story/*.mjs` to another format. They are already data built with small constructors and both readers share them; they stay as they are.
- Cloud sync, accounts, multiplayer, public hosting, code signing.
- Keeping any API-key provider, the setup page/setup code, or the "Use ChatGPT or another AI" copy/paste bridge.

## Anti-goals (failure even if it technically works)

- A character acting unlike their sheet (voice, boundaries, personality).
- The world forgetting something important that happened in this playthrough, or contradicting it.
- AI content leaking into the authored story files, or into Prebuilt mode.
- An AI reply corrupting or bloating a save beyond recovery.
- Prebuilt mode needing Claude, Internet, or a login.
- Anything private (saves, transcripts, prompts, logs, credentials, built binaries) ending up in Git.
- The interface losing the warm/magical feel or becoming overwhelming while waiting on AI.

## Constraints

- Windows 11, single user, owner's own machine.
- Claude Code CLI is installed and logged in with the owner's subscription (verified: `claude` 2.1.302 on PATH). AI calls count against subscription usage limits.
- `claude -p --bare` is **not usable**: bare mode only accepts `ANTHROPIC_API_KEY`/`apiKeyHelper`, not subscription login.
- Existing toolchain: Node 22.6+, Vite, React 19, Python 3 + Pillow for art preparation (`scripts/prepare_art.py`).
- Existing engine rules (`docs/ENGINE.md`): commands are deterministic, validated, and reject unknown input; content has stable IDs; new save fields need defaults, validation, a version bump and a migration.

## Three kinds of information

The owner's explicit requirement: prebuilt info and recorded info must never get confused. There are three tiers, each with one home:

| Tier | What | Where | Who writes it |
| --- | --- | --- | --- |
| **Canon** | Authored chapters, character sheets, locations, spells, lore | Repo (`src/story/`, `characters/active/`, `src/content.mjs`, new `world/` lore file) | Only the author, by hand. Read-only at runtime in every mode. |
| **Played record** | Choices, bonds, verified shared memories, journal, calendar, spells, progress | The save file | The engine, via validated commands. |
| **Invented (AI modes only)** | Scenes, events, storylines, NPC remarks, threads Claude created in this playthrough | The same save file, in clearly separate fields, every entry tagged with provenance | Claude proposes; the engine validates and stores. |

Rules:
- Invented content never exists in Prebuilt saves and is never read by Prebuilt modes.
- Within an AI save, invented events **do** become things that happened in that playthrough (so characters can remember them), but they are always stored as `invented`, never merged into canon fields or authored memory IDs.
- Canon always wins: the context builder presents canon as fixed truth and invented history as "what has happened in this playthrough".

## Saves

- Move persistence from browser `localStorage` to JSON files under the Windows user data folder (Electron `app.getPath('userData')`, e.g. `%APPDATA%\Lanternmere\saves\`). Never inside the repo.
- Four slots: `book`, `live`, `guided`, `sandbox`. Each mode only reads its own slot. Guided and Sandbox start new games (they do not import a Book/Live save) — my call; easy to revisit.
- Writes are atomic (write temp, rename) and keep one rolling backup per slot.
- Save version bumps to 5 with the new AI-mode fields (invented records, chronicle, threads — see below) and a migration from v4 that leaves Book/Live saves untouched in meaning.
- Keep export/import (now via a file dialog). The existing size and validation rules still apply; AI fields get their own caps.
- Keep `createSaveRepository`'s injectable shape so engine tests stay browser-free; add a file-backed implementation for Electron.

## Desktop shell (Electron)

- Electron main process loads the built game from `dist/` (custom `app://` protocol or `file://` — builder's call). No separate server to start.
- The existing Node HTTP server and its `/api/ai/*` routes are retired. The renderer talks to the main process through a small, explicit preload API (contextIsolation on, nodeIntegration off), e.g. `saves.read/write/import/export` and `ai.request/cancel/status`.
- The service worker/offline cache is unnecessary inside Electron and should be disabled there.
- Packaging produces a Windows `.exe` (installer or portable — builder's call). Unsigned is fine.
- `npm run dev` should still allow browser development of Prebuilt modes; AI and file saves only need to work in Electron.

## Claude bridge

Lives entirely in the Electron main process.

**Invocation.** Spawn `claude` (resolved from PATH; show a friendly "Claude Code not found / not logged in" message otherwise) with, at minimum:

- `-p` with the prompt on stdin
- `--output-format json` and `--json-schema <schema>` for structured replies
- `--tools ""` (no tools at all), `--strict-mcp-config` with no MCP config, and settings sources restricted so the owner's personal CLAUDE.md, hooks and plugins don't load
- `--system-prompt` (replace, not append) carrying the Lanternmere storyteller rules
- `--model` defaulting to the strongest available model; selectable in Settings
- `--no-session-persistence`
- working directory: an empty folder under the app's user data, never the repo

The game owns all memory itself and sends a fully built context each call, so it does not depend on Claude sessions/`--resume`. Exact flags must be re-verified against `claude --help` at build time; behavior above is the requirement, flag spelling is not.

**Robustness.** One request at a time per save; cancellable; generous timeout (minutes, not seconds); clear states for "thinking", "usage limit reached", "Claude unavailable", "reply rejected". On a reply that fails validation, retry once with the validation errors appended, then fall back gracefully without changing the save. Prebuilt mode never touches the bridge.

**Waiting.** While Claude thinks, the scene stays on screen with a gentle in-world "the world is stirring" treatment consistent with the art direction — not a spinner over a blank page. Free text input stays available to compose the next move only after the reply lands.

**Debug log.** Optional prompt/response log for tuning, written only to the user data folder and off by default.

## Reply contract

Claude never edits state directly. Every reply is one JSON object matching a schema the game defines. Shape (builder refines):

- `beats[]` — ordered narration and dialogue: `{speaker: characterId|null, text, expression}` using existing staging concepts (at most two actors on stage, existing expressions only).
- `location` — must be an existing location ID; `period`/time advance within allowed bounds.
- `present[]` — existing active character IDs only.
- `suggestions[]` — 2–4 optional choices to show alongside free text.
- `proposals[]` — typed, bounded effects for the engine to validate, e.g. bond change (small capped delta), record invented event (summary, involved characters, importance), open/advance/close a thread, journal note, advance time. Mode-specific allowances below.
- `memoryNotes` — what the model thinks is worth remembering from this turn (input to the memory system, not trusted as fact on its own).

The engine validates every field: unknown IDs, missing expressions, invented locations, out-of-range deltas, or forbidden proposals are rejected. Accepted proposals become normal engine commands. A rejected proposal never blocks showing the narration if the narration itself is valid.

## Context and memory management

This is what keeps characters in character and the world from forgetting. Each call's context is assembled fresh by a context builder that extends `src/character-context.mjs` (it already gates knowledge by chapter and bond and excludes `authoring` notes).

Layers, in priority order:

1. **Storyteller rules** (system prompt): tone (warm, mysterious, not overwhelming), canon-wins, no new places, use only listed people/expressions, respect character boundaries, don't narrate the player's unspoken feelings, reply in the schema.
2. **Style reference**: the owner likes the existing authored prose (`story/`, from `src/story/`). A short curated set of authored passages — narration and each on-stage character's lines where available — is included as the voice and quality bar Claude matches.
3. **World canon pack**: a new hand-authored `world/` lore summary (setting, houses, magic, the central mystery, tone), the location list with descriptions, the calendar/season. Built once per release, stable and cacheable.
4. **People on stage**: full sheets (voice, boundaries, gated knowledge, relationship style) for characters present or directly addressed; a one-line index for everyone else so Claude can bring them in.
5. **Played record**: bonds, verified shared memories with authored meaning, story choices, current chapter/beat (Guided), date/period/location.
6. **Playthrough memory** (AI saves only):
   - **Recent turns** verbatim (last N exchanges).
   - **Chronicle**: older turns compressed into running summaries by a periodic summarization call, so nothing important falls off the end.
   - **Important events**: invented events ranked by importance; high-importance ones are always included.
   - **Per-character memories**: what each NPC personally witnessed or was told (an NPC doesn't know what they didn't see — the existing rule).
   - **Open threads**: active storylines/promises/mysteries with their status, always included.
7. **The player's input** this turn.

Budgets per layer are set so a full prompt stays well inside the model's context; trimming drops from the bottom of each layer's priority, never from rules, on-stage sheets, or open threads. Context assembly must be unit-testable without Claude.

## Mode 2: Guided AI

- Uses the Book chapter structure, `chapterBeats`, and the authored decisions.
- **Authored sections play as written** (verbatim prose and staging) — owner's decision. Claude adds moments between and around them; it never rewrites authored prose.
- **Between and around authored sections**, Claude runs interludes: free-text play with present characters at the section's location, side moments, small scenes. Claude signals when an interlude has naturally run its course, or the player chooses to continue the story.
- **At authored decisions**, the player can pick an option or type their own response; Claude maps typed responses to the closest authored option (so later authored callbacks still work) and writes a short bridge in the player's own terms.
- Allowed proposals: invented events, threads that stay within the current chapter's frame, bond changes, journal notes. Not allowed: changing chapter, skipping authored beats, unlocking gated discoveries early, choosing an ending outside the authored ones.
- Endings: the authored endings remain the only endings; play history may influence which one and how it's framed.

## Mode 3: Sandbox AI

- Uses the Live world structure: map, calendar, four periods, routines (where characters are), bonds, spells, houses and points.
- Any travel to an existing location, any conversation, any typed action is a turn handled by Claude, grounded in who is actually there per routines (Claude may move a character for a reason it states, as an invented event).
- Authored chapters are background canon and lore, not a track: the central mystery exists in the world and can be discovered, ignored, or resolved differently.

**Timeless and Timed sub-modes** (owner's decision). Chosen when starting a Sandbox game and stored in the save:

- **Timeless**: days and seasons still pass for daily life, but the central mystery only moves when the player pursues it. A whole year of simply living there is valid.
- **Timed**: the mystery unfolds along the school year whether or not the player chases it, roughly following the authored calendar (including the 21 June renewal deadline), creating urgency.
- A Timeless save can switch to Timed at any point: from the menu, or in-world when the player interacts with a significant object or asks a character a question that Claude judges should start the clock. In-world triggers arrive as a proposal; the player confirms before the switch. The switch is one-way (Timed cannot go back to Timeless) — my call, so urgency is never undone.

**Story progress in Sandbox.** Sandbox does not use the Book chapter track. It has its own **mystery milestones**, derived from the authored chapters' key revelations (e.g. heard the flame, the register, the lake memory, the stones). Each milestone, once reached, unlocks the same gated knowledge and discoveries the corresponding chapter does elsewhere (character `knowledge` gates, Echosight lake/stones). In Timeless, milestones are reached only by Claude proposing them after the player actually pursues the thread (engine checks prerequisites and order). In Timed, a milestone is also reached when its calendar point passes. The context builder gates on milestones in Sandbox and on chapters elsewhere — milestone mapping is the builder's to define from the authored story.

**Invented characters** (owner's decision). Claude may introduce new people. They have no portrait, so Claude introduces each with enough visual description (appearance, clothing, manner) for the reader to picture them, and they appear as text-only speakers on stage. They live only in that save: stable save-scoped ID, name, description, role, where they're usually found, and their own witnessed memories, all tagged `invented`. The engine caps how many exist and never promotes them to canon sheets. Guided mode may also introduce minor invented characters within its interludes, under the same rules — my call.
- Allowed proposals: everything in Guided, plus starting and resolving long storylines, time advancement, and reaching a self-declared ending for a storyline or for the year. Engine still enforces existing rules (no invented locations, spell prerequisites, bounded deltas); invented people follow the rules below.

## Privacy and the public repo

- `.gitignore` adds Electron build output (`out/`, `release/`, `*.exe`, etc.); keeps `.env*`, `.local/`.
- Saves, AI logs, the Claude working directory and settings all live under the user data folder, never the repo.
- Remove `.env.example` provider settings and all key-handling code with the old providers.
- No credentials are ever stored or seen by the game; Claude Code keeps its own login.
- Add a test that save/log/working paths resolve outside the repo directory.

## What changes in existing docs

`docs/ENGINE.md`, `docs/AI_SETUP.md`, `characters/README.md`, `START_HERE.md`, `CLAUDE_START_HERE.md` and `OBJECTIVES.md` all state "AI is supplementary and cannot change state". That stays true for Prebuilt modes; the docs must be updated to describe the AI-mode rules above and the new setup (no keys; requires Claude Code installed and logged in).

## Calls made without the owner (review these)

- Prebuilt modes drop the free-text AI chat box entirely; they use prepared dialogue only and never call Claude. AI dialogue already stored in v4 Book/Live saves is kept in the save but no longer shown.
- Guided and Sandbox start fresh games rather than importing Book/Live saves.
- The `world/` lore pack is drafted by the builder from `STORY.md`, `story/`, `docs/YEAR_CONTINUITY.md` and the character sheets, then approved by the owner before AI tuning. It states the mystery's true answer in a section marked storyteller-only (never revealed directly; revealed through milestones).
- Model use (owner confirmed): all writing uses the strongest model. Housekeeping calls (chronicle summaries, memory extraction, mapping typed text to an authored option) use a mid-tier model, not the lightest — background records must be accurate. When a limit is reached, the game says so gently and Prebuilt stays fully playable.
- Timeless → Timed switch is one-way.
- Guided interludes may introduce minor invented characters.

## Left to the builder

- Electron tooling (Forge vs electron-builder), protocol choice, installer vs portable.
- Exact JSON schema, budget numbers, summarization cadence, N for recent turns.
- How the main menu presents three options with Prebuilt's two sub-choices, within the existing art direction (`docs/PRESENTATION_DIRECTION.md`).
- Test strategy for the bridge (a fake `claude` executable for tests, as the existing suite uses a fake provider).
- Build order — a sensible sequence is Electron shell + file saves → Claude bridge + reply contract → context/memory system → Sandbox → Guided — but the builder decides.
