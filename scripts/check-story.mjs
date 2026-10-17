import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { isGameDate } from '../src/character-memory.mjs';
import { chapters, characterById, expressions, locationById } from '../src/content.mjs';
import { stagedScenes } from '../src/scene-beats.mjs';
import { choiceKey, introductions } from '../src/story/choices.mjs';
import { auditStory } from '../src/story/audit.mjs';

const identifiers = new Set(),
  chapterIds = new Set(),
  choices = new Map();
const id = (value) => assert.match(value, /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/);
const text = (value) =>
  assert.ok(typeof value === 'string' && value.trim(), 'Missing authored text');
const imageExists = (name) =>
  ['../art/', '../'].some((folder) => existsSync(new URL(`${folder}${name}.png`, import.meta.url)));
for (const scene of [...stagedScenes].sort((a, b) => a.chapter - b.chapter)) {
  id(scene.id);
  assert.ok(
    !identifiers.has(scene.id) && !chapterIds.has(scene.chapter),
    'Duplicate scene/chapter',
  );
  identifiers.add(scene.id);
  chapterIds.add(scene.chapter);
  assert.ok(chapters[scene.chapter] && Number.isInteger(scene.chapter));
  const beats = new Set(),
    sections = new Map();
  for (const beat of scene.beats) {
    id(beat.id);
    text(beat.text);
    assert.ok(!beats.has(beat.id), `Duplicate beat ${scene.id}:${beat.id}`);
    beats.add(beat.id);
    if (beat.illustration) {
      id(beat.illustration.art);
      text(beat.illustration.alt);
      assert.ok(imageExists(beat.illustration.art), `Missing illustration ${beat.id}`);
    }
    assert.ok(
      beat.actors.length <= 2 && new Set(beat.actors.map((a) => a.id)).size === beat.actors.length,
    );
    for (const actor of beat.actors) {
      assert.ok(Object.hasOwn(characterById, actor.id), `Missing actor ${actor.id}`);
      assert.ok(
        (expressions[actor.id] || ['neutral']).includes(actor.emotion),
        `Missing expression ${actor.id}:${actor.emotion}`,
      );
      assert.ok(
        imageExists(`${characterById[actor.id].prefix}-${actor.emotion}`),
        `Missing portrait file ${actor.id}:${actor.emotion}`,
      );
    }
    if (beat.speaker)
      assert.ok(
        beat.actors.some((a) => a.id === beat.speaker),
        `Offstage speaker ${beat.id}`,
      );
    assert.ok(beat.section, `Missing section ${beat.id}`);
    if (beat.section.date) {
      assert.ok(isGameDate(beat.section.date));
      assert.ok(beat.section.date >= chapters[scene.chapter].date);
      assert.ok(
        !chapters[scene.chapter + 1] || beat.section.date < chapters[scene.chapter + 1].date,
      );
    }
    id(beat.section.id);
    text(beat.section.title);
    assert.ok(
      Object.hasOwn(locationById, beat.section.location),
      `Unknown scene location ${beat.id}`,
    );
    assert.ok(
      Number.isInteger(beat.section.period) && beat.section.period >= 0 && beat.section.period <= 3,
    );
    if (sections.has(beat.section.id))
      assert.deepEqual(beat.section, sections.get(beat.section.id));
    sections.set(beat.section.id, beat.section);
    if (beat.when) {
      const prior = choices.get(beat.when.choice);
      assert.ok(prior, `Condition must reference an earlier choice: ${beat.id}`);
      assert.ok(beat.when.equals === null || prior.options.some((o) => o.id === beat.when.equals));
      if (beat.when.equals === null) assert.ok(prior.chapter < scene.chapter);
    }
    if (beat.choice) {
      const optionIds = new Set();
      text(beat.choice.prompt);
      assert.ok(beat.choice.options.length >= 2);
      for (const option of beat.choice.options) {
        id(option.id);
        assert.ok(!optionIds.has(option.id));
        optionIds.add(option.id);
        text(option.label);
        text(option.journal);
        for (const person of option.remember || []) assert.ok(Object.hasOwn(characterById, person));
      }
      choices.set(choiceKey(scene.id, beat.id), {
        chapter: scene.chapter,
        options: beat.choice.options,
      });
    }
  }
}
const audit = auditStory(stagedScenes);
for (const [key, introduction] of Object.entries(introductions)) {
  assert.ok(choices.has(key), `Unknown introduction checkpoint ${key}`);
  text(introduction.text);
  for (const person of introduction.people) assert.ok(Object.hasOwn(characterById, person));
}
const reachable = audit.reachable;
const legacy = new Set(stagedScenes.flatMap((scene) => [...auditStory([scene]).reachable]));
for (const scene of stagedScenes)
  for (const beat of scene.beats) {
    assert.ok(
      reachable.has(beat) || legacy.has(beat),
      `Unreachable authored beat ${scene.id}:${beat.id}`,
    );
  }
console.log(
  `Validated ${stagedScenes.length} authored chapters, ${choices.size} decisions, ${audit.paths} exact routes (${audit.peakStates} concurrent dependency states), and migration fallbacks.`,
);
