import { finishSceneChoices } from './helpers/story.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  initialState,
  transition,
  canAdvance,
  parseSave,
  season,
  sceneArt,
  holiday,
} from '../src/engine.mjs';
import { spells, chapters, locations, characters, expressions } from '../src/content.mjs';
import { readFile, stat } from 'node:fs/promises';
const action = (s, type, rest = {}) => transition(s, { type, ...rest });
function learn(s, id) {
  const spell = spells.find((x) => x.id === id);
  s = action(s, 'visit', { id: spell.location });
  return action(s, 'learn', { id, answer: spell.correct });
}
function completeWorld(choice = 0) {
  let s = initialState();
  const next = () => {
    s = finishSceneChoices(s);
    assert.equal(canAdvance(s), true, `chapter ${s.chapter + 1} should be achievable`);
    s = action(s, 'chapter', { choice: s.chapter === 7 ? choice : 0 });
  };
  s = action(s, 'talk', { id: 'rowan', topic: 'hello' });
  next();
  s = learn(s, 'kindle');
  next();
  s = action(s, 'visit', { id: 'library' });
  s = action(s, 'talk', { id: 'imogen', topic: 'hello' });
  s = action(s, 'inspect');
  s = learn(s, 'echo');
  next();
  s = action(s, 'visit', { id: 'glasshouses' });
  s = action(s, 'talk', { id: 'saoirse', topic: 'hello' });
  s = action(s, 'tend');
  next();
  s = action(s, 'visit', { id: 'mere' });
  s = action(s, 'cast', { id: 'echo' });
  next();
  s = action(s, 'visit', { id: 'candlestones' });
  s = action(s, 'cast', { id: 'echo' });
  s = learn(s, 'thread');
  next();
  next();
  s = action(s, 'visit', { id: 'heartfire' });
  s = action(s, 'cast', { id: 'thread' });
  next();
  return s;
}
test('world mode has a reachable climax and both endings without AI or grinding', () => {
  for (const [choice, ending] of [
    [0, 'shared'],
    [1, 'keeper'],
  ]) {
    const s = completeWorld(choice);
    assert.equal(s.ending, ending);
    assert.equal(s.chapter, 7);
    assert.deepEqual(s.spells, ['kindle', 'echo', 'thread']);
    assert.ok(s.clues.includes('restored'));
    assert.ok(s.points > 100);
    assert.deepEqual(parseSave(JSON.stringify(s)), { ...s, feedback: '' });
  }
});
test('book mode completes the entire story with choices alone', () => {
  for (const choice of [0, 1]) {
    let s = initialState('book');
    for (let i = 0; i < 8; i++) {
      assert.equal(s.chapter, i);
      s = action(finishSceneChoices(s), 'chapter', { choice });
    }
    assert.ok(s.ending);
    assert.equal(s.spells.length, 3);
    assert.ok(s.clues.includes('restored'));
    assert.equal(s.date, '2027-06-21');
  }
});
test('story and spells cannot skip requirements, and repeated actions do not farm rewards', () => {
  let s = initialState();
  assert.equal(action(s, 'chapter', { choice: 0 }).chapter, 0);
  assert.equal(action(s, 'cast', { id: 'thread' }).clues.length, 0);
  s = action(s, 'visit', { id: 'warding-hall' });
  s = action(s, 'learn', { id: 'thread', answer: 0 });
  assert.equal(s.spells.length, 0);
  s = action(s, 'visit', { id: 'classroom' });
  s = action(s, 'learn', { id: 'kindle', answer: 0 });
  assert.equal(s.spells.length, 0);
  s = action(s, 'learn', { id: 'kindle', answer: 1 });
  const points = s.points;
  s = action(s, 'learn', { id: 'kindle', answer: 1 });
  assert.equal(s.points, points);
  s = action(s, 'talk', { id: 'rowan', topic: 'hello' });
  const bond = s.bonds.rowan;
  const earned = s.points;
  s = action(s, 'talk', { id: 'rowan', topic: 'hello' });
  assert.equal(s.bonds.rowan, bond);
  assert.equal(s.points, earned);
});
test('calendar handles month/year rollovers, leap days, festivals, and seasonal art', () => {
  let s = { ...initialState(), date: '2026-12-31' };
  s = action(s, 'rest');
  assert.equal(s.date, '2027-01-01');
  assert.equal(season(s.date), 'Winter');
  assert.equal(sceneArt(s, 'mere'), 'mere-frozen');
  s = { ...s, date: '2028-02-28' };
  assert.equal(action(s, 'rest').date, '2028-02-29');
  assert.equal(holiday('2026-10-31').name, 'Emberfall');
  assert.equal(sceneArt({ ...s, date: '2026-10-31' }, 'lantern-hall'), 'lantern-hall-emberfall');
  assert.equal(sceneArt({ ...s, date: '2026-12-21' }, 'lantern-hall'), 'lantern-hall-longnight');
});
test('save validation rejects broken or unsupported imports', () => {
  const good = initialState();
  for (const bad of [
    null,
    {},
    { ...good, date: '2026-02-31' },
    { ...good, spells: ['admin'] },
    { ...good, bonds: { rowan: Infinity } },
    { ...good, chapter: 99 },
    { ...good, ending: 'shared' },
    { ...good, mode: 'admin' },
    { ...good, journal: [{}] },
  ])
    assert.throws(() => parseSave(bad));
  assert.equal(parseSave({ ...good, unexpected: 'not retained' }).unexpected, undefined);
});
test('every game location, familiar, cast portrait and expression resolves to a prepared artwork', async () => {
  const raw = JSON.parse(await readFile(new URL('../public/art/manifest.json', import.meta.url)));
  const all = new Set(raw.map((a) => a.id));
  for (const l of locations) assert.ok(all.has(l.id === 'mere' ? 'mere-day' : l.id), l.id);
  for (const c of characters) {
    for (const expression of expressions[c.id] || ['neutral'])
      assert.ok(all.has(`${c.prefix}-${expression}`), `${c.id}: ${expression}`);
  }
  assert.equal(raw.filter((a) => !a.generated).length, 142);
  assert.ok(all.has('academy-map'));
  for (const a of raw)
    assert.ok((await stat(new URL('../public' + a.src, import.meta.url))).size > 0, a.id);
});

test('future Echosight clues wait for their chapter, remain available late, and preserve old discoveries', () => {
  for (const [location, clue, chapter, spoiler] of [
    ['mere', 'lake', 4, /seven|first keepers/iu],
    ['candlestones', 'stones', 5, /freely offered|whoever comes next/iu],
  ]) {
    const early = { ...initialState('live'), spells: ['echo'], location, chapter: chapter - 1 };
    const blocked = action(early, 'cast', { id: 'echo' });
    assert.deepEqual(blocked.clues, []);
    assert.equal(blocked.points, early.points);
    assert.equal(blocked.date, early.date);
    assert.equal(blocked.period, early.period);
    assert.doesNotMatch(blocked.feedback, spoiler);
    const old = parseSave({ ...early, version: 3, clues: [clue] });
    assert.ok(old.clues.includes(clue));
    for (const date of ['2027-08-12', '2027-12-21']) {
      const ready = { ...early, chapter, date, daily: { date, checkins: [], event: null } };
      const found = action(ready, 'cast', { id: 'echo' });
      assert.ok(found.clues.includes(clue));
      assert.equal(found.points, ready.points + 10);
      assert.equal(action(found, 'cast', { id: 'echo' }).points, found.points);
    }
  }
  assert.equal(
    sceneArt({ ...initialState(), date: '2026-12-21' }, 'tully-cottage'),
    'tully-cottage-winter',
  );
  assert.equal(
    sceneArt({ ...initialState(), date: '2026-10-31' }, 'tully-cottage'),
    'tully-cottage',
  );
});
