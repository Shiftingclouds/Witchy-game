import test from 'node:test';
import assert from 'node:assert/strict';
import { soundFor } from '../src/features/audio/soundscape.mjs';

const all = new Set([
  'music/theme-lanternmere',
  'music/moment-the-crossing',
  'music/moment-the-journey',
  'music/place-lantern-hall-day',
  'music/place-lantern-hall-night',
  'music/festival-emberfall',
  'ambience/amb-lake',
  'ambience/amb-hall',
  'ambience/amb-boathouse',
]);

test('the title screen plays the theme over the lake', () => {
  assert.deepEqual(soundFor({ screen: 'title' }, all), {
    music: 'music/theme-lanternmere',
    ambience: ['ambience/amb-lake'],
  });
});

test('story moments have their own music, keyed by section', () => {
  const s = soundFor({ screen: 'scene', section: 'crossing', location: 'mere', period: 2 }, all);
  assert.equal(s.music, 'music/moment-the-crossing');
  assert.deepEqual(s.ambience, ['ambience/amb-lake']);
});

test('places follow the time of day, and festivals take over on their day', () => {
  const day = soundFor(
    { screen: 'world', location: 'lantern-hall', period: 0, date: '2026-09-10' },
    all,
  );
  const night = soundFor(
    { screen: 'world', location: 'lantern-hall', period: 3, date: '2026-09-10' },
    all,
  );
  const emberfall = soundFor(
    { screen: 'world', location: 'lantern-hall', period: 0, date: '2026-10-31' },
    all,
  );
  assert.equal(day.music, 'music/place-lantern-hall-day');
  assert.equal(night.music, 'music/place-lantern-hall-night');
  assert.equal(emberfall.music, 'music/festival-emberfall');
  assert.deepEqual(day.ambience, ['ambience/amb-hall']);
});

test('a missing track falls back to a suitable one that exists, or to silence', () => {
  const mere = soundFor({ screen: 'world', location: 'mere', period: 3, date: '2026-09-10' }, all);
  assert.equal(mere.music, 'music/moment-the-crossing');
  const none = soundFor(
    { screen: 'world', location: 'library', period: 0, date: '2026-09-10' },
    new Set(),
  );
  assert.deepEqual(none, { music: null, ambience: [] });
});

test('the boathouse layers its own sound over the lake', () => {
  const s = soundFor(
    { screen: 'world', location: 'boathouse', period: 1, date: '2026-09-10' },
    all,
  );
  assert.deepEqual(s.ambience, ['ambience/amb-lake', 'ambience/amb-boathouse']);
});
