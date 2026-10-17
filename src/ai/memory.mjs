// Housekeeping: fold older moments into a chronicle so nothing important falls off the end.
import { characterById } from '../content.mjs';

export const CHRONICLE_AT = 16;
const ABSORB = 10;

export const needsChronicle = (game) => (game.ai?.turns.length || 0) >= CHRONICLE_AT;

const nameOf = (game, id) =>
  characterById[id]?.name || game.ai.people.find((p) => p.id === id)?.name || id;

export function chronicleRequest(game) {
  const turns = game.ai.turns.slice(0, ABSORB);
  const transcript = turns
    .map(
      (t) =>
        `[${t.date} at ${t.location}] Player: ${t.player}\n` +
        t.beats
          .map((b) => (b.speaker ? `${nameOf(game, b.speaker)}: ${b.text}` : b.text))
          .join('\n'),
    )
    .join('\n\n');
  const people = [
    ...Object.values(characterById).map((c) => `${c.id} = ${c.name}`),
    ...game.ai.people.map((p) => `${p.id} = ${p.name}`),
  ].join('; ');
  return {
    system:
      'You keep the memory of a story game. Summarise accurately and briefly; never invent anything that did not happen. Reply only in the requested JSON shape.',
    prompt: `Summarise these moments from ${game.name}'s playthrough for the chronicle (2–5 sentences, past tense, specific: who, what, promises made, feelings shown openly). Then list what each person present would personally remember (only people who witnessed it), and any events worth remembering with importance 1–3 (3 only for life-changing moments).\n\nPeople ids: ${people}\n\n${transcript}`,
    schema: {
      type: 'object',
      properties: {
        entry: { type: 'string' },
        memories: {
          type: 'array',
          items: {
            type: 'object',
            properties: { who: { type: 'string' }, text: { type: 'string' } },
            required: ['who', 'text'],
            additionalProperties: false,
          },
        },
        events: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              summary: { type: 'string' },
              involves: { type: 'array', items: { type: 'string' } },
              importance: { type: 'integer' },
            },
            required: ['summary', 'involves', 'importance'],
            additionalProperties: false,
          },
        },
      },
      required: ['entry', 'memories', 'events'],
      additionalProperties: false,
    },
    absorbedTurnIds: turns.map((t) => t.id),
  };
}

/** Turn a housekeeping reply into the engine's ai-chronicle command. */
export const chronicleAction = (data, absorbedTurnIds) => ({
  type: 'ai-chronicle',
  entry: data.entry,
  absorbedTurnIds,
  proposals: [
    ...(data.memories || []).map((m) => ({ type: 'memory', who: m.who, text: m.text })),
    ...(data.events || []).map((e) => ({ type: 'event', ...e })),
  ],
});
