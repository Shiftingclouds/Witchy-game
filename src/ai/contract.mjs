// The reply contract: the one shape Claude answers in, and the validator that keeps canon safe.
// Claude never edits state; every effect is a typed proposal the engine may accept or refuse.
import { characterById, expressions, locationById } from '../content.mjs';

const PROPOSAL_TYPES = [
  'bond',
  'event',
  'thread',
  'journal',
  'time',
  'move',
  'memory',
  'person',
  'milestone',
  'time-mode',
];
const SANDBOX_ONLY = new Set(['person', 'milestone', 'time-mode', 'move']);
const LIMITS = { beats: 12, beatText: 1200, proposals: 8, suggestions: 4 };

const text = (description) => ({ type: 'string', description });

/** JSON schema handed to `claude -p --json-schema`. */
export function replySchema(mode, { decision } = {}) {
  const properties = {
    beats: {
      type: 'array',
      description: 'The scene in order: narration (speaker null) and dialogue lines.',
      items: {
        type: 'object',
        properties: {
          speaker: {
            type: ['string', 'null'],
            description: 'Character id, invented person name, or null for narration.',
          },
          text: text(
            'One paragraph of narration or one line of dialogue, second person present for narration.',
          ),
          expression: text('One of the speaker’s listed expressions; neutral if unsure.'),
        },
        required: ['speaker', 'text', 'expression'],
        additionalProperties: false,
      },
    },
    location: text('An existing location id where the scene takes place.'),
    present: {
      type: 'array',
      items: { type: 'string' },
      description: 'Character ids or invented person ids on stage.',
    },
    suggestions: {
      type: 'array',
      items: { type: 'string' },
      description: '2–4 short things the player might do next.',
    },
    proposals: {
      type: 'array',
      description:
        'Effects for the game to consider. Use sparingly and only for what actually happened.',
      items: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum:
              mode === 'guided'
                ? PROPOSAL_TYPES.filter((t) => !SANDBOX_ONLY.has(t))
                : PROPOSAL_TYPES,
          },
          character: { type: 'string' },
          delta: { type: 'integer' },
          summary: { type: 'string' },
          involves: { type: 'array', items: { type: 'string' } },
          importance: { type: 'integer' },
          op: { type: 'string', enum: ['open', 'advance', 'resolve'] },
          id: { type: 'string' },
          title: { type: 'string' },
          note: { type: 'string' },
          text: { type: 'string' },
          advance: { type: 'string', enum: ['period', 'day'] },
          location: { type: 'string' },
          who: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          role: { type: 'string' },
          home: { type: 'string' },
        },
        required: ['type'],
        additionalProperties: false,
      },
    },
    memoryNotes: text(
      'What is worth remembering from this moment (not trusted as fact on its own).',
    ),
  };
  const required = ['beats', 'location', 'present', 'suggestions', 'proposals', 'memoryNotes'];
  if (mode === 'guided') {
    properties.interludeComplete = {
      type: 'boolean',
      description: 'True when this moment has naturally run its course.',
    };
  }
  if (decision) {
    properties.mappedOption = {
      type: 'string',
      enum: decision.options.map((o) => o.id),
      description: 'The authored option closest to what the player wrote.',
    };
    required.push('mappedOption');
  }
  return { type: 'object', properties, required, additionalProperties: false };
}

const str = (value, max) => (typeof value === 'string' ? value.trim().slice(0, max) : '');
const slug = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);

function checkProposal(p, { game, mode, newPeople }) {
  if (!p || !PROPOSAL_TYPES.includes(p.type)) return [null, 'unknown proposal'];
  if (mode === 'guided' && SANDBOX_ONLY.has(p.type))
    return [null, 'not allowed in the Guided Tale'];
  const person = (id) =>
    Object.hasOwn(characterById, id) ||
    game.ai?.people.some((x) => x.id === id) ||
    newPeople.has(id);
  switch (p.type) {
    case 'bond':
      if (!Object.hasOwn(characterById, p.character) || !Number.isFinite(p.delta))
        return [null, 'unknown character'];
      return [
        {
          type: 'bond',
          character: p.character,
          delta: Math.max(-5, Math.min(5, Math.round(p.delta))),
        },
      ];
    case 'event':
      if (!str(p.summary, 600)) return [null, 'empty event'];
      return [
        {
          type: 'event',
          summary: str(p.summary, 600),
          involves: (Array.isArray(p.involves) ? p.involves : []).filter(person),
          importance: [1, 2, 3].includes(p.importance) ? p.importance : 1,
        },
      ];
    case 'thread':
      if (!['open', 'advance', 'resolve'].includes(p.op) || !(str(p.id, 60) || str(p.title, 120)))
        return [null, 'incomplete thread'];
      return [
        {
          type: 'thread',
          op: p.op,
          id: str(p.id, 60),
          title: str(p.title, 120),
          note: str(p.note, 300),
        },
      ];
    case 'journal':
      return str(p.text, 300)
        ? [{ type: 'journal', text: str(p.text, 300) }]
        : [null, 'empty journal note'];
    case 'time':
      return ['period', 'day'].includes(p.advance)
        ? [{ type: 'time', advance: p.advance }]
        : [null, 'unknown time step'];
    case 'move':
      return Object.hasOwn(locationById, p.location)
        ? [{ type: 'move', location: p.location }]
        : [null, 'unknown location'];
    case 'memory':
      return person(p.who) && str(p.text, 300)
        ? [{ type: 'memory', who: p.who, text: str(p.text, 300) }]
        : [null, 'unknown person'];
    case 'person':
      if (!str(p.name, 40) || !Object.hasOwn(locationById, p.home))
        return [null, 'incomplete person'];
      return [
        {
          type: 'person',
          name: str(p.name, 40),
          description: str(p.description, 300),
          role: str(p.role, 60),
          home: p.home,
        },
      ];
    default:
      return [{ type: p.type }];
  }
}

/** Validate a reply against canon. `reply` is null only when no usable beat remains. */
export function validateReply(raw, { game, mode, decision = null }) {
  const errors = [];
  const rejected = [];
  if (!raw || typeof raw !== 'object' || !Array.isArray(raw.beats))
    return { reply: null, rejected, errors: ['The reply had no scene.'] };
  // People introduced in this reply may already speak in it.
  const newPeople = new Map();
  for (const p of Array.isArray(raw.proposals) ? raw.proposals : [])
    if (p?.type === 'person' && mode === 'sandbox' && str(p.name, 40))
      newPeople.set('p-' + slug(p.name), p.name);
  const invented = new Map((game.ai?.people || []).map((p) => [p.id, p.name]));
  const speakerId = (speaker) => {
    if (speaker === null || speaker === undefined) return null;
    if (Object.hasOwn(characterById, speaker) || invented.has(speaker) || newPeople.has(speaker))
      return speaker;
    const byName = [...invented, ...newPeople].find(
      ([, name]) => name.toLowerCase() === String(speaker).toLowerCase(),
    );
    if (byName) return byName[0];
    const cast = Object.values(characterById).find(
      (c) => c.name.toLowerCase() === String(speaker).toLowerCase(),
    );
    return cast ? cast.id : undefined;
  };
  const beats = [];
  for (const b of raw.beats.slice(0, LIMITS.beats)) {
    const id = speakerId(b?.speaker);
    const line = str(b?.text, LIMITS.beatText);
    if (id === undefined || !line) {
      errors.push(`Dropped a line from an unknown speaker (${b?.speaker}).`);
      continue;
    }
    const allowed =
      id && Object.hasOwn(characterById, id) ? expressions[id] || ['neutral'] : ['neutral'];
    beats.push({
      speaker: id,
      text: line,
      expression: allowed.includes(b.expression) ? b.expression : 'neutral',
    });
  }
  if (!beats.length)
    return { reply: null, rejected, errors: [...errors, 'No usable lines remained.'] };
  const proposals = [];
  for (const p of (Array.isArray(raw.proposals) ? raw.proposals : []).slice(0, LIMITS.proposals)) {
    const [accepted, reason] = checkProposal(p, { game, mode, newPeople });
    if (accepted) proposals.push(accepted);
    else rejected.push({ proposal: p, reason });
  }
  let mappedOption = null;
  if (decision) {
    mappedOption = decision.options.some((o) => o.id === raw.mappedOption)
      ? raw.mappedOption
      : null;
    if (!mappedOption) errors.push('The answer did not match an authored option.');
  }
  const present = (Array.isArray(raw.present) ? raw.present : []).map(speakerId).filter((id) => id);
  return {
    reply: {
      beats,
      location: Object.hasOwn(locationById, raw.location) ? raw.location : game.location,
      present: [...new Set([...present, ...beats.map((b) => b.speaker).filter(Boolean)])],
      suggestions: (Array.isArray(raw.suggestions) ? raw.suggestions : [])
        .map((s) => str(s, 120))
        .filter(Boolean)
        .slice(0, LIMITS.suggestions),
      proposals,
      memoryNotes: str(raw.memoryNotes, 600),
      interludeComplete: raw.interludeComplete === true,
      mappedOption,
    },
    rejected,
    errors,
  };
}
