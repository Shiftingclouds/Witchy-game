// Reading the story script format (see story-script.mjs) back into a game scene, and checking that a
// rewrite kept everything saves and later chapters rely on.
import { TIMES } from './story-script.mjs';

const SCENE = /^=== SCENE (\S+) \| chapter (\d+) ===$/;
const SECTION = /^--- SECTION (\S+) \| place: (\S+) \| time: (\w+) \| date: (\d{4}-\d\d-\d\d) ---$/;
const TAG = /^\[([^\]]+)\]\s*(.*)$/;

/**
 * Parse one scene of script text.
 * @returns {{ scene: object|null, exits: string[], errors: string[], warnings: string[] }}
 * The scene has `{ id, chapter, beats }`; beats carry `section`, `speaker`, `actors`, `when`,
 * `illustration` and `choice` like hand-written scenes. Beat ids: decision beats take their key's
 * last part; all others are `<section>-<n>`.
 */
export function parseStoryScript(text, { nameToId = {}, allowedEmotions = {} } = {}) {
  const errors = [];
  const warnings = [];
  const exits = [];
  const beats = [];
  let scene = null;
  let section = null;
  let gate = null;
  let decision = null;
  const counters = {};
  const nextId = () => {
    counters[section.id] = (counters[section.id] || 0) + 1;
    return `${section.id}-${counters[section.id]}`;
  };
  const push = (beat) => {
    if (!section) {
      errors.push(`A line comes before any SECTION: "${(beat.text || '').slice(0, 40)}"`);
      return;
    }
    beats.push({ ...beat, section: { ...section }, ...(gate ? { when: { ...gate } } : {}) });
  };
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  lines.forEach((raw, i) => {
    const line = raw.trim();
    const at = `line ${i + 1}`;
    if (!line || line.startsWith('```')) return;
    let m;
    if ((m = line.match(SCENE))) {
      if (scene) errors.push(`${at}: a second SCENE header; send one scene per file.`);
      scene = { id: m[1], chapter: Number(m[2]) };
      return;
    }
    if ((m = line.match(SECTION))) {
      if (gate) errors.push(`${at}: SECTION ${m[1]} starts inside an unclosed [IF]`);
      gate = null;
      const period = TIMES.indexOf(m[3]);
      if (period < 0) errors.push(`${at}: unknown time "${m[3]}"`);
      section = { id: m[1], location: m[2], period: Math.max(period, 0), date: m[4] };
      return;
    }
    if (!(m = line.match(TAG))) {
      errors.push(`${at}: not a tagged line: "${line.slice(0, 50)}"`);
      return;
    }
    const [, tag, rest] = m;
    if (decision && !/^(OPTION |END DECISION)/.test(tag))
      errors.push(`${at}: DECISION ${decision.key} is missing [END DECISION]`);
    if (tag === 'N') return push({ id: nextId(), text: rest, speaker: null, actors: [] });
    if (tag === 'BEAT' || tag === 'NOTE') return warnings.push(`${at}: leftover [${tag}] skipped`);
    if (tag.startsWith('IMAGE ')) {
      const art = tag.slice(6).trim();
      const last = beats.at(-1);
      if (last && !last.illustration && last.section.id === section?.id)
        last.illustration = { art, alt: rest };
      else
        push({
          id: nextId(),
          text: '',
          speaker: null,
          actors: [],
          illustration: { art, alt: rest },
        });
      return;
    }
    if (tag.startsWith('DECISION ')) {
      const key = tag.slice(9).trim();
      const [sceneId, beatId] = key.split(':');
      if (scene && sceneId !== scene.id)
        errors.push(`${at}: decision ${key} belongs to another scene`);
      // The line just before a decision (narration, or someone speaking) is the line it is read with.
      const last = beats.at(-1);
      const lead =
        last &&
        !last.choice &&
        !last.illustration &&
        last.section.id === section?.id &&
        JSON.stringify(last.when || null) === JSON.stringify(gate)
          ? beats.pop()
          : null;
      if (!lead) errors.push(`${at}: DECISION ${key} needs a line just before it to be read with`);
      decision = {
        key,
        beat: {
          id: beatId,
          text: lead?.text || '',
          speaker: lead?.speaker || null,
          actors: lead?.actors || [],
          choice: { prompt: rest, options: [] },
        },
      };
      return;
    }
    if (tag.startsWith('OPTION ')) {
      if (!decision) return errors.push(`${at}: OPTION outside a DECISION`);
      const [label, ...fields] = rest.split(' | ');
      const option = { id: tag.slice(7).trim(), label: label.trim() };
      for (const f of fields) {
        const [, k, v] = f.match(/^(\w+):\s*(.*)$/) || [];
        if (k === 'hint' || k === 'journal') option[k] = v.trim();
      }
      decision.beat.choice.options.push(option);
      return;
    }
    if (tag === 'END DECISION') {
      if (!decision) return errors.push(`${at}: [END DECISION] without a DECISION`);
      push(decision.beat);
      decision = null;
      return;
    }
    if (tag.startsWith('IF ')) {
      const [, key, value] = tag.match(/^IF (\S+) = (\S+)$/) || [];
      if (!key) return errors.push(`${at}: unreadable gate [${tag}]`);
      if (gate) errors.push(`${at}: [IF] inside another [IF]`);
      gate = { choice: key, equals: value === '(none)' ? null : value };
      return;
    }
    if (tag === 'END IF') {
      if (!gate) errors.push(`${at}: [END IF] without [IF]`);
      gate = null;
      return;
    }
    if (tag.startsWith('EXIT ')) {
      exits[Number(tag.slice(5))] = rest;
      return;
    }
    // Speech: [Name | emotion]
    const [name, emotion = 'neutral'] = tag.split('|').map((s) => s.trim());
    const id = nameToId[name];
    if (!id) return errors.push(`${at}: unknown speaker "${name}"`);
    let feel = emotion;
    if (allowedEmotions[id] && !allowedEmotions[id].includes(emotion)) {
      warnings.push(`${at}: ${name} has no "${emotion}" portrait; using neutral`);
      feel = 'neutral';
    }
    if (!rest) errors.push(`${at}: ${name} says nothing`);
    push({ id: nextId(), text: rest, speaker: id, actors: [{ id, emotion: feel }] });
  });
  if (decision) errors.push(`DECISION ${decision.key} is missing [END DECISION]`);
  if (gate) errors.push('An [IF] is never closed with [END IF]');
  if (!scene) errors.push('No "=== SCENE" header found');
  for (const b of beats)
    if (!b.text && !b.illustration && !b.choice) errors.push(`Empty line in ${b.section.id}`);
  return { scene: scene && { ...scene, beats }, exits, errors, warnings };
}

/** What must survive a rewrite: section ids, decision keys with their option ids, branch gates. */
export function structureOf(scene) {
  const sections = [...new Set(scene.beats.map((b) => b.section?.id).filter(Boolean))];
  const decisions = {};
  for (const b of scene.beats)
    if (b.choice) decisions[`${scene.id}:${b.id}`] = b.choice.options.map((o) => o.id);
  const gates = [
    ...new Set(scene.beats.filter((b) => b.when).map((b) => `${b.when.choice}=${b.when.equals}`)),
  ];
  return { sections, decisions, gates };
}

/** Problems that would break saves or later chapters if `next` replaced `current`. */
export function compareStructure(current, next) {
  const a = structureOf(current);
  const b = structureOf(next);
  const problems = [];
  for (const id of a.sections) if (!b.sections.includes(id)) problems.push(`missing SECTION ${id}`);
  for (const [key, options] of Object.entries(a.decisions)) {
    if (!b.decisions[key]) problems.push(`missing DECISION ${key}`);
    else
      for (const o of options)
        if (!b.decisions[key].includes(o)) problems.push(`DECISION ${key} is missing OPTION ${o}`);
  }
  for (const g of a.gates)
    if (!b.gates.includes(g)) problems.push(`missing gate [IF ${g.replace('=', ' = ')}]`);
  return problems;
}

/**
 * Carry over what is not prose (remember lists, effects, section titles) from the current scene
 * into the imported one, matched by id. Introductions stay in src/story/choices.mjs.
 */
export function mergeMetadata(current, next) {
  const titles = Object.fromEntries(
    current.beats.filter((b) => b.section).map((b) => [b.section.id, b.section.title]),
  );
  const options = {};
  for (const b of current.beats)
    if (b.choice) for (const o of b.choice.options) options[`${b.id}:${o.id}`] = o;
  return {
    ...next,
    beats: next.beats.map((b) => ({
      ...b,
      section: { ...b.section, title: titles[b.section.id] || b.section.id },
      ...(b.choice
        ? {
            choice: {
              ...b.choice,
              options: b.choice.options.map((o) => {
                const old = options[`${b.id}:${o.id}`] || {};
                return {
                  ...o,
                  ...(old.remember ? { remember: old.remember } : {}),
                  ...(old.effects ? { effects: old.effects } : {}),
                };
              }),
            },
          }
        : {}),
    })),
  };
}
