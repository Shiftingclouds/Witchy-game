import { migrateCharacterMemories } from '../character-memory.mjs';
import { SAVE_VERSION } from './state.mjs';

// Every migration advances one version. Keep prior migrations for exported saves.
const migrations = new Map([
  [3, (state) => ({ ...state, version: 4, storyChoices: {} })],
  [4, (state) => ({ ...state, version: 5, ai: null })],
  // v6 chooses house and familiar inside the story; older saves already have both, so their
  // new opening decisions count as answered.
  [
    5,
    (state) => ({
      ...state,
      version: 6,
      storyChoices: state.house
        ? {
            'arrival:crossing': 'castle',
            'arrival:house': state.house,
            'arrival:familiar': state.familiar,
            ...state.storyChoices,
          }
        : state.storyChoices,
    }),
  ],
  [
    1,
    (state) => ({ ...state, version: 2, daily: { date: state.date, checkins: [], event: null } }),
  ],
  [
    2,
    (state) => ({
      ...state,
      version: 3,
      characterMemories: migrateCharacterMemories(state),
      conversations: {},
      conversationSequence: 0,
    }),
  ],
]);

export function migrateSave(value) {
  let state = value;
  while (Number.isInteger(state?.version) && state.version < SAVE_VERSION) {
    const migrate = migrations.get(state.version);
    if (!migrate) throw new Error('This save version cannot be upgraded.');
    state = migrate(state);
  }
  return state;
}
