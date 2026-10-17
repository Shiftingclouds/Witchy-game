# Authored story length and release gate

The 250,000-word request is a production objective. It is not the current game's length. The app currently contains a short playable first-year outline, introductions, conversations, lessons, and small gatherings; a larger cast and reusable scenes do not create novel-length content by themselves.

## Reproduce the audit

From the repository root:

```sh
node scripts/count-story-words.mjs
node scripts/count-story-words.mjs --json
node scripts/count-story-words.mjs --check
```

The first command prints category and chapter totals. JSON includes every counted text field, its source, eligibility, and any exact duplicate. `--check` exits with status 1 until eligible authored content reaches 250,000 words. This intentional failure is a content production gate, not a broken application test. It must not be included in ordinary application tests until the release-length requirement is met.

The counter uses the actual application data and fixed engine outcomes. It does not count README files, production plans, archived JSON sidecars, source code, comments, test fixtures, generated web bundles, or image filenames. New story formats require an explicit adapter and verification that a player can reach the content; dumping a manuscript into the repository does not qualify it.

## Current measured length

Measured on 16 October 2026, after the integrated register investigation:

| Measure | Words |
| --- | ---: |
| Eligible unique story, dialogue, choices, lessons, discoveries | 20,004 |
| Progress toward 250,000 | 8.00% |
| Remaining to the minimum | 229,996 |
| Catalogued reference copy, generic fallbacks, and migration-only prose, excluded | 2,710 |
| Opening and register scenes and local decisions, across branches | 15,603 |
| Register investigation alone, including local choices | 4,808 |
| One opening path, excluding the two chapter-exit choice pairs | 8,960–9,034 |
| Complete current Book / illustrated route, including visible choices and one ending, excluding optional conversations | 13,868–14,004 |

The prior integrated opening checkpoint contained 15,105 eligible words. Both reading presentations now consume **the same selected path**. Retired compact summaries for chapters 1–3 no longer count. Ten local decisions produce 1,024 combinations through the register with explicit rejoins and later callbacks. The counter computes exact counts and length ranges by merging histories after their last future use, while retaining repeated text until its final occurrence; it does not add mutually exclusive outcomes to a single-playthrough figure.

The opening contains 13 scene sections across the arrival/orientation and first-practical chapters. The register adds six sections and a 4,261–4,349-word selected chapter route including its exit labels. Chapters 4–8 still have compact prototype narration (79–99 words each) and require full expansion. Reaching the opening package budget does not complete the first-year manuscript.

## What qualifies toward 250,000

Count unique authored narration, character dialogue, player choices, branch outcomes, spell lesson questions/answers, and substantive discoveries that ship in the offline game. Count all reachable branches in the content-library total, including mutually exclusive routes. Count each exact repeated string once across book/world modes, revisits, character reuse, menus, and journal copies.

Do not count bios, location descriptions, role labels, titles, objective text, calendar descriptions, routine tables, metadata, interface instructions, reward notifications, player notes, or optional AI replies toward this narrative target. These can improve the game but are reported separately where catalogued. The counter deliberately excludes shared generic conversation fallbacks and the daily-conversation wrappers that concatenate existing bios or introductions. Repetition over a hundred in-game days does not increase authored length.

Tokenization counts words containing letters or numbers; internal apostrophes and hyphens stay within a word, while em dashes separate words. Exact deduplication normalizes Unicode and whitespace. It does not detect paraphrased filler, copied paragraphs inside larger strings, or cosmetic name substitutions. Those require editorial review, and they must not qualify simply because the program sees different strings.

The current source adapters cover `content.mjs`, `cast.mjs`, `life.mjs`, selected authored discoveries through the public `engine.mjs` API, epilogue data in `features/story/epilogue.mjs`, and the registered `src/story/` scenes exposed through `stagedScenes` in `scene-beats.mjs`, including selected decision labels. Exact new-game dependency-state analysis checks eligibility; migration-only fallbacks are reported separately. Derived `chapterBeats()` fragments render existing chapter prose and are not counted again. The story UI and counter import the same epilogue data; formatting or moving JSX does not change the count. Setup instructions, character sheets, and engine documentation remain excluded.

## Acceptance criteria beyond arithmetic

1. **Shipping library:** at least 250,000 eligible unique words, reachable offline through implemented choices, quests, conversations, or scenes. A production budget should exceed the floor to allow cuts and deduplication.
2. **Route length:** measure the main plot with one selected relationship route separately from the all-branches total. Report shortest and typical tested routes; never advertise the library total as the length every player reads. The current book-route report includes both displayed choice labels and one ending, with no optional chats. It is a supplied-text measurement, not a recording of what a person read.
3. **Scene purpose:** every substantial scene has an objective, development or conflict, a decision or meaningful action, an emotional turn, and an observable consequence. Length ranges are planning aids, not quotas that justify padding.
4. **Cast purpose:** each featured character supplies a distinct obstacle, clue, skill, relationship, or perspective. Removing them should change something identifiable. A different portrait plus interchangeable dialogue does not constitute a character arc.
5. **Branch purpose:** a branch must change information, trust, boundaries, plans, later reactions, or the outcome. Required plot resolution must remain possible without pursuing romance or repeatedly farming daily actions.
6. **Completion:** every accepted scene passes continuity, speaker/expression, save/resume, unlock, and offline checks; each quest and ending has a tested attainable path. Outline notes, unconnected drafts, and placeholder prose remain outside the shipping count.

Use the companion production roadmap for the proposed content allocation. Its future-word budget is a plan, not authored content. The counter never imports that document.
