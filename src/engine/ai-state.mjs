// Playthrough memory for the AI modes. Everything Claude invents lives here, tagged as invented,
// and never mixes with canon or the authored record.
import { characterById, locationById } from '../content.mjs';
import { isAiMode } from './modes.mjs';

export const AI_LIMITS = {
  turns: 24,
  chronicle: 60,
  events: 150,
  openThreads: 30,
  people: 40,
  memoriesPerPerson: 12,
  text: 600,
  beats: 12,
  beatText: 1200,
  player: 2000,
};

export const emptyAi = (timeMode = null) => ({
  timeMode,
  turns: [],
  chronicle: [],
  events: [],
  threads: [],
  people: [],
  memories: {},
  sequence: 0,
  pendingTimed: false,
});

const str = (value, max) => (typeof value === 'string' ? value.trim().slice(0, max) : '');
const isPerson = (ai, id) => Object.hasOwn(characterById, id) || ai.people.some((p) => p.id === id);

/** Validate and clean a save's AI memory; drop anything malformed rather than failing the whole save. */
export function sanitizeAi(value, mode) {
  if (!isAiMode(mode)) return null;
  const v = value && typeof value === 'object' ? value : {};
  const ai = emptyAi(
    mode === 'sandbox' && ['timeless', 'timed'].includes(v.timeMode)
      ? v.timeMode
      : mode === 'sandbox'
        ? 'timeless'
        : null,
  );
  ai.sequence = Number.isInteger(v.sequence) && v.sequence >= 0 ? v.sequence : 0;
  ai.pendingTimed = v.pendingTimed === true && ai.timeMode === 'timeless';
  ai.people = (Array.isArray(v.people) ? v.people : [])
    .filter(
      (p) =>
        p && typeof p.id === 'string' && str(p.name, 40) && Object.hasOwn(locationById, p.home),
    )
    .slice(0, AI_LIMITS.people)
    .map((p) => ({
      id: str(p.id, 60),
      name: str(p.name, 40),
      description: str(p.description, 300),
      role: str(p.role, 60),
      home: p.home,
      source: 'invented',
    }));
  ai.turns = (Array.isArray(v.turns) ? v.turns : []).slice(-AI_LIMITS.turns).map((t) => ({
    id: Number.isInteger(t.id) ? t.id : 0,
    player: str(t.player, AI_LIMITS.player),
    beats: (Array.isArray(t.beats) ? t.beats : []).slice(0, AI_LIMITS.beats).map((b) => ({
      speaker: typeof b.speaker === 'string' ? b.speaker : null,
      text: str(b.text, AI_LIMITS.beatText),
      expression: str(b.expression, 30) || 'neutral',
    })),
    date: str(t.date, 10),
    location: Object.hasOwn(locationById, t.location) ? t.location : null,
    section: typeof t.section === 'string' ? str(t.section, 100) : null,
  }));
  ai.chronicle = (Array.isArray(v.chronicle) ? v.chronicle : [])
    .slice(-AI_LIMITS.chronicle)
    .map((c) => ({
      id: Number.isInteger(c.id) ? c.id : 0,
      text: str(c.text, 800),
      date: str(c.date, 10),
    }))
    .filter((c) => c.text);
  ai.events = (Array.isArray(v.events) ? v.events : [])
    .slice(-AI_LIMITS.events)
    .map((e) => ({
      id: str(e.id, 30),
      summary: str(e.summary, AI_LIMITS.text),
      involves: (Array.isArray(e.involves) ? e.involves : [])
        .filter((id) => isPerson(ai, id))
        .slice(0, 6),
      importance: [1, 2, 3].includes(e.importance) ? e.importance : 1,
      date: str(e.date, 10),
      source: 'invented',
    }))
    .filter((e) => e.summary);
  ai.threads = (Array.isArray(v.threads) ? v.threads : []).slice(0, 80).map((t) => ({
    id: str(t.id, 60),
    title: str(t.title, 120),
    status: t.status === 'resolved' ? 'resolved' : 'open',
    notes: (Array.isArray(t.notes) ? t.notes : [])
      .map((n) => str(n, 300))
      .filter(Boolean)
      .slice(-6),
  }));
  for (const [who, list] of Object.entries(
    v.memories && typeof v.memories === 'object' ? v.memories : {},
  ))
    if (isPerson(ai, who) && Array.isArray(list))
      ai.memories[who] = list
        .map((m) => str(m, 300))
        .filter(Boolean)
        .slice(-AI_LIMITS.memoriesPerPerson);
  return ai;
}
