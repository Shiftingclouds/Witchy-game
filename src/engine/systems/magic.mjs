import { spells } from '../../content.mjs';
import { reward, entry } from '../effects.mjs';
import { advanceTime } from '../time.mjs';
import { requirementMet } from '../selectors.mjs';

export const magicSystem = {
  id: 'magic',
  commands: {
    learn: (s, action) => {
      const spell = spells.find((x) => x.id === action.id);
      if (!spell || s.location !== spell.location) {
        s.feedback = 'Visit the right classroom to learn this spell.';
        return;
      }
      if (s.spells.includes(spell.id)) {
        s.feedback = 'You already know this spell.';
        return;
      }
      if (spell.requires?.some((x) => !s.spells.includes(x))) {
        s.feedback = 'Learn Kindle and Echosight before attempting Threadbind.';
        return;
      }
      if (action.answer !== spell.correct) {
        s.feedback = 'Not quite. ' + spell.explanation;
        return;
      }
      s.spells.push(spell.id);
      reward(s, 'spell:' + spell.id, 10);
      entry(s, `I learned ${spell.name}. ${spell.explanation} (+10 house points)`);
      advanceTime(s);
      return;
    },
    cast: (s, action) => {
      if (!s.spells.includes(action.id)) {
        s.feedback = 'Learn this spell before you cast it.';
        return;
      }
      let clue = null,
        text = '';
      if (action.id === 'echo' && s.location === 'mere') {
        clue = 'lake';
        text =
          'Under the water, seven small lights form an open circle. The lake remembers the first keepers.';
      } else if (action.id === 'echo' && s.location === 'candlestones') {
        clue = 'stones';
        text = 'The inscription returns: A light freely offered. A space for whoever comes next.';
      } else if (action.id === 'thread' && s.location === 'heartfire') {
        if (
          s.chapter < 7 ||
          !['kindle', 'echo', 'thread'].every((x) => s.spells.includes(x)) ||
          !['archive', 'flower', 'lake', 'stones'].every((x) => s.clues.includes(x)) ||
          !requirementMet(s, 'friends')
        ) {
          s.feedback =
            'The circle is not ready yet. Follow the story in your journal; your friends and the recovered memories must be gathered first.';
          return;
        }
        clue = 'restored';
        text =
          'Your friends join their lights to yours. The Heartfire rises, and every lantern in the academy answers.';
      } else
        text =
          action.id === 'kindle'
            ? 'A small golden flame settles over your palm. Its warmth feels like being expected.'
            : action.id === 'echo'
              ? 'Soft traces of earlier visitors shimmer around you. Some memories are simply happy afternoons.'
              : 'A gentle circle of light opens around your feet, leaving room for someone else.';
      if (clue && !s.clues.includes(clue)) {
        s.clues.push(clue);
        reward(s, clue, 10);
        entry(s, text + ' (+10 house points)');
        advanceTime(s);
      } else s.feedback = text;
      return;
    },
  },
};
