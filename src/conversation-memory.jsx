import { characterById } from './content.mjs';
import { memoryDefinition } from './character-memory.mjs';

export function ConversationMemory({ id, game, act }) {
  const turns = game.conversations?.[id] || [],
    memories = game.characterMemories?.[id] || [];
  if (!turns.length && !memories.length) return null;
  return (
    <details className="conversation-memory">
      <summary>Your history with {characterById[id].name}</summary>
      {memories.length > 0 && (
        <>
          <h4>Shared moments</h4>
          <ul>
            {memories.map((memory) => (
              <li key={memory.key}>
                {memoryDefinition(id, memory.key)?.text}
                {memory.date && <small>{memory.date}</small>}
              </li>
            ))}
          </ul>
        </>
      )}
      {turns.length > 0 && (
        <>
          <h4>Recent AI conversations</h4>
          <p>
            These replies help the conversation continue. Story events and relationship levels come
            from your game progress.
          </p>
          <ol>
            {turns.map((turn) => (
              <li key={turn.id}>
                {turn.player && (
                  <p>
                    <strong>{game.name}:</strong> {turn.player}
                  </p>
                )}
                <p>
                  <strong>{characterById[id].name}:</strong> {turn.text}
                </p>
              </li>
            ))}
          </ol>
          <button className="text-button" onClick={() => act({ type: 'forget-conversation', id })}>
            Clear saved AI conversation
          </button>
        </>
      )}
    </details>
  );
}
