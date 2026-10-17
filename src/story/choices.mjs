export const choiceKey = (scene, beat) => `${scene}:${beat}`;

// Explicit story introductions; stage positions and portrait presence grant nothing.
export const introductions = {
  'longnight:shore-work': {
    people: ['tully', 'kestrel'],
    text: 'We met for the Longnight winter round and prepared the route before the supervised lake reading.',
  },
  'emberfall:work-plan': {
    people: ['saoirse', 'rhys', 'delphine'],
    text: 'We worked together on the Emberfall lantern frames and agreed which work could be finished before the supper bell.',
  },
  'arrival:first-observation': {
    people: ['rowan', 'imogen'],
    text: 'We met at the welcome supper and examined the extinguished hall lantern.',
  },
  'arrival:corridor-job': {
    people: ['grey', 'cas', 'toby'],
    text: 'We met on arrival evening while the lantern report and luggage route were being sorted out.',
  },
  'arrival:common-room-rule': {
    people: ['noor', 'idris'],
    text: 'We met during the open common-room visit and helped plan the study-hour invitation.',
  },
  'arrival:watering-method': {
    people: ['saoirse', 'rhys'],
    text: 'We met in the glasshouses and helped make the watering prototype safe to test.',
  },
  'first-kindle:partner-response': {
    people: ['elian-vale'],
    text: 'We met in the first supervised Kindle practical.',
  },
  'register:search-method': {
    people: ['dunne', 'maelin-quill'],
    text: 'We met at the library reading table and began a supervised comparison of the lantern records.',
  },
  'register:worker-question': {
    people: ['grey'],
    text: 'We spoke in the old cloisters about a keeper’s handover and how to record that work accurately.',
  },
};

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
