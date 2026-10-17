// Who is on stage, how they are staged, and the light they are seen in. Pure, so it is easy to test.

/** Everyone who speaks or is present anywhere in the current line's section, in order of first appearance. */
export function sectionCast(beats, index) {
  const sectionId = beats[index]?.section?.id;
  const inSection = sectionId ? beats.filter((b) => b.section?.id === sectionId) : beats;
  const cast = [];
  for (const beat of inSection)
    for (const id of [beat.speaker, ...(beat.actors || []).map((a) => a.id)])
      if (id && !cast.includes(id)) cast.push(id);
  return cast;
}

/** Two or more people stand above the dialogue; one sits in the box; none leaves the box full width. */
export const staging = (cast) =>
  cast.length >= 2 ? 'group' : cast.length === 1 ? 'single' : 'none';

const TIMES = ['morning', 'afternoon', 'evening', 'night'];
export const timeOfDay = (period) => TIMES[period] || 'evening';

export const emotionOf = (beat, id) =>
  (beat?.actors || []).find((a) => a.id === id)?.emotion || 'neutral';
