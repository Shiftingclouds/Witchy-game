import { createEngine } from './runtime.mjs';
import { refreshDay } from './time.mjs';
import { worldSystem } from './systems/world.mjs';
import { relationshipsSystem } from './systems/relationships.mjs';
import { magicSystem } from './systems/magic.mjs';
import { storySystem } from './systems/story.mjs';
import { aiSystem, followCalendar } from './systems/ai.mjs';
import { stagedScenes } from '../scene-beats.mjs';
import { fillSorting, sortingKeys } from './sorting.mjs';

// Register a feature once here. Duplicate action names fail during startup.
export const gameEngine = createEngine(
  [worldSystem, relationshipsSystem, magicSystem, storySystem, aiSystem],
  {
    prepare(state) {
      state.feedback = '';
      refreshDay(state);
      followCalendar(state);
      // A game that already knows its house never waits on Honoria's house questions.
      const filled = fillSorting(state, sortingKeys(stagedScenes.find((s) => s.id === 'arrival')));
      if (filled !== state) state.storyChoices = filled.storyChoices;
    },
  },
);
export const transition = gameEngine.transition;
