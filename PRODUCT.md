# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

One person: the owner. They play alone on their own Windows PC, in quiet evening sessions, to unwind and get lost in a world they love. There is no other audience.

## Product Purpose

Lanternmere is a cozy, mysterious witch-academy story game. It lets the owner live a first year at Lanternmere Academy, either as a prebuilt illustrated story (Book and Live the world modes) or, in planned modes, as a living world written by Claude as they play. Success is the owner sitting down and immediately feeling wrapped in the world: warm, comforting, mysterious and magical, never overwhelming.

## Positioning

A personal story world built around a single owner's taste and a hand-assembled body of illustrations and prose, not a product for a market. Its distinct mechanism is one shared world and story that can be read as written or lived freely with an AI storyteller.

## Operating Context

- Played in an Electron desktop window on Windows 11; works fully offline for prebuilt play. Planned AI modes call Claude Code (`claude -p`) on the same PC.
- Long, unhurried reading sessions: illustrated scenes, staged dialogue with character portraits, choices, a calendar, a journal.
- Developed in a public GitHub repository; nothing private is committed.

## Capabilities and Constraints

- Existing React/Vite game with a deterministic engine shared by Book and Live modes; 47 character sheets; seven expanded chapters (see `CLAUDE_START_HERE.md`).
- Three planned ways to play: Prebuilt (Book + Live), Guided AI, Sandbox AI (see `docs/superpowers/specs/2026-10-16-desktop-and-ai-modes-design.md`).
- Desktop window minimum 1024×700; narrow widths only need to keep working.
- Reading comfort is a requirement: text size, reveal speed, reduced motion and reading modes must all be respected.

## Brand Commitments

- Name: Lanternmere, "Academy of the Quiet Arts".
- Feel the owner made binding: warm, comforting, mysterious, magical, never overwhelming; magical but inviting.
- The existing illustrations (and ChatGPT-made art in the same style, e.g. `art/opening-lantern-mere.png`) are the visual heart.
- Approved visual direction: `docs/superpowers/specs/2026-10-17-lamplight-visual-design.md`.

## Evidence on Hand

- ~160 illustrations: locations, portraits with expressions, familiars (`*.png`, `art/`).
- Authored prose in `story/` and `src/story/`.
- No audience, marketing, testimonials or monetization exist or should be invented.

## Product Principles

1. The world comes first: art and story lead, interface recedes.
2. Comfort over cleverness: nothing should overwhelm, rush or strain a tired reader.
3. Magic is earned: special effects and light are kept for moments that deserve them.
4. Never lose the player's life in the world: saves are sacred.

## Accessibility & Inclusion

Single user, but long reading sessions: high contrast in every reading mode, adjustable text size, full reduced-motion support, keyboard play.
