import { chapters, expressions } from './content.mjs';

import { kindleScene } from './story/kindle.mjs';
import { arrivalScene } from './story/arrival.mjs';
import { resolveBeats, choiceKey } from './story/choices.mjs';
const beat = (text, speaker = null, actors = []) => ({ text, speaker, actors });
export const stagedScenes = [arrivalScene, kindleScene];
export { choiceKey } from './story/choices.mjs';
export const chapterSceneId = (index) =>
  stagedScenes.find((scene) => scene.chapter === index)?.id || `chapter-${index + 1}`;

// Existing chapter passages remain the single source for their scene view.
// Quote cues are explicit per chapter; narration never impersonates a speaker.
const quoteEmotions = [
  ['warm', 'warm'],
  ['tense'],
  ['grave'],
  ['amused', 'warm'],
  ['scared'],
  ['grave', 'warm'],
  [],
  [],
];
export function chapterBeats(index, state) {
  const staged = stagedScenes.find((scene) => scene.chapter === index);
  if (staged) return state ? resolveBeats(staged, state.storyChoices || {}) : staged.beats;
  const chapter = chapters[index];
  let quote = 0;
  return chapter.text.flatMap((text, paragraph) =>
    text
      .split(/(“[^”]*”)/u)
      .filter((part) => part.trim())
      .map((part, fragment) => {
        const spoken = part.startsWith('“');
        const emotion = spoken ? quoteEmotions[index][quote++] || chapter.emotion : chapter.emotion;
        return {
          ...beat(
            part.trim(),
            spoken ? chapter.speaker : null,
            spoken ? [{ id: chapter.speaker, emotion }] : [],
          ),
          id: `paragraph-${paragraph + 1}-part-${fragment + 1}`,
        };
      }),
  );
}

export function resolveExpression(id, emotion) {
  return (expressions[id] || ['neutral']).includes(emotion) ? emotion : 'neutral';
}
export const textSpeeds = { slow: 48, normal: 28, fast: 14, instant: 0 };
export function textCharacters(text) {
  return typeof Intl.Segmenter === 'function'
    ? [...new Intl.Segmenter('en', { granularity: 'grapheme' }).segment(text)].map((s) => s.segment)
    : Array.from(text);
}
export function letterDelay(character, speed) {
  const base = textSpeeds[speed] ?? textSpeeds.normal;
  return base ? base + (/[.!?…]/u.test(character) ? 160 : /[,;:—]/u.test(character) ? 80 : 0) : 0;
}

export function choiceDefinition(key) {
  for (const scene of stagedScenes) {
    const beat = scene.beats.find((beat) => beat.choice && choiceKey(scene.id, beat.id) === key);
    if (beat) return { scene, beat };
  }
  return null;
}
export function pendingStoryChoice(state) {
  const scene = stagedScenes.find((scene) => scene.chapter === state.chapter);
  if (!scene) return null;
  return (
    chapterBeats(state.chapter, state).find(
      (beat) => beat.choice && !state.storyChoices?.[choiceKey(scene.id, beat.id)],
    ) || null
  );
}
