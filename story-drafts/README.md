# Read the ChatGPT story rewrite

**Branch: `scene-player`. These files contain the actual narration, dialogue, choices, and alternative scenes.** The core first-year manuscript now has eight chapters and eight complete epilogues. The earlier approved arrival is the foundation of Chapter 1; the letter and journey are new, and Chapters 2–8 and the endings have been rewritten.

The latest package is a manuscript delivery. It has not been imported into the game. An earlier version of the arrival already exists in the runtime, but it does not contain this new opening. The files in `story/` export the currently implemented game; they are not this rewrite.

## Read in order

| Chapter | Manuscript | What happens |
| --- | --- | --- |
| 1. Arrival | [01-arrival-chatgpt.txt](01-arrival-chatgpt.txt) | The letter, leaving home, the green train, Platform Nought, the crossing, house questions, familiar selection, and the first days. |
| 2. First Kindle | [02-first-kindle-chatgpt.txt](02-first-kindle-chatgpt.txt) | Learning beside Rowan, an imperfect first attempt, and the voice beneath the flame. |
| 3. The register | [03-register-chatgpt.txt](03-register-chatgpt.txt) | Imogen follows the missing workers' accounts, makes a premature claim, and chooses how to correct it. |
| 4. Emberfall | [04-emberfall-chatgpt.txt](04-emberfall-chatgpt.txt) | Saoirse's promises meet the time available; the festival and a moonflower experiment leave room for quiet company. |
| 5. Longnight | [05-longnight-chatgpt.txt](05-longnight-chatgpt.txt) | A winter round, seven willing lights beneath the ice, and the Midsummer deadline. |
| 6. First Thaw | [06-thaw-chatgpt.txt](06-thaw-chatgpt.txt) | The Candlestones, a connection that can be released, and invitations people may decline. |
| 7. Bloomtide | [07-bloom-chatgpt.txt](07-bloom-chatgpt.txt) | A workable rehearsal, private support for Rowan, a finished register and lantern, and a provisional direction for next year. |
| 8. Midsummer | [08-midsummer-chatgpt.txt](08-midsummer-chatgpt.txt) | The full restoration, an interrupted casting, the group's recovery, your lantern lighting, and the final choices. |
| Endings | [09-epilogues-chatgpt.txt](09-epilogues-chatgpt.txt) | Eight distinct final scenes showing the lives those choices lead to. |

`[N]` marks narration. A character's name marks speech; the second tag selects their portrait expression. `[IF …]` blocks show alternatives, so a player reads only the block matching their saved choice. The manuscripts include every alternative for review.

## Your house friends

| House | Recurring pair |
| --- | --- |
| Owlcombe | Imogen and Idris |
| Rookhallow | Rowan and Cas |
| Heronmere | Noor and Petra |
| Larkspire | Saoirse and Toby |

Every chapter and ending includes a scene with the selected pair. The wider cast remains in the same world, and the central investigation includes Rowan, Imogen, and Saoirse in every house. Familiar-specific moments recur across five chapters, with additional travel variants in one ending.

## Eight endings

The final direction—welcoming arrivals, recovering records, following the roads, or everyday academy life—combines with the existing choice between shared stewardship and a keeper's year. All eight outcomes are available from every house and familiar. The earlier Bloomtide preference can be changed, and no romance or hidden relationship score is required.

Read [ENDING_STORYBOARD.md](ENDING_STORYBOARD.md) for the eight outcomes and their earlier preparation. [endings.json](endings.json) gives the exact selection rules, stable IDs, and older-save default.

## Review and import

The checked package contains **35,701 authored prose words** across its alternatives. A complete manuscript route reads **23,442–24,088 words**, including the choice labels shown to the player. These are manuscript counts, not a claim that the new routes have been played in the application.

- [Claude handoff](../CHATGPT_REWRITE_HANDOFF.md): current status, integration order, and remaining work.
- [Writing plan](REWRITE_PLAN.md): scene purpose, character movement, and canon constraints.
- [Check report](REWRITE_CHECKS.json): exact prose counts, manuscript hashes, and symbolic branch analysis.
- Run `node scripts/check-rewrite.mjs` from the repository root to repeat the manuscript audit. Add `--write-report` to regenerate the report.

This core rewrite does not complete the 250,000-word whole-game goal. Its word count includes authored alternatives and excludes tags, planning documents, and duplicate whole fields; a single playthrough reads fewer words. Do not add these replacement manuscripts to the old runtime prose count as if both were new story content. Personal quests, full romance routes, and further school-life chapters remain separate writing work.
