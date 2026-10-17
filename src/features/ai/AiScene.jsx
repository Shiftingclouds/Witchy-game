import { useState } from 'react';
import { characterById } from '../../content.mjs';
import { Portrait, Modal, Button } from '../../components.jsx';
import { ThinkingVeil } from '../../components/lamplight/ThinkingVeil.jsx';
import { StoryInput } from '../../components/lamplight/StoryInput.jsx';
import { ERROR_COPY } from '../../ai/claude.mjs';
import { useTurn } from './useTurn.mjs';
import './ai.css';

/** Who said a line: cast with a small portrait; invented people by name, described the first time. */
function Speaker({ id, game, firstAppearance }) {
  if (characterById[id])
    return (
      <span className="ai-speaker">
        <Portrait id={id} className="ai-speaker-portrait" />
        <strong>{characterById[id].name}</strong>
      </span>
    );
  const person = game.ai?.people.find((p) => p.id === id);
  return (
    <span className="ai-speaker invented">
      <strong>{person?.name || id}</strong>
      {person && firstAppearance && <em className="ai-introduction">{person.description}</em>}
    </span>
  );
}

/**
 * The living scene for the AI modes: recent moments, suggestions, free text, a thinking veil,
 * calm errors with retry, and (Open World) the confirmation when the world asks to let time move.
 */
export function AiScene({
  game,
  act,
  mode = game.mode,
  reduced,
  focus,
  placeholder = 'What do you do?',
  turnsShown = 4,
  filter,
}) {
  const [text, setText] = useState('');
  const turn = useTurn({ game, act, mode });
  const turns = (game.ai?.turns || []).filter(filter || (() => true)).slice(-turnsShown);
  const introduced = new Set();
  const submit = async (words) => {
    const reply = await turn.send(words, { focus });
    if (reply) setText('');
  };
  return (
    <section className="ai-scene" aria-label="The scene">
      <div className="ai-transcript" aria-live="polite">
        {turns.map((t) => (
          <article key={t.id} className="ai-moment">
            {t.player && <p className="ai-player">You: {t.player}</p>}
            {t.beats.map((b, i) => {
              const line = b.speaker ? (
                <p key={i} className="ai-line">
                  <Speaker
                    id={b.speaker}
                    game={game}
                    firstAppearance={!introduced.has(b.speaker)}
                  />
                  <span>{b.text}</span>
                </p>
              ) : (
                <p key={i} className="ai-narration">
                  {b.text}
                </p>
              );
              if (b.speaker) introduced.add(b.speaker);
              return line;
            })}
          </article>
        ))}
        {!turns.length && (
          <p className="ai-empty">
            The world is listening. Write what you do, or say something, and it will answer.
          </p>
        )}
      </div>
      {turn.error && (
        <div className="ai-error" role="alert">
          <p>{ERROR_COPY[turn.error] || ERROR_COPY.failed}</p>
          <Button
            onClick={async () => {
              if (await turn.retry()) setText('');
            }}
            disabled={turn.busy}
          >
            Try again
          </Button>
        </div>
      )}
      {!turn.busy && game.ai?.turns.length > 0 && turns.length > 0 && (
        <div className="ai-suggestions">
          {(game.ai.lastSuggestions || []).map((s) => (
            <button key={s} className="text-button" onClick={() => submit(s)}>
              {s}
            </button>
          ))}
        </div>
      )}
      <StoryInput
        value={text}
        onChange={setText}
        onSubmit={submit}
        disabled={turn.busy}
        placeholder={placeholder}
      />
      <ThinkingVeil active={turn.busy} reduced={reduced} />
      {turn.busy && (
        <button className="text-button ai-stop" onClick={turn.cancel}>
          Stop
        </button>
      )}
      {mode === 'sandbox' && game.ai?.pendingTimed && (
        <Modal
          title="Let the year begin to move?"
          onClose={() => act({ type: 'ai-keep-timeless' })}
        >
          <p>
            From now on the year moves on with the calendar, and the mystery with it, towards
            midsummer. This can’t be undone.
          </p>
          <div className="button-row">
            <Button
              className="primary"
              onClick={() => act({ type: 'ai-time-mode', mode: 'timed' })}
            >
              Let time move
            </Button>
            <Button onClick={() => act({ type: 'ai-keep-timeless' })}>Keep time still</Button>
          </div>
        </Modal>
      )}
    </section>
  );
}
