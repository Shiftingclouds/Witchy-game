// Builds docs/design/CHATGPT_STORY_REWRITE.md: one file that gives ChatGPT everything it needs to
// rewrite the whole story in the game's script format. Usage: node scripts/make-chatgpt-story.mjs
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { chapters, characters, expressions, houses, locations } from '../src/content.mjs';
import { stagedScenes } from '../src/scene-beats.mjs';
import { endingCommon, endingVariants } from '../src/features/story/epilogue.mjs';
import { MYSTERY_STAGES } from '../src/ai/world/mystery.mjs';
import { writeCompactChapter, writeStoryScript } from './story-script.mjs';

const sheets = Object.fromEntries(
  readdirSync('characters/active').map((f) => {
    const s = JSON.parse(readFileSync('characters/active/' + f, 'utf8'));
    return [s.id, s];
  }),
);
const houseName = (id) => houses.find((h) => h.id === id)?.name || '—';
const cell = (t) =>
  String(t ?? '—')
    .replace(/\|/g, '/')
    .replace(/\n/g, ' ');

const out = [];
out.push(`# Lanternmere — rewrite the story

Hello! You are writing the story of **Lanternmere**, a cosy, mysterious witch-academy game. The player arrives at Lanternmere Academy by boat, lives through their first year, and uncovers why the academy's lanterns are going dark. This file contains everything you need: how to write it, the exact format to write in, the cast, the places, what the mystery may reveal in each chapter, and the whole current story to rewrite (starting with a new opening skeleton).

The owner chose you because they love your prose. Make it yours.

## How to write

1. **Slow, grounded, concrete.** Let moments breathe. Show where we are and what it looks, sounds and smells like before things happen. Never rush from one event to the next.
2. **Always clear.** It must always be obvious who is in the scene, where they are standing, and who is speaking. One action or one spoken line per paragraph.
3. **No riddles, no random lines.** Every line follows from the one before. Characters talk like real people: plainly, warmly, with their own habits (see the cast sheet).
4. **The player is a newcomer.** Nobody knows them at first. Friendships grow over time and are earned. Never write a character greeting the player as an old friend before they have met.
5. **Speech and action stay separate.** Speech lines contain only what is said; describe actions in their own narration line.
6. **Cosy, not saccharine. Mysterious, not grim.** The magic is practical and gentle; the mystery is quiet and real.
7. **Second person, present tense** for narration ("You step onto the boat.").
8. Keep the player's own feelings light: suggest them, don't dictate them, and never put words in the player's mouth.

## The format (please follow exactly)

Write every scene in this plain format, one item per line:

\`\`\`
=== SCENE <scene id> | chapter <n> ===
--- SECTION <id> | place: <place id> | time: <morning|afternoon|evening|night> | date: <YYYY-MM-DD> ---
[N] A paragraph of narration.
[Rowan | warm] What Rowan says, without quotation marks.
[IMAGE <art id>] Alt text (keep these where they are).
[DECISION <key>] The question the player answers?
[OPTION <id>] What the player chooses | hint: a short hint | journal: what the player writes in their journal afterwards
[END DECISION]
[IF <key> = <option id>]
...lines that only happen after that choice...
[END IF]
\`\`\`

**Rules that keep the game working:**
- Keep every \`SECTION\` line, every \`DECISION\` key and every \`OPTION\` id **exactly** as given, in the same order. Later chapters remember these choices.
- Keep every \`[IF …]\` gate and its \`[END IF]\`; rewrite what is inside them freely.
- Inside a section you may add, remove, merge or reorder \`[N]\` and speech lines as much as you like.
- Speech: \`[<Name> | <emotion>]\` with the name exactly as in the cast sheet and an emotion from that person's list (use \`neutral\` if unsure). No quotation marks.
- A speech line whose words are in (parentheses) is a direction for what that person says: write the actual line.
- \`[BEAT]\` lines are stage directions in the skeleton: replace each with real prose (several lines if the moment needs them). \`[NOTE]\` lines are guidance for you: follow them, then leave them out of your reply.
- Only the places in the place list; only the people in the cast sheet (unnamed background people are fine).
- Option labels, hints and journal lines are prose too: rewrite them, but keep their meaning.

## How to reply

- **One scene per reply,** in a single code block, starting with its \`=== SCENE\` line.
- **Start with the opening** (scene \`arrival\`: the new skeleton plus the existing supper sections). Then stop and wait: the owner will play it in the game and tell you whether the voice is right.
- After that, when the owner says **"next"**, rewrite the next scene, in order.
- At the end of each scene, also rewrite that chapter's two **exit choices** as \`[EXIT 0] …\` and \`[EXIT 1] …\` lines.

`);

// Cast sheet
out.push('## Cast sheet\n');
out.push('| Name | Who they are | House | How they speak | Example line | Emotions you may use |');
out.push('| --- | --- | --- | --- | --- | --- |');
for (const c of characters) {
  const s = sheets[c.id];
  out.push(
    `| ${c.name} | ${cell(c.role)} | ${houseName(s?.identity.house)} | ${cell(s?.voice.cadence)} | ${cell(s?.voice.example)} | ${(expressions[c.id] || ['neutral']).join(', ')} |`,
  );
}
out.push('');
out.push(`Houses: ${houses.map((h) => `**${h.name}** (${h.bird}, ${h.virtue})`).join(' · ')}.`, '');

// Places
out.push('## Places\n');
out.push(locations.map((l) => `\`${l.id}\` ${l.name}`).join(' · '), '');

// Mystery limits
out.push('## The mystery, chapter by chapter\n');
out.push(
  'What each chapter reveals. A chapter may hint at what comes next but must never reveal more than its own line. Keep these facts unchanged.\n',
);
for (const stage of MYSTERY_STAGES)
  out.push(`- **Chapter ${stage.chapter + 1}:** ${stage.revelation}`);
out.push('');

// The story
out.push('---\n\n## The story to rewrite\n');
out.push(
  'Scenes in playing order. The opening starts with the new skeleton (stage directions to write in full), then continues with the existing supper sections of the same scene. Everything after that is the current prose: rewrite it in your own voice, keeping the structure tags.\n',
);
const skeleton = readFileSync('story-drafts/00-opening-skeleton.md', 'utf8').trimEnd();
const block = (text) => '```\n' + text.trimEnd() + '\n```\n';
for (const [index, chapter] of chapters.entries()) {
  const scene = stagedScenes.find((s) => s.chapter === index);
  out.push(`### Chapter ${index + 1}\n`);
  let script = scene ? writeStoryScript(scene, chapter.date) : writeCompactChapter(chapter, index);
  if (index === 0) script = skeleton + '\n' + script.split('\n').slice(1).join('\n');
  script += '\n' + chapter.choices.map((c, i) => `[EXIT ${i}] ${c[0]}`).join('\n') + '\n';
  out.push(block(script));
}
out.push('### Epilogues\n');
for (const [id, variant] of Object.entries(endingVariants)) {
  const lines = [
    `=== EPILOGUE ${id} ===`,
    ...[endingCommon[0], variant, ...endingCommon.slice(1)].map((t) => `[N] ${t}`),
  ];
  out.push(block(lines.join('\n')));
}
out.push(`---

When everything is rewritten, thank you! The owner will import each reply into the game.
`);
writeFileSync('docs/design/CHATGPT_STORY_REWRITE.md', out.join('\n'));
console.log('Wrote docs/design/CHATGPT_STORY_REWRITE.md');
