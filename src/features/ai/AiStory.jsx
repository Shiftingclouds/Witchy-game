import { useState } from 'react';
import { Feather, Hourglass } from 'lucide-react';
import { Button, Eyebrow, Modal } from '../../components.jsx';
import { MYSTERY_STAGES } from '../../ai/world/mystery.mjs';
import { chapters } from '../../content.mjs';
import './ai.css';

/** The Open World's own story page: what has happened in this life, kept by the storyteller. */
export function AiStory({ game, act }) {
  const [asking, setAsking] = useState(false);
  const ai = game.ai;
  const open = ai.threads.filter((t) => t.status === 'open');
  const resolved = ai.threads.filter((t) => t.status === 'resolved');
  const discovered = MYSTERY_STAGES.filter((s) => s.chapter <= game.chapter);
  return (
    <>
      <div className="page-heading">
        <div>
          <Eyebrow>
            THE OPEN WORLD · {ai.timeMode === 'timed' ? 'TIME IS MOVING' : 'TIMELESS'}
          </Eyebrow>
          <h1>Your story, as it has happened.</h1>
          <p>Kept by the storyteller from everything you have done here.</p>
        </div>
      </div>
      <div className="ai-story">
        <section aria-labelledby="chronicle-title">
          <h2 id="chronicle-title">
            <Feather size={18} /> The chronicle
          </h2>
          {ai.turns.length > 0 && (
            <>
              <h3 className="ai-story-sub">Lately</h3>
              <ol>
                {[...ai.turns]
                  .reverse()
                  .slice(0, 6)
                  .map((t) => (
                    <li key={'t' + t.id}>
                      {t.player}
                      <small>{t.beats.find((b) => !b.speaker)?.text || t.beats[0]?.text}</small>
                    </li>
                  ))}
              </ol>
              {(ai.chronicle.length > 0 || ai.events.length > 0) && (
                <h3 className="ai-story-sub">Before that</h3>
              )}
            </>
          )}
          {ai.chronicle.length || ai.events.length ? (
            <ol>
              {[...ai.chronicle].reverse().map((c) => (
                <li key={'c' + c.id}>
                  {c.text}
                  <small>{c.date}</small>
                </li>
              ))}
              {ai.events
                .filter((e) => e.importance >= 2)
                .reverse()
                .slice(0, 12)
                .map((e) => (
                  <li key={e.id}>
                    {e.summary}
                    <small>{e.date}</small>
                  </li>
                ))}
            </ol>
          ) : (
            !ai.turns.length && <p>Nothing written yet. Go and live a little.</p>
          )}
        </section>
        <div className="ai-story-side">
          <section aria-labelledby="threads-title">
            <h2 id="threads-title">Threads</h2>
            {open.length || resolved.length ? (
              <ul>
                {open.map((t) => (
                  <li key={t.id}>
                    {t.title}
                    {t.notes.at(-1) && <small>{t.notes.at(-1)}</small>}
                  </li>
                ))}
                {resolved.map((t) => (
                  <li key={t.id} className="resolved">
                    {t.title}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No promises or mysteries in hand yet.</p>
            )}
          </section>
          <section aria-labelledby="mystery-title">
            <h2 id="mystery-title">What you have uncovered</h2>
            <ul>
              {discovered.map((s) => (
                <li key={s.chapter}>
                  <strong>{chapters[s.chapter].kicker}</strong>
                  <small>{s.revelation}</small>
                </li>
              ))}
            </ul>
          </section>
          {ai.timeMode === 'timeless' && (
            <section className="ai-time" aria-labelledby="time-title">
              <h2 id="time-title">
                <Hourglass size={18} /> Time
              </h2>
              <p>The year waits for you. You can let it begin to move whenever you like.</p>
              <Button onClick={() => setAsking(true)}>Let the year begin to move</Button>
            </section>
          )}
        </div>
      </div>
      {asking && (
        <Modal title="Let the year begin to move?" onClose={() => setAsking(false)}>
          <p>
            From now on the year moves on with the calendar, and the mystery with it, towards
            midsummer. This can’t be undone.
          </p>
          <div className="button-row">
            <Button
              className="primary"
              onClick={() => {
                act({ type: 'ai-time-mode', mode: 'timed' });
                setAsking(false);
              }}
            >
              Let time move
            </Button>
            <Button onClick={() => setAsking(false)}>Keep time still</Button>
          </div>
        </Modal>
      )}
    </>
  );
}

/** Side card on Your day in the Open World: the threads you are carrying. */
export function ThreadsCard({ game, navigate }) {
  const open = game.ai.threads.filter((t) => t.status === 'open').slice(-4);
  return (
    <aside className="quest-card">
      <Eyebrow>THREADS YOU ARE CARRYING</Eyebrow>
      {open.length ? (
        <ul className="task-list">
          {open.map((t) => (
            <li key={t.id}>{t.title}</li>
          ))}
        </ul>
      ) : (
        <p>Nothing pressing. The day is yours.</p>
      )}
      <button className="text-button" onClick={() => navigate('book')}>
        Your story so far
      </button>
    </aside>
  );
}
