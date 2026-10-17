import { isLiveLike } from '../modes.mjs';
import { locationById } from '../../content.mjs';
import { periods } from '../state.mjs';
import { advanceTime, dateLabel, holiday } from '../time.mjs';
import { reward, entry } from '../effects.mjs';

export const worldSystem = {
  id: 'world',
  commands: {
    visit: (s, action) => {
      if (!Object.hasOwn(locationById, action.id)) return false;
      s.location = action.id;
      if (!s.visited.includes(action.id)) s.visited.push(action.id);
      return true;
    },
    inspect: (s, action) => {
      const key = 'inspect:' + s.location;
      if (reward(s, key, 3)) {
        if (s.location === 'library' && !s.clues.includes('archive')) s.clues.push('archive');
        entry(s, locationById[s.location].description + ' (+3 house points)');
        advanceTime(s);
      } else s.feedback = locationById[s.location].description;
      return;
    },
    tend: (s, action) => {
      if (s.location !== 'glasshouses') {
        s.feedback = 'The moonflowers grow in the Glasshouses.';
        return;
      }
      if (!s.clues.includes('flower')) {
        s.clues.push('flower');
        reward(s, 'flower', 5);
        entry(
          s,
          'A moonflower opened in my hands. I kept one fallen petal for an Emberfall lantern. (+5 house points)',
        );
        advanceTime(s);
      } else s.feedback = 'Your moonflower is thriving. Its fallen petal is safe in your journal.';
      return;
    },
    wait: (s, action) => {
      if (!isLiveLike(s.mode)) return false;
      advanceTime(s);
      s.feedback = `${periods[s.period]} at Lanternmere. ${dateLabel(s.date)}.`;
      return;
    },
    rest: (s, action) => {
      entry(s, 'I put my books aside and let the day be enough.');
      advanceTime(s, true);
      s.feedback = `A new morning. ${holiday(s.date)?.name || dateLabel(s.date)} awaits.`;
      return;
    },
    notes: (s, action) => {
      s.notes = String(action.value).slice(0, 12000);
      return;
    },
  },
};
