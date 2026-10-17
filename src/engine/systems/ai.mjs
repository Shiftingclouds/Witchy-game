import { characterById, locationById, chapters } from '../../content.mjs';
import { advanceTime } from '../time.mjs';
import { isAiMode, isLiveLike } from '../modes.mjs';
import { AI_LIMITS } from '../ai-state.mjs';

const str = (value, max) => (typeof value === 'string' ? value.trim().slice(0, max) : '');
const slug = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
const isPerson = (s, id) =>
  Object.hasOwn(characterById, id) || s.ai.people.some((p) => p.id === id);

/** In the Timed Open World the mystery follows the calendar (a milestone per authored chapter date). */
export function followCalendar(s) {
  if (s.mode !== 'sandbox' || s.ai?.timeMode !== 'timed') return;
  let reached = 0;
  chapters.forEach((c, i) => {
    if (c.date <= s.date) reached = i;
  });
  if (reached > s.chapter) s.chapter = Math.min(reached, chapters.length - 1);
}

function trimEvents(ai) {
  while (ai.events.length > AI_LIMITS.events) {
    const lowest = Math.min(...ai.events.map((e) => e.importance));
    ai.events.splice(
      ai.events.findIndex((e) => e.importance === lowest),
      1,
    );
  }
}

function apply(s, p, used) {
  const ai = s.ai;
  switch (p?.type) {
    case 'bond': {
      if (!Object.hasOwn(characterById, p.character) || !Number.isFinite(p.delta)) return false;
      // At most ±5 per person per turn, however the change is split across proposals.
      used.bond ??= {};
      const so = used.bond[p.character] || 0;
      const delta = Math.max(-5, Math.min(5, so + Math.round(p.delta))) - so;
      if (!delta) return false;
      used.bond[p.character] = so + delta;
      s.bonds[p.character] = Math.max(0, Math.min(100, (s.bonds[p.character] || 0) + delta));
      return true;
    }
    case 'event': {
      const summary = str(p.summary, AI_LIMITS.text);
      if (!summary) return false;
      ai.events.push({
        id: 'e' + ai.sequence,
        summary,
        involves: (Array.isArray(p.involves) ? p.involves : [])
          .filter((id) => isPerson(s, id))
          .slice(0, 6),
        importance: [1, 2, 3].includes(p.importance) ? p.importance : 1,
        date: s.date,
        source: 'invented',
      });
      trimEvents(ai);
      return true;
    }
    case 'thread': {
      const id = slug(str(p.id, 60) || str(p.title, 120));
      if (!id) return false;
      const existing = ai.threads.find((t) => t.id === id);
      const note = str(p.note, 300);
      if (p.op === 'open') {
        if (
          existing ||
          ai.threads.filter((t) => t.status === 'open').length >= AI_LIMITS.openThreads
        )
          return false;
        ai.threads.push({
          id,
          title: str(p.title, 120) || id,
          status: 'open',
          notes: note ? [note] : [],
        });
        return true;
      }
      if (!existing) return false;
      if (note) existing.notes = [...existing.notes, note].slice(-6);
      if (p.op === 'resolve') {
        existing.status = 'resolved';
        // Keep only the newest resolved threads; open ones are never dropped.
        const resolved = ai.threads.filter((t) => t.status === 'resolved');
        const excess = new Set(resolved.slice(0, -AI_LIMITS.resolvedThreads));
        ai.threads = ai.threads.filter((t) => !excess.has(t));
      }
      return true;
    }
    case 'journal': {
      const text = str(p.text, 300);
      if (!text) return false;
      s.journal.push({ date: s.date, text });
      return true;
    }
    case 'time': {
      if (used.time || !['period', 'day'].includes(p.advance)) return false;
      used.time = true;
      advanceTime(s, p.advance === 'day');
      return true;
    }
    case 'move': {
      if (!isLiveLike(s.mode) || !Object.hasOwn(locationById, p.location)) return false;
      s.location = p.location;
      if (!s.visited.includes(p.location)) s.visited.push(p.location);
      return true;
    }
    case 'memory': {
      const text = str(p.text, 300);
      if (!text || !isPerson(s, p.who)) return false;
      ai.memories[p.who] = [...(ai.memories[p.who] || []), text].slice(
        -AI_LIMITS.memoriesPerPerson,
      );
      return true;
    }
    case 'person': {
      if (s.mode !== 'sandbox' || ai.people.length >= AI_LIMITS.people) return false;
      const name = str(p.name, 40);
      if (!name || !Object.hasOwn(locationById, p.home) || ai.people.some((x) => x.name === name))
        return false;
      ai.people.push({
        id: 'p-' + slug(name),
        name,
        description: str(p.description, 300),
        role: str(p.role, 60),
        home: p.home,
        source: 'invented',
      });
      return true;
    }
    case 'milestone': {
      if (s.mode !== 'sandbox' || used.milestone || s.chapter >= chapters.length - 1) return false;
      // The mystery cannot be rushed: a revelation needs some living between it and the last one.
      if (ai.sequence - (ai.milestoneAt || 0) < AI_LIMITS.turnsPerMilestone) return false;
      used.milestone = true;
      ai.milestoneAt = ai.sequence;
      s.chapter += 1;
      return true;
    }
    case 'time-mode': {
      if (s.mode !== 'sandbox' || ai.timeMode !== 'timeless') return false;
      ai.pendingTimed = true;
      return true;
    }
    default:
      return false;
  }
}

export const aiSystem = {
  id: 'ai',
  commands: {
    'ai-turn'(s, action) {
      const reply = action.reply;
      if (!isAiMode(s.mode) || !s.ai || !reply || !Array.isArray(reply.beats)) return false;
      // A reply asked for by another save (the player switched modes mid-request) is dropped.
      if (action.mode && action.mode !== s.mode) return false;
      s.ai.sequence += 1;
      s.ai.turns.push({
        id: s.ai.sequence,
        player: str(action.player, AI_LIMITS.player),
        beats: reply.beats.slice(0, AI_LIMITS.beats).map((b) => ({
          speaker: typeof b.speaker === 'string' ? b.speaker : null,
          text: str(b.text, AI_LIMITS.beatText),
          expression: str(b.expression, 30) || 'neutral',
        })),
        date: s.date,
        location: s.location,
        section: typeof action.section === 'string' ? str(action.section, 100) : null,
      });
      s.ai.turns = s.ai.turns.slice(-AI_LIMITS.turns);
      s.ai.lastSuggestions = (Array.isArray(reply.suggestions) ? reply.suggestions : [])
        .map((x) => str(x, 120))
        .filter(Boolean)
        .slice(0, 4);
      const used = {};
      for (const proposal of (Array.isArray(reply.proposals) ? reply.proposals : []).slice(0, 8))
        apply(s, proposal, used);
    },
    'ai-chronicle'(s, action) {
      const text = str(action.entry, 800);
      if (!isAiMode(s.mode) || !s.ai || !text) return false;
      if (action.mode && action.mode !== s.mode) return false;
      const absorbed = new Set(Array.isArray(action.absorbedTurnIds) ? action.absorbedTurnIds : []);
      // Repeat-safe: if those moments are already folded in, this summary is a duplicate.
      if (!s.ai.turns.some((t) => absorbed.has(t.id))) return false;
      s.ai.sequence += 1;
      s.ai.chronicle = [...s.ai.chronicle, { id: s.ai.sequence, text, date: s.date }].slice(
        -AI_LIMITS.chronicle,
      );
      s.ai.turns = s.ai.turns.filter((t) => !absorbed.has(t.id));
      const used = {};
      for (const proposal of (Array.isArray(action.proposals) ? action.proposals : []).slice(0, 12))
        if (['memory', 'event'].includes(proposal?.type)) apply(s, proposal, used);
    },
    'ai-time-mode'(s, action) {
      if (s.mode !== 'sandbox' || s.ai?.timeMode !== 'timeless' || action.mode !== 'timed')
        return false;
      s.ai.timeMode = 'timed';
      s.ai.pendingTimed = false;
      followCalendar(s);
    },
    'ai-keep-timeless'(s) {
      if (!s.ai?.pendingTimed) return false;
      s.ai.pendingTimed = false;
    },
  },
};
