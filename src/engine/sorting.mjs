// Honoria's house questions: each answer (arrival:sorting-1, -2, …) leans toward a house. The house
// with the most answers is her suggestion at the final arrival:house choice; the player decides.

/** The keys of the house questions, in order, from the decisions that exist in a scene's beats. */
export const sortingKeys = (scene) =>
  (scene?.beats || [])
    .filter((b) => b.choice && /^sorting-\d+$/.test(b.id))
    .map((b) => `${scene.id}:${b.id}`)
    .sort((a, b) => Number(a.split('-').pop()) - Number(b.split('-').pop()));

/** The house the answers point to, or null. Ties go to the house that reached the top count first. */
export function houseLeaning(storyChoices = {}, keys = []) {
  const counts = {};
  let leader = null;
  let best = 0;
  for (const key of keys) {
    const house = storyChoices[key];
    if (!house) continue;
    counts[house] = (counts[house] || 0) + 1;
    if (counts[house] > best) {
      best = counts[house];
      leader = house;
    }
  }
  return leader;
}

/** A game that already knows its house (an older save) counts any unanswered questions as answered. */
export function fillSorting(state, keys = []) {
  if (!state.house) return state;
  const missing = keys.filter((k) => !state.storyChoices?.[k]);
  if (!missing.length) return state;
  return {
    ...state,
    storyChoices: {
      ...state.storyChoices,
      ...Object.fromEntries(missing.map((k) => [k, state.house])),
    },
  };
}

/** Put the suggested option first, marked; the others keep their order. */
export function orderBySuggestion(options, suggested) {
  const pick = options.find((o) => o.id === suggested);
  if (!pick) return options;
  return [{ ...pick, suggested: true }, ...options.filter((o) => o !== pick)];
}
