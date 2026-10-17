import test from 'node:test';
import assert from 'node:assert/strict';
import { replySchema, validateReply } from '../src/ai/contract.mjs';
import { initialState } from '../src/engine.mjs';

const sandbox = () => initialState('sandbox', 'Wren', 'heronmere', 'fox', { timeMode: 'timeless' });
const base = {
  beats: [
    { speaker: null, text: 'The hall hums with supper noise.', expression: 'neutral' },
    { speaker: 'rowan', text: 'There you are.', expression: 'warm' },
  ],
  location: 'lantern-hall',
  present: ['rowan'],
  suggestions: ['Sit with Rowan', 'Look for Imogen'],
  proposals: [{ type: 'bond', character: 'rowan', delta: 2 }],
  memoryNotes: 'Wren arrived late to supper.',
};

test('the schema asks for beats, proposals and suggestions', () => {
  const schema = replySchema('sandbox');
  assert.deepEqual(
    schema.required.sort(),
    ['beats', 'location', 'memoryNotes', 'present', 'proposals', 'suggestions'].sort(),
  );
  assert.ok(replySchema('guided').properties.interludeComplete);
  const decision = replySchema('guided', {
    decision: {
      options: [
        { id: 'a', label: 'A' },
        { id: 'b', label: 'B' },
      ],
    },
  });
  assert.deepEqual(decision.properties.mappedOption.enum, ['a', 'b']);
});

test('a well-formed reply validates', () => {
  const { reply, rejected, errors } = validateReply(base, { game: sandbox(), mode: 'sandbox' });
  assert.equal(reply.beats.length, 2);
  assert.deepEqual(rejected, []);
  assert.deepEqual(errors, []);
});

test('unknown speakers are dropped but the rest of the scene stays', () => {
  const raw = {
    ...base,
    beats: [
      ...base.beats,
      { speaker: 'gandalf', text: 'You shall not pass.', expression: 'grave' },
    ],
  };
  const { reply } = validateReply(raw, { game: sandbox(), mode: 'sandbox' });
  assert.equal(reply.beats.length, 2);
});

test('an invented place is refused and a missing expression falls back to neutral', () => {
  const raw = {
    ...base,
    beats: [{ speaker: 'toby', text: 'Hello!', expression: 'ecstatic' }],
    proposals: [{ type: 'move', location: 'secret-tower' }],
  };
  const { reply, rejected } = validateReply(raw, { game: sandbox(), mode: 'sandbox' });
  assert.equal(reply.beats[0].expression, 'neutral');
  assert.equal(rejected[0].reason, 'unknown location');
});

test('bond changes are clamped and only the first eight proposals count', () => {
  const raw = {
    ...base,
    proposals: Array.from({ length: 40 }, () => ({ type: 'bond', character: 'rowan', delta: 50 })),
  };
  const { reply } = validateReply(raw, { game: sandbox(), mode: 'sandbox' });
  assert.equal(reply.proposals.length, 8);
  assert.equal(reply.proposals[0].delta, 5);
});

test('the Guided Tale cannot invent people, move, or reach milestones', () => {
  const raw = {
    ...base,
    proposals: [
      {
        type: 'person',
        name: 'Bettany',
        description: 'A baker.',
        role: 'baker',
        home: 'thimble-cross',
      },
      { type: 'milestone' },
      { type: 'move', location: 'library' },
    ],
  };
  const { reply, rejected } = validateReply(raw, { game: initialState('guided'), mode: 'guided' });
  assert.equal(reply.proposals.length, 0);
  assert.equal(rejected.length, 3);
});

test('a newly introduced person can speak in the same reply', () => {
  const raw = {
    ...base,
    beats: [{ speaker: 'Bettany Crisp', text: 'Fresh bread!', expression: 'warm' }],
    proposals: [
      {
        type: 'person',
        name: 'Bettany Crisp',
        description: 'Flour to the elbows.',
        role: 'baker',
        home: 'thimble-cross',
      },
    ],
  };
  const { reply } = validateReply(raw, { game: sandbox(), mode: 'sandbox' });
  assert.equal(reply.beats[0].speaker, 'p-bettany-crisp');
  assert.equal(reply.beats[0].expression, 'neutral');
});

test('a mapped option must be one of the authored options', () => {
  const decision = {
    options: [
      { id: 'sit', label: 'Sit' },
      { id: 'walk', label: 'Walk' },
    ],
  };
  const good = validateReply(
    { ...base, mappedOption: 'sit' },
    { game: initialState('guided'), mode: 'guided', decision },
  );
  assert.equal(good.reply.mappedOption, 'sit');
  const bad = validateReply(
    { ...base, mappedOption: 'fly' },
    { game: initialState('guided'), mode: 'guided', decision },
  );
  assert.equal(bad.reply.mappedOption, null);
  assert.ok(bad.errors.length);
});

test('a reply with no usable beats is rejected', () => {
  const { reply, errors } = validateReply(
    { ...base, beats: [{ speaker: 'nobody', text: 'x', expression: 'warm' }] },
    { game: sandbox(), mode: 'sandbox' },
  );
  assert.equal(reply, null);
  assert.ok(errors.length);
  assert.equal(validateReply(null, { game: sandbox(), mode: 'sandbox' }).reply, null);
});

test('a malformed involves list is dropped, not thrown', () => {
  const raw = {
    beats: [{ speaker: null, text: 'Rain.', expression: 'neutral' }],
    location: 'lantern-hall',
    present: [],
    suggestions: [],
    proposals: [{ type: 'event', summary: 'It rained.', involves: 'rowan', importance: 1 }],
    memoryNotes: '',
  };
  assert.doesNotThrow(() => validateReply(raw, { game: sandbox(), mode: 'sandbox' }));
});
