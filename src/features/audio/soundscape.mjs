// What should be playing: music and ambient sound for where the player is. Pure, so it is easy to
// test. Track ids are paths inside audio/ without the extension (see docs/design/SOUND_AND_MUSIC.md);
// `available` is the set of ids that exist, so anything not yet made falls back or stays silent.
import { holiday } from '../../engine/time.mjs';

const night = (period) => period >= 2;

const FESTIVALS = {
  'Arrival Day': 'festival-arrival',
  Emberfall: 'festival-emberfall',
  Longnight: 'festival-longnight',
  'First Thaw': 'festival-first-thaw',
  Bloomtide: 'festival-bloomtide',
  'The Homecoming of Lights': 'festival-homecoming',
};

// Story sections with their own music; other sections play the music of their place.
const MOMENTS = {
  letter: 'moment-the-letter',
  leaving: 'place-home',
  train: 'moment-the-journey',
  platform: 'moment-the-platform',
  crossing: 'moment-the-crossing',
  hall: 'moment-the-hall',
  house: 'moment-sorting',
  familiar: 'moment-familiar',
};

const GROUPS = [
  [['corridor', 'classroom', 'warding-hall', 'infirmary', 'weathervane-room'], 'place-academy'],
  [['library'], 'place-library'],
  [['brewing-cellars', 'kitchens'], 'place-cellars'],
  [['observatory', 'rookery'], 'place-heights'],
  [['menagerie'], 'place-menagerie'],
  [['whispering-wood', 'old-cloisters'], 'place-wood'],
  [['candlestones', 'fen-chapel'], 'place-stones'],
  [['glimmer-pitch'], 'place-glimmer'],
  [['heartfire'], 'place-heartfire'],
  [['crooked-lantern', 'lamp-ladle'], 'place-inn'],
  [['nana-pearl', 'tully-cottage', 'wrens-nest'], 'place-cottage'],
  [['home-kitchen', 'home-street'], 'place-home'],
  [['train-carriage'], 'moment-the-journey'],
];
const VILLAGE = [
  'thimble-cross',
  'lamplight-row',
  'lamplighters',
  'wand-shop',
  'robe-shop',
  'sweetshop',
  'platform-nought',
];
const HOUSES = ['owlcombe', 'rookhallow', 'heronmere', 'larkspire'];

/** Candidate music tracks for a place and time, best first. */
function placeMusic(location, period) {
  const late = night(period);
  if (location === 'lantern-hall')
    return [late ? 'place-lantern-hall-night' : 'place-lantern-hall-day', 'place-lantern-hall-day'];
  if (location === 'mere' || location === 'boathouse')
    return late ? ['place-mere-night', 'moment-the-crossing'] : ['place-mere-day'];
  if (location === 'glasshouses')
    return late ? ['place-glasshouses-night', 'place-glasshouses'] : ['place-glasshouses'];
  if (VILLAGE.includes(location))
    return late
      ? ['place-village-evening', 'place-village-day']
      : ['place-village-day', 'moment-the-journey'];
  if (HOUSES.includes(location)) return ['house-' + location];
  const group = GROUPS.find(([ids]) => ids.includes(location));
  return group ? [group[1]] : [];
}

/** Ambient sound beds for a place and time (several may layer). */
function placeAmbience(location, period) {
  if (location === 'mere') return ['amb-lake'];
  if (location === 'boathouse') return ['amb-lake', 'amb-boathouse'];
  if (location === 'lantern-hall') return ['amb-hall'];
  if (
    [
      ...HOUSES,
      'crooked-lantern',
      'lamp-ladle',
      'nana-pearl',
      'tully-cottage',
      'wrens-nest',
    ].includes(location)
  )
    return ['amb-fire'];
  if (location === 'library') return ['amb-library'];
  if (['whispering-wood', 'old-cloisters'].includes(location))
    return [night(period) ? 'amb-night' : 'amb-woods'];
  if (['glasshouses', 'rookery'].includes(location) && !night(period)) return ['amb-birds'];
  if (['candlestones', 'fen-chapel', 'glimmer-pitch', 'home-street'].includes(location))
    return night(period) ? ['amb-night'] : [];
  if (location === 'platform-nought') return ['amb-station'];
  if (VILLAGE.includes(location)) return ['amb-village'];
  if (location === 'train-carriage') return ['amb-train'];
  if (['kitchens', 'home-kitchen'].includes(location)) return ['amb-kitchen'];
  if (location === 'heartfire') return ['amb-cavern'];
  return [];
}

/**
 * @param {{screen: 'title'|'scene'|'world', section?: string, location?: string, period?: number, date?: string}} context
 * @param {Set<string>} available ids like 'music/theme-lanternmere'
 * @returns {{music: string|null, ambience: string[]}}
 */
export function soundFor(context, available) {
  const has = (id) => available.has(id);
  const pick = (names, folder) => names.map((n) => `${folder}/${n}`).find(has) || null;
  if (context.screen === 'title')
    return {
      music: pick(['theme-lanternmere'], 'music'),
      ambience: ['ambience/amb-lake'].filter(has),
    };
  const { location, period = 0, date } = context;
  const festival = date && FESTIVALS[holiday(date)?.name];
  const moment = context.screen === 'scene' && MOMENTS[context.section];
  const music = pick(
    [...(moment ? [moment] : []), ...(festival ? [festival] : []), ...placeMusic(location, period)],
    'music',
  );
  const ambience = placeAmbience(context.section === 'crossing' ? 'mere' : location, period)
    .map((n) => `ambience/${n}`)
    .filter(has);
  return { music, ambience };
}
