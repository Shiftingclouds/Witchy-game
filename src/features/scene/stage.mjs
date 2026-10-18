// Who is on stage, how they are staged, and the light they are seen in. Pure, so it is easy to test.

/**
 * Who is on stage at this line: everyone who has spoken or appeared so far in the current section,
 * in order of first appearance. Nobody stands on stage before their first line; once there, they stay.
 */
export function sectionCast(beats, index) {
  const sectionId = beats[index]?.section?.id;
  const cast = [];
  for (let i = 0; i <= index; i++) {
    const beat = beats[i];
    if (sectionId && beat.section?.id !== sectionId) continue;
    for (const id of [beat.speaker, ...(beat.actors || []).map((a) => a.id)])
      if (id && !cast.includes(id)) cast.push(id);
  }
  return cast;
}

/** Two or more people stand above the dialogue; one sits in the box; none leaves the box full width. */
export const staging = (cast) =>
  cast.length >= 2 ? 'group' : cast.length === 1 ? 'single' : 'none';

const TIMES = ['morning', 'afternoon', 'evening', 'night'];
export const timeOfDay = (period) => TIMES[period] || 'evening';

export const emotionOf = (beat, id) =>
  (beat?.actors || []).find((a) => a.id === id)?.emotion || 'neutral';

/** The authored text of one section, as canon for a Guided interlude (speech attributed by name). */
export const sectionText = (beats, sectionId, nameOf) =>
  beats
    .filter((b) => b.section?.id === sectionId)
    .map((b) => (b.speaker ? `${nameOf(b.speaker)}: ${b.text}` : b.text))
    .join('\n')
    .slice(-2500);

/** True on the last line of a section (where the Guided Tale offers to linger). */
export const endsSection = (beats, index) => {
  const beat = beats[index];
  if (!beat?.section) return false;
  const next = beats[index + 1];
  return next ? next.section?.id !== beat.section.id : !beat.choice;
};
