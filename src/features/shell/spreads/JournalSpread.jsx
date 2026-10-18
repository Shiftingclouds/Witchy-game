import './spreads.css';
import { CheckCircle2, Download } from 'lucide-react';
import { dateLabel } from '../../../engine.mjs';
import { Button } from '../../../components.jsx';
import { downloadSave } from '../../../storage/saves.mjs';
import { MarginNote, PressedLeaf } from '../../../components/lamplight/marginalia.jsx';
import { Spread } from '../Grimoire.jsx';

const CLUES = {
  archive: 'The old register',
  flower: 'A moonflower petal',
  lake: 'The lake’s memory',
  stones: 'The first keepers’ circle',
  restored: 'The Heartfire, renewed',
};

function Entry({ entry }) {
  return (
    <article className="gm-entry">
      <time className="gm-rubric">{dateLabel(entry.date)}.</time> {entry.text}
    </article>
  );
}

/** The journal as a spread: the year in moments across both pages, then notes to self. */
export function JournalSpread({ game, act }) {
  const entries = [...game.journal].reverse();
  const half = Math.ceil(entries.length / 2);
  const left = (
    <>
      <h1>{game.name}’s journal</h1>
      {entries.length ? (
        entries.slice(0, half).map((e, i) => <Entry key={i} entry={e} />)
      ) : (
        <p className="gm-quiet">The pages are waiting for your first evening.</p>
      )}
      <div className="mg-row">
        <PressedLeaf />
        <MarginNote tilt={-3}>A place for the things you don’t want to forget.</MarginNote>
      </div>
    </>
  );
  const right = (
    <>
      {entries.slice(half).map((e, i) => (
        <Entry key={i} entry={e} />
      ))}
      <h2 className="gm-sub">
        <span className="gm-rubric">Notes</span> to self
      </h2>
      <textarea
        className="gm-ruled"
        aria-label="Personal journal notes"
        maxLength={12000}
        value={game.notes}
        onChange={(e) => act({ type: 'notes', value: e.target.value })}
        placeholder="Today I noticed…"
      />
      <p className="gm-small">Saved on this device with your story.</p>
      <section className="discoveries">
        <h2 className="gm-sub">
          <span className="gm-rubric">Little</span> discoveries
        </h2>
        <p>
          {game.visited.length} {game.visited.length === 1 ? 'place' : 'places'} visited ·{' '}
          {game.clues.length} {game.clues.length === 1 ? 'clue' : 'clues'} gathered
        </p>
        {game.clues.map((c) => (
          <span key={c}>
            <CheckCircle2 size={13} />
            {CLUES[c]}
          </span>
        ))}
      </section>
      <Button icon={Download} onClick={() => downloadSave(game)}>
        Export your save
      </Button>
    </>
  );
  return <Spread className="gm-journal" folio={12} left={left} right={right} />;
}
