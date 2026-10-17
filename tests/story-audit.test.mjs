import test from 'node:test';
import assert from 'node:assert/strict';
import { auditStory, countWords, normalizeText, storyFields } from '../src/story/audit.mjs';
import { enumerateStoryPaths } from '../src/story/choices.mjs';
import { stagedScenes } from '../src/scene-beats.mjs';

function compareExhaustive(scenes, initialFields = []) {
  const paths = enumerateStoryPaths(scenes),
    audit = auditStory(scenes, { initialFields });
  const counts = paths.map((path) =>
    [...new Set([...initialFields, ...path.beats.flatMap(storyFields)].map(normalizeText))].reduce(
      (sum, text) => sum + countWords(text),
      0,
    ),
  );
  assert.equal(audit.paths, BigInt(paths.length));
  assert.equal(audit.minimum, Math.min(...counts));
  assert.equal(audit.maximum, Math.max(...counts));
  assert.deepEqual(audit.reachable, new Set(paths.flatMap((p) => p.beats)));
  assert.deepEqual(new Set(audit.coverage.flatMap((p) => p.beats)), audit.reachable);
  for (const scene of scenes)
    for (const beat of scene.beats) {
      if (!audit.reachable.has(beat) || !beat.choice) continue;
      for (const option of beat.choice.options)
        assert.ok(audit.coverage.some((p) => p.choices[`${scene.id}:${beat.id}`] === option.id));
    }
}
const decision = (id, when) => ({
  id,
  text: 'Choose a path.',
  when,
  choice: {
    options: [
      { id: 'a', label: 'Listen.' },
      { id: 'b', label: 'Ask.' },
    ],
  },
});

test('compressed audit matches exhaustive authored routes, whole-field deduplication, and coverage', () => {
  compareExhaustive(stagedScenes, ['A repeated line.']);
});

test('conditional decisions, absent choices, repeated text, and cross-chapter callbacks stay exact', () => {
  compareExhaustive(
    [
      {
        id: 'one',
        chapter: 0,
        beats: [
          decision('first'),
          decision('second', { choice: 'one:first', equals: 'b' }),
          { id: 'repeat', text: ' Same   words. ', when: { choice: 'one:first', equals: 'a' } },
        ],
      },
      {
        id: 'two',
        chapter: 1,
        beats: [
          {
            id: 'absent',
            text: 'A different outcome.',
            when: { choice: 'one:second', equals: null },
          },
          { id: 'late', text: 'Same words.', when: { choice: 'one:second', equals: 'a' } },
          { id: 'always', text: 'Café today.' },
          { id: 'unicode', text: 'Cafe\u0301 today.' },
        ],
      },
    ],
    ['Same words.'],
  );
});

test('a hundred independent choices count exactly without enumerating their histories', () => {
  const scene = {
    id: 'long',
    chapter: 0,
    beats: Array.from({ length: 100 }, (_, i) => decision(`pick-${i}`)),
  };
  const audit = auditStory([scene]);
  assert.equal(audit.paths, 2n ** 100n);
  assert.equal(audit.peakStates, 1);
  assert.equal(audit.minimum, 5);
  assert.equal(audit.maximum, 5);
  assert.ok(audit.coverage.length <= 101);
});

test('too many simultaneously live dependencies fail visibly instead of sampling', () => {
  const scene = {
    id: 'wide',
    chapter: 0,
    beats: [
      decision('x'),
      decision('y'),
      { id: 'late-x', text: 'X.', when: { choice: 'wide:x', equals: 'a' } },
      { id: 'late-y', text: 'Y.', when: { choice: 'wide:y', equals: 'b' } },
    ],
  };
  assert.throws(() => auditStory([scene], { limit: 2 }), /concurrent dependency states/);
});
