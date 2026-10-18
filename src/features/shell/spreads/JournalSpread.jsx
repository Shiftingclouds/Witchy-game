import './spreads.css';
import { CheckCircle2, Download, MapPin } from 'lucide-react';
import { locationById } from '../../../content.mjs';
import { dateLabel } from '../../../engine.mjs';
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
      <section className="discoveries">
        <h2 className="gm-sub">
          <span className="gm-rubric">Little</span> discoveries
        </h2>
        <p>
          {game.visited.length} {game.visited.length === 1 ? 'place' : 'places'} visited ·{' '}
          {game.clues.length} {game.clues.length === 1 ? 'clue' : 'clues'} gathered
        </p>
        <ul className="gm-visited">
          {game.visited.map((id) => (
            <li key={id}>
              <MapPin size={13} />
              {locationById[id]?.name}
            </li>
          ))}
        </ul>
        {game.clues.map((c) => (
          <span key={c}>
            <CheckCircle2 size={13} />
            {CLUES[c]}
          </span>
        ))}
      </section>
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
      <button className="text-button gm-export" onClick={() => downloadSave(game)}>
        <Download size={14} /> Export your save
      </button>
    </>
  );
  return (
    <Spread className="gm-journal" folio={74} title="Notes & Moments" left={left} right={right} />
  );
}
