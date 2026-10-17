import { useState } from 'react';
import { BookOpen, ScrollText, Settings2, Theater } from 'lucide-react';
import { characterById } from '../../content.mjs';
import { spoken } from '../../scene-beats.mjs';
import { ReadingControls } from '../../dialogue-presentation.jsx';

/**
 * The scene's quiet corner controls: the lines so far, and a gear for reading settings and for
 * switching between playing the scene and reading it as a page.
 */
export function SceneMenu({ reading, lines = null, view = 'play', onSwitchView }) {
  const [open, setOpen] = useState(null);
  const toggle = (which) => setOpen(open === which ? null : which);
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
          <button type="button" className="scene-switch" onClick={onSwitchView}>
            {view === 'play' ? <BookOpen size={15} /> : <Theater size={15} />}
            {view === 'play' ? 'Read as a page' : 'Play as a scene'}
          </button>
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
