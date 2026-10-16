import { finishSceneChoices } from './helpers/story.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { characters, locationById, festivals } from '../src/content.mjs';
import {
  initialState,
  transition,
  parseSave,
  SAVE_VERSION,
  talkLine,
  relationshipLabel,
} from '../src/engine.mjs';
import {
  allEvents,
  dailyEvents,
  eventForDay,
  characterLocation,
  peopleHere,
  routineFor,
  dailyConversation,
} from '../src/life.mjs';
import { castDetails, supportingDialogues } from '../src/cast.mjs';

test('every character has a valid unique presence through weekday, weekend, and festival routines', () => {
  for (const date of ['2026-09-02', '2026-09-05', '2026-12-21'])
    for (let period = 0; period < 4; period++) {
      const s = { ...initialState(), date, period };
      const placements = [];
      for (const id of Object.keys(locationById))
        placements.push(...peopleHere(s, id).map((c) => c.id));
      assert.equal(placements.length, characters.length);
      assert.equal(new Set(placements).size, characters.length);
      for (const c of characters) {
        assert.ok(locationById[characterLocation(s, c.id)]);
        assert.equal(routineFor(s, c.id)[period], characterLocation(s, c.id));
      }
    }
  const s = { ...initialState(), date: '2026-09-02' };
  assert.notEqual(characterLocation(s, 'rowan'), characterLocation({ ...s, period: 1 }, 'rowan'));
  assert.equal(characterLocation({ ...s, date: '2026-09-01', period: 3 }, 'rowan'), 'lantern-hall');
});
test('supporting characters have distinct introductions and open up when friendship grows', () => {
  const intros = characters.map((c) => talkLine(c.id, 'hello')[1]);
  assert.equal(new Set(intros).size, characters.length);
  for (const id of Object.keys(supportingDialogues)) {
    assert.notEqual(
      talkLine(id, 'care', initialState())[1],
      talkLine(id, 'care', { ...initialState(), bonds: { [id]: 20 } })[1],
    );
    assert.ok(castDetails[id].bio.length > 40);
    assert.ok(dailyConversation(initialState(), id).length > 20);
  }
});
test('daily friendship grows beyond exhausted introductory topics and cannot repeat for rewards that day', () => {
  let s = initialState();
  s = transition(s, { type: 'checkin', id: 'noor' });
  assert.equal(s.bonds.noor, undefined);
  for (const topic of ['hello', 'mystery', 'care', 'laugh'])
    s = transition(s, { type: 'talk', id: 'noor', topic });
  assert.equal(s.bonds.noor, 20);
  for (let i = 0; i < 8; i++) {
    s = transition(s, { type: 'checkin', id: 'noor' });
    const points = s.points,
      bond = s.bonds.noor;
    s = transition(s, { type: 'checkin', id: 'noor' });
    assert.equal(s.points, points);
    assert.equal(s.bonds.noor, bond);
    s = transition(s, { type: 'rest' });
    assert.deepEqual(s.daily.checkins, []);
  }
  assert.equal(relationshipLabel(s.bonds.noor), 'Close friend');
  assert.ok(s.rewards.length < 10);
});
test('all six holidays override daily rotation and offer valid choices with an available host', () => {
  for (const f of festivals) {
    const date = `2027-${String(f.month).padStart(2, '0')}-${String(f.day).padStart(2, '0')}`;
    const s = { ...initialState(), date };
    const event = eventForDay(s);
    assert.equal(event.month, f.month);
    assert.equal(event.day, f.day);
    assert.equal(characterLocation(s, event.host), event.location);
  }
  const seen = new Set();
  for (let d = 2; d <= 9; d++)
    seen.add(eventForDay({ ...initialState(), date: `2026-09-${String(d).padStart(2, '0')}` }).id);
  assert.equal(seen.size, dailyEvents.length);
  for (const e of allEvents) {
    assert.ok(locationById[e.location]);
    assert.ok(castDetails[e.host]);
    assert.equal(e.choices.length, 2);
  }
});
test('event actions validate location and date, persist outcomes, and cannot award twice', () => {
  let s = initialState(),
    event = eventForDay(s);
  const wrong = transition(
    { ...s, location: 'library' },
    { type: 'event', id: event.id, choice: 0 },
  );
  assert.equal(wrong.points, 0);
  assert.equal(transition(s, { type: 'event', id: 'unknown', choice: 0 }).points, 0);
  assert.equal(transition(s, { type: 'event', id: event.id, choice: 12 }).points, 0);
  s = transition(s, { type: 'event', id: event.id, choice: 1 });
  assert.deepEqual(s.daily.event, { id: event.id, choice: 1 });
  assert.equal(s.points, event.choices[1].points);
  assert.equal(s.bonds.rowan, event.choices[1].bond);
  const restored = parseSave(JSON.stringify(s));
  const repeated = transition(restored, { type: 'event', id: event.id, choice: 0 });
  assert.equal(repeated.points, s.points);
  s = transition(s, { type: 'rest' });
  assert.equal(s.daily.event, null);
  assert.notEqual(eventForDay(s).id, event.id);
  const book = initialState('book');
  assert.equal(eventForDay(book), null);
  assert.deepEqual(transition(book, { type: 'event', id: 'arrival-day', choice: 0 }), book);
});
test('old saves migrate without losing notes, progress, relationships, or rewards', () => {
  const old = {
    ...initialState(),
    version: 1,
    notes: 'Keep this memory.',
    points: 20,
    bonds: { imogen: 15 },
    spells: ['kindle'],
    rewards: ['spell:kindle'],
  };
  delete old.daily;
  const upgraded = parseSave(JSON.stringify(old));
  assert.equal(upgraded.version, SAVE_VERSION);
  assert.equal(upgraded.notes, old.notes);
  assert.deepEqual(upgraded.bonds, old.bonds);
  assert.deepEqual(upgraded.spells, old.spells);
  assert.deepEqual(upgraded.rewards, old.rewards);
  assert.equal(upgraded.points, old.points);
  assert.deepEqual(upgraded.daily, { date: old.date, checkins: [], event: null });
  for (const daily of [
    { date: old.date, checkins: ['missing'], event: null },
    { date: old.date, checkins: ['rowan', 'rowan'], event: null },
    { date: old.date, checkins: [], event: { id: 'missing', choice: 0 } },
    { date: 'wrong', checkins: [], event: null },
  ])
    assert.throws(() => parseSave({ ...upgraded, daily }));
});
test('waiting and crossing midnight reset daily limits, and story time jumps do the same', () => {
  let s = initialState();
  s = transition(s, { type: 'event', id: 'arrival-day', choice: 0 });
  s = transition(finishSceneChoices(s), { type: 'chapter', choice: 0 });
  assert.equal(s.date, '2026-09-04');
  assert.equal(s.daily.date, s.date);
  assert.equal(s.daily.event, null);
  for (let i = 0; i < 4; i++) s = transition(s, { type: 'wait' });
  assert.equal(s.date, '2026-09-05');
  assert.equal(s.period, 0);
  assert.equal(s.daily.date, s.date);
});
