# Production checkpoints

## 16 October 2026 — Foundation preserved

- Checkpoint: `f96f697` — academy engine, character sheets, AI setup, original art integration, current compact story.
- Verified before checkpoint: 33 unit/API tests, 20 browser scenarios, formatting, character sheets, clean installation, production build, development and production startup. Actual provider credentials remain unconfigured.
- Measured story: 4,812 eligible words; 245,188 remain to the 250,000-word minimum. Profiles, plans, setup copy, and generated dialogue are excluded.
- Next: follow [the completion plan](docs/PRODUCTION_PLAN.md), beginning with shared authored scenes, saved local choices, branch-aware counting, and the opening package.

This log records completed packages and their limits. Local commits preserve work; no push or publication is implied.

## 16 October 2026 — Shared branching story checkpoint

- Both reading presentations now consume the same authored paths. Five saved local decisions drive distinct responses and later callbacks; the two opening chapters contain eight scene sections. Save version 4 upgrades versions 1–3 without inventing choices.
- Added the arrival investigation, Cas/Toby corridor problem, first-night intention, and Elian’s first Kindle practical. Promoted Elian with a reviewed transparent portrait, active sheet, introduction, and routine.
- Targeted verification: 27 engine, migration, character-context, presentation-data, and life tests passed. The new story validator verified 32 opening combinations and old-save fallback passages. Formatting passed.
- Audit: 10,090 eligible words across the game, including 5,922 opening scene words and local choice labels. Retired chapter summaries and migration-only prose are excluded. The 10,000–15,000-word opening package remains in progress.
- Next gate: browser integration and visual review; then additional academy-life scenes and reading controls. No release-readiness claim is implied by this intermediate save.

## 16 October 2026 — Reading and browser checkpoint

- Story text can be enlarged, motion can be reduced independently of the device, and preferences survive reloads. Section navigation saves a reading place. Keyboard focus moves into the selected branch; transcripts retain decisions.
- Portraits keep stable stage positions through speaker changes; departed actors no longer push the remaining cast sideways. Background controls become inert while a dialog is open.
- Full checks passed: 37 unit/API tests, character/story validators, formatting, production build, and offline cache generation. All 23 browser scenarios passed across the full baseline run and affected-test rerun; one initial failure was an ambiguous test selector, corrected to target the dialog.
- Next: add a common-room visit and Saoirse’s practical introduction to bring the opening closer to its planned length. The current 10,090-word whole-game count is not the opening-package count.

## 16 October 2026 — Opening package integrated and reviewed

- Expanded the opening to **10,795 eligible authored scene words** across **13 sections**, with **seven local decisions** and **128 complete combinations**. One selected opening path contains 8,960–9,034 words before chapter-exit labels. The whole-game audit is **15,105 / 250,000**; 234,895 words remain. Chapters 3–8 are still compact.
- Added Heronmere visiting hours and a study invitation with an actual Thursday payoff, Saoirse’s supervised watering trial, Grey’s promised report, and corresponding practical-lesson callbacks. Elian now has individual supporting topics and daily dialogue. The active cast is 46; 14 additions remain proposed.
- Introductions establish acquaintance once and supply verified meeting memories. A character met in the story no longer remains a stranger in progression or AI context. Dated choices advance early saves without rewinding a later Live calendar; forged early memories are rejected.
- Visual review at desktop and 320px with largest text found and fixed a line-scroll problem. The stage remains visible during long text, every new line begins at the top, speakers retain positions, and the dialog heading/close control stay accessible. Review captures: [desktop](docs/opening-desktop.png), [mobile](docs/opening-mobile.png).
- Final checks: **39 unit/API tests passed**, character and scene validators passed, formatting and production build passed. **23 browser scenarios passed**, with the nine affected reader scenarios rerun successfully after the final introduction/layout fixes and three story scenarios rerun for review captures. The large-text/reduced-motion scenario also passed after disabling dialog/toast entrance animation under the in-game motion preference. The length release gate correctly fails below 250,000. Documentation links and unchanged original assets were checked.
- Added the [authoring contract](docs/STORY_AUTHORING.md) and [full-year continuity ledger](docs/YEAR_CONTINUITY.md), including an ordered six-scene plan for the register investigation. Real-provider access remains unconfigured; mock provider coverage is not a live-provider trial.
- Next checkpoint: bounded act-level route auditing, then write and integrate **Notes in the margins**, preserving evidence gates and the two existing reachable endings. Remaining full-year content, romance, new cast packets, and expressions are still production work.

## 16 October 2026 — Route analysis checkpoint

- Replaced full-history enumeration in production validators and length reports with exact dependency-state analysis. Completed histories merge only when future text and choices cannot distinguish them. Counts retain arbitrary precision; route lengths still deduplicate normalized whole fields.
- Ten focused audit/story tests passed: comparison against all current routes, conditional decisions and missing-choice fallbacks, cross-chapter duplicate prose, a hundred independent choices (2^100 exact routes), a visible dependency-budget failure, and engine/save regression paths covering every reachable beat and option through both endings.
- The unchanged content still measures 15,105 eligible words. Register artwork has been generated; chapter integration and visual review are the next checkpoint.

## 16 October 2026 — Register investigation and artwork integrated

- Added `register` / **Notes in the margins**: six substantial sections, **4,808 eligible scene words**, three saved decisions, earlier-choice callbacks and explicit rejoins. The player compares formal and working records, asks Grey about a keeper’s work, observes a supervised Echosight exercise, and supports Imogen’s correction. Both readers share the text and decisions.
- Generated and integrated **four images** using the supplied art as reference: the register close-up, Dunne’s attentive expression, and Maelin Quill’s neutral/reflective portraits. The close-up appears inline in Book and as an uncropped scene view; the full evidence remains readable in prose. Original art is unchanged. The browser collection now has **148 images / 27.2 MiB**.
- Promoted Maelin with an active sheet, routine, distinct prepared dialogue, professional boundaries and gated knowledge. The cast now has **47 active / 13 proposed** identities. Introductions, selected branch memories and private support remain separated by witness; the new chapter also accepts old saves without inventing opening decisions.
- Corrected Imogen’s older mystery conversation and the retained compact summary so they no longer assert physical erasure. Public AI facts distinguish supported observations from an unproven cause. Corrected the continuity ledger’s Candlestones date to the implemented First Thaw date, 20 March.
- Verified: **44 unit/API tests passed**, formatting and character/story validators passed, final production build and offline cache generation passed. **25 browser scenarios passed**, including both new art/reader scenarios. One new test initially constructed an inconsistent legacy daily date; its fixture was corrected and the full checks passed. Sandbox process/socket restrictions were resolved by running the checks with the approved local execution permissions.
- Visually reviewed [desktop evidence](docs/register-desktop.png), [320px largest-text view](docs/register-mobile.png), and [Maelin with Imogen](docs/register-portraits.png). New portraits have real transparency; stable speaker/listener placement and decoded expression changes were checked in the browser. All four new art files are available offline.
- Whole-game count: **20,004 / 250,000 words (8.00%)**, with **229,996 remaining**. Expanded scenes total 15,603 words across 19 sections. Current complete Book/staged routes contain 13,868–14,004 words including one ending and visible choice labels, excluding optional chats. The exact audit counts 1,024 combinations with at most 32 simultaneous dependency states. The length gate intentionally remains unmet.
- Next package: **Emberfall**, following the six-part sequence in [YEAR_CONTINUITY.md](docs/YEAR_CONTINUITY.md). Review the existing glasshouse and festival scenery, write the practical task and moonflower observation, then produce their close-up/environment needs. Chapters 4–8, substantial personal arcs, romance, remaining proposed cast and art gaps are still production work. Real-provider access remains unconfigured.

## 16 October 2026 — Emberfall checkpoint

- Added six Emberfall sections and **4,347 eligible scene words**: a practical lantern handover with Delphine’s time boundary, festival supper, controlled moonflower comparison, Rhys’s limited Echosight example, Saoirse’s quiet personal conversation and a corridor return. Three saved decisions have distinct responses and witness-specific memories; earlier watering and register decisions receive callbacks.
- Integrated four new images: a night glasshouse, petal-comparison close-up, Saoirse attentive and Rhys warm. The collection is **152 images / 28.1 MiB**. Reviewed [cast](docs/emberfall-cast.png), [evidence](docs/emberfall-evidence.png), and [320px largest text](docs/emberfall-mobile.png) captures. All load offline; prose remains available independently of artwork.
- Targeted checks passed: story/character validators, 21 engine/story/audit/presentation tests, then all eight story tests after adding the late-Live and private-memory case. Production build passed. Ten browser scenarios passed, including the full compact-year ending and new Emberfall offline resume/branch coverage. No new save version is required.
- Whole-game audit: **24,263 / 250,000 eligible words**, **225,737 remaining**. Expanded scenes contain **19,950 words across 25 sections**; current Book/staged routes contain **17,416–17,585 words**. Thirteen local decisions produce **8,192 exact combinations**, with at most 32 simultaneous audit states. The 250,000-word release gate remains unmet.
- Next: Longnight, with winter cottage art, seven-light evidence, teacher-supported investigation and a concrete Midsummer deadline. Remaining chapters, personal quests, romance and cast/art gaps remain production work. No live AI provider is configured.
