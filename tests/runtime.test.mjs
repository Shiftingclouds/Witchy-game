import test from 'node:test';
import assert from 'node:assert/strict';
import { createEngine } from '../src/engine/runtime.mjs';
import { initialState, transition, parseSave, gameEngine } from '../src/engine.mjs';
import { createSaveRepository } from '../src/storage/saves.mjs';

test('systems are explicit, extensible, deterministic, and discard rejected mutations', () => {
  assert.deepEqual(gameEngine.systems, ['world', 'relationships', 'magic', 'story', 'ai']);
  const extension = {
    id: 'test-feature',
    commands: {
      sample: (draft, action) => {
        draft.points += action.amount;
      },
      reject: (draft) => {
        draft.points = 999;
        return false;
      },
    },
  };
  const runtime = createEngine([extension]),
    before = initialState(),
    snapshot = structuredClone(before);
  assert.equal(runtime.transition(before, { type: 'sample', amount: 3 }).points, 3);
  assert.deepEqual(
    runtime.transition(before, { type: 'sample', amount: 3 }),
    runtime.transition(before, { type: 'sample', amount: 3 }),
  );
  assert.deepEqual(before, snapshot);
  assert.equal(runtime.transition(before, { type: 'reject' }), before);
  for (const action of [null, [], {}, 'sample', { type: 'unknown' }, { type: '__proto__' }])
    assert.equal(transition(before, action), before);
  assert.throws(() => createEngine([extension, extension]));
  assert.throws(() => createEngine([extension, { id: 'other', commands: { sample: () => {} } }]));
});

test('long mixed action sequences preserve valid saves and do not mutate previous states', () => {
  let state = initialState(),
    seed = 8731;
  const next = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed;
  };
  const actions = [
    { type: 'wait' },
    { type: 'rest' },
    { type: 'talk', id: 'rowan', topic: 'hello' },
    { type: 'talk', id: 'imogen', topic: 'care' },
    { type: 'checkin', id: 'rowan' },
    { type: 'visit', id: 'library' },
    { type: 'inspect' },
    { type: 'learn', id: 'echo', answer: 1 },
    { type: 'cast', id: 'echo' },
    { type: 'chapter', choice: 0 },
    { type: 'visit', id: 'glasshouses' },
    { type: 'tend' },
  ];
  for (let i = 0; i < 300; i++) {
    const previous = structuredClone(state);
    const result = transition(state, actions[next() % actions.length]);
    assert.deepEqual(state, previous);
    assert.deepEqual(parseSave(result), { ...result, feedback: '' });
    assert.ok(result.points >= state.points);
    state = result;
  }
});

test('save imports are validated before replacing data and preserve both mode backups', () => {
  const data = new Map(),
    storage = {
      getItem: (key) => data.get(key) ?? null,
      setItem: (key, value) => data.set(key, value),
    };
  const repository = createSaveRepository(storage),
    live = initialState(),
    book = initialState('book');
  repository.write(live);
  repository.write(book);
  const before = new Map(data);
  assert.throws(() => repository.import('{broken', live));
  assert.deepEqual(data, before);
  const imported = repository.import(JSON.stringify({ ...book, name: 'Ember' }), live);
  assert.equal(imported.name, 'Ember');
  assert.equal(repository.read('live').name, 'Avery');
  assert.equal(repository.read('book').name, 'Ember');
  assert.equal(JSON.parse(data.get('lanternmere.import-backup.book')).name, 'Avery');
  assert.equal(JSON.parse(data.get('lanternmere.import-backup')).mode, 'live');
  data.set('lanternmere.save.live', 'broken');
  assert.throws(() => repository.read('live'));
  assert.equal(data.get('lanternmere.save.live'), 'broken');
  const full = createSaveRepository({
    ...storage,
    setItem: () => {
      throw Error('quota');
    },
  });
  assert.throws(() => full.import(JSON.stringify(book), live));
  assert.equal(data.get('lanternmere.save.book'), JSON.stringify(imported));
});

test('invalid names, relationship maps, and journal dates cannot enter a save', () => {
  const good = initialState();
  for (const patch of [
    { name: ' ' },
    { bonds: [] },
    { journal: [{ date: 'not-a-date', text: 'Bad date' }] },
    { journal: [{ date: '2026-02-31', text: 'Impossible date' }] },
    { journal: [{ date: '2027-01-01', text: 'Future date' }] },
  ])
    assert.throws(() => parseSave({ ...good, ...patch }));
});
