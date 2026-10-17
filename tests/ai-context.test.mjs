import test from 'node:test';
import assert from 'node:assert/strict';
import { buildTurnContext, STORYTELLER_RULES, CONTEXT_LIMIT } from '../src/ai/context.mjs';
import { needsChronicle, chronicleRequest } from '../src/ai/memory.mjs';
import { MYSTERY_STAGES, MYSTERY_TRUTH } from '../src/ai/world/mystery.mjs';
import { initialState } from '../src/engine.mjs';
import { characterSheets } from '../src/character-sheets.mjs';

const sandbox = (chapter = 0) => ({
  ...initialState('sandbox', 'Wren', 'heronmere', 'fox', { timeMode: 'timeless' }),
  chapter,
});
const whole = ({ system, prompt }) => system + '\n' + prompt;

test('knowledge is gated by the story so far', () => {
  const early = whole(
    buildTurnContext({
      game: { ...initialState('guided'), chapter: 2 },
      mode: 'guided',
      input: 'Hello',
      focus: { characterId: 'rowan' },
    }),
  );
  assert.ok(!early.includes(MYSTERY_STAGES[4].revelation));
  const shared = characterSheets.rowan.canon.knowledge.find((k) => k.minimumChapter >= 5);
  assert.ok(!early.includes(shared.text));
  assert.ok(early.includes(MYSTERY_STAGES[2].revelation));
});

test('the storyteller-only truth reaches the Open World, never the Guided Tale', () => {
  assert.ok(
    whole(buildTurnContext({ game: sandbox(), mode: 'sandbox', input: 'Hi' })).includes(
      MYSTERY_TRUTH,
    ),
  );
  assert.ok(
    !whole(
      buildTurnContext({ game: initialState('guided'), mode: 'guided', input: 'Hi' }),
    ).includes(MYSTERY_TRUTH),
  );
});

test('rules are the system prompt and the player speaks last', () => {
  const ctx = buildTurnContext({
    game: sandbox(),
    mode: 'sandbox',
    input: 'I wave at Rowan.',
    focus: { characterId: 'rowan' },
  });
  assert.ok(ctx.system.startsWith(STORYTELLER_RULES('sandbox').slice(0, 40)));
  assert.match(ctx.prompt.trimEnd(), /I wave at Rowan\.$/);
});

test('characters on stage bring their voice and boundaries', () => {
  const ctx = whole(
    buildTurnContext({
      game: sandbox(),
      mode: 'sandbox',
      input: 'Hi',
      focus: { characterId: 'rowan' },
    }),
  );
  for (const boundary of characterSheets.rowan.canon.boundaries) assert.ok(ctx.includes(boundary));
  assert.ok(ctx.includes(characterSheets.rowan.voice.example));
});

test('a very long playthrough stays within budget and keeps what matters', () => {
  const g = sandbox(3);
  g.ai.turns = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    player: 'p'.repeat(1900),
    beats: [{ speaker: null, text: 'b'.repeat(1100), expression: 'neutral' }],
    date: g.date,
    location: g.location,
    section: null,
  }));
  g.ai.chronicle = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    text: 'c'.repeat(780),
    date: g.date,
  }));
  g.ai.events = Array.from({ length: 150 }, (_, i) => ({
    id: 'e' + i,
    summary: (i === 3 ? 'KEY EVENT ' : '') + 'e'.repeat(580),
    involves: [],
    importance: i === 3 ? 3 : 1,
    date: g.date,
    source: 'invented',
  }));
  g.ai.threads = Array.from({ length: 30 }, (_, i) => ({
    id: 't' + i,
    title: 'Thread number ' + i,
    status: 'open',
    notes: ['n'.repeat(290)],
  }));
  const ctx = buildTurnContext({ game: g, mode: 'sandbox', input: 'What now?' });
  assert.ok(
    (ctx.system + ctx.prompt).length <= CONTEXT_LIMIT,
    `${(ctx.system + ctx.prompt).length}`,
  );
  assert.ok(ctx.prompt.includes('KEY EVENT'));
  for (let i = 0; i < 30; i++) assert.ok(ctx.prompt.includes('Thread number ' + i));
  assert.match(ctx.prompt.trimEnd(), /What now\?$/);
});

test('older turns are summarised once there are enough of them', () => {
  const g = sandbox();
  assert.equal(needsChronicle(g), false);
  g.ai.turns = Array.from({ length: 16 }, (_, i) => ({
    id: i + 1,
    player: 'hi ' + i,
    beats: [{ speaker: 'rowan', text: 'hello', expression: 'warm' }],
    date: g.date,
    location: g.location,
    section: null,
  }));
  assert.equal(needsChronicle(g), true);
  const req = chronicleRequest(g);
  assert.deepEqual(req.absorbedTurnIds, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  assert.deepEqual(req.schema.required.sort(), ['entry', 'events', 'memories']);
  assert.ok(req.prompt.includes('hi 0') && !req.prompt.includes('hi 12'));
});
