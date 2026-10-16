import { transition } from '../../src/engine.mjs';
import { chapterSceneId, choiceKey, pendingStoryChoice } from '../../src/scene-beats.mjs';
export function finishSceneChoices(state, optionIndex = 0) {
  let pending;
  while ((pending = pendingStoryChoice(state))) {
    state = transition(state, {
      type: 'story-choice',
      key: choiceKey(chapterSceneId(state.chapter), pending.id),
      option: pending.choice.options[optionIndex].id,
    });
  }
  return state;
}
