import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { chapters, characterById } from '../src/content.mjs';
import { stagedScenes, choiceDefinition } from '../src/scene-beats.mjs';
import { endingCommon, endingVariants } from '../src/features/story/epilogue.mjs';

// Readable exports are derived from shipping prose, never a second authoring source.
// Include all alternatives with explicit labels; this is not one possible playthrough.
const check = process.argv.includes('--check');
const files = new Map();
const sections = stagedScenes.reduce(
  (total, scene) => total + new Set(scene.beats.map((beat) => beat.section.id)).size,
  0,
);
const index = [
  '# Lanternmere — the actual story',
  '',
  'Start here to read the implemented narrative. These chapter exports contain the prose and dialogue used by the game, including labelled alternative choices. They are not outlines. Read [CLAUDE_START_HERE.md](CLAUDE_START_HERE.md) for the development handoff.',
  '',
  `${stagedScenes.length} chapters are expanded into ${sections} scene sections. The table identifies any chapters still awaiting expansion. See [the current word audit](docs/WORD_COUNT.md) for progress toward the requested 250,000-word minimum. Exported copies do not increase the word count.`,
  '',
  '| Chapter | Readable prose | Editable game source | Status |',
  '| --- | --- | --- | --- |',
];

for (const [number, chapter] of chapters.entries()) {
  const scene = stagedScenes.find((item) => item.chapter === number);
  const slug = scene?.id || 'midsummer';
  const file = `story/${String(number + 1).padStart(2, '0')}-${slug}.md`;
  const source = scene
    ? `src/story/${scene.id === 'first-kindle' ? 'kindle' : scene.id}.mjs`
    : 'src/content.mjs';
  index.push(
    `| ${number + 1}. ${chapter.title} | [Read chapter](${file}) | [Source](${source}) | ${scene ? 'Expanded, playable' : 'Compact, playable; expansion pending'} |`,
  );
  const lines = [
    `# ${number + 1}. ${chapter.title}`,
    '',
    `${chapter.kicker} · ${chapter.date}`,
    '',
    `Generated from [the game source](../${source}) by \`npm run export:story\`. Edit the source and regenerate. ${scene ? 'All alternatives are included and labelled below; a player sees only their selected path.' : 'This is the current compact chapter, awaiting full expansion.'}`,
    '',
  ];
  let previousSection;
  let previousCondition;
  for (const beat of scene?.beats || chapter.text.map((text) => ({ text }))) {
    if (beat.section && beat.section.id !== previousSection) {
      lines.push(
        `## ${beat.section.title}`,
        '',
        `*${beat.section.date || chapter.date} · ${beat.section.location}*`,
        '',
      );
      previousSection = beat.section.id;
      previousCondition = undefined;
    }
    const condition = beat.when ? JSON.stringify(beat.when) : undefined;
    if (condition !== previousCondition) {
      if (beat.when) {
        const { choice, equals } = beat.when;
        const option = choiceDefinition(choice)?.beat.choice.options.find(
          (item) => item.id === equals,
        );
        lines.push(
          `> ${equals === null ? 'Older-save fallback: no recorded choice' : `Branch: ${option?.label || equals}`} (\`${choice}\`${equals === null ? '' : ` = \`${equals}\``}).`,
          '',
        );
      } else lines.push('> All routes rejoin here.', '');
      previousCondition = condition;
    }
    if (beat.speaker) {
      const emotion = beat.actors.find((item) => item.id === beat.speaker)?.emotion;
      lines.push(
        `**${characterById[beat.speaker].name}${emotion ? ` (${emotion})` : ''}:** ${beat.text}`,
        '',
      );
    } else lines.push(beat.text, '');
    if (beat.illustration)
      lines.push(`![${beat.illustration.alt}](../art/${beat.illustration.art}.png)`, '');
    if (beat.choice) {
      lines.push(
        `**Choice — ${beat.choice.prompt}**`,
        '',
        `Decision: \`${scene.id}:${beat.id}\``,
        '',
      );
      for (const [position, option] of beat.choice.options.entries())
        lines.push(`${position + 1}. ${option.label} (\`${option.id}\`)`);
      lines.push('');
    }
  }
  lines.push('## Chapter exit choices', '');
  chapter.choices.forEach((option, position) => lines.push(`${position + 1}. ${option[0]}`));
  files.set(file, lines.join('\n') + '\n');
}

index.push(
  '',
  '[Read the two current epilogues](story/09-epilogues.md).',
  '',
  'The sources also contain supporting conversations, spell lessons and gatherings in `src/content.mjs`, `src/cast.mjs`, and `src/life.mjs`. The chapter exports focus on the main story.',
  '',
  'Regenerate with `npm run export:story`; verify that exports match the game with `npm run check:story-export`. See [the authoring contract](docs/STORY_AUTHORING.md) and [the word-count method](docs/WORD_COUNT.md).',
  '',
);
files.set('STORY.md', index.join('\n'));
const endings = [
  '# Current epilogues',
  '',
  'Generated from `src/features/story/epilogue.mjs`. Both endings are playable; their fuller scenes remain production work.',
  '',
];
for (const [id, variant] of Object.entries(endingVariants))
  endings.push(
    `## ${id === 'shared' ? 'Shared stewardship' : 'Become a keeper'}`,
    '',
    endingCommon[0],
    '',
    variant,
    '',
    ...endingCommon.slice(1).flatMap((text) => [text, '']),
  );
files.set('story/09-epilogues.md', endings.join('\n'));

if (!check) await mkdir('story', { recursive: true });
for (const [file, contents] of files) {
  if (check) {
    const actual = await readFile(file, 'utf8').catch(() => null);
    if (actual !== contents) throw Error(`Stale story export: ${file}. Run npm run export:story.`);
  } else await writeFile(file, contents);
}
console.log(
  `${check ? 'Verified' : 'Exported'} ${chapters.length} story chapters, two epilogues, and STORY.md from playable sources.`,
);
