import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, transition, parseSave, canAdvance, SAVE_VERSION } from '../src/engine.mjs';
import { chapterBeats, stagedScenes } from '../src/scene-beats.mjs';
import { auditStory } from '../src/story/audit.mjs';
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
    assert.deepEqual(next.bonds, { rowan: 1, imogen: 1 });
    assert.equal(next.bookmark.beat, 'record-columns');
    assert.equal(choose(next, 'arrival:first-observation', 'frame'), next);
    assert.ok(
      next.characterMemories.imogen.some(
        (memory) => memory.key === 'scene:arrival:first-observation:record',
      ),
    );
    assert.ok(
      next.characterMemories.rowan.some(
        (memory) => memory.key === 'meeting:arrival:first-observation',
      ),
    );
    assert.ok(!next.characterMemories.rowan.some((memory) => memory.key.startsWith('scene:')));
    assert.ok(chapterBeats(0, next).some((b) => b.id === 'record-thanks'));
    assert.ok(!chapterBeats(0, next).some((b) => b.id === 'frame-thanks'));
    assert.ok(!chapterBeats(0, next).some((b) => b.id === 'night-key'));
    assert.deepEqual(parseSave(JSON.stringify(next)).storyChoices, next.storyChoices);
  }
});

test('routes covering every authored beat and option reach both endings with their selected memories', () => {
  for (const path of auditStory(stagedScenes).coverage) {
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

test('dated story choices advance early saves, reset daily activity, and never rewind world time', () => {
  let state = initialState('book');
  for (const [key, option] of [
    ['arrival:first-observation', 'record'],
    ['arrival:corridor-job', 'trunk'],
    ['arrival:night-intention', 'ask'],
  ])
    state = choose(state, key, option);
  assert.equal(state.date, '2026-09-01');
  assert.equal(state.period, 3);
  const morning = choose(state, 'arrival:common-room-rule', 'quiet');
  assert.equal(morning.date, '2026-09-02');
  assert.equal(morning.period, 0);
  assert.equal(morning.daily.date, morning.date);
  assert.equal(morning.characterMemories.noor[0].date, '2026-09-02');
  const late = {
    ...state,
    date: '2026-10-01',
    period: 3,
    daily: { date: '2026-10-01', checkins: ['rowan'], event: null },
  };
  const unchangedTime = choose(late, 'arrival:common-room-rule', 'quiet');
  assert.equal(unchangedTime.date, late.date);
  assert.equal(unchangedTime.period, late.period);
  assert.deepEqual(unchangedTime.daily, late.daily);
  assert.throws(() => parseSave({ ...morning, date: '2026-09-01' }));
  const forged = structuredClone(morning);
  forged.characterMemories.noor[0].date = '2026-09-01';
  assert.throws(() => parseSave(forged));
});

test('authored introductions satisfy meeting requirements and enter only the selected character context', () => {
  const state = finishSceneChoices(initialState('live'));
  assert.equal(canAdvance(state), true);
  assert.equal(state.bonds.rowan, 1);
  assert.equal(state.bonds.saoirse, 1);
  assert.ok(
    buildCharacterContext('rowan', characterInput(state, 'rowan')).relationship.sharedMemories.some(
      (memory) => memory.key === 'meeting:arrival:first-observation',
    ),
  );
  const noorContext = buildCharacterContext('noor', characterInput(state, 'noor'));
  assert.equal(noorContext.relationship.level, 'Acquaintance');
  assert.ok(
    noorContext.relationship.sharedMemories.every((memory) => !memory.text.includes('watering')),
  );
  assert.equal(choose(state, 'arrival:common-room-rule', 'quiet'), state);
});
