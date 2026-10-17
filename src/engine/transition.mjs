import { createEngine } from './runtime.mjs';
import { refreshDay } from './time.mjs';
import { worldSystem } from './systems/world.mjs';
import { relationshipsSystem } from './systems/relationships.mjs';
import { magicSystem } from './systems/magic.mjs';
import { storySystem } from './systems/story.mjs';
import { aiSystem, followCalendar } from './systems/ai.mjs';

// Register a feature once here. Duplicate action names fail during startup.
export const gameEngine = createEngine(
  [worldSystem, relationshipsSystem, magicSystem, storySystem, aiSystem],
  {
    prepare(state) {
      state.feedback = '';
      refreshDay(state);
      followCalendar(state);
    },
  },
);
export const transition = gameEngine.transition;
