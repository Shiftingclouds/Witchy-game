import { chapters } from '../../content.mjs';
import { chapterBeats, chapterSceneId } from '../../scene-beats.mjs';
import { rememberCharacter } from '../../character-memory.mjs';
import { reward, bond, entry } from '../effects.mjs';
import { refreshDay } from '../time.mjs';
import { canAdvance } from '../selectors.mjs';

export const storySystem = {
  id: 'story',
  commands: {
    bookmark: (s, action) => {
      if (
        action.scene !== chapterSceneId(s.chapter) ||
        !chapterBeats(s.chapter).some((beat) => beat.id === action.beat)
      )
        return false;
      s.bookmark = { scene: action.scene, beat: action.beat };
      return true;
    },
    chapter: (s, action) => {
      const chapter = chapters[s.chapter];
      if (
        !chapter ||
        !canAdvance(s) ||
        !Number.isInteger(action.choice) ||
        !chapter.choices[action.choice]
      ) {
        s.feedback = 'There are still a few things to discover before the next chapter.';
        return;
      }
      if (s.mode === 'book')
        for (const r of chapter.requirements) {
          if (['rowan', 'imogen', 'saoirse'].includes(r)) bond(s, r, 5);
          else if (['kindle', 'echo', 'thread'].includes(r)) {
            if (!s.spells.includes(r)) s.spells.push(r);
          } else if (r === 'friends') {
            for (const id of ['rowan', 'imogen', 'saoirse'])
              s.bonds[id] = Math.max(10, s.bonds[id] || 0);
          } else if (!s.clues.includes(r)) s.clues.push(r);
        }
      s.bookmark = null;
      const choice = chapter.choices[action.choice];
      bond(s, choice[1], 5);
      rememberCharacter(s, choice[1], `chapter:${s.chapter}:${action.choice}`);
      reward(s, 'chapter:' + s.chapter, 15);
      entry(s, `${chapter.title}: ${choice[0]} (+15 house points)`);
      if (s.chapter === chapters.length - 1) {
        s.ending = choice[3];
        s.feedback = 'The first year is complete. Your life at Lanternmere continues.';
      } else {
        s.chapter++;
        const next = chapters[s.chapter];
        if (s.date < next.date) s.date = next.date;
        refreshDay(s);
        s.period = 0;
        s.location = next.scene;
        if (!s.visited.includes(next.scene)) s.visited.push(next.scene);
      }
      return;
    },
  },
};
