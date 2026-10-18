import {
  ArrowRight,
  Clock,
  Eye,
  Expand,
  Flower2,
  Heart,
  MessageCircle,
  Moon,
  Sparkles,
} from 'lucide-react';
import { art, houses, locations, locationById, spells } from './content.mjs';
import { holiday, periods, relationshipLabel, sceneArt } from './engine.mjs';
import { peopleHere } from './life.mjs';
import { Button, Portrait } from './components.jsx';
import { DailyCard, Residents } from './daily-life.jsx';
import { HouseCrest } from './components/lamplight/HouseCrest.jsx';
import { LanternSketch, MarginNote } from './components/lamplight/marginalia.jsx';
import { DropCap, Spread } from './features/shell/Grimoire.jsx';
import { longDate } from './features/shell/long-date.mjs';

const GREETING = ['Good morning', 'Good afternoon', 'Good evening', 'Late as it is'];

/** Your day as the grimoire's Today spread: the place as a plate on the left, the day on the right. */
export default function World({ game, act, visit, navigate, open, quest, aiScene }) {
  const location = locationById[game.location],
    here = peopleHere(game),
    person = here[0];
  const lesson = spells.find((s) => s.location === game.location),
    today = holiday(game.date),
    house = houses.find((h) => h.id === game.house);
  const nearby = locations
    .filter((l) => l.region === location.region && l.id !== location.id)
    .slice(0, 4);
  const left = (
    <>
      <figure className="gm-plate">
        <section className="scene gm-arch" aria-label={location.name}>
          <img className="scene-background" src={art(sceneArt(game))} alt={location.description} />
          <button
            aria-label="View full artwork"
            className="scene-expand"
            onClick={() => open({ type: 'scene' })}
          >
            <Expand size={16} />
          </button>
        </section>
        <figcaption>
          <h2>{location.name}</h2>
          {location.subtitle}, at {periods[game.period].toLowerCase()}
        </figcaption>
      </figure>
      <Residents game={game} open={open} />
      <h2 className="gm-sub">
        <span className="gm-rubric">A little</span> further afield
      </h2>
      <ul className="gm-nearby">
        {nearby.map((l) => (
          <li key={l.id}>
            <button className="place-card" onClick={() => visit(l.id)}>
              <img src={art(sceneArt(game, l.id))} alt="" loading="lazy" />
              <span>
                <strong>{l.name}</strong>
                <small>{l.subtitle}</small>
              </span>
              <ArrowRight size={15} />
            </button>
          </li>
        ))}
      </ul>
      <button className="text-button gm-more" onClick={() => navigate('map')}>
        Explore the map <ArrowRight size={14} />
      </button>
      <div className="mg-row">
        <LanternSketch />
        <MarginNote tilt={-2}>
          {today
            ? `${today.name}. ${today.description}`
            : 'You don’t have to find your whole life today. Just the next small thing.'}
        </MarginNote>
      </div>
    </>
  );
  const right = (
    <>
      <h1>{longDate(game.date)}</h1>
      <DropCap>{`${GREETING[game.period]}, ${game.name}. ${location.description}`}</DropCap>
      <div className="scene-actions gm-actions">
        <Button icon={Eye} onClick={() => act({ type: 'inspect' })}>
          Look around
        </Button>
        {person && (
          <Button icon={MessageCircle} onClick={() => open({ type: 'talk', id: person.id })}>
            Talk to {person.name}
          </Button>
        )}
        {lesson && !game.spells.includes(lesson.id) && (
          <Button
            className="gold"
            icon={Sparkles}
            onClick={() => open({ type: 'lesson', id: lesson.id })}
          >
            Learn {lesson.name}
          </Button>
        )}
        {game.location === 'glasshouses' && (
          <Button icon={Flower2} onClick={() => act({ type: 'tend' })}>
            Tend moonflowers
          </Button>
        )}
        {game.spells.length > 0 && (
          <div className="cast-select">
            <Sparkles size={15} />
            <select
              aria-label="Cast a spell"
              value=""
              onChange={(e) => {
                if (e.target.value) act({ type: 'cast', id: e.target.value });
              }}
            >
              <option value="">Cast a spell</option>
              {spells
                .filter((s) => game.spells.includes(s.id))
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
            </select>
          </div>
        )}
      </div>
      {aiScene}
      {quest}
      <DailyCard game={game} visit={visit} open={open} />
      <section className="company-card">
        {person ? (
          <div className="company-person">
            <span className="gm-arch">
              <Portrait id={person.id} emotion={game.bonds[person.id] > 0 ? 'warm' : 'neutral'} />
            </span>
            <div>
              <h3>{person.name}</h3>
              <p>{person.role}</p>
              <span>
                <Heart size={12} />
                {relationshipLabel(game.bonds[person.id] || 0)}
              </span>
              <button
                className="text-button"
                onClick={() => open({ type: 'profile', id: person.id })}
              >
                Get to know {person.name} <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ) : (
          <p className="quiet-room">
            Everyone is elsewhere for now. Enjoy the stillness, or{' '}
            <button className="text-button" onClick={() => navigate('people')}>
              find a familiar face <ArrowRight size={14} />
            </button>
          </p>
        )}
      </section>
      {house && (
        <section className="house-card">
          <div className="house-crest">
            <HouseCrest house={house.id} size={44} />
          </div>
          <p>
            <strong>{game.points}</strong> house points for {house.name}. Little kindnesses add up.
          </p>
        </section>
      )}
      <div className="passing-time">
        <Button icon={Clock} onClick={() => act({ type: 'wait' })}>
          Wait until {periods[(game.period + 1) % 4].toLowerCase()}
        </Button>
        <Button className="rest-button" icon={Moon} onClick={() => act({ type: 'rest' })}>
          Rest until tomorrow
        </Button>
      </div>
    </>
  );
  return <Spread className="gm-today" folio={42} left={left} right={right} />;
}
