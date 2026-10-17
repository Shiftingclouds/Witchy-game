import { choiceKey, matchesCondition } from './choices.mjs';

export const normalizeText = (text) => text.normalize('NFC').replace(/\s+/gu, ' ').trim();
export const countWords = (text) =>
  (text.match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu) || []).length;
export const storyFields = (beat) => [
  beat.text,
  ...(beat.choice?.options || []).map((option) => option.label),
];

// Exact dynamic analysis. Histories merge only after their last future use.
// Remember repeated text until its final occurrence so route lengths still
// deduplicate whole fields, including duplicates across chapter boundaries.
// This audits exponentially many routes without storing each full playthrough.
export function auditStory(
  scenes,
  { fields = storyFields, initialFields = [], limit = 4096 } = {},
) {
  const entries = [...scenes]
    .sort((a, b) => a.chapter - b.chapter)
    .flatMap((scene) => scene.beats.map((beat) => ({ scene, beat })));
  const lastChoice = new Map(),
    lastText = new Map();
  const texts = entries.map(({ beat, scene }, index) => {
    if (beat.when) lastChoice.set(beat.when.choice, index);
    const values = [...new Set(fields(beat, scene).map(normalizeText))];
    for (const value of values) lastText.set(value, index);
    return values;
  });
  const starting = new Set(initialFields.map(normalizeText));
  const base = [...starting].reduce((sum, text) => sum + countWords(text), 0);
  let states = [
    {
      choices: {},
      seen: new Set([...starting].filter((s) => lastText.has(s))),
      count: 1n,
      minimum: base,
      maximum: base,
      witness: {},
    },
  ];
  const reachable = new Set(),
    witnesses = new Map();
  let peakStates = 1;
  for (const [index, { scene, beat }] of entries.entries()) {
    const next = new Map();
    for (const state of states) {
      const included = matchesCondition(beat, state.choices);
      let added = 0;
      const seen = new Set(state.seen);
      if (included) {
        reachable.add(beat);
        witnesses.set(`${scene.id}:${beat.id}`, state.witness);
        for (const text of texts[index])
          if (!seen.has(text)) {
            added += countWords(text);
            seen.add(text);
          }
      }
      for (const text of seen) if (lastText.get(text) <= index) seen.delete(text);
      const options = included && beat.choice ? beat.choice.options : [null];
      for (const option of options) {
        const key = choiceKey(scene.id, beat.id);
        const choices = { ...state.choices },
          witness = { ...state.witness };
        if (option) {
          choices[key] = option.id;
          witness[key] = option.id;
          witnesses.set(`${key}:${option.id}`, witness);
        }
        for (const choice of Object.keys(choices))
          if (!lastChoice.has(choice) || lastChoice.get(choice) <= index) delete choices[choice];
        const signature = JSON.stringify([Object.entries(choices).sort(), [...seen].sort()]);
        const existing = next.get(signature);
        if (existing) {
          existing.count += state.count;
          existing.minimum = Math.min(existing.minimum, state.minimum + added);
          existing.maximum = Math.max(existing.maximum, state.maximum + added);
        } else {
          next.set(signature, {
            choices,
            seen,
            count: state.count,
            minimum: state.minimum + added,
            maximum: state.maximum + added,
            witness,
          });
        }
      }
    }
    if (next.size > limit)
      throw Error(
        `Story audit exceeds ${limit} concurrent dependency states at ${scene.id}:${beat.id}.`,
      );
    peakStates = Math.max(peakStates, next.size);
    states = [...next.values()];
  }
  // Concrete complete routes covering every reachable beat and decision option.
  // These are a regression suite, not a claim that each route was simulated.
  const coverage = new Map();
  for (const prefix of witnesses.values()) {
    const choices = { ...prefix },
      beats = [];
    for (const { scene, beat } of entries) {
      if (!matchesCondition(beat, choices)) continue;
      beats.push(beat);
      if (beat.choice) choices[choiceKey(scene.id, beat.id)] ||= beat.choice.options[0].id;
    }
    coverage.set(JSON.stringify(choices), { choices, beats });
  }
  return {
    reachable,
    paths: states.reduce((sum, state) => sum + state.count, 0n),
    minimum: Math.min(...states.map((s) => s.minimum)),
    maximum: Math.max(...states.map((s) => s.maximum)),
    peakStates,
    coverage: [...coverage.values()],
  };
}
