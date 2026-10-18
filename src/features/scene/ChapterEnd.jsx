import { ArrowRight, Compass } from 'lucide-react';
import { chapters } from '../../content.mjs';
import { canAdvance, requirements } from '../../engine.mjs';
import { isLiveLike } from '../../engine/modes.mjs';

/**
 * The end of a chapter, inside the scene: its two ways forward. In the living modes, if the days
 * still hold something the story needs, it says what, and goes there instead.
 */
export function ChapterEnd({ game, act, onVisit, onExit }) {
  if (isLiveLike(game.mode) && !canAdvance(game)) {
    const todo = requirements(game).filter((r) => !r.done);
    return (
      <div
        className="scene-choice-panel scene-exits"
        role="group"
        aria-label="Before the story goes on"
      >
        <p className="scene-exits-lead">
          <Compass size={16} /> Before the story goes on
        </p>
        {todo.map((r) => (
          <button key={r.id} type="button" onClick={() => onVisit?.(r.id)}>
            {r.label}
            <ArrowRight size={15} />
          </button>
        ))}
        {!todo.length && (
          <button type="button" onClick={onExit}>
            Back to your day <ArrowRight size={15} />
          </button>
        )}
      </div>
    );
  }
  return (
    <div className="scene-choice-panel scene-exits" role="group" aria-label="What will you do?">
      <p className="scene-exits-lead">What will you do?</p>
      {chapters[game.chapter].choices.map((choice, i) => (
        <button key={i} type="button" onClick={() => act({ type: 'chapter', choice: i })}>
          {choice[0]}
          <ArrowRight size={15} />
        </button>
      ))}
    </div>
  );
}
