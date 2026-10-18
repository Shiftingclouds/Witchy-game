import test from 'node:test';
import assert from 'node:assert/strict';
import { characters, expressions, chapters } from '../src/content.mjs';
import { stagedScenes } from '../src/scene-beats.mjs';
import { writeStoryScript } from '../scripts/story-script.mjs';
import { parseStoryScript, compareStructure, structureOf } from '../scripts/story-parse.mjs';

const options = {
  nameToId: Object.fromEntries(characters.map((c) => [c.name, c.id])),
  allowedEmotions: Object.fromEntries(
    characters.map((c) => [c.id, expressions[c.id] || ['neutral']]),
  ),
};

test('every current scene survives a round trip through the script format', () => {
  for (const scene of stagedScenes) {
    const { scene: back, errors } = parseStoryScript(
      writeStoryScript(scene, chapters[scene.chapter].date),
      options,
    );
    assert.deepEqual(errors, [], scene.id);
    assert.deepEqual(structureOf(back), structureOf(scene), scene.id);
    assert.deepEqual(compareStructure(scene, back), [], scene.id);
  }
});

test('a reply that drops a decision is refused, naming it', () => {
  const arrival = stagedScenes.find((s) => s.id === 'arrival');
  const script = writeStoryScript(arrival, chapters[0].date);
  const start = script.indexOf('[DECISION arrival:corridor-job]');
  const end = script.indexOf('[END DECISION]', start) + '[END DECISION]'.length;
  const { scene } = parseStoryScript(script.slice(0, start) + script.slice(end), options);
  assert.ok(compareStructure(arrival, scene).includes('missing DECISION arrival:corridor-job'));
});

test('an unknown speaker and an unclosed branch are reported, with where they are', () => {
  const { errors } = parseStoryScript(
    [
      '=== SCENE arrival | chapter 0 ===',
      '--- SECTION crossing | place: mere | time: evening | date: 2026-09-01 ---',
      '[Bartholomew | warm] Hello there.',
      '[IF arrival:crossing = toby]',
      '[N] The fish follow.',
    ].join('\n'),
    options,
  );
  assert.ok(errors.some((e) => /line 3: unknown speaker "Bartholomew"/.test(e)));
  assert.ok(errors.some((e) => /never closed/.test(e)));
});

test('speech keeps its words without quotation marks, and a missing portrait falls back to neutral', () => {
  const { scene, warnings } = parseStoryScript(
    [
      '=== SCENE arrival | chapter 0 ===',
      '--- SECTION crossing | place: mere | time: evening | date: 2026-09-01 ---',
      '[Toby | ecstatic] They are very polite fish.',
    ].join('\n'),
    options,
  );
  const line = scene.beats[0];
  assert.equal(line.speaker, 'toby');
  assert.equal(line.text, 'They are very polite fish.');
  assert.equal(line.actors[0].emotion, 'neutral');
  assert.ok(warnings.some((w) => /no "ecstatic" portrait/.test(w)));
});
