# Lanternmere — the actual story

Start here to read the implemented narrative. These chapter exports contain the prose and dialogue used by the game, including labelled alternative choices. They are not outlines. Read [CLAUDE_START_HERE.md](CLAUDE_START_HERE.md) for the development handoff.

7 chapters are expanded into 43 scene sections. The table identifies any chapters still awaiting expansion. See [the current word audit](docs/WORD_COUNT.md) for progress toward the requested 250,000-word minimum. Exported copies do not increase the word count.

| Chapter | Readable prose | Editable game source | Status |
| --- | --- | --- | --- |
| 1. A place at the table | [Read chapter](story/01-arrival.md) | [Source](src/story/arrival.mjs) | Expanded, playable |
| 2. The smallest flame | [Read chapter](story/02-first-kindle.md) | [Source](src/story/kindle.mjs) | Expanded, playable |
| 3. Notes in the margins | [Read chapter](story/03-register.md) | [Source](src/story/register.mjs) | Expanded, playable |
| 4. A lantern for the lost | [Read chapter](story/04-emberfall.md) | [Source](src/story/emberfall.mjs) | Expanded, playable |
| 5. The lake remembers | [Read chapter](story/05-longnight.md) | [Source](src/story/longnight.mjs) | Expanded, playable |
| 6. An open circle | [Read chapter](story/06-thaw.md) | [Source](src/story/thaw.mjs) | Expanded, playable |
| 7. The light we carry | [Read chapter](story/07-bloom.md) | [Source](src/story/bloom.mjs) | Expanded, playable |
| 8. A home made of light | [Read chapter](story/08-midsummer.md) | [Source](src/content.mjs) | Compact, playable; expansion pending |

[Read the two current epilogues](story/09-epilogues.md).

The sources also contain supporting conversations, spell lessons and gatherings in `src/content.mjs`, `src/cast.mjs`, and `src/life.mjs`. The chapter exports focus on the main story.

Regenerate with `npm run export:story`; verify that exports match the game with `npm run check:story-export`. See [the authoring contract](docs/STORY_AUTHORING.md) and [the word-count method](docs/WORD_COUNT.md).
