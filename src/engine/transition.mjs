import { createEngine } from './runtime.mjs';
import { refreshDay } from './time.mjs';
import { worldSystem } from './systems/world.mjs';
import { relationshipsSystem } from './systems/relationships.mjs';
import { magicSystem } from './systems/magic.mjs';
import { storySystem } from './systems/story.mjs';

// Register a feature once here. Duplicate action names fail during startup.
export const gameEngine = createEngine(
  [worldSystem, relationshipsSystem, magicSystem, storySystem],
  {
    prepare(state) {
      state.feedback = '';
      refreshDay(state);
    },
  },
);
export const transition = gameEngine.transition;
