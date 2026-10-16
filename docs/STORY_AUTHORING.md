# Authoring scenes that both readers can use

`src/story/` owns prose and explicit performance directions. `src/scene-beats.mjs` registers one authored scene per chapter and supplies derived views for chapters not yet expanded. Book and staged readers call `chapterBeats(chapter, state)`; neither keeps a second manuscript.

## Data contract

Use the small constructors in `authoring.mjs`: `narrate`, `speak`, `actor`, `section`, `decide`, and `when`. Every beat has a stable unique ID, text, a nullable speaker, and at most two explicitly directed actors. A speaking actor must be on stage. Use an existing expression; write a request in the art queue when the right portrait does not exist. Staging never grants gameplay progress.

Sections have an ID, title, real location, period (0–3), and optionally a date within the chapter’s time window. The staged background uses that authored date and period; a delayed Live player does not turn a September memory into a winter illustration. Changing sections changes scenery. The book shows section headings and dates and offers navigation to the portions reached so far.

A decision is a normal beat with `choice: {prompt, options}`. Each option has a stable ID, label, journal summary, optional helpful hint, and `remember` character IDs. A condition is `{choice: 'scene-id:beat-id', equals: 'option-id'}`. Conditional passages follow their decision, and an unconditional beat rejoins the paths. Later chapters may reference earlier decisions. A later `equals: null` branch supplies an honest fallback for a migrated save with unknown history.

Do not change an ID merely to edit prose. Changing or retiring a decision needs an explicit migration; retired beat bookmarks safely reset only the reading position. Dates, option IDs, order, and chosen branch memories are validated on import.

## Commands and consequences

`{type: 'story-choice', key: 'scene-id:beat-id', option: 'option-id'}` accepts only the current unresolved decision in the current chapter. It saves the choice, adds the authored journal summary and selected shared memories, and bookmarks the continuation. Replay and alternative answers after selection are rejected. Neither timing nor an animation selects an option.

Introductions are explicit records in `story/choices.mjs`, keyed to a decision checkpoint. They establish a minimum friendship score of 1 once and record a `meeting:` memory. They do not repeat awards, add house points, or infer an encounter from a visible portrait. This keeps a person met in a scene from being treated as a stranger in Live requirements or AI context. Future additional effects should be typed engine operations with tests, not JavaScript callbacks embedded in content.

Dated decisions advance an early save to their date/period and reset daily activity when crossing a day. They never rewind a later Live date. Bookmark navigation changes no date, relationship, or reward. Chapter-exit choices still own the existing chapter progression and house-point award.

Only relevant saved choice keys accompany the selected NPC’s shared memories to either AI path. Memory meaning comes from authored IDs, with chapter/date validation; the provider cannot supply its own verified event text.

## Review and checks

1. Review the exact background and portraits before writing. Name the scene’s immediate goal, obstacle, action/decision, changed situation, and exit.
2. Write distinct branches with a visible response and a deliberate rejoin. Add the future callback in the same package when possible. Do not imply a numerical reward that the engine does not grant.
3. Run `npm run check:story` for references, dates, expressions, ordered decisions, path reachability, and migration fallbacks. Run `npm run count:words` for eligible unique text and actual route ranges.
4. Exercise the affected decisions, imports, replay, and older saves in engine tests. Check the readers with keyboard, narrow screens, large text, and offline reloads after a coherent package.
5. Update the production log and make a local checkpoint. Full suites belong after major integration, not every prose edit.

The current audit enumerates 128 opening paths and deliberately caps whole-package expansion at 4,096. Before the year exceeds that budget, split route analysis into bounded act packages with explicit incoming dependencies; do not remove the cap or silently sample paths and call the result exhaustive. Runtime reading resolves one selected path and does not enumerate combinations.

`docs/WORD_COUNT.md` defines the release target. Retired compact summaries, old-save-only prose, profile text, journals repeated from decisions, and generated AI replies are excluded. The present 10,795-word opening is an integrated package, not proof that the remaining year is written.
