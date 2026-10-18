// Builds the prompt for one AI-mode turn, fresh each time, in priority layers:
// rules → style → world → people on stage → played record → playthrough memory → the player's words.
// Trimming removes from the bottom of optional layers only; rules, on-stage sheets, open threads
// and the player's words always survive.
import {
  characters,
  characterById,
  chapters,
  locations,
  locationById,
  expressions,
} from '../content.mjs';
import { characterInput, buildCharacterContext } from '../character-context.mjs';
import { peopleHere } from '../life.mjs';
import { relationshipLabel } from '../character-memory.mjs';
import { LORE } from './world/lore.mjs';
import { MYSTERY_STAGES, MYSTERY_TRUTH } from './world/mystery.mjs';
import { STYLE_SAMPLES } from './world/style.mjs';
import { STORYTELLER_RULES } from './storyteller.mjs';

export { STORYTELLER_RULES };
export const CONTEXT_LIMIT = 60_000;

const PERIODS = ['morning', 'afternoon', 'evening', 'night'];

function sheetText(id, game) {
  const c = buildCharacterContext(id, characterInput(game, id));
  const ch = c.character;
  const voice = Object.entries(ch.voice || {})
    .map(([k, v]) => `${k}: ${v}`)
    .join('; ');
  const invented = game.ai?.memories?.[id] || [];
  return [
    `## ${ch.name} (id: ${id}) — ${ch.role}`,
    ch.summary,
    `Traits: ${ch.traits.join(', ')}. Values: ${ch.values.join(', ')}. Wants: ${ch.motivation}`,
    `Voice — ${voice}`,
    `Boundaries: ${ch.boundaries.join(' ')}`,
    ch.knownFacts.length ? `Knows: ${ch.knownFacts.join(' ')}` : '',
    ch.personalTopics.length ? `Will share if trusted: ${ch.personalTopics.join(' ')}` : '',
    ch.connections.length
      ? `Knows people: ${ch.connections.map((x) => `${x.name} (${x.relationship})`).join('; ')}`
      : '',
    `With the player: ${c.relationship.level} (${c.relationship.score}/100). ${c.relationship.guidance || ''}`,
    c.relationship.sharedMemories?.length
      ? `Shared moments: ${c.relationship.sharedMemories.join(' ')}`
      : '',
    invented.length ? `Remembers from this playthrough: ${invented.join(' ')}` : '',
    `Expressions: ${(expressions[id] || ['neutral']).join(', ')}`,
  ]
    .filter(Boolean)
    .join('\n');
}

/** Sections in priority order; `items` can be trimmed from the end when over budget. */
function sections({ game, mode, input, focus = {} }) {
  const ai = game.ai || {
    turns: [],
    chronicle: [],
    events: [],
    threads: [],
    people: [],
    memories: {},
  };
  const reached = MYSTERY_STAGES.filter((s) => s.chapter <= game.chapter);
  const next = MYSTERY_STAGES.find((s) => s.chapter === game.chapter + 1);
  const here = peopleHere(game).map((c) => c.id);
  const recentSpeakers = (ai.turns.at(-1)?.beats || [])
    .map((b) => b.speaker)
    .filter((id) => characterById[id]);
  const onStage = [
    ...new Set([focus.characterId, ...recentSpeakers, ...here].filter((id) => characterById[id])),
  ].slice(0, 6);
  const out = [];
  out.push({
    title: 'STYLE (match this voice and quality)',
    items: [
      ...STYLE_SAMPLES.narration.slice(0, 5).map((p) => `Narration: ${p}`),
      ...onStage.flatMap((id) =>
        (STYLE_SAMPLES.voices[id] || []).slice(0, 2).map((l) => `${characterById[id].name}: ${l}`),
      ),
    ],
    trim: true,
  });
  out.push({
    title: 'WORLD',
    items: [
      LORE,
      'LOCATIONS (id — name: description): ' +
        locations.map((l) => `${l.id} — ${l.name}: ${l.description}`).join(' | '),
    ],
  });
  out.push({
    title: 'THE STORY SO FAR (canon)',
    items: [
      ...reached.map((s) => `Chapter ${s.chapter + 1}: ${s.revelation}`),
      mode === 'sandbox' && next
        ? `NEXT MILESTONE (storyteller only; reveal only when genuinely pursued): ${next.revelation}`
        : '',
      mode === 'sandbox' ? MYSTERY_TRUTH : '',
      mode === 'guided'
        ? `Current authored chapter: ${chapters[game.chapter].title} (${chapters[game.chapter].kicker}).`
        : '',
      focus.sceneText
        ? `The authored scene the player just read (verbatim canon):\n${focus.sceneText}`
        : '',
    ].filter(Boolean),
  });
  out.push({ title: 'PEOPLE ON STAGE', items: onStage.map((id) => sheetText(id, game)) });
  out.push({
    title: 'EVERYONE ELSE (id — role)',
    items: [
      characters
        .filter((c) => !onStage.includes(c.id))
        .map((c) => `${c.id} — ${c.name}, ${c.role}`)
        .join('; '),
      ...ai.people.map(
        (p) =>
          `${p.id} — ${p.name}, ${p.role} (invented this playthrough; usually at ${p.home}): ${p.description}`,
      ),
    ],
    trim: true,
  });
  out.push({
    title: 'PLAYED RECORD',
    items: [
      `Player: ${game.name} of ${game.house || 'no house yet'}, familiar: ${game.familiar || 'none yet'}.`,
      `Now: ${game.date}, ${PERIODS[game.period]}, at ${game.location} (${locationById[game.location]?.name}).`,
      `Friendships: ${
        Object.entries(game.bonds)
          .map(([id, n]) => `${characterById[id]?.name} ${relationshipLabel(n)} (${n})`)
          .join('; ') || 'none yet'
      }.`,
      `Spells known: ${game.spells.join(', ') || 'none yet'}. House points: ${game.points}.`,
      mode === 'sandbox'
        ? `Time: ${ai.timeMode === 'timed' ? 'Timed — the year and the mystery move on with the calendar; midsummer renewal deadline 2027-06-21.' : 'Timeless — the mystery waits until the player pursues it.'}`
        : '',
    ].filter(Boolean),
  });
  out.push({
    title: 'OPEN THREADS (always remember)',
    items: ai.threads
      .filter((t) => t.status === 'open')
      .map((t) => `[${t.id}] ${t.title}${t.notes.length ? ' — ' + t.notes.join(' / ') : ''}`),
  });
  out.push({
    title: 'IMPORTANT EVENTS',
    items: ai.events.filter((e) => e.importance === 3).map((e) => `${e.date}: ${e.summary}`),
  });
  out.push({
    title: 'OTHER EVENTS (newest first)',
    items: ai.events
      .filter((e) => e.importance < 3)
      .reverse()
      .map((e) => `${e.date}: ${e.summary}`),
    trim: true,
  });
  out.push({
    title: 'CHRONICLE OF THIS PLAYTHROUGH (newest first)',
    items: [...ai.chronicle].reverse().map((c) => `${c.date}: ${c.text}`),
    trim: true,
  });
  out.push({
    title: 'RECENT MOMENTS (oldest first)',
    items: ai.turns
      .slice(-8)
      .map(
        (t) =>
          `Player: ${t.player}\n` +
          t.beats
            .map((b) =>
              b.speaker
                ? `${characterById[b.speaker]?.name || ai.people.find((p) => p.id === b.speaker)?.name || b.speaker}: ${b.text}`
                : b.text,
            )
            .join('\n'),
      ),
    trim: true,
    trimFromStart: true,
  });
  if (focus.decision)
    out.push({
      title: 'AUTHORED DECISION',
      items: [
        `${focus.decision.prompt}\nOptions: ${focus.decision.options.map((o) => `${o.id} = ${o.label}`).join(' | ')}\nMap the player's words to the closest option as mappedOption, and write a short bridge in their own terms.`,
      ],
    });
  out.push({ title: 'THE PLAYER', items: [String(input || '').slice(0, 2000)] });
  return out;
}

const render = (list) => list.map((s) => `# ${s.title}\n${s.items.join('\n\n')}`).join('\n\n');

export function buildTurnContext({ game, mode, input, focus }) {
  const system = STORYTELLER_RULES(mode);
  const list = sections({ game, mode, input, focus }).filter((s) => s.items.length);
  const size = () => system.length + render(list).length;
  // Trim the least important optional material first, from the bottom of each layer.
  const order = [
    'OTHER EVENTS (newest first)',
    'CHRONICLE OF THIS PLAYTHROUGH (newest first)',
    'STYLE (match this voice and quality)',
    'EVERYONE ELSE (id — role)',
    'RECENT MOMENTS (oldest first)',
  ];
  for (const title of order) {
    const section = list.find((s) => s.title === title);
    while (
      section &&
      size() > CONTEXT_LIMIT &&
      section.items.length > (title.startsWith('RECENT') ? 2 : 0)
    )
      section.trimFromStart ? section.items.shift() : section.items.pop();
  }
  // Last resort: shorten long items in the trimmable layers.
  for (const section of list.filter((s) => s.trim))
    if (size() > CONTEXT_LIMIT) section.items = section.items.map((item) => item.slice(0, 400));
  const prompt = render(list);
  return { system, prompt, budget: { used: system.length + prompt.length, limit: CONTEXT_LIMIT } };
}
