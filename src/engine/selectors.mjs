import { isBookLike } from './modes.mjs';
import { chapters, dialogues } from '../content.mjs';
import { castDetails, supportingDialogues } from '../cast.mjs';
import { season, holiday } from './time.mjs';
import { pendingStoryChoice } from '../scene-beats.mjs';
export function sceneArt(state, id = state.location) {
  if (id === 'mere')
    return season(state.date) === 'Winter'
      ? 'mere-frozen'
      : state.period >= 2
        ? 'mere-night'
        : 'mere-day';
  if (id === 'corridor' && state.period >= 2) return 'corridor-night';
  if (id === 'glasshouses' && state.period >= 2) return 'glasshouses-night';
  if (id === 'tully-cottage' && season(state.date) === 'Winter') return 'tully-cottage-winter';
  if (id === 'candlestones' && season(state.date) === 'Spring' && state.period < 2)
    return 'candlestones-day';
  if (['thimble-cross', 'glimmer-pitch'].includes(id) && season(state.date) === 'Winter')
    return id + '-snow';
  if (id === 'lantern-hall')
    return holiday(state.date)?.name === 'Emberfall'
      ? 'lantern-hall-emberfall'
      : holiday(state.date)?.name === 'Longnight'
        ? 'lantern-hall-longnight'
        : 'lantern-hall';
  return id;
}
export function requirements(s) {
  return (chapters[s.chapter]?.requirements || []).map((id) => ({
    id,
    done: requirementMet(s, id),
    label: {
      rowan: 'Meet Rowan',
      kindle: 'Learn Kindle',
      imogen: 'Meet Imogen',
      archive: 'Read the old register',
      echo: 'Learn Echosight',
      saoirse: 'Meet Saoirse',
      flower: 'Tend a moonflower',
      lake: 'Read the memory in the lake',
      stones: 'Read the Candlestones',
      thread: 'Learn Threadbind',
      friends: 'Reach 10 friendship with each of your three companions',
      restored: 'Restore the Heartfire',
    }[id],
  }));
}
export function requirementMet(s, id) {
  if (['rowan', 'imogen', 'saoirse'].includes(id)) return (s.bonds[id] || 0) > 0;
  if (['kindle', 'echo', 'thread'].includes(id)) return s.spells.includes(id);
  if (id === 'friends') return ['rowan', 'imogen', 'saoirse'].every((p) => (s.bonds[p] || 0) >= 10);
  return s.clues.includes(id);
}
export function canAdvance(s) {
  return (
    !s.ending &&
    !pendingStoryChoice(s) &&
    (isBookLike(s.mode) || requirements(s).every((r) => r.done))
  );
}
export function talkLine(id, topic, state) {
  const authored = supportingDialogues[id];
  if (topic === 'care' && (state?.bonds[id] || 0) >= 20 && authored?.trust)
    return ['neutral', authored.trust];
  if (dialogues[id]?.[topic]) return dialogues[id][topic];
  if (authored?.[topic]) return ['neutral', authored[topic]];
  if (topic === 'hello' && castDetails[id]?.hello) return ['neutral', castDetails[id].hello];
  return [
    'neutral',
    {
      care: 'Some days are quieter than others. I am glad you thought to ask. There is always room for a little company.',
      mystery:
        'The lamps belong to all of us. I may not know the old magic, but I can notice when someone has been left in the dark.',
      laugh:
        'I think an ordinary, uneventful afternoon is an underrated magical achievement. Shall we try for one?',
    }[topic] || 'It is good to see you.',
  ];
}
