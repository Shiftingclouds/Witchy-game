# Claude: the complete core story rewrite is here

**Updated 19 October 2026. Branch: `scene-player`. Start with [story-drafts/README.md](story-drafts/README.md).**

The actual prose is in the nine numbered `.txt` files in [story-drafts/](story-drafts/): eight chapters followed by eight full epilogues. This supersedes the earlier handoff saying that only arrival was written. The owner's latest requests authorize the whole core rewrite, different house-friend pairs, and eight endings.

## What has been written

- A new opening before the boats: the letter at home, packing, departure, the green train, and meeting Priya, Toby, and Cas at Platform Nought. Six house questions precede the player's final house choice.
- Rewritten chapters from First Kindle through Bloomtide, preserving the existing sections, decision keys, option IDs, conditional gates, exit indices, and their order. The approved arrival remains the foundation of Chapter 1.
- A full seven-section Midsummer restoration. The three spells do distinct work; a participant withdraws, the first connection fails, and the group adapts using what it practised. Rowan's private support choice, Saoirse's lantern assignment, the rehearsal arrangements, and the original voice all receive payoffs.
- Recurring house pairs in every chapter and epilogue: Owlcombe—Imogen/Idris; Rookhallow—Rowan/Cas; Heronmere—Noor/Petra; Larkspire—Saoirse/Toby. Other characters remain in the shared world. All eight familiars have branches in five chapters.
- Eight complete endings, specified in [ENDING_STORYBOARD.md](story-drafts/ENDING_STORYBOARD.md) and [endings.json](story-drafts/endings.json). The final direction combines with the original two stewardship policies. Each has a concrete event, a house-friend scene, and its own closing image.

## Manuscript status versus game status

**These latest drafts have not been imported.** This publication changes manuscripts, their audit, and handoff documents; it does not change runtime prose or artwork. The checkout used for writing began at `36b09e6`, which already contained Claude's import of the earlier approved arrival. That import does not include this package's letter, journey, questionnaire, or later rewrite.

`STORY.md` and `story/` remain exports of the implemented game. Read `story-drafts/` to find this new writing. Treat the drafts as the editable source when importing them; regenerate readable runtime exports afterwards.

## Integration order

1. **Import chapters 1–7.** Each passes the existing importer's dry run, for example:

   ```sh
   npm run import:story -- story-drafts/01-arrival-chatgpt.txt --check
   ```

   Omitting `--check` imports a file. Repeat for the remaining numbered chapter files through `07-bloom-chatgpt.txt`. The importer merges existing metadata by stable identifiers; it does not supply all gameplay metadata for new material.

2. **Wire the new opening.** Use `arrival:letter` and `arrival:sorting-1` through `arrival:sorting-6`. Each questionnaire answer uses a house ID. Tally a suggestion while preserving the player's final authority in `arrival:house`. Update introductions: Priya, Toby, and Cas are met on the platform; Tully is met aboard the boat. Petra's first house introduction is conditional on Heronmere. Verify acquaintances and memories at the actual encountered beats, including first meetings in other modes. Do not grant private knowledge simply because a portrait appeared.

3. **Register the expanded final chapter.** Its stable manuscript ID is `heartfire-chapter-7`, chapter index `7`. `src/scene-beats.mjs` currently registers only the first seven staged scenes, and the importer rejects unknown scenes. Add the final scene to that path before importing `08-midsummer-chatgpt.txt`; merely generating another chapter module will not make it playable. Preserve the current chapter-exit effects and handle saves positioned in the old compact final chapter.

4. **Integrate the eight epilogues.** The current parser imports scenes, and `src/features/story/epilogue.mjs` contains only the old two outcomes. Parse or convert the eight `EPILOGUE` blocks, including speaker expressions and house/familiar/letter gates. Replace the old common ending prose rather than appending it to every new ending. Follow `endings.json`: `bloom:future-work` is provisional; `heartfire-chapter-7:future-focus` is authoritative. Exit `0` remains shared stewardship and exit `1` remains keeper. Retain those policy meanings in saves; select the ending variant separately. A missing final focus defaults to `welcome`, preserving existing `shared` and `keeper` IDs. Do not infer it from an unrecorded choice.

5. **Reconcile presentation and persistent state.** Check introductory backgrounds and the requested `cg-acceptance-letter` and `journey-countryside` illustrations against the art slots. This pass supplies no new image files. Review portrait staging, relationship effects, AI memory wording, and progress restoration around new beats. Rowan's private Bloomtide conversation must remain private. The new future-direction choices express preferences; they should not award repeatable rewards.

6. **Validate the imported game.** Export the story, run the project's checks and build, then exercise Book/staged readers, every ending, each house and familiar, and older-save fallbacks. Include the eight ending selections, a changed Bloomtide preference, the house suggestion, resume during the new opening, and resume around the new final choice. No browser playthrough of this latest rewrite has been claimed.

## Checks and scope

[REWRITE_CHECKS.json](story-drafts/REWRITE_CHECKS.json) records the source-brief hash, manuscript hashes, authored prose count, and route analysis. Run `node scripts/check-rewrite.mjs --write-report` to regenerate it. It checks the preserved source structure, valid speakers/expressions/locations, known choice references, all four house pairs, familiar coverage, and reachability of authored branches for each ending. Older-save `(none)` branches receive syntax/reference checks; their runtime migration still needs testing.

The seven currently supported chapter imports pass `--check`. The existing `tests/story-script.test.mjs` test file passes. The manuscript audit uses symbolic dependency states; its large combination counts are not separately written stories or simulated browser playthroughs.

The checked package contains **35,701 authored prose words** across all alternatives, with complete manuscript routes of **23,442–24,088 words** including displayed choice labels. Tags, hints, journals, planning files, and duplicate whole text fields are excluded from the authored total.

The core first-year draft is written through its endings. The broader **250,000-word game**, personal quests, full romance routes, and additional school-life material are not complete. Do not count the replacement draft, old runtime prose, and generated exports as additive new writing. The next implementation task is to import and play-review this package; the next substantial writing work is the additional character and academy-life content.

Older milestones and stopping instructions in `CLAUDE_START_HERE.md` are archived context. This handoff is the current rewrite status and publication target.
