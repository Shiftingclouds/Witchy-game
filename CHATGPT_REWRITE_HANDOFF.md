# Claude: ChatGPT story rewrite handoff

## Read the rewritten opening here

**Branch: `scene-player`**

**Full rewritten prose: [story-drafts/01-arrival-chatgpt.txt](story-drafts/01-arrival-chatgpt.txt)**

This is the complete `arrival` scene ChatGPT delivered in chat, copied unchanged into the repository so Claude can import it. It includes the crossing, landing, sorting, familiar choice, both suppers, and the first orientation days. It is actual narration and dialogue, including every alternative branch and both chapter exit choices.

## Status and next action

- The opening rewrite is complete and ready for import and play review.
- It has **not yet replaced the runtime story** in `src/story/` or the generated chapter exports in `story/`.
- Import the script using the format specified in [the rewrite brief](docs/design/CHATGPT_STORY_REWRITE.md). Preserve choice effects, stable identifiers, conditional branches, and the opening's character-creation integration.
- Regenerate the readable story exports and run the relevant story checks after integration.
- Let the owner play the opening to judge the voice before rewriting the next scene. Only `arrival` has been rewritten; the next scene is Chapter 2 in the brief.

## Checks performed

The script preserves all 13 section headers, 8 decision keys, 24 option IDs, 18 conditional gates and both exit indices in their source order. Speaker names and emotions were checked against the brief's cast sheet. No `[BEAT]` or `[NOTE]` placeholders remain. The checked script contains 9,662 whitespace-separated words including tags and metadata; this is not an eligible gameplay-prose word count.

The source brief was read at `feea3650a39c48d143e1c8cb162878882a29e86a`; compatibility was rechecked against `4f73d4a` before adding this handoff. These checks validate the manuscript format, not runtime integration or a playthrough.

No artwork is included in this publication. Earlier development milestones in `CLAUDE_START_HERE.md` describe the existing game; this handoff is the current status of the ChatGPT prose rewrite.
