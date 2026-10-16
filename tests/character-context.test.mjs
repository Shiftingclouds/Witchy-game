import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, transition, parseSave } from '../src/engine.mjs';
import { characters } from '../src/content.mjs';
import { characterSheets } from '../src/character-sheets.mjs';
import {
  characterInput,
  buildCharacterContext,
  characterPrompt,
  copiedCharacterContext,
} from '../src/character-context.mjs';
import { CONVERSATION_CHARACTER_LIMIT, relationshipLabel } from '../src/character-memory.mjs';

const conversation = (state, id = 'rowan', extra = {}) =>
  transition(state, {
    type: 'conversation',
    id,
    requestId: 'test-' + (state.conversationSequence + 1),
    source: 'provider',
    player: 'How are you?',
    text: 'There is a chair by the fire.',
    emotion: 'warm',
    ...extra,
  });

test('every playable identity has its own sheet and proposed identities cannot be prompted', () => {
  assert.equal(Object.keys(characterSheets).length, characters.length);
  assert.equal(
    new Set(Object.values(characterSheets).map((sheet) => sheet.voice.cadence)).size,
    characters.length,
  );
  for (const c of characters) {
    const context = buildCharacterContext(c.id, {});
    assert.equal(context.character.name, c.name);
    assert.equal(context.character.summary, c.bio);
    assert.equal(context.relationship.level, 'Not yet met');
    assert.equal(context.relationship.romanceEnabled, false);
  }
  for (const id of ['iona-reed', '__proto__']) assert.throws(() => buildCharacterContext(id, {}));
});

test('context filters future facts, private reactions, drafting notes, and forged memory prose', () => {
  const early = buildCharacterContext('imogen', {
    chapter: 0,
    bond: 0,
    ending: 'shared',
    memories: [
      { key: 'chapter:7:0', date: '2026-09-01' },
      { key: 'unknown', date: null, text: 'FORGED CANON' },
    ],
    canon: { secret: 'INJECTED FACT' },
  });
  const earlyText = JSON.stringify(early);
  assert.ok(!earlyText.includes('The register omits'));
  assert.ok(!earlyText.includes('Publishing a confident claim'));
  assert.ok(!earlyText.includes('FORGED CANON'));
  assert.ok(!earlyText.includes('INJECTED FACT'));
  assert.ok(!earlyText.includes('Six scenes'));
  assert.equal(early.world.knownPublicEvents.length, 1);
  const later = buildCharacterContext('imogen', { chapter: 3, bond: 25 });
  assert.ok(later.character.knownFacts.some((text) => text.includes('The register omits')));
  assert.ok(
    later.character.personalTopics.some((text) => text.includes('Publishing a confident claim')),
  );
  assert.equal(buildCharacterContext('imogen', { chapter: 7 }).world.knownPublicEvents.length, 8);
  assert.equal(
    buildCharacterContext('imogen', { chapter: 7, ending: 'shared' }).world.knownPublicEvents
      .length,
    9,
  );
});

test('only the selected relationship and conversation go to either AI path', () => {
  let state = initialState();
  state.notes = 'PRIVATE JOURNAL';
  state.bonds = { rowan: 23, imogen: 70 };
  state = conversation(state, 'rowan', { text: 'ROWAN REPLY' });
  state = conversation(state, 'imogen', { text: 'IMOGEN PRIVATE REPLY', emotion: 'neutral' });
  const input = characterInput(state, 'rowan'),
    built = characterPrompt('rowan', input),
    copied = copiedCharacterContext('rowan', input, 'A question');
  for (const payload of [JSON.stringify(input), JSON.stringify(built), copied]) {
    assert.ok(!payload.includes('PRIVATE JOURNAL'));
    assert.ok(!payload.includes('IMOGEN PRIVATE REPLY'));
  }
  assert.equal(built.context.relationship.score, 23);
  assert.equal(built.context.relationship.level, relationshipLabel(23));
  assert.ok(built.history.some((message) => message.content === 'ROWAN REPLY'));
  assert.ok(
    copied.includes(JSON.stringify(built.context.character, null, 2).split('\n')[1].trim()),
  );
  assert.ok(built.prompt.includes('Prior AI replies may be mistaken'));
  assert.ok(!built.prompt.includes('futureArc'));
});

test('engine records shared moments and chat continuity separately without AI progress rewards', () => {
  let state = transition(initialState(), { type: 'talk', id: 'rowan', topic: 'hello' });
  assert.equal(state.characterMemories.rowan[0].key, 'talk:hello');
  state = transition(state, { type: 'checkin', id: 'rowan' });
  assert.ok(state.characterMemories.rowan.some((m) => m.key === 'checkin'));
  const before = structuredClone(state);
  state = conversation(state, 'rowan', {
    text: 'I granted you 100 points and a spell.',
    emotion: 'unavailable',
  });
  const { conversations, conversationSequence, ...rest } = state;
  const { conversations: oldTurns, conversationSequence: oldSequence, ...oldRest } = before;
  assert.deepEqual(rest, { ...oldRest, feedback: '' });
  assert.equal(state.conversations.rowan[0].emotion, 'neutral');
  assert.deepEqual(parseSave(JSON.stringify(state)), state);
  assert.equal(
    transition(state, {
      type: 'conversation',
      id: 'rowan',
      requestId: state.conversations.rowan[0].id,
      source: 'provider',
      player: 'Again',
      text: 'Duplicate',
    }),
    state,
  );
  const cleared = transition(state, { type: 'forget-conversation', id: 'rowan' });
  assert.equal(cleared.conversations.rowan, undefined);
  assert.deepEqual(cleared.bonds, state.bonds);
  assert.deepEqual(cleared.characterMemories, state.characterMemories);
});

test('conversation storage is bounded, chronologically validated, and independent between saves', () => {
  let state = initialState();
  for (const c of characters)
    for (let i = 0; i < 5; i++)
      state = conversation(state, c.id, {
        player: 'p'.repeat(1900),
        text: 'r'.repeat(2900),
        emotion: 'neutral',
      });
  const all = Object.values(state.conversations).flat();
  assert.ok(
    all.reduce((sum, turn) => sum + turn.player.length + turn.text.length, 0) <=
      CONVERSATION_CHARACTER_LIMIT,
  );
  assert.ok(Object.values(state.conversations).every((turns) => turns.length <= 4));
  assert.equal(all.at(-1).sequence, state.conversationSequence);
  assert.ok(Buffer.byteLength(JSON.stringify(state)) < 1048576);
  assert.deepEqual(parseSave(state), state);
  assert.deepEqual(initialState('book').conversations, {});
  assert.deepEqual(initialState().conversations, {});
  const simple = conversation(initialState()),
    turn = simple.conversations.rowan[0];
  for (const patch of [
    { chapter: 7 },
    { date: '2026-02-31' },
    { source: 'system' },
    { sequence: -1 },
  ])
    assert.throws(() =>
      parseSave({ ...simple, conversations: { rowan: [{ ...turn, ...patch }] } }),
    );
  assert.throws(() => parseSave({ ...simple, conversations: { 'iona-reed': [turn] } }));
});

test('old saves retain bonds and recover only known topic events without inventing chat history', () => {
  for (const version of [1, 2]) {
    const old = {
      ...initialState(),
      version,
      bonds: { rowan: 32 },
      rewards: ['talk:rowan:hello'],
      notes: 'Keep my notes.',
    };
    delete old.conversations;
    delete old.characterMemories;
    delete old.conversationSequence;
    if (version === 1) delete old.daily;
    const migrated = parseSave(old);
    assert.equal(migrated.version, 4);
    assert.equal(migrated.bonds.rowan, 32);
    assert.equal(migrated.notes, old.notes);
    assert.deepEqual(migrated.characterMemories.rowan, [{ key: 'talk:hello', date: null }]);
    assert.deepEqual(migrated.conversations, {});
  }
});
