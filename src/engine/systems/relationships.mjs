import { characterById } from '../../content.mjs';
import { eventForDay } from '../../life.mjs';
import { rememberCharacter, recordConversation } from '../../character-memory.mjs';
import { reward, bond, entry } from '../effects.mjs';
import { advanceTime } from '../time.mjs';

export const relationshipsSystem = {
  id: 'relationships',
  commands: {
    conversation: (s, action) => {
      if (!recordConversation(s, action)) return false;
      return true;
    },
    'forget-conversation': (s, action) => {
      if (!Object.hasOwn(characterById, action.id)) return false;
      delete s.conversations[action.id];
      return true;
    },
    talk: (s, action) => {
      if (
        !Object.hasOwn(characterById, action.id) ||
        !['hello', 'mystery', 'care', 'laugh'].includes(action.topic)
      )
        return false;
      const key = `talk:${action.id}:${action.topic}`;
      if (reward(s, key, 2)) {
        bond(s, action.id, 5);
        rememberCharacter(s, action.id, 'talk:' + action.topic);
        entry(
          s,
          `I talked with ${characterById[action.id].name}. ${action.topic === 'care' ? 'Sometimes listening is its own kind of magic.' : 'We know each other a little better.'} (+5 friendship)`,
        );
        advanceTime(s);
      } else s.feedback = 'A familiar conversation. Try a different topic to grow your friendship.';
      return;
    },
    checkin: (s, action) => {
      if (s.mode !== 'live' || !Object.hasOwn(characterById, action.id)) return false;
      if (!(s.bonds[action.id] > 0)) {
        s.feedback = 'Say hello first. A friendship begins with an introduction.';
        return;
      }
      if (s.daily.checkins.includes(action.id)) {
        s.feedback = 'You have already shared a little time today. Come back tomorrow.';
        return;
      }
      s.daily.checkins.push(action.id);
      bond(s, action.id, 3);
      s.points += 1;
      rememberCharacter(s, action.id, 'checkin');
      entry(
        s,
        `I spent a quiet moment with ${characterById[action.id].name}. Making time for each other matters. (+3 friendship, +1 house point)`,
      );
      advanceTime(s);
      return;
    },
    event: (s, action) => {
      if (s.mode !== 'live') return false;
      const event = eventForDay(s);
      if (!event || event.id !== action.id || s.location !== event.location) {
        s.feedback = 'Visit today’s gathering before taking part.';
        return;
      }
      if (s.daily.event) {
        s.feedback =
          'You have already taken part in today’s gathering. Another small adventure awaits tomorrow.';
        return;
      }
      if (!Number.isInteger(action.choice) || !event.choices[action.choice]) return false;
      const choice = event.choices[action.choice];
      s.daily.event = { id: event.id, choice: action.choice };
      bond(s, event.host, choice.bond);
      s.points += choice.points;
      rememberCharacter(s, event.host, `event:${event.id}:${action.choice}`);
      entry(
        s,
        `${event.title}: ${choice.outcome} (+${choice.bond} friendship with ${characterById[event.host].name}, +${choice.points} house points)`,
      );
      advanceTime(s);
      return;
    },
  },
};
