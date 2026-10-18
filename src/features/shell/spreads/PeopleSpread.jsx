import './spreads.css';
import { useState } from 'react';
import { Heart, MapPin, Search, Leaf } from 'lucide-react';
import { characters, locationById } from '../../../content.mjs';
import { relationshipLabel } from '../../../engine.mjs';
import { metCharacters } from '../../../engine/selectors.mjs';
import { characterLocation } from '../../../life.mjs';
import { Portrait } from '../../../components.jsx';
import { MarginNote } from '../../../components/lamplight/marginalia.jsx';
import { Spread } from '../Grimoire.jsx';

function PersonEntry({ c, game, live, open }) {
  const bond = game.bonds[c.id] || 0;
  return (
    <button
      className={'person-card gm-person ' + (c.index <= 3 ? 'companion' : '')}
      onClick={() => open({ type: 'profile', id: c.id })}
    >
      <span className="gm-arch person-portrait">
        <Portrait id={c.id} emotion={bond > 0 ? 'warm' : 'neutral'} />
      </span>
      <span className="person-info">
        {c.index <= 3 && <span className="gm-mark">YOUR STORY</span>}
        <h2>{c.name}</h2>
        <p>{c.role}</p>
        <span className="gm-leaves" aria-hidden="true">
          {Array.from({ length: 10 }, (_, i) => (
            <Leaf key={i} size={11} className={i < Math.round(bond / 10) ? 'on' : ''} />
          ))}
        </span>
        {live && (
          <span className="person-where">
            <MapPin size={12} />
            {locationById[characterLocation(game, c.id)].name}
          </span>
        )}
        <small title={`Friendship ${bond} of 100`}>
          <Heart size={12} />
          {bond ? relationshipLabel(bond) : 'A new face'}
        </small>
      </span>
    </button>
  );
}

/** People you have met, in arched windows across the spread. Nobody appears before you meet them. */
export function PeopleSpread({ game, open, live }) {
  const [query, setQuery] = useState(''),
    [onlyFriends, setOnlyFriends] = useState(false);
  const met = metCharacters(game);
  const known = characters.filter((c) => met.has(c.id));
  const shown = known.filter(
    (c) => c.name.toLowerCase().includes(query.toLowerCase()) && (!onlyFriends || game.bonds[c.id]),
  );
  // The left page also carries the heading and filters, so it takes the smaller half.
  const half = Math.floor(shown.length / 2);
  const entry = (c) => <PersonEntry key={c.id} c={c} game={game} live={live} open={open} />;
  const left = (
    <>
      <h1>A world of familiar faces</h1>
      <div className="filter-bar">
        <div className="tabs">
          <button className={!onlyFriends ? 'active' : ''} onClick={() => setOnlyFriends(false)}>
            People you’ve met · {known.length}
          </button>
          <button className={onlyFriends ? 'active' : ''} onClick={() => setOnlyFriends(true)}>
            Friends
          </button>
        </div>
        <label className="search">
          <Search size={15} />
          <input
            aria-label="Find a person"
            placeholder="Find a familiar face…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>
      <div className="people-grid">{shown.slice(0, half).map(entry)}</div>
      {!shown.length && (
        <p className="empty-state">
          A friendship is waiting to begin. Say hello to someone in the academy.
        </p>
      )}
    </>
  );
  const right = (
    <>
      <div className="people-grid">{shown.slice(half).map(entry)}</div>
      <MarginNote arrow tilt={-2}>
        Some friendships begin with a grand adventure. Most begin with hello.
      </MarginNote>
    </>
  );
  return (
    <Spread className="gm-people" folio={38} title="Familiar Faces" left={left} right={right} />
  );
}
