// Shared sample day for all three variants: mid-autumn, evening, in Lantern Hall.
import {
  art,
  portrait,
  characterById,
  houses,
  spells,
  festivals,
  locationById,
  chapters,
} from '../../../src/content.mjs';

export { art, portrait };
export const player = {
  name: 'Avery',
  house: houses.find((h) => h.id === 'owlcombe'),
  familiar: 'cat',
};
export const day = {
  date: '14 October',
  weekday: 'Wednesday',
  period: 'Evening',
  season: 'Autumn',
  year: 'Your first year',
};
export const place = { ...locationById['lantern-hall'], art: art('lantern-hall') };
export const story = {
  chapter: 2,
  of: 8,
  title: chapters[1].title,
  goal: chapters[1].goal,
  done: false,
};
export const peopleHere = ['rowan', 'imogen', 'toby'].map((id) => ({
  ...characterById[id],
  portrait: portrait(id),
}));
export const met = [
  ['rowan', 6, 'Lantern Hall'],
  ['imogen', 4, 'Lantern Hall'],
  ['toby', 5, 'Lantern Hall'],
  ['cas', 2, 'The Library'],
  ['tully', 3, 'The Boathouse'],
  ['honoria', 1, 'The Observatory'],
].map(([id, bond, where]) => ({ ...characterById[id], bond, where, portrait: portrait(id) }));
export const learned = spells.filter((s) => ['kindle', 'echo'].includes(s.id));
export const blankPages = spells.length - learned.length;
export const journal = [
  {
    date: '14 October',
    text: 'Rowan let me hold the brass lighter for the hall lanterns. My hands shook; the flame did not.',
  },
  {
    date: '9 October',
    text: 'Imogen says the library keeps a register of everyone who ever lost something here. She wants to find it before Emberfall.',
  },
  {
    date: '2 September',
    text: 'First Kindle lesson. My lantern caught on the third try and stayed lit all through supper.',
  },
  {
    date: '1 September',
    text: 'A black cat chose me on arrival night and settled on my foot as though it had found its usual place.',
  },
  {
    date: '1 September',
    text: 'I shared Toby’s bread on the crossing and fed the fish beside the boat. Cas said there were forty-one, then admitted he had guessed.',
  },
];
export const notes =
  'Ask Imogen about the old register.\nFind out who leaves the lantern lit in the cloisters.';
export const october = {
  name: 'October',
  year: 2026,
  startsOn: 4 /* Thursday, Mon=0 */,
  days: 31,
  today: 14,
};
export const calendarMarks = {
  14: { kind: 'today' },
  16: { kind: 'event', title: 'A book with loose ends', place: 'The Library' },
  21: { kind: 'event', title: 'The wandering seedlings', place: 'The Glasshouses' },
  24: { kind: 'event', title: 'The reluctant lantern', place: 'The Lamplighters' },
  31: {
    kind: 'festival',
    title: 'Emberfall',
    text: festivals.find((f) => f.name === 'Emberfall').description,
  },
};
export const nav = [
  ['day', 'Your day'],
  ['map', 'World map'],
  ['story', 'The story'],
  ['people', 'People'],
  ['grimoire', 'Grimoire'],
  ['calendar', 'Calendar'],
  ['journal', 'Journal'],
];
export const mapArt = art('academy-map');
