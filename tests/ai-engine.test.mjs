import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, transition, SAVE_VERSION } from '../src/engine.mjs';
import { parseSave } from '../src/engine/save.mjs';
import { migrateSave } from '../src/engine/migrations.mjs';
import { MAX_SAVE_BYTES } from '../src/storage/saves.mjs';
import { isBookLike, isLiveLike, isAiMode, MODES } from '../src/engine/modes.mjs';
import { chapters } from '../src/content.mjs';

const turn = (game, reply, player = 'I look around.', n = 1) =>
  transition(game, { type: 'ai-turn', requestId: 'r' + n, player, reply });
const beats = [{ speaker: 'rowan', text: 'There you are.', expression: 'warm' }];

test('modes group into book-like, live-like and AI', () => {
  assert.deepEqual(MODES, ['book', 'live', 'guided', 'sandbox']);
  assert.ok(
    isBookLike('guided') && isLiveLike('sandbox') && isAiMode('guided') && !isAiMode('live'),
  );
});

test('v4 Book and Live saves migrate to v5 untouched', () => {
  assert.equal(SAVE_VERSION, 6);
  for (const mode of ['book', 'live']) {
    const v4 = { ...initialState(mode), version: 4 };
    delete v4.ai;
    const migrated = parseSave(JSON.stringify(v4));
    assert.equal(migrated.ai, null);
    const { ai, version, ...rest } = migrated;
    const { version: _v, ...before } = migrateSave(v4);
    delete before.ai;
    assert.deepEqual(rest, before);
  }
});

test('new AI games start with empty playthrough memory', () => {
  const g = initialState('sandbox', 'Wren', 'heronmere', 'fox', { timeMode: 'timeless' });
  assert.deepEqual(
    { ...g.ai },
    {
      timeMode: 'timeless',
      turns: [],
      chronicle: [],
      events: [],
      threads: [],
      people: [],
      memories: {},
      sequence: 0,
      pendingTimed: false,
      lastSuggestions: [],
      milestoneAt: 0,
    },
  );
  assert.equal(initialState('guided').ai.timeMode, null);
  assert.equal(initialState('book').ai, null);
  assert.equal(parseSave(JSON.stringify(g)).ai.timeMode, 'timeless');
});

test('a turn records the exchange and applies bounded proposals', () => {
  let g = initialState('sandbox', 'Wren', 'heronmere', 'fox', { timeMode: 'timeless' });
  g = turn(g, {
    beats,
    location: 'lantern-hall',
    present: ['rowan'],
    proposals: [
      { type: 'bond', character: 'rowan', delta: 50 },
      { type: 'move', location: 'nowhere-castle' },
      {
        type: 'event',
        summary: 'Rowan showed Wren the kitchens.',
        involves: ['rowan'],
        importance: 2,
      },
      {
        type: 'person',
        name: 'Bettany Crisp',
        description: 'A tall baker with flour to the elbows.',
        role: 'baker',
        home: 'thimble-cross',
      },
    ],
  });
  assert.equal(g.ai.turns.length, 1);
  assert.equal(g.bonds.rowan, 5);
  assert.equal(g.location, 'lantern-hall');
  assert.equal(g.ai.events[0].source, 'invented');
  assert.equal(g.ai.people[0].name, 'Bettany Crisp');
});

test('only the Open World can reach a milestone, and only one step at a time', () => {
  let s = initialState('sandbox', 'Wren', 'heronmere', 'fox', { timeMode: 'timeless' });
  for (let i = 0; i < 5; i++) s = turn(s, { beats });
  s = turn(s, { beats, proposals: [{ type: 'milestone' }, { type: 'milestone' }] });
  assert.equal(s.chapter, 1);
  let gd = initialState('guided');
  gd = turn(gd, {
    beats,
    proposals: [
      { type: 'milestone' },
      { type: 'person', name: 'X', description: 'y', role: 'z', home: 'library' },
    ],
  });
  assert.equal(gd.chapter, 0);
  assert.equal(gd.ai.people.length, 0);
  assert.equal(gd.ending, null);
});

test('timeless can become timed, never the reverse', () => {
  let g = initialState('sandbox', 'Wren', 'heronmere', 'fox', { timeMode: 'timeless' });
  g = transition(g, { type: 'ai-time-mode', mode: 'timed' });
  assert.equal(g.ai.timeMode, 'timed');
  assert.equal(transition(g, { type: 'ai-time-mode', mode: 'timeless' }), g);
});

test('in timed mode the mystery follows the calendar', () => {
  let g = initialState('sandbox', 'Wren', 'heronmere', 'fox', { timeMode: 'timed' });
  g = { ...g, date: chapters[3].date };
  g = turn(g, { beats });
  assert.ok(g.chapter >= 3);
});

test('a very long playthrough stays bounded', () => {
  let g = initialState('sandbox', 'Wren', 'heronmere', 'fox', { timeMode: 'timeless' });
  for (let i = 0; i < 300; i++)
    g = turn(
      g,
      {
        beats: [{ speaker: null, text: 'x'.repeat(1000), expression: 'neutral' }],
        proposals: [{ type: 'event', summary: 'y'.repeat(500), involves: [], importance: 1 }],
      },
      'z'.repeat(1500),
      i,
    );
  assert.ok(g.ai.turns.length <= 24);
  assert.ok(g.ai.events.length <= 150);
  assert.ok(new TextEncoder().encode(JSON.stringify(g)).length < MAX_SAVE_BYTES);
});

test('bond changes total at most ±5 per person per turn, however many proposals', () => {
  const g = initialState('sandbox', 'Wren', 'heronmere', 'fox', { timeMode: 'timeless' });
  const proposals = Array.from({ length: 8 }, () => ({
    type: 'bond',
    character: 'rowan',
    delta: 50,
  }));
  assert.equal(turn(g, { beats, proposals }).bonds.rowan, 5);
});

test('a chronicle whose turns are already absorbed changes nothing', () => {
  let g = initialState('sandbox', 'Wren', 'heronmere', 'fox', { timeMode: 'timeless' });
  g = turn(g, { beats });
  const action = {
    type: 'ai-chronicle',
    mode: 'sandbox',
    entry: 'They met Rowan.',
    absorbedTurnIds: [1],
  };
  const once = transition(g, action);
  const twice = transition(once, action);
  assert.equal(twice.ai.chronicle.length, 1);
});

test('a reply meant for another mode never lands in this save', () => {
  const g = initialState('guided', 'Wren', 'heronmere', 'fox');
  const t = transition(g, { type: 'ai-turn', mode: 'sandbox', player: 'Hi', reply: { beats } });
  assert.equal(t.ai.turns.length, 0);
  const c = transition(g, {
    type: 'ai-chronicle',
    mode: 'sandbox',
    entry: 'x',
    absorbedTurnIds: [],
  });
  assert.equal(c.ai.chronicle.length, 0);
});

test('the mystery cannot be rushed: milestones need time between them', () => {
  let g = initialState('sandbox', 'Wren', 'heronmere', 'fox', { timeMode: 'timeless' });
  const start = g.chapter;
  for (let i = 0; i < 7; i++)
    g = turn(g, { beats, proposals: [{ type: 'milestone' }] }, 'Push on.', i);
  assert.equal(g.chapter, start + 1);
});

test('long games keep every open thread through a reload, and resolved ones stay bounded', () => {
  let g = initialState('sandbox', 'Wren', 'heronmere', 'fox', { timeMode: 'timeless' });
  for (let i = 0; i < 120; i++)
    g = turn(
      g,
      {
        beats,
        proposals: [
          { type: 'thread', op: 'open', id: 't' + i, title: 'T' + i },
          { type: 'thread', op: 'resolve', id: 't' + i },
        ],
      },
      'x',
      i,
    );
  g = turn(g, {
    beats,
    proposals: [{ type: 'thread', op: 'open', id: 'newest', title: 'Newest' }],
  });
  assert.ok(g.ai.threads.length <= 81);
  const reloaded = parseSave(JSON.stringify(g));
  assert.ok(reloaded.ai.threads.some((t) => t.id === 'newest' && t.status === 'open'));
});
