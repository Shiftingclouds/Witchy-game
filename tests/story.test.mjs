import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, transition, parseSave, canAdvance, SAVE_VERSION } from '../src/engine.mjs';
import { openingAnswered } from '../src/engine/state.mjs';
import { chapterBeats, stagedScenes } from '../src/scene-beats.mjs';
import { auditStory } from '../src/story/audit.mjs';
import { characterInput, buildCharacterContext } from '../src/character-context.mjs';
import { finishSceneChoices } from './helpers/story.mjs';
const choose = (state, key, option) => transition(state, { type: 'story-choice', key, option });

test('unanswered decisions gate both modes, reject out-of-order actions, and cannot be replayed', () => {
  for (const mode of ['book', 'live']) {
    const before = initialState(mode, 'Avery', 'owlcombe', 'cat');
    assert.equal(canAdvance(before), false);
    for (const [key, option] of [
      ['arrival:corridor-job', 'trunk'],
      ['arrival:first-observation', 'fake'],
      ['first-kindle:partner-response', 'observe'],
    ])
      assert.equal(choose(before, key, option), before);
    const next = choose(before, 'arrival:first-observation', 'record');
    assert.equal(next.storyChoices['arrival:first-observation'], 'record');
    assert.deepEqual(before.storyChoices, openingAnswered('owlcombe', 'cat'));
    assert.equal(next.points, before.points);
    assert.deepEqual(next.bonds, { rowan: 1, imogen: 1 });
    const path = chapterBeats(0, next);
    const after = path[path.findIndex((b) => b.id === 'first-observation') + 1];
    assert.equal(next.bookmark.beat, after.id);
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
    // Only the chosen branch is reached, and nothing past the next unanswered decision.
    const gated = (b, equals) =>
      b.when?.choice === 'arrival:first-observation' && b.when.equals === equals;
    assert.ok(chapterBeats(0, next).some((b) => gated(b, 'record')));
    assert.ok(!chapterBeats(0, next).some((b) => gated(b, 'frame')));
    assert.ok(!chapterBeats(0, next).some((b) => b.when?.choice === 'arrival:night-intention'));
    assert.deepEqual(parseSave(JSON.stringify(next)).storyChoices, next.storyChoices);
  }
});

test('routes covering every authored beat and option reach both endings with their selected memories', () => {
  for (const path of auditStory(stagedScenes).coverage) {
    for (const ending of [0, 1]) {
      let state = initialState('book', 'Avery');
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
    const old = { ...initialState('book', 'Avery', 'owlcombe', 'cat'), version, chapter: 1 };
    delete old.storyChoices;
    const migrated = parseSave(old);
    assert.equal(migrated.version, SAVE_VERSION);
    // Only the arrival-night answers implied by the save's own house and familiar.
    assert.deepEqual(migrated.storyChoices, openingAnswered('owlcombe', 'cat'));
    assert.ok(chapterBeats(1, migrated).some((beat) => beat.id === 'intention-legacy'));
    assert.equal(
      transition(finishSceneChoices(migrated), { type: 'chapter', choice: 0 }).chapter,
      2,
    );
  }
});

test('imported bookmarks and AI memories cannot claim an unchosen branch', () => {
  const state = choose(
    initialState('book', 'Avery', 'owlcombe', 'cat'),
    'arrival:first-observation',
    'frame',
  );
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
  let state = initialState('book', 'Avery', 'owlcombe', 'cat');
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
  const state = finishSceneChoices(initialState('live', 'Avery', 'owlcombe', 'cat'));
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

test('register decisions preserve private support, new faculty memories, and evidence knowledge gates', () => {
  let state = initialState('book', 'Avery', 'owlcombe', 'cat');
  for (let chapter = 0; chapter < 2; chapter++)
    state = transition(finishSceneChoices(state), { type: 'chapter', choice: 0 });
  const early = buildCharacterContext('maelin-quill', characterInput(state, 'maelin-quill'));
  assert.equal(early.relationship.level, 'Not yet met');
  assert.ok(!early.character.knownFacts.some((fact) => fact.includes('three working entries')));
  assert.ok(!early.world.knownPublicEvents.some((fact) => fact.includes('three formal entries')));
  state = choose(state, 'register:search-method', 'makers');
  assert.equal(state.bonds['maelin-quill'], 1);
  assert.equal(state.bonds.dunne, 1);
  assert.equal(choose(state, 'register:correction', 'private'), state);
  state = choose(state, 'register:worker-question', 'record');
  state = choose(state, 'register:correction', 'private');
  state = parseSave(JSON.stringify(state));
  const imogen = buildCharacterContext('imogen', characterInput(state, 'imogen'));
  const maelin = buildCharacterContext('maelin-quill', characterInput(state, 'maelin-quill'));
  assert.ok(
    imogen.relationship.sharedMemories.some(
      (memory) => memory.key === 'scene:register:correction:private',
    ),
  );
  assert.ok(
    !maelin.relationship.sharedMemories.some((memory) => memory.key.includes('correction')),
  );
  assert.ok(
    maelin.relationship.sharedMemories.some(
      (memory) => memory.key === 'scene:register:search-method:makers',
    ),
  );
  const beats = chapterBeats(2, state);
  assert.ok(beats.some((beat) => beat.id === 'maker-payoff'));
  assert.ok(!beats.some((beat) => beat.id === 'date-payoff'));
  state = transition(state, { type: 'chapter', choice: 0 });
  const later = buildCharacterContext('maelin-quill', characterInput(state, 'maelin-quill'));
  assert.ok(later.character.knownFacts.some((fact) => fact.includes('three working entries')));
  assert.ok(later.world.knownPublicEvents.some((fact) => fact.includes('remain unproven')));
  assert.deepEqual(later.character.allowedExpressions, ['neutral', 'reflective']);
  const legacy = parseSave({
    ...initialState('book', 'Avery', 'owlcombe', 'cat'),
    chapter: 2,
    date: '2026-09-18',
    daily: { date: '2026-09-18', checkins: [], event: null },
  });
  assert.ok(chapterBeats(2, legacy).some((beat) => beat.id === 'record-legacy'));
  assert.equal(transition(finishSceneChoices(legacy), { type: 'chapter', choice: 0 }).chapter, 3);
});

test('Emberfall can be caught up after its date and its private conversation stays with Saoirse', () => {
  let state = initialState('book', 'Avery', 'owlcombe', 'cat');
  for (let chapter = 0; chapter < 3; chapter++)
    state = transition(finishSceneChoices(state), { type: 'chapter', choice: 0 });
  state = {
    ...state,
    mode: 'live',
    date: '2027-02-12',
    period: 3,
    daily: { date: '2027-02-12', checkins: [], event: null },
  };
  state = choose(state, 'emberfall:work-plan', 'shared');
  state = choose(state, 'emberfall:observation', 'exchange');
  state = choose(state, 'emberfall:quiet-company', 'rest');
  state = parseSave(state);
  assert.equal(state.date, '2027-02-12');
  assert.equal(state.bonds.delphine, 1);
  assert.ok(chapterBeats(3, state).some((beat) => beat.id === 'shared-memory-cover'));
  assert.ok(!chapterBeats(3, state).some((beat) => beat.id === 'simple-memory-cover'));
  const rhys = buildCharacterContext('rhys', characterInput(state, 'rhys'));
  const saoirse = buildCharacterContext('saoirse', characterInput(state, 'saoirse'));
  assert.ok(
    !rhys.relationship.sharedMemories.some((memory) => memory.key.includes('quiet-company')),
  );
  assert.ok(
    saoirse.relationship.sharedMemories.some(
      (memory) => memory.key === 'scene:emberfall:quiet-company:rest',
    ),
  );
  assert.equal(canAdvance(state), false);
  state = transition(state, { type: 'visit', id: 'glasshouses' });
  state = transition(state, { type: 'tend' });
  assert.equal(canAdvance(state), true);
  assert.equal(transition(state, { type: 'chapter', choice: 0 }).chapter, 4);
});

test('Longnight records shared work, gates later knowledge, and imports without invented winter choices', () => {
  let state = initialState('book', 'Avery', 'owlcombe', 'cat');
  for (let chapter = 0; chapter < 4; chapter++)
    state = transition(finishSceneChoices(state), { type: 'chapter', choice: 0 });
  const before = buildCharacterContext('kestrel', characterInput(state, 'kestrel'));
  assert.ok(!before.character.knownFacts.some((fact) => fact.includes('cycle records')));
  state = choose(state, 'longnight:shore-work', 'lanterns');
  assert.equal(state.bonds.kestrel, 1);
  assert.equal(state.bonds.tully, 1);
  state = choose(state, 'longnight:echo-record', 'words');
  state = choose(state, 'longnight:winter-duty', 'archive');
  state = parseSave(state);
  assert.ok(chapterBeats(4, state).some((beat) => beat.id === 'archive-start'));
  assert.ok(!chapterBeats(4, state).some((beat) => beat.id === 'handover-start'));
  const tully = buildCharacterContext('tully', characterInput(state, 'tully'));
  assert.ok(
    tully.relationship.sharedMemories.some(
      (memory) => memory.key === 'scene:longnight:winter-duty:archive',
    ),
  );
  const imogen = buildCharacterContext('imogen', characterInput(state, 'imogen'));
  assert.ok(
    !imogen.relationship.sharedMemories.some((memory) => memory.key.includes('winter-duty')),
  );
  const forged = {
    ...state,
    date: '2026-10-31',
    journal: [],
    characterMemories: {},
    daily: { date: '2026-10-31', checkins: [], event: null },
  };
  assert.throws(() => parseSave(forged), /Invalid story decision/);
  state = transition(state, { type: 'chapter', choice: 1 });
  const later = buildCharacterContext('kestrel', characterInput(state, 'kestrel'));
  assert.ok(later.character.knownFacts.some((fact) => fact.includes('cycle records')));
  const legacy = parseSave({
    ...initialState('book', 'Avery', 'owlcombe', 'cat'),
    chapter: 4,
    date: '2026-12-21',
    daily: { date: '2026-12-21', checkins: [], event: null },
  });
  assert.ok(chapterBeats(4, legacy).some((beat) => beat.id === 'winter-company-legacy'));
  assert.equal(transition(finishSceneChoices(legacy), { type: 'chapter', choice: 0 }).chapter, 5);
});

test('First Thaw pays off both winter tasks and keeps practical outcomes and later knowledge consistent', () => {
  for (const option of [0, 1]) {
    let state = initialState('book', 'Avery', 'owlcombe', 'cat');
    for (let chapter = 0; chapter < 5; chapter++)
      state = transition(finishSceneChoices(state, option), { type: 'chapter', choice: option });
    const initial = chapterBeats(5, state);
    assert.ok(initial.some((beat) => beat.id === (option ? 'archive-result' : 'handover-result')));
    assert.ok(!initial.some((beat) => beat.id === (option ? 'handover-result' : 'archive-result')));
    const before = buildCharacterContext('kestrel', characterInput(state, 'kestrel'));
    assert.ok(!before.character.knownFacts.some((fact) => fact.includes('Larger rehearsals')));
    state = parseSave(finishSceneChoices(state, option));
    assert.equal(state.date, '2027-03-20');
    assert.equal(state.period, 1);
    assert.ok(
      chapterBeats(5, state).some((beat) => beat.id === (option ? 'space-card' : 'signal-card')),
    );
    const imogen = buildCharacterContext('imogen', characterInput(state, 'imogen'));
    assert.ok(
      imogen.relationship.sharedMemories.some(
        (memory) => memory.key === `scene:thaw:rejoining:${option ? 'space' : 'signal'}`,
      ),
    );
    const rowan = buildCharacterContext('rowan', characterInput(state, 'rowan'));
    assert.ok(
      !rowan.relationship.sharedMemories.some((memory) =>
        memory.key.includes('thaw:practice-role'),
      ),
    );
    state = transition(state, { type: 'chapter', choice: option });
    assert.ok(state.spells.includes('thread'));
    assert.ok(state.clues.includes('stones'));
    const after = buildCharacterContext('kestrel', characterInput(state, 'kestrel'));
    assert.ok(after.character.knownFacts.some((fact) => fact.includes('Larger rehearsals')));
  }
  const old = parseSave({
    ...initialState('book', 'Avery', 'owlcombe', 'cat'),
    chapter: 5,
    date: '2027-03-20',
    daily: { date: '2027-03-20', checkins: [], event: null },
  });
  assert.ok(chapterBeats(5, old).some((beat) => beat.id === 'winter-task-legacy'));
  assert.equal(transition(finishSceneChoices(old), { type: 'chapter', choice: 0 }).chapter, 6);
});

test('Bloomtide keeps private support private and records the actual rehearsal and lantern plans', () => {
  let state = initialState('book', 'Avery', 'owlcombe', 'cat');
  for (let chapter = 0; chapter < 6; chapter++)
    state = transition(finishSceneChoices(state, 1), { type: 'chapter', choice: 0 });
  state = choose(state, 'bloom:rehearsal-plan', 'relay');
  assert.equal(state.bonds.okoro, 1);
  state = choose(state, 'bloom:rowan-support', 'stay');
  state = choose(state, 'bloom:lantern-use', 'welcome');
  state = parseSave(state);
  assert.ok(chapterBeats(6, state).some((beat) => beat.id === 'relay-payoff'));
  assert.ok(!chapterBeats(6, state).some((beat) => beat.id === 'earlier-payoff'));
  for (const id of ['imogen', 'saoirse', 'okoro', 'grey']) {
    const context = buildCharacterContext(id, characterInput(state, id));
    assert.ok(
      !context.relationship.sharedMemories.some((memory) => memory.key.includes('rowan-support')),
    );
  }
  const rowan = buildCharacterContext('rowan', characterInput(state, 'rowan'));
  assert.ok(
    rowan.relationship.sharedMemories.some(
      (memory) => memory.key === 'scene:bloom:rowan-support:stay',
    ),
  );
  state = transition(state, { type: 'chapter', choice: 0 });
  assert.equal(state.chapter, 7);
  assert.ok(['rowan', 'imogen', 'saoirse'].every((id) => state.bonds[id] >= 10));
});
