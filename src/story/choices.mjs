export const choiceKey = (scene, beat) => `${scene}:${beat}`;

export function matchesCondition(beat, choices) {
  return !beat.when || (choices[beat.when.choice] ?? null) === beat.when.equals;
}

// Stop at the first unanswered decision. Both reading presentations use this path.
// Past choices are immutable; revisiting a paragraph cannot replay its effects.
export function resolveBeats(scene, choices) {
  const result = [];
  for (const beat of scene.beats) {
    if (!matchesCondition(beat, choices)) continue;
    result.push(beat);
    if (beat.choice && !choices[choiceKey(scene.id, beat.id)]) break;
  }
  return result;
}

// Authoring/audit utility. Runtime reading resolves only the selected path.
// The cap makes accidental combinatorial growth a visible authoring failure.
export function enumeratePaths(scene, incoming = {}, limit = 4096) {
  const paths = [];
  function walk(index, choices, beats) {
    if (paths.length >= limit)
      throw Error(`Too many paths in ${scene.id}; split the audit package.`);
    for (; index < scene.beats.length; index++) {
      const beat = scene.beats[index];
      if (!matchesCondition(beat, choices)) continue;
      beats = [...beats, beat];
      if (!beat.choice) continue;
      const key = choiceKey(scene.id, beat.id);
      if (choices[key]) continue;
      for (const option of beat.choice.options)
        walk(index + 1, { ...choices, [key]: option.id }, beats);
      return;
    }
    paths.push({ choices, beats });
  }
  walk(0, incoming, []);
  return paths;
}

export function enumerateStoryPaths(scenes, limit = 4096) {
  let paths = [{ choices: {}, beats: [] }];
  for (const scene of [...scenes].sort((a, b) => a.chapter - b.chapter)) {
    const next = [];
    for (const path of paths) {
      for (const branch of enumeratePaths(scene, path.choices, limit)) {
        next.push({ choices: branch.choices, beats: [...path.beats, ...branch.beats] });
        if (next.length > limit) throw Error('Story path audit exceeds its package limit.');
      }
    }
    paths = next;
  }
  return paths;
}
