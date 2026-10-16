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
