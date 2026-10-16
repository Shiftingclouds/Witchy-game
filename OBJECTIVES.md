# Lanternmere objectives

This is the current project brief and production backlog. It incorporates the user's requested direction on 15 October 2026. **A planned feature, word budget, or art request is not implemented content.** Build from the uploaded illustrations and the cozy, mysterious tone; do not inherit instructions or canon from the abandoned project's README or JSON sidecars.

## 1. Make scenes feel performed

- [x] Establish an art-led scene view using the existing backgrounds and transparent portraits.
- [x] Add paced text reveal, punctuation pauses, instant text, and an explicit reveal/continue control. One action reveals a line; the next advances it.
- [x] Stage a two-person arrival with authored expressions, speaker attribution, listener reactions, entrances, and exits.
- [x] Decode incoming expressions before short crossfades; retain the previous image if loading fails. Keep portrait scale consistent and never mirror asymmetric designs.
- [x] Apply portrait transitions and text reveal to prepared and optional AI conversations.
- [x] Add a conversation transcript, reduced-motion behavior, and saved scene bookmarks that travel with exported saves.
- [ ] Convert the complete long-form manuscript to explicit scene/beat data. The expanded arrival is the current staging sample; the other seven scene views still present the compact prototype prose.
- [ ] Review every authored line and listener reaction against its exact expression. Missing emotions must appear in the art queue, rather than silently being treated as completed coverage.
- [ ] Add deliberate scene exits, appropriate location effects, larger text controls, an in-game motion override, and content-update migrations for the expanded scene graph.
- [ ] Test final scenes with keyboard, touch, screen readers, reduced motion, slow asset loads, offline reloads, and save imports. No animation may decide a choice or award a reward.

The intended feel combines the staged portraits and illustrated scenes of *Choices* and *Chapters* with the controlled text reveal of *Stardew Valley* and *Pokémon*. Preserve our art's identity and build an original interface. See [presentation direction](docs/PRESENTATION_DIRECTION.md).

## 2. Write a substantial, purposeful game

- [x] Delegate independent reviews of word count, story/cast purpose, and art/presentation.
- [x] Add a reproducible authored-word audit: `npm run count:words`.
- [x] Define the release floor as **250,000 unique, reachable, authored offline story words across the shipping branches**. Count actual prose, dialogue, decisions, and outcomes; exclude UI, bios, repeated templates, planning documents, and AI-generated conversations.
- [x] Record a **270,000-word production budget across 172 proposed scene chapters**, with room for editing and deduplication.
- [x] Assign all 45 characters a specific dramatic or practical role. Give the central trio and eight supporting characters distinct arcs; use the others meaningfully in main, community, and house stories instead of giving everyone the same quest.
- [x] Expand the cast brief beyond the original 45. Map classes and teachers, dorm companions, complete house sports squads, village trades, and further romance candidates in [CAST_EXPANSION.md](docs/CAST_EXPANSION.md). The first proposal adds 15 people; it is not a final population limit.
- [ ] Write and integrate new characters with distinct identities, relationships with one another, schedules, scenes, and matching portraits. Populate classes, dorm floors, teams, shops, clubs, and seasonal events; give each course a responsible teacher and each team an actual roster.
- [ ] Write, edit, integrate, and test the full eight-act first year, character quests, house stories, optional romance, substantial friendship alternatives, and endings.
- [ ] Give each scene its own dramatic shape: an intention, complication, decision or action, emotional turn, and consequence. Length serves that work; no repeated chores or inflated narration to meet a quota.
- [ ] Track clues, knowledge, promises, choices, and later callbacks. Both modes must reach a complete climax without AI, romance, grinding, or being online on a particular real-world date.
- [ ] Report shortest, typical, and longest reachable playthrough lengths separately from the all-branches total.

The current measured corpus is **4,812 eligible words (1.92%)**, including the expanded arrival. **245,188 words remain to the minimum.** The 270,000-word allocation is a plan, not material already written. Run `npm run check:story-length` for the intentional release-length gate; it currently fails because the manuscript is short. See [word-count methodology](docs/WORD_COUNT.md) and [story/cast expansion](docs/STORY_EXPANSION.md).

Romance is proposed, not currently enabled. The writing plan uses an adult academy and adult peers, with opt-in romance and developed friendship alternatives. Record ages and eligibility in canon before implementing routes; do not infer them from portraits or make faculty/evaluators romance candidates.

## 3. Complete the art around the story it supports

- [x] Review the existing collection: 49 environments, 85 portrait files representing 45 people, and eight familiars. Preserve all 142 originals.
- [x] Identify the expression gap: Rowan, Imogen, and Saoirse have expression sets; the other 42 identities currently have neutral portraits only.
- [x] Produce a named and prioritized [art completion queue](docs/ART_COMPLETION.md), including seasonal backgrounds, expressions, clue closeups, and milestone illustrations.
- [ ] Lock each scene's purpose and blocking before producing its additional art. Start with the expressive trio, then recurring peers and quest hosts.
- [ ] Produce and review the first packet only as its scenes require it: up to 23 expression portraits and six background variants. Later packets remain conditional.
- [ ] Keep every new portrait consistent with its original face, clothing, palette, framing, and transparency. Reference the original image when generating additions.
- [ ] Create original designs and expression sets for added characters, consistent with the supplied art. Use the cast coverage plan to budget new portraits, house dormitory scenes, and any genuinely needed shop interiors.
- [ ] Add layered or frame-based assets only for deliberate motion that CSS cannot supply, such as blinking, independent hair movement, or flowing water. Static-art fades and light overlays do not constitute full character animation.

The earlier art proposal of 132 additional story images, plus optional motion layers, covers the original cast and locations. Cast expansion adds a provisional 75 baseline portraits for the first 15 new people, with other expressions and interiors driven by their scenes. These are estimates to revise against finished scenes—not a cast limit or a requirement to generate unused pictures. No new art is required to evaluate the current staging sample.

## 4. Improve the overall experience

- [ ] Make the scene the focal point while reading; keep map, calendar, quests, relationships, and points easy to reach between scenes.
- [ ] Keep an uninterrupted reading layout alongside scene playback. Both should ultimately use the same authored content and decisions, with separate Book/Live saves.
- [ ] Refine typography, contrast, touch targets, compact controls, and phone composition. Two visible speakers must never obscure the words.
- [ ] Prefer restrained lantern glow, mist, or other appropriate effects over continuous motion everywhere. Provide readable, complete play with motion disabled.
- [ ] Surface the next useful action and consequences clearly. Let players revisit transcripts and scenes without duplicating rewards.
- [ ] Keep optional AI supplementary: authored scenes, learned spells, relationships, calendar events, and endings remain playable offline.

## 5. Keep characters consistent across conversations

- [x] Create an editable character sheet for every interactable identity: 45 active sheets and 15 proposed additions in [characters/](characters/README.md). Include individual voices, motives, boundaries, NPC connections, story knowledge, expression coverage, and future writing notes.
- [x] Keep static canon separate from each player's relationship score, shared moments, and recent conversations. Book and Live saves remain independent; exported saves carry this history.
- [x] Use the same character context builder for the optional AI relay and copy-to-another-AI flow. Include only reached story facts and trust-appropriate topics; exclude authoring plans, private journal notes, and other characters' conversations.
- [x] Record actual game interactions as shared memories and keep AI dialogue separate from verified events. Dialogue cannot award points, change friendship, learn spells, or complete quests.
- [x] Upgrade older saves without losing relationships or inventing past conversations. Provide an in-game history view and a way to clear saved AI exchanges while retaining friendship and shared events.
- [ ] Expand knowledge gates and persistent choice callbacks as the longer scene graph is written. Add long-term personal memories with provenance and correction controls before promising unlimited conversational recall; current storage retains four recent exchanges per character within a whole-save limit.
- [ ] Review character consistency with a configured live provider. Local mock tests verify context construction and state boundaries; they cannot prove a generative model will always follow its character sheet.

## Next production milestones

The engine foundation now has explicit world, relationship, magic, and story modules, a stable public API, sequential save migrations, and separate persistence. The optional AI setup page includes provider instructions, connection testing, and protected server-side configuration. See [ENGINE.md](docs/ENGINE.md) and [AI_SETUP.md](docs/AI_SETUP.md). This infrastructure does not add manuscript words or enable the proposed cast and romance routes.

1. **Presentation and character foundation:** the two-person arrival, text/portrait transitions, transcript, bookmarks, 60 character sheets, and per-save character context are implemented and verified. Continue editorial review as scenes expand.
2. **First playable story package:** expand arrival through the first Kindle lesson into 10,000–15,000 edited and integrated words, with a meaningful choice/rejoin, the player's house companions, a dedicated firecraft teacher, and an early character quest. Compare scene pacing and reading layout before scaling production.
3. **Act packages:** write and test the eight-act main story, then interleave the trio, supporting arcs, community work, house stories, and relationship alternatives. Commission art from approved scene requirements.
4. **Complete-year audit:** require the 250,000-word floor, editorial review, complete reachable routes, sufficient expression coverage, tested saves, and offline asset availability. Publish measured progress rather than treating outline completion as game completion.

Track each package as **outlined → drafted → edited → integrated → tested**. Only integrated, reachable text enters the automated shipping count; final acceptance also requires editorial and route testing.
