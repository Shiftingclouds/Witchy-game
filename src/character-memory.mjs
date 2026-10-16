import { characterById, chapters, topics, expressions } from './content.mjs';
import { eventById } from './life.mjs';
import { choiceDefinition } from './scene-beats.mjs';
import { introductions } from './story/choices.mjs';

export const MEMORY_LIMIT = 16;
export const TURNS_PER_CHARACTER = 4;
export const CONVERSATION_CHARACTER_LIMIT = 60000;
export const relationshipLabel = (score) =>
  score >= 40
    ? 'Close friend'
    : score >= 20
      ? 'Friend'
      : score >= 10
        ? 'Getting closer'
        : score > 0
          ? 'Acquaintance'
          : 'Not yet met';
export const isGameDate = (value) =>
  typeof value === 'string' &&
  /^20\d\d-\d\d-\d\d$/.test(value) &&
  !Number.isNaN(Date.parse(value + 'T12:00:00Z')) &&
  new Date(value + 'T12:00:00Z').toISOString().slice(0, 10) === value;

export function sceneMemoryMatches(key, choices) {
  if (key?.startsWith('meeting:')) return Boolean(choices?.[key.slice(8)]);
  if (!key?.startsWith('scene:')) return true;
  const [, scene, beat, option] = key.split(':');
  return choices?.[`${scene}:${beat}`] === option;
}

export function memoryDefinition(characterId, key) {
  if (typeof key !== 'string' || !Object.hasOwn(characterById, characterId)) return null;
  if (key.startsWith('meeting:')) {
    const choice = key.slice(8),
      definition = choiceDefinition(choice),
      introduction = introductions[choice];
    return definition && introduction?.people.includes(characterId)
      ? {
          text: introduction.text,
          minimumChapter: definition.scene.chapter,
          minimumDate: definition.beat.section?.date || chapters[definition.scene.chapter].date,
        }
      : null;
  }
  if (key.startsWith('scene:')) {
    const parts = key.split(':');
    if (parts.length !== 4) return null;
    const definition = choiceDefinition(`${parts[1]}:${parts[2]}`);
    const option = definition?.beat.choice.options.find((option) => option.id === parts[3]);
    return option?.remember?.includes(characterId)
      ? {
          text: option.journal,
          minimumChapter: definition.scene.chapter,
          minimumDate: definition.beat.section?.date || chapters[definition.scene.chapter].date,
        }
      : null;
  }
  if (key === 'checkin')
    return { text: 'We spent a quiet part of the day together.', minimumChapter: 0 };
  if (key.startsWith('talk:')) {
    const topic = topics.find((t) => key === 'talk:' + t.id);
    return topic
      ? {
          text: {
            hello: 'The player chose an introductory conversation with me.',
            care: 'The player asked how I was feeling.',
            mystery: 'We discussed my current thoughts about the lanterns.',
            laugh: 'We shared a little levity.',
          }[topic.id],
          minimumChapter: 0,
        }
      : null;
  }
  const eventMatch = key.match(/^event:([a-z-]+):([01])$/);
  if (eventMatch) {
    const event = eventById[eventMatch[1]],
      choice = event?.choices[Number(eventMatch[2])];
    return event?.host === characterId && choice
      ? { text: `${event.title}: ${choice.outcome}`, minimumChapter: 0 }
      : null;
  }
  const chapterMatch = key.match(/^chapter:([0-7]):([01])$/);
  if (chapterMatch) {
    const index = Number(chapterMatch[1]),
      choice = chapters[index].choices[Number(chapterMatch[2])];
    return choice?.[1] === characterId
      ? { text: `The player chose: ${choice[0]}`, minimumChapter: index + 1 }
      : null;
  }
  return null;
}

export function rememberCharacter(state, id, key) {
  if (!memoryDefinition(id, key)) return;
  state.characterMemories ??= {};
  const current = state.characterMemories[id] || [];
  state.characterMemories[id] = [
    ...current.filter((memory) => memory.key !== key),
    { key, date: state.date },
  ].slice(-MEMORY_LIMIT);
}

export function migrateCharacterMemories(state) {
  const memories = {};
  for (const id of Object.keys(characterById)) {
    const known = topics
      .filter((topic) => state.rewards?.includes(`talk:${id}:${topic.id}`))
      .map((topic) => ({ key: 'talk:' + topic.id, date: null }));
    if (known.length) memories[id] = known;
  }
  return memories;
}

export function recordConversation(state, action) {
  if (
    !Object.hasOwn(characterById, action.id) ||
    typeof action.requestId !== 'string' ||
    !/^[a-zA-Z0-9-]{1,80}$/.test(action.requestId) ||
    !['provider', 'pasted'].includes(action.source) ||
    typeof action.player !== 'string' ||
    action.player.length > 2000 ||
    typeof action.text !== 'string' ||
    !action.text.trim() ||
    action.text.length > 3000
  )
    return false;
  if (
    Object.values(state.conversations || {})
      .flat()
      .some((turn) => turn.id === action.requestId)
  )
    return false;
  state.conversations ??= {};
  state.conversationSequence = (state.conversationSequence || 0) + 1;
  if (state.conversationSequence > Number.MAX_SAFE_INTEGER) return false;
  const emotion = (expressions[action.id] || ['neutral']).includes(action.emotion)
    ? action.emotion
    : 'neutral';
  const turn = {
    id: action.requestId,
    sequence: state.conversationSequence,
    source: action.source,
    player: action.player.trim(),
    text: action.text.trim(),
    emotion,
    date: state.date,
    chapter: state.chapter,
  };
  state.conversations[action.id] = [...(state.conversations[action.id] || []), turn].slice(
    -TURNS_PER_CHARACTER,
  );
  let all = Object.entries(state.conversations).flatMap(([id, turns]) =>
    turns.map((turn) => ({ id, turn })),
  );
  let size = all.reduce((sum, item) => sum + item.turn.player.length + item.turn.text.length, 0);
  for (const item of all.sort((a, b) => a.turn.sequence - b.turn.sequence)) {
    if (size <= CONVERSATION_CHARACTER_LIMIT) break;
    state.conversations[item.id] = state.conversations[item.id].filter(
      (turn) => turn.id !== item.turn.id,
    );
    size -= item.turn.player.length + item.turn.text.length;
    if (!state.conversations[item.id].length) delete state.conversations[item.id];
  }
  return true;
}

export function validateCharacterState(state) {
  const validMap = (value) =>
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.keys(value).every((id) => Object.hasOwn(characterById, id));
  if (
    !validMap(state.characterMemories) ||
    !validMap(state.conversations) ||
    !Number.isSafeInteger(state.conversationSequence) ||
    state.conversationSequence < 0
  )
    throw Error('Invalid character memory.');
  const memories = {},
    conversations = {},
    ids = new Set(),
    sequences = new Set();
  let size = 0;
  for (const [id, list] of Object.entries(state.characterMemories)) {
    if (
      !Array.isArray(list) ||
      list.length > MEMORY_LIMIT ||
      new Set(list.map((m) => m?.key)).size !== list.length
    )
      throw Error('Invalid shared memories.');
    memories[id] = list.map((memory) => {
      const definition = memoryDefinition(id, memory?.key);
      if (
        !definition ||
        !sceneMemoryMatches(memory.key, state.storyChoices) ||
        (definition?.minimumDate && (!memory.date || memory.date < definition.minimumDate)) ||
        definition.minimumChapter > state.chapter + (state.ending ? 1 : 0) ||
        (memory.date !== null && (!isGameDate(memory.date) || memory.date > state.date))
      )
        throw Error('Invalid shared memory.');
      return { key: memory.key, date: memory.date };
    });
  }
  for (const [id, list] of Object.entries(state.conversations)) {
    if (!Array.isArray(list) || list.length > TURNS_PER_CHARACTER)
      throw Error('Invalid conversation history.');
    let previous = 0;
    conversations[id] = list.map((turn) => {
      if (
        !turn ||
        typeof turn.id !== 'string' ||
        !/^[a-zA-Z0-9-]{1,80}$/.test(turn.id) ||
        ids.has(turn.id) ||
        !Number.isSafeInteger(turn.sequence) ||
        turn.sequence <= previous ||
        turn.sequence > state.conversationSequence ||
        sequences.has(turn.sequence) ||
        !['provider', 'pasted'].includes(turn.source) ||
        typeof turn.player !== 'string' ||
        turn.player.length > 2000 ||
        typeof turn.text !== 'string' ||
        !turn.text.trim() ||
        turn.text.length > 3000 ||
        !(expressions[id] || ['neutral']).includes(turn.emotion) ||
        !isGameDate(turn.date) ||
        turn.date > state.date ||
        !Number.isInteger(turn.chapter) ||
        turn.chapter < 0 ||
        turn.chapter > state.chapter
      )
        throw Error('Invalid conversation turn.');
      ids.add(turn.id);
      sequences.add(turn.sequence);
      previous = turn.sequence;
      size += turn.player.length + turn.text.length;
      return Object.fromEntries(
        ['id', 'sequence', 'source', 'player', 'text', 'emotion', 'date', 'chapter'].map((key) => [
          key,
          turn[key],
        ]),
      );
    });
  }
  if (size > CONVERSATION_CHARACTER_LIMIT) throw Error('Conversation memory exceeds its limit.');
  return {
    characterMemories: memories,
    conversations,
    conversationSequence: state.conversationSequence,
  };
}
