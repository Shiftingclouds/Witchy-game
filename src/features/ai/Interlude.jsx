import { useState } from 'react';
import { AiScene } from './AiScene.jsx';
import { VineButton } from '../opening/VineButton.jsx';

/**
 * A small moment between authored sections of the Guided Tale. Collapsed by default so the authored
 * story keeps its flow; "Continue the story" always folds it away again.
 */
export function Interlude({ game, act, reduced, sectionId, sceneText }) {
  const moments = (game.ai?.turns || []).filter((t) => t.section === sectionId);
  const [open, setOpen] = useState(false);
  return (
    <aside className="interlude" aria-label="A moment between scenes">
      {open ? (
        <>
          <AiScene
            game={game}
            act={act}
            reduced={reduced}
            focus={{ sectionId, sceneText }}
            filter={(t) => t.section === sectionId}
            turnsShown={6}
          />
          <button className="text-button interlude-continue" onClick={() => setOpen(false)}>
            Continue the story
          </button>
        </>
      ) : (
        <div className="interlude-invite">
          {moments.length > 0 && (
            <p className="interlude-recall">
              You lingered here:{' '}
              {moments.at(-1).beats.find((b) => !b.speaker)?.text || moments.at(-1).player}
            </p>
          )}
          <VineButton
            title="Linger here a while"
            subline={
              moments.length ? 'Return to this moment' : 'A small moment before the story moves on'
            }
            onClick={() => setOpen(true)}
          />
        </div>
      )}
    </aside>
  );
}
