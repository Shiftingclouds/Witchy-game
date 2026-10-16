import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, transition, parseSave, canAdvance, SAVE_VERSION } from '../src/engine.mjs';
import { chapterBeats, stagedScenes } from '../src/scene-beats.mjs';
import { enumerateStoryPaths } from '../src/story/choices.mjs';
import { characterInput, buildCharacterContext } from '../src/character-context.mjs';
import { finishSceneChoices } from './helpers/story.mjs';
const choose = (state, key, option) => transition(state, { type: 'story-choice', key, option });

test('unanswered decisions gate both modes, reject out-of-order actions, and cannot be replayed', () => {
  for (const mode of ['book', 'live']) {
    const before = initialState(mode);
    assert.equal(canAdvance(before), false);
    for (const [key, option] of [
      ['arrival:corridor-job', 'trunk'],
      ['arrival:first-observation', 'fake'],
      ['first-kindle:partner-response', 'observe'],
    ])
      assert.equal(choose(before, key, option), before);
    const next = choose(before, 'arrival:first-observation', 'record');
    assert.equal(next.storyChoices['arrival:first-observation'], 'record');
    assert.deepEqual(before.storyChoices, {});
    assert.equal(next.points, before.points);
    assert.deepEqual(next.bonds, before.bonds);
    assert.equal(next.bookmark.beat, 'record-columns');
    assert.equal(choose(next, 'arrival:first-observation', 'frame'), next);
    assert.equal(next.characterMemories.imogen[0].key, 'scene:arrival:first-observation:record');
    assert.equal(next.characterMemories.rowan, undefined);
    assert.ok(chapterBeats(0, next).some((b) => b.id === 'record-thanks'));
    assert.ok(!chapterBeats(0, next).some((b) => b.id === 'frame-thanks'));
    assert.ok(!chapterBeats(0, next).some((b) => b.id === 'night-key'));
    assert.deepEqual(parseSave(JSON.stringify(next)).storyChoices, next.storyChoices);
  }
});

test('all authored route combinations reach callbacks and both endings with their selected memories', () => {
  for (const path of enumerateStoryPaths(stagedScenes)) {
    for (const ending of [0, 1]) {
      let state = initialState('book');
      for (const scene of stagedScenes) {
        for (const beat of scene.beats) {
          const key = `${scene.id}:${beat.id}`;
          if (beat.choice && path.choices[key]) state = choose(state, key, path.choices[key]);
        }
        const actual = chapterBeats(state.chapter, state);
        assert.ok(actual.every((beat) => path.beats.includes(beat)));
        if (state.chapter === 1) {
          const expected =
            state.storyChoices['arrival:corridor-job'] === 'sign'
              ? 'cas-callback'
              : 'toby-callback';
          assert.ok(actual.some((beat) => beat.id === expected));
        }
        assert.equal(canAdvance(state), true);
        state = parseSave(transition(state, { type: 'chapter', choice: 0 }));
      }
      while (!state.ending) state = transition(state, { type: 'chapter', choice: ending });
      assert.equal(state.ending, ending ? 'keeper' : 'shared');
      assert.deepEqual(parseSave(state).storyChoices, path.choices);
    }
  }
});

test('old saves migrate without invented decisions and current imports reject contradictory choices', () => {
  for (const version of [1, 2, 3]) {
    const old = { ...initialState('book'), version, chapter: 1 };
    delete old.storyChoices;
    const migrated = parseSave(old);
    assert.equal(migrated.version, SAVE_VERSION);
    assert.deepEqual(migrated.storyChoices, {});
    assert.ok(chapterBeats(1, migrated).some((beat) => beat.id === 'intention-legacy'));
    assert.equal(
      transition(finishSceneChoices(migrated), { type: 'chapter', choice: 0 }).chapter,
      2,
    );
  }
});

test('imported bookmarks and AI memories cannot claim an unchosen branch', () => {
  const state = choose(initialState('book'), 'arrival:first-observation', 'frame');
  assert.equal(
    parseSave({ ...state, bookmark: { scene: 'arrival', beat: 'record-columns' } }).bookmark,
    null,
  );
  assert.throws(() => parseSave({ ...state, storyChoices: { 'arrival:corridor-job': 'sign' } }));
  assert.throws(() =>
    parseSave({ ...state, storyChoices: { 'arrival:first-observation': 'bogus' } }),
  );
  assert.throws(() =>
    parseSave({
      ...state,
      characterMemories: {
        imogen: [{ key: 'scene:arrival:first-observation:record', date: state.date }],
      },
    }),
  );
  const context = buildCharacterContext('rowan', characterInput(state, 'rowan'));
  assert.ok(context.relationship.sharedMemories.some((memory) => memory.text.includes('frame')));
  const forged = buildCharacterContext('imogen', {
    ...characterInput(state, 'imogen'),
    memories: [{ key: 'scene:arrival:first-observation:record', date: state.date }],
  });
  assert.deepEqual(forged.relationship.sharedMemories, []);
});
