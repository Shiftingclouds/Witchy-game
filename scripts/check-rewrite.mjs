// Manuscript checks only: this does not import drafts or claim a playable build.
// Run from the repository root: node scripts/check-rewrite.mjs [--write-report]
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { characters, expressions, locations, storyPlaces } from '../src/content.mjs';
import { parseStoryScript, compareStructure } from './story-parse.mjs';
import { auditStory, countWords, normalizeText } from '../src/story/audit.mjs';

const directory = 'story-drafts';
const read = (name) => readFileSync(`${directory}/${name}`, 'utf8');
const source = readFileSync('docs/design/CHATGPT_STORY_REWRITE.md', 'utf8');
const parserOptions = {
  nameToId: Object.fromEntries(characters.map((c) => [c.name, c.id])),
  allowedEmotions: Object.fromEntries(
    characters.map((c) => [c.id, expressions[c.id] || ['neutral']]),
  ),
};
const places = new Set([...locations, ...storyPlaces].map((p) => p.id));
const files = readdirSync(directory)
  .filter((f) => /^0[1-8]-.+-chatgpt\.txt$/.test(f))
  .sort();
assert.equal(files.length, 8, 'All eight chapter manuscripts are required.');
const parse = (text, name) => {
  const result = parseStoryScript(text, parserOptions);
  assert.deepEqual(result.errors, [], `${name}: parser errors`);
  assert.deepEqual(result.warnings, [], `${name}: portrait/placeholder warnings`);
  const ids = result.scene.beats.map((b) => b.id);
  assert.equal(new Set(ids).size, ids.length, `${name}: duplicate beat IDs`);
  for (const beat of result.scene.beats) {
    assert(places.has(beat.section.location), `${name}: unknown location`);
    if (beat.speaker) assert(!/^["“(]/u.test(beat.text), `${name}: unconverted speech direction`);
  }
  return result;
};
const manuscripts = files.map((file) => ({ file, text: read(file), ...parse(read(file), file) }));
const originalBlocks = [...source.matchAll(/```\n(=== SCENE [\s\S]*?)\n```/gu)]
  .map((m) => m[1])
  .filter((block) => !block.startsWith('=== SCENE <'));
const tokens = (text) =>
  [
    ...text.matchAll(
      /^(--- SECTION .+|\[DECISION [^\]]+\]|\[OPTION [^\]]+\]|\[IF [^\]]+\]|\[IMAGE [^\]]+\]|\[EXIT \d+\])/gmu,
    ),
  ].map((m) => m[1]);
const isSubsequence = (before, after) => {
  let index = 0;
  for (const token of after) if (token === before[index]) index++;
  return index === before.length;
};
for (let original of originalBlocks) {
  const id = original.match(/^=== SCENE (\S+)/u)[1];
  if (id === 'arrival') {
    // The supplied brief includes the obsolete five-section skeleton before the approved prose.
    const starts = [...original.matchAll(/^--- SECTION crossing .+$/gmu)];
    original = `${original.split('\n')[0]}\n\n${original.slice(starts.at(-1).index)}`;
  }
  const next = manuscripts.find((m) => m.scene.id === id);
  assert(next, `Missing source scene ${id}`);
  const baseline = parseStoryScript(original, parserOptions);
  assert.deepEqual(baseline.errors, [], `${id}: source parse`);
  assert.deepEqual(compareStructure(baseline.scene, next.scene), [], `${id}: legacy structure`);
  assert(
    isSubsequence(tokens(original), tokens(next.text)),
    `${id}: changed legacy tag order/header`,
  );
  assert.deepEqual(Object.keys(next.exits), ['0', '1'], `${id}: preserve the two exit indices`);
}
assert.equal(originalBlocks.length, 8);

const routeTable = JSON.parse(read('endings.json'));
const epilogueText = read('09-epilogues-chatgpt.txt');
const epilogues = [
  ...epilogueText.matchAll(/^=== EPILOGUE (\S+) ===\n([\s\S]*?)(?=^=== EPILOGUE |$(?![\s\S]))/gmu),
].map((m) => {
  // The production parser supports scenes, so use a validation-only wrapper for epilogue lines.
  const wrapper = `=== SCENE ${m[1]} | chapter 8 ===\n--- SECTION epilogue | place: lantern-hall | time: evening | date: 2027-09-01 ---\n${m[2]}`;
  return { id: m[1], text: m[0], ...parse(wrapper, m[1]) };
});
assert.equal(epilogues.length, 8);
assert.equal(new Set(epilogues.map((e) => e.id)).size, 8);
assert.equal(routeTable.endings.length, 8);
assert.equal(new Set(routeTable.endings.map((e) => `${e.focus}:${e.exit}`)).size, 8);
assert.equal(routeTable.legacyFocus, 'welcome');
for (const ending of routeTable.endings) {
  assert(
    epilogues.some((e) => e.id === ending.id),
    `Missing epilogue ${ending.id}`,
  );
  assert(['welcome', 'records', 'roads', 'everyday'].includes(ending.focus));
  assert([0, 1].includes(ending.exit));
}
assert.equal(routeTable.endings.find((e) => e.focus === 'welcome' && e.exit === 0).id, 'shared');
assert.equal(routeTable.endings.find((e) => e.focus === 'welcome' && e.exit === 1).id, 'keeper');

const domains = new Map();
for (const { scene } of manuscripts) {
  for (const beat of scene.beats) {
    if (!beat.choice) continue;
    const key = `${scene.id}:${beat.id}`;
    assert(!domains.has(key), `Repeated decision ${key}`);
    assert.equal(new Set(beat.choice.options.map((o) => o.id)).size, beat.choice.options.length);
    domains.set(
      key,
      beat.choice.options.map((o) => o.id),
    );
  }
}
const encountered = new Set();
for (const { scene } of [...manuscripts, ...epilogues]) {
  for (const beat of scene.beats) {
    if (beat.when) {
      const { choice, equals } = beat.when;
      assert(encountered.has(choice), `Forward/unknown choice reference ${choice}`);
      assert(
        equals === null || domains.get(choice).includes(equals),
        `Unknown option ${choice}=${equals}`,
      );
    }
    if (beat.choice) encountered.add(`${scene.id}:${beat.id}`);
  }
}
const pairs = {
  owlcombe: ['Imogen', 'Idris'],
  rookhallow: ['Rowan', 'Cas'],
  heronmere: ['Noor', 'Petra'],
  larkspire: ['Saoirse', 'Toby'],
};
for (const manuscript of [...manuscripts, ...epilogues]) {
  for (const [house, names] of Object.entries(pairs)) {
    const blocks = [
      ...manuscript.text.matchAll(
        new RegExp(`\\[IF arrival:house = ${house}\\]([\\s\\S]*?)\\[END IF\\]`, 'gu'),
      ),
    ]
      .map((m) => m[1])
      .join('\n');
    for (const name of names)
      assert(blocks.includes(name), `${manuscript.file || manuscript.id}: ${house} lacks ${name}`);
  }
}
const sorting = [...domains].filter(([key]) => key.startsWith('arrival:sorting-'));
assert(sorting.length >= 5 && sorting.length <= 10);
for (const [, values] of sorting) assert.deepEqual(values, Object.keys(pairs));
const familiarCoverage = manuscripts.filter(({ text }) =>
  domains
    .get('arrival:familiar')
    .every((familiar) => text.includes(`[IF arrival:familiar = ${familiar}]`)),
);
assert(familiarCoverage.length >= 5, 'All eight familiars should appear in most chapters.');

const fields = (beat) => [
  beat.text || '',
  beat.choice?.prompt || '',
  ...(beat.choice?.options || []).map((o) => o.label),
];
const allFields = new Set(
  [...manuscripts, ...epilogues].flatMap(({ scene, exits = [] }) =>
    [...scene.beats.flatMap(fields), ...exits].map(normalizeText).filter(Boolean),
  ),
);
const results = [];
for (const ending of routeTable.endings) {
  const scenes = manuscripts.map(({ scene, exits }) => ({
    ...scene,
    beats: [
      ...scene.beats.map((b) => {
        if (`${scene.id}:${b.id}` !== routeTable.focusChoice || !b.choice) return b;
        return {
          ...b,
          choice: { ...b.choice, options: b.choice.options.filter((o) => o.id === ending.focus) },
        };
      }),
      { id: 'audit-exits', text: exits.join(' ') },
    ],
  }));
  scenes.push(epilogues.find((e) => e.id === ending.id).scene);
  const result = auditStory(scenes, { fields, limit: 32768 });
  assert(result.paths > 0n, `${ending.id}: unreachable ending`);
  for (const scene of scenes) {
    for (const beat of scene.beats) {
      if (beat.when?.equals === null) continue; // Older-save fallback, intentionally absent from fresh games.
      if (beat.when?.choice === routeTable.focusChoice && beat.when.equals !== ending.focus)
        continue;
      assert(
        result.reachable.has(beat),
        `${ending.id}: unreachable authored beat ${scene.id}:${beat.id}`,
      );
    }
  }
  const fullMenuWords = manuscripts
    .at(-1)
    .scene.beats.filter((b) => b.choice)
    .flatMap((b) => b.choice.options.filter((o) => o.id !== ending.focus))
    .reduce((sum, o) => sum + countWords(o.label), 0);
  results.push({
    ...ending,
    paths: String(result.paths),
    minimumRouteWords: result.minimum + fullMenuWords,
    maximumRouteWords: result.maximum + fullMenuWords,
    peakDependencyStates: result.peakStates,
    coverageWitnesses: result.coverage.length,
  });
  console.log(
    `OK ${ending.id}: ${result.paths} symbolic paths; ${result.peakStates} peak dependency states.`,
  );
}
const report = {
  scope:
    'Authored manuscripts only. Symbolic route analysis is not a runtime import or a browser playthrough.',
  sourceBriefSha256: createHash('sha256').update(source).digest('hex'),
  manuscriptFiles: [...files, '09-epilogues-chatgpt.txt'],
  manuscriptSha256: Object.fromEntries(
    [...files, '09-epilogues-chatgpt.txt'].map((file) => [
      file,
      createHash('sha256').update(read(file)).digest('hex'),
    ]),
  ),
  chapterCount: manuscripts.length,
  endingCount: epilogues.length,
  decisionCount: domains.size,
  housePairs: pairs,
  chaptersWithAllEightFamiliarBranches: familiarCoverage.map((m) => m.scene.id),
  authoredProseWords: [...allFields].reduce((sum, s) => sum + countWords(s), 0),
  wordCountDefinition:
    'Unique complete narration, speech, decision prompt, option-label and exit-label fields. Tags, hints, journals, plans and duplicated whole fields excluded. Route counts include all displayed option labels.',
  targetWholeGameWords: 250000,
  runtimeImported: false,
  endings: results,
};
if (process.argv.includes('--write-report'))
  writeFileSync(`${directory}/REWRITE_CHECKS.json`, JSON.stringify(report, null, 2) + '\n');
console.log(
  `PASS: ${files.length} chapters, ${epilogues.length} endings, ${report.authoredProseWords} authored prose words.`,
);
