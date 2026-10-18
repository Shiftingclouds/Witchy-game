import { finishSceneChoices } from './helpers/story.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { chapters, characterById, expressions } from '../src/content.mjs';
import {
  stagedScenes,
  chapterBeats,
  chapterSceneId,
  textCharacters,
  letterDelay,
  resolveExpression,
} from '../src/scene-beats.mjs';
import { initialState, transition, parseSave } from '../src/engine.mjs';
import { sectionCast } from '../src/features/scene/stage.mjs';

test('every staged beat has a unique stable id, an available expression, and an on-stage speaker', () => {
  for (let chapter = 0; chapter < chapters.length; chapter++) {
    const beats = chapterBeats(chapter);
    assert.ok(beats.length > 0);
    assert.equal(new Set(beats.map((b) => b.id)).size, beats.length);
    for (const b of beats) {
      assert.ok(b.id && b.text);
      assert.ok(b.actors.length <= 2);
      assert.equal(new Set(b.actors.map((a) => a.id)).size, b.actors.length);
      if (b.speaker) assert.ok(b.actors.some((actor) => actor.id === b.speaker));
      for (const actor of b.actors) {
        assert.ok(characterById[actor.id]);
        assert.ok((expressions[actor.id] || ['neutral']).includes(actor.emotion));
      }
    }
  }
  // Staging is per section now: everyone who speaks in a section stands on stage for all of it.
  const arrival = chapterBeats(0, initialState('book', 'A', 'owlcombe', 'cat'));
  const supper = arrival.findIndex((b) => b.section?.id === 'place-at-table');
  assert.ok(['rowan', 'imogen'].every((id) => sectionCast(arrival, supper).includes(id)));
});

test('derived scene views preserve the original prose and distinguish speech from narration', () => {
  const normalize = (text) => text.replace(/\s+/gu, '');
  for (let chapter = 1; chapter < chapters.length; chapter++) {
    if (stagedScenes.some((scene) => scene.chapter === chapter)) continue;
    const beats = chapterBeats(chapter);
    assert.equal(
      normalize(beats.map((b) => b.text).join('')),
      normalize(chapters[chapter].text.join('')),
    );
    for (const b of beats) {
      if (b.speaker) assert.ok(b.text.startsWith('“') && b.text.endsWith('”'));
      else assert.equal(b.actors.length, 0);
    }
  }
});

test('text reveal preserves complete graphemes and honors instant and punctuation pacing', () => {
  const text = 'Ame\u0301lie 👨‍👩‍👧‍👦 waves.';
  const chars = textCharacters(text);
  assert.ok(chars.includes('e\u0301'));
  assert.ok(chars.includes('👨‍👩‍👧‍👦'));
  assert.equal(chars.join(''), text);
  assert.equal(letterDelay('.', 'instant'), 0);
  assert.ok(letterDelay('.', 'normal') > letterDelay('a', 'normal'));
  assert.equal(resolveExpression('noor', 'laugh'), 'neutral');
  assert.equal(resolveExpression('rowan', 'laugh'), 'laugh');
});

test('scene bookmarks resume without rewards, validate imports, and survive older saves', () => {
  const before = initialState('book');
  const beat = chapterBeats(0)[4];
  const after = transition(before, { type: 'bookmark', scene: chapterSceneId(0), beat: beat.id });
  assert.deepEqual({ ...after, bookmark: null }, before);
  assert.deepEqual(parseSave(JSON.stringify(after)).bookmark, after.bookmark);
  assert.equal(transition(before, { type: 'bookmark', scene: 'arrival', beat: 'fake' }), before);
  const old = { ...before };
  delete old.bookmark;
  assert.equal(parseSave(old).bookmark, null);
  assert.equal(
    parseSave({ ...after, bookmark: { scene: 'arrival', beat: 'retired-beat' } }).bookmark,
    null,
  );
  assert.throws(() => parseSave({ ...after, bookmark: { scene: 123, beat: beat.id } }));
  assert.equal(
    transition(finishSceneChoices(after), { type: 'chapter', choice: 0 }).bookmark,
    null,
  );
});
