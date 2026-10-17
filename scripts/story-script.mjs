// The story script format shared with ChatGPT: plain lines with bracket tags that are easy for a
// writer to keep and easy to import back. Speech is written WITHOUT quotation marks (the game adds them).
//
//   === SCENE <scene id> | chapter <n> ===
//   --- SECTION <id> | place: <location id> | time: <morning|afternoon|evening|night> | date: <YYYY-MM-DD> ---
//   [N] narration paragraph
//   [<Name> | <emotion>] spoken words
//   [BEAT] a stage direction to write in full (skeletons only)
//   [NOTE] guidance for the writer; never shown in the game
//   [IMAGE <art id>] alt text
//   [DECISION <key>] prompt
//   [OPTION <id>] label | hint: … | journal: …
//   [END DECISION]
//   [IF <key> = <option id>] … [END IF]
import { characterById } from '../src/content.mjs';

export const TIMES = ['morning', 'afternoon', 'evening', 'night'];

const optionLine = (o) =>
  `[OPTION ${o.id}] ${o.label}${o.hint ? ` | hint: ${o.hint}` : ''}${o.journal ? ` | journal: ${o.journal}` : ''}`;

/** A staged scene (src/story) as script lines. */
export function writeStoryScript(scene, chapterDate) {
  const out = [`=== SCENE ${scene.id} | chapter ${scene.chapter} ===`, ''];
  let section;
  let gate;
  const closeGate = () => {
    if (gate !== undefined) out.push('[END IF]');
    gate = undefined;
  };
  for (const beat of scene.beats) {
    if (beat.section && beat.section.id !== section) {
      closeGate();
      section = beat.section.id;
      const s = beat.section;
      out.push(
        '',
        `--- SECTION ${s.id} | place: ${s.location} | time: ${TIMES[s.period ?? 0]} | date: ${s.date || chapterDate} ---`,
      );
    }
    const condition = beat.when
      ? `${beat.when.choice} = ${beat.when.equals ?? '(none)'}`
      : undefined;
    if (condition !== gate) {
      closeGate();
      if (condition) out.push(`[IF ${condition}]`);
      gate = condition;
    }
    if (beat.illustration) out.push(`[IMAGE ${beat.illustration.art}] ${beat.illustration.alt}`);
    if (beat.speaker) {
      const emotion = beat.actors?.find((a) => a.id === beat.speaker)?.emotion || 'neutral';
      out.push(`[${characterById[beat.speaker].name} | ${emotion}] ${beat.text}`);
    } else if (beat.text) out.push(`[N] ${beat.text}`);
    if (beat.choice) {
      out.push(`[DECISION ${scene.id}:${beat.id}] ${beat.choice.prompt}`);
      for (const o of beat.choice.options) out.push(optionLine(o));
      out.push('[END DECISION]');
    }
  }
  closeGate();
  return out.join('\n') + '\n';
}

/** A compact chapter (no staged scene yet) as one narrated section. */
export function writeCompactChapter(chapter, index) {
  const out = [
    `=== SCENE ${chapter.scene}-chapter-${index} | chapter ${index} ===`,
    '',
    `--- SECTION main | place: ${chapter.scene} | time: evening | date: ${chapter.date} ---`,
    '[NOTE] This chapter is still compact. Expand it into full scenes with sections, keeping what happens.',
  ];
  for (const text of chapter.text) out.push(`[N] ${text}`);
  return out.join('\n') + '\n';
}
