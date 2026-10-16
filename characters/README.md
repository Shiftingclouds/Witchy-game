# Character sheets and player relationships

Every named character has one editable JSON sheet: `active/` contains the 46 playable identities, and `proposed/` contains the 14 planned additions. Proposed people have no art or game entry yet and are deliberately excluded from the AI and browser registry.

These files define characters. **They never contain a real player's save, private notes, friendship score, or conversation transcript.** Each Book/Live save stores those separately. Exporting a save carries its relationships and memories; a fresh game starts without another player's history.

## Edit a character

- `identity`: stable ID, display name, role, optional pronouns, house, and age provenance. Proposed ages do not become established facts or enable romance.
- `canon`: summary, personality traits, values, motivation, fears, boundaries, and facts. `knowledge` and `privateReactions` carry `minimumChapter` and `minimumBond` gates.
- `voice`: cadence, humour, things to avoid, and a sample. The characters have individual directions rather than a shared instruction to sound warmly inspirational.
- `connections`: relationships with other NPCs, their established/proposed status, and earliest story stage. An NPC does not receive another character's player conversations.
- `relationshipStyle`: behaviour at acquaintance, friend, and close-friend levels. Romance is currently disabled for everyone, including planned candidates.
- `presentation`: original portrait prefix and actual available expressions. Neutral-only characters cannot request a nonexistent smile asset.
- `runtime`: references to the relevant save fields and schedule source; these are paths, not embedded live progress.
- `authoring`: future arcs and drafting notes. **This entire section is excluded from AI prompts.** A planned outcome is not a memory of something that happened.

`src/content.mjs` reads active sheet names, roles, and biographies. Existing authored dialogue and four-period routines remain in `src/cast.mjs` and `src/content.mjs`; edit those when changing a character's actual scenes or schedule. The sheets are the source for AI personality and knowledge. Changes must remain consistent with the authored story; the model is not responsible for reconciling contradictory writing.

After adding/removing an active sheet, run `npm run sync:characters` to regenerate `src/character-sheets.mjs`. Run `npm run check:characters` after edits. The production build includes the validator. Do not promote a proposed sheet until its identity, art, conversations, and world presence are implemented. IDs remain stable across renames and content revisions.

## Per-save state

| Field | Meaning and owner |
| --- | --- |
| `bonds[characterId]` | Authoritative friendship score, 0–100. Existing game actions alone change it. The label is derived from this score; there is no second competing score in the sheet. |
| `characterMemories[characterId]` | Up to 16 shared moments identified by game-controlled keys, with in-game dates. Introductions, chosen topics, daily time together, gatherings, and chapter decisions are recorded by the engine. |
| `conversations[characterId]` | Up to four recent AI exchanges, including player text, reply, actual expression, source (`provider` or `pasted`), date, and chapter. These are unverified dialogue, not facts about completed quests. |
| `storyChoices[sceneId:beatId]` | Immutable local decision IDs. Only relevant keys accompany the selected character’s memories in AI context. |
| `conversationSequence` | Local ordering for trimming the oldest dialogue when the whole save exceeds 60,000 conversation characters. |

Shared memories are compact references such as `talk:hello` or `event:arrival-day:0`, `scene:arrival:first-observation:record`, or `meeting:arrival:first-observation`. Scene memories must match a saved choice and its earliest possible date; introductions use explicit authored checkpoints. The context builder looks up their authored meaning. It does not accept arbitrary text labelled “verified memory” from a provider. Clearing saved AI conversation removes the transcript for that character without lowering friendship or erasing real shared events.

Save version 4 retains these stores and adds `storyChoices`. Versions 1–3 migrate automatically, preserving scores, journal notes, spells, and progress. Old introduction/topic rewards supply recoverable memories with an unknown date. Missing conversation history and past event choices are left unknown; migration never invents them. Runtime parsing validates IDs, dates, chronology, sizes, and sources, and removes unrecognised fields. There is no cloud account or shared server-side player memory in this implementation.

## How AI retrieves context

1. The browser selects the current character's state with `characterInput(game, id)`; it does not send the full save, private journal, or another character's chat.
2. `src/character-context.mjs` loads that character's active sheet and constructs a bounded context. The API and offline copy-to-AI bridge use the same builder.
3. Only reached public story events, permitted character knowledge, established NPC connections, and trust-appropriate personal topics enter the prompt. Stage gates count completed chapters: `minimumChapter: 3` means the third prototype chapter has been completed. Final-stage material requires the completed ending. New scene-specific unlocks should extend these gates as the full story is implemented.
4. Relationship score, derived label, verified shared events, and recent exchanges inform the reply. Prior AI replies never rewrite canon or prove a game action occurred. Unknown history stays unknown.
5. The provider returns only dialogue and an allowed expression. The engine stores that exchange without awarding points, raising friendship, or changing quests, spells, time, or canon.

The AI relay revalidates the selected snapshot and rebuilds canonical memory text from IDs. The local browser owns the save; this is not a server-authoritative multiplayer or anti-cheat system. Prompt instructions and withheld facts reduce drift and spoilers, but a generative provider can still contradict them. Local mock tests verify the context and state boundaries; a paid provider has not been configured or tested. A future long-term memory feature should retain provenance and require a real game event before promoting a claim to fact.

The complete copyable context can be inspected in the conversation's “Use ChatGPT or another AI” panel. It works offline after the app is cached. The context contains this friendship and recent messages, so copying it to another service deliberately shares those selected details. Character documents and AI-generated text do not count toward the 250,000-word authored-story target.
