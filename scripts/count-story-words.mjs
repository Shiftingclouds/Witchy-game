#!/usr/bin/env node
/**
 * Count explicitly selected, shipped player-facing story fields, not source files.
 * Run from any directory: node scripts/count-story-words.mjs [--json] [--check]
 * Keep adapters in sync when new story formats are added. See docs/WORD_COUNT.md.
 */
import { endingCommon, endingVariants } from '../src/features/story/epilogue.mjs';
import { existsSync } from 'node:fs';
import {
  chapters,
  characters,
  dialogues,
  festivals,
  houses,
  locations,
  spells,
} from '../src/content.mjs';
import { castDetails, dailyLines, supportingDialogues } from '../src/cast.mjs';
import { dailyEvents, festivalEvents } from '../src/life.mjs';
import { initialState, talkLine, transition } from '../src/engine.mjs';

const args = new Set(process.argv.slice(2));
for (const argument of args) {
  if (!['--json', '--check', '--help'].includes(argument))
    throw new Error(`Unknown argument: ${argument}`);
}
if (args.has('--help')) {
  console.log(
    'Usage: node scripts/count-story-words.mjs [--json] [--check]\n--json   Emit the report and the complete, source-labelled text inventory.\n--check  Exit with status 1 while the 250,000 eligible-word target is unmet.',
  );
  process.exit(0);
}

const TARGET = 250_000;
const records = [];
const normalize = (value) => value.normalize('NFC').replace(/\s+/gu, ' ').trim();
// Apostrophes and internal hyphens belong to a word; an em dash separates words.
const wordCount = (value) => (value.match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu) || []).length;
function add(category, source, text, eligible = true) {
  if (typeof text !== 'string' || !normalize(text)) throw new Error(`Missing text in ${source}`);
  records.push({ category, source, text: normalize(text), words: wordCount(text), eligible });
}

for (const [index, chapter] of chapters.entries()) {
  chapter.text.forEach((text, i) =>
    add('Main story narration', `content.chapters[${index}].text[${i}]`, text),
  );
  chapter.choices.forEach((choice, i) =>
    add('Main story choices', `content.chapters[${index}].choices[${i}][0]`, choice[0]),
  );
}

for (const [index, text] of endingCommon.entries())
  add('Epilogue narration', `epilogue.common[${index}]`, text);
for (const [id, text] of Object.entries(endingVariants))
  add('Epilogue narration', `epilogue.${id}`, text);

for (const [id, topics] of Object.entries(dialogues)) {
  for (const [topic, [, text]] of Object.entries(topics))
    add('Companion dialogue', `content.dialogues.${id}.${topic}[1]`, text);
}
for (const [id, details] of Object.entries(castDetails)) {
  if (details.hello) add('Supporting introductions', `cast.castDetails.${id}.hello`, details.hello);
}
for (const [id, topics] of Object.entries(supportingDialogues)) {
  for (const [topic, text] of Object.entries(topics))
    add('Supporting topics and trust dialogue', `cast.supportingDialogues.${id}.${topic}`, text);
}
for (const [id, lines] of Object.entries(dailyLines)) {
  lines.forEach((text, i) =>
    add('Authored daily conversations', `cast.dailyLines.${id}[${i}]`, text),
  );
}
for (const [collection, events] of Object.entries({ dailyEvents, festivalEvents })) {
  for (const event of events) {
    const category = collection === 'dailyEvents' ? 'Everyday gatherings' : 'Holiday gatherings';
    add(category, `life.${collection}.${event.id}.intro`, event.intro);
    for (const [i, choice] of event.choices.entries()) {
      add(category, `life.${collection}.${event.id}.choices[${i}].label`, choice.label);
      add(category, `life.${collection}.${event.id}.choices[${i}].outcome`, choice.outcome);
    }
    add('Titles and directions', `life.${collection}.${event.id}.title`, event.title, false);
  }
}
for (const spell of spells) {
  add('Spell lesson questions and answers', `content.spells.${spell.id}.question`, spell.question);
  spell.answers.forEach((text, i) =>
    add('Spell lesson questions and answers', `content.spells.${spell.id}.answers[${i}]`, text),
  );
  add(
    'Spell lesson questions and answers',
    `content.spells.${spell.id}.explanation`,
    spell.explanation,
  );
}

// Exercise the engine's fixed discoveries. Do not count notification boilerplate,
// generated character-name combinations, reward suffixes, or replayed journal copies.
const ready = {
  ...initialState('live'),
  chapter: 7,
  spells: ['kindle', 'echo', 'thread'],
  clues: ['archive', 'flower', 'lake', 'stones'],
  bonds: { rowan: 20, imogen: 20, saoirse: 20 },
};
add('Exploration discoveries', 'engine.initialState.journal[0].text', ready.journal[0].text);
for (const [location, action, overrides] of [
  ['glasshouses', { type: 'tend' }, { clues: [] }],
  ['mere', { type: 'cast', id: 'echo' }, { clues: [] }],
  ['candlestones', { type: 'cast', id: 'echo' }, { clues: [] }],
  ['heartfire', { type: 'cast', id: 'thread' }, {}],
  ['classroom', { type: 'cast', id: 'kindle' }, {}],
  ['classroom', { type: 'cast', id: 'echo' }, {}],
  ['classroom', { type: 'cast', id: 'thread' }, {}],
]) {
  const result = transition({ ...ready, location, ...overrides }, action);
  add(
    'Exploration discoveries',
    `engine.transition.${action.type}.${action.id || 'moonflower'}.${location}`,
    result.feedback.replace(/\s*\(\+\d[^()]*\)$/u, ''),
  );
}
const rested = transition(ready, { type: 'rest' });
add(
  'Exploration discoveries',
  'engine.transition.rest.journal',
  rested.journal[ready.journal.length].text,
);

// Descriptive/reference copy is useful, but separate from the long-form target.
for (const chapter of chapters) {
  for (const field of ['title', 'kicker', 'goal'])
    add(
      'Titles and directions',
      `content.chapters.${chapter.title}.${field}`,
      chapter[field],
      false,
    );
}
for (const character of characters) {
  for (const field of ['role', 'bio'])
    add(
      'Character profiles',
      `content.characters.${character.id}.${field}`,
      character[field],
      false,
    );
}
for (const location of locations) {
  for (const field of ['name', 'subtitle', 'description'])
    add('Place descriptions', `content.locations.${location.id}.${field}`, location[field], false);
}
for (const spell of spells) {
  for (const field of ['name', 'school', 'description', 'gesture'])
    add('Spell reference copy', `content.spells.${spell.id}.${field}`, spell[field], false);
}
for (const festival of festivals) {
  for (const field of ['name', 'description'])
    add(
      'Calendar reference copy',
      `content.festivals.${festival.name}.${field}`,
      festival[field],
      false,
    );
}
for (const house of houses)
  add('House mottos', `content.houses.${house.id}.motto`, house.motto, false);

// The same fallback reply is used by many people; record it once, outside target.
const fallbackCharacter = characters.find(
  (character) => !dialogues[character.id] && !supportingDialogues[character.id],
);
if (fallbackCharacter) {
  for (const topic of ['care', 'mystery', 'laugh'])
    add(
      'Shared conversation fallbacks',
      `engine.talkLine.fallback.${topic}`,
      talkLine(fallbackCharacter.id, topic)[1],
      false,
    );
}

// The scene reader can expand a chapter while retaining its original book text.
// Count only authored staging data, never chapterBeats()'s derived fragments.
const stagedModuleURL = new URL('../src/scene-beats.mjs', import.meta.url);
let stagedScenes = [];
if (existsSync(stagedModuleURL)) {
  ({ stagedScenes } = await import(stagedModuleURL.href));
  if (!Array.isArray(stagedScenes))
    throw new Error('scene-beats.mjs must export an audited stagedScenes array.');
  const stagedChapters = new Set();
  for (const scene of stagedScenes) {
    if (
      !Number.isInteger(scene.chapter) ||
      !chapters[scene.chapter] ||
      stagedChapters.has(scene.chapter)
    )
      throw new Error(`Staged scene ${scene.id} has an invalid or shadowed chapter route.`);
    stagedChapters.add(scene.chapter);
    if (!Array.isArray(scene.beats)) throw new Error(`Missing beats in staged scene ${scene.id}`);
    scene.beats.forEach((beat, i) =>
      add(
        'Expanded illustrated scenes',
        `scene-beats.stagedScenes.${scene.id}.beats[${i}].text`,
        beat.text,
      ),
    );
  }
}
// Add future formats explicitly, after verifying an app route uses them. Never
// walk arbitrary JS strings, docs, generated output, or archived art sidecars.

const seen = new Map();
const categories = new Map();
// Eligible content gets first claim if the same prose is also shown in metadata.
for (const record of [...records].sort((a, b) => Number(b.eligible) - Number(a.eligible))) {
  const key = record.text;
  record.duplicateOf = seen.get(key) || null;
  if (!record.duplicateOf) seen.set(key, record.source);
  const category = categories.get(record.category) || {
    category: record.category,
    eligible: record.eligible,
    fields: 0,
    fieldWords: 0,
    uniqueWords: 0,
  };
  category.fields++;
  category.fieldWords += record.words;
  if (!record.duplicateOf) category.uniqueWords += record.words;
  categories.set(record.category, category);
}
const sum = (items, key) => items.reduce((total, item) => total + item[key], 0);
const narrative = records.filter((record) => record.eligible);
const uniqueNarrative = narrative.filter((record) => !record.duplicateOf);
const eligibleWords = sum(uniqueNarrative, 'words');
const categoryRows = [...categories.values()];
const uniqueWordCount = (strings) =>
  [...new Set(strings.map(normalize))].reduce((total, text) => total + wordCount(text), 0);
const bookBase = chapters.flatMap((chapter) => [
  ...chapter.text,
  ...chapter.choices.map((choice) => choice[0]),
]);
const bookRoutes = Object.fromEntries(
  Object.entries(endingVariants).map(([ending, text]) => [
    ending,
    uniqueWordCount([...bookBase, ...endingCommon, text]),
  ]),
);
const illustratedBase = chapters.flatMap((chapter, index) => [
  ...(stagedScenes.find((scene) => scene.chapter === index)?.beats.map((beat) => beat.text) ||
    chapter.text),
  ...chapter.choices.map((choice) => choice[0]),
]);
const illustratedRoutes = Object.fromEntries(
  Object.entries(endingVariants).map(([ending, text]) => [
    ending,
    uniqueWordCount([...illustratedBase, ...endingCommon, text]),
  ]),
);
const chapterRows = chapters.map((chapter, index) => ({
  chapter: index + 1,
  title: chapter.title,
  narrationWords: uniqueWordCount(chapter.text),
  choiceWords: uniqueWordCount(chapter.choices.map((choice) => choice[0])),
}));
const report = {
  definition:
    'Unique normalized authored story, dialogue, choices, lessons and fixed discoveries across shipping branches; excludes descriptive/reference copy and shared fallback templates.',
  target: TARGET,
  eligibleWords,
  remainingWords: Math.max(0, TARGET - eligibleWords),
  percentOfTarget: Number(((eligibleWords / TARGET) * 100).toFixed(2)),
  targetMet: eligibleWords >= TARGET,
  cataloguedNarrativeFieldWords: sum(narrative, 'words'),
  exactDuplicateNarrativeWordsRemoved: sum(
    narrative.filter((record) => record.duplicateOf),
    'words',
  ),
  excludedReferenceWords: sum(
    categoryRows.filter((category) => !category.eligible),
    'uniqueWords',
  ),
  inventory: {
    chapters: chapters.length,
    characters: characters.length,
    locations: locations.length,
    everydayGatherings: dailyEvents.length,
    holidayGatherings: festivalEvents.length,
    expandedIllustratedScenes: stagedScenes.length,
  },
  bookRouteWords: bookRoutes,
  illustratedRouteWords: illustratedRoutes,
  categories: categoryRows,
  chapters: chapterRows,
  limitations: [
    'Route counts include both visible choice labels, one ending, and no optional character conversations. Illustrated routes replace chapter prose with staged scenes where available; they do not require reading both versions.',
    'Route figures measure supplied prose, not player reading behavior. They exclude interface transitions and repeated visits.',
    'The full total spans mutually exclusive choices and recurring events; it is not a one-playthrough word count.',
    'Exact whole-field reuse is deduplicated after whitespace/NFC normalization. Near-duplicates, copied passages inside longer strings and filler still require editorial review.',
    'Reference totals cover the catalogued data fields only, not every UI label or operational notification.',
    'Procedurally wrapped bios/introductions, repeat rewards, player notes, provider replies, legacy files, comments and production plans do not count.',
    'New content formats need an explicit audited adapter and an actual reachable app route before inclusion.',
  ],
  records,
};

if (args.has('--json')) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(
    `Lanternmere authored-content audit\n${eligibleWords.toLocaleString('en')} / ${TARGET.toLocaleString('en')} eligible words (${report.percentOfTarget}%)\n${report.remainingWords.toLocaleString('en')} words remain before the minimum, plus editorial/reachability review.\n`,
  );
  console.table(
    categoryRows.map(({ category, eligible, uniqueWords, fieldWords }) => ({
      category,
      towardTarget: eligible ? 'yes' : 'no',
      uniqueWords,
      fieldWords,
    })),
  );
  console.log(
    `\nExact duplicate narrative words removed: ${report.exactDuplicateNarrativeWordsRemoved}`,
  );
  console.log(
    `First-year book route: ${Math.min(...Object.values(bookRoutes))}–${Math.max(...Object.values(bookRoutes))} unique narrative/choice words, excluding optional chats.`,
  );
  if (stagedScenes.length)
    console.log(
      `Illustrated route instead of original chapter prose: ${Math.min(...Object.values(illustratedRoutes))}–${Math.max(...Object.values(illustratedRoutes))} words, excluding optional chats.`,
    );
  console.table(chapterRows);
  console.log(
    '\nThis is a whole-game inventory, not a guaranteed playthrough length. See docs/WORD_COUNT.md for scope, exclusions, and acceptance criteria.',
  );
}
if (args.has('--check') && !report.targetMet) process.exitCode = 1;
