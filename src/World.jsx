import {
  ArrowRight,
  Clock,
  Eye,
  Expand,
  Feather,
  Heart,
  Leaf,
  MapPin,
  MessageCircle,
  Moon,
  Sparkles,
  Users,
  Flower2,
} from 'lucide-react';
import { art, houses, locations, locationById, spells } from './content.mjs';
import { holiday, periods, relationshipLabel, sceneArt, season } from './engine.mjs';
import { peopleHere } from './life.mjs';
import { Button, Eyebrow, Portrait } from './components.jsx';
import { DailyCard, Residents } from './daily-life.jsx';
import { HouseCrest } from './components/lamplight/HouseCrest.jsx';

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
  return (
    <>
      <div className="page-heading">
        <div>
          <Eyebrow>{season(game.date).toUpperCase()} · YOUR FIRST YEAR</Eyebrow>
          <h1>Make a little room for magic, {game.name}.</h1>
          <p>A new friendship, an old secret, or simply a very good cup of tea.</p>
        </div>
        <button className="season-label" onClick={() => navigate('calendar')}>
          <Leaf size={17} />
          {season(game.date)} at Lanternmere
        </button>
      </div>
      <div className="world-layout">
        <div className="world-main">
          <section className="scene" aria-label={location.name}>
            <img
              className="scene-background"
              src={art(sceneArt(game))}
              alt={location.description}
            />
            <div className="scene-top">
              <span>
                <MapPin size={13} />
                {location.region.toUpperCase()}
              </span>
              <button
                aria-label="View full artwork"
                className="scene-expand"
                onClick={() => open({ type: 'scene' })}
              >
                <Expand size={17} />
              </button>
            </div>
            {person && (
              <button
                className="scene-person"
                onClick={() => open({ type: 'talk', id: person.id })}
                aria-label={'Talk to ' + person.name}
              >
                <span className="scene-person-avatar">
                  <Portrait id={person.id} />
                </span>
                <span>
                  <MessageCircle size={12} /> {person.name} is here
                </span>
              </button>
            )}
            <div className="scene-caption">
              <Eyebrow>{location.subtitle}</Eyebrow>
              <h2>{location.name}</h2>
              <p>{location.description.split('. ')[0]}.</p>
            </div>
          </section>
          <div className="scene-actions">
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
          <Residents game={game} open={open} />
          <DailyCard game={game} visit={visit} open={open} />
          <div className="nearby-heading">
            <h3>A little further afield</h3>
            <button className="text-button" onClick={() => navigate('map')}>
              Explore the map <ArrowRight size={14} />
            </button>
          </div>
          <div className="nearby-grid">
            {nearby.map((l) => (
              <button className="place-card" key={l.id} onClick={() => visit(l.id)}>
                <img src={art(sceneArt(game, l.id))} alt="" loading="lazy" />
                <div>
                  <strong>{l.name}</strong>
                  <small>{l.subtitle}</small>
                </div>
                <ArrowRight size={15} />
              </button>
            ))}
          </div>
          <div className="quiet-note">
            <Feather size={18} />
            <p>
              “
              {today
                ? today.description
                : 'You don’t have to find your whole life today. Just the next small thing.'}
              ”
            </p>
            <span>{today ? today.name : 'A NOTE LEFT IN THE MARGIN'}</span>
          </div>
        </div>
        <aside className="world-aside">
          {quest}
          <section className="company-card">
            <div className="section-label">
              <Users size={16} /> {person ? 'A FAMILIAR FACE' : 'A QUIET CORNER'}
            </div>
            {person ? (
              <>
                <div className="company-person">
                  <Portrait
                    id={person.id}
                    emotion={game.bonds[person.id] > 0 ? 'warm' : 'neutral'}
                  />
                  <div>
                    <h3>{person.name}</h3>
                    <p>{person.role}</p>
                    <span>
                      <Heart size={12} />
                      {relationshipLabel(game.bonds[person.id] || 0)}
                    </span>
                  </div>
                </div>
                <button
                  className="text-button"
                  onClick={() => open({ type: 'profile', id: person.id })}
                >
                  Get to know {person.name} <ArrowRight size={14} />
                </button>
              </>
            ) : (
              <>
                <p className="quiet-room">
                  Everyone is elsewhere for now. Enjoy the stillness, or find a friend.
                </p>
                <button className="text-button" onClick={() => navigate('people')}>
                  Find a familiar face <ArrowRight size={14} />
                </button>
              </>
            )}
          </section>
          {house && (
            <section className="house-card">
              <div className="house-crest">
                <HouseCrest house={house.id} size={48} />
              </div>
              <div>
                <small>FOR {house.name.toUpperCase()}</small>
                <strong>
                  {game.points} <span>house points</span>
                </strong>
                <p>Little kindnesses add up.</p>
              </div>
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
        </aside>
      </div>
    </>
  );
}
