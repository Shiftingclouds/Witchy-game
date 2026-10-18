import { useState } from 'react';
import { ScrollText, Settings2 } from 'lucide-react';
import { characterById } from '../../content.mjs';
import { spoken } from '../../scene-beats.mjs';
import { ReadingControls } from '../../dialogue-presentation.jsx';

/**
 * The scene's quiet corner controls: the lines so far, and a gear for reading settings.
 */
export function SceneMenu({ reading, lines = null }) {
  const [open, setOpen] = useState(null);
  const toggle = (which) => {
    const closing = open === which;
    setOpen(closing ? null : which);
    // Closing a panel hands the keyboard back to the story, so Enter continues it.
    if (closing) document.querySelector('.dialogue-text')?.focus();
  };
  return (
    <div className="scene-corner">
      {lines && (
        <button
          type="button"
          className="scene-icon"
          aria-label="Lines so far"
          aria-expanded={open === 'history'}
          onClick={() => toggle('history')}
        >
          <ScrollText size={18} />
        </button>
      )}
      <button
        type="button"
        className="scene-icon"
        aria-label="Scene settings"
        aria-expanded={open === 'settings'}
        onClick={() => toggle('settings')}
      >
        <Settings2 size={18} />
      </button>
      {open === 'settings' && (
        <div className="scene-menu" role="group" aria-label="Scene settings">
          <ReadingControls reading={reading} />
        </div>
      )}
      {open === 'history' && lines && (
        <div className="scene-menu scene-history" role="group" aria-label="Lines so far">
          <ol>
            {lines.map((line) => (
              <li key={line.id}>
                {line.speaker && <strong>{characterById[line.speaker].name}</strong>}
                <p>{line.speaker ? spoken(line.text) : line.text}</p>
                {line.chosen && <p className="history-choice">Your choice: {line.chosen}</p>}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
