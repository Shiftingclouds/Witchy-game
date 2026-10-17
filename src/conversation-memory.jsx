import { characterById } from './content.mjs';
import { memoryDefinition } from './character-memory.mjs';

export function ConversationMemory({ id, game }) {
  // Stored AI dialogue from older saves stays in the save but is not shown in Prebuilt play.
  const memories = game.characterMemories?.[id] || [];
  if (!memories.length) return null;
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
    </details>
  );
}
