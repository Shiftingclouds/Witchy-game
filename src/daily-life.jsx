import { isLiveLike } from './engine/modes.mjs';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  Heart,
  MapPin,
  MessageCircle,
  Users,
} from 'lucide-react';
import { art, characterById, locationById } from './content.mjs';
import { periods, relationshipLabel, sceneArt } from './engine.mjs';
import { characterLocation, eventForDay, eventById, peopleHere, routineFor } from './life.mjs';
import { Button, Eyebrow, Modal, Portrait } from './components.jsx';

export function Residents({ game, open }) {
  const here = peopleHere(game);
  // People invented in the Open World have no portrait; they appear by name where they usually are.
  const invented = (game.ai?.people || []).filter((p) => p.home === game.location);
  return (
    <section className="residents" aria-label="People here now">
      <div className="section-label">
        <Users size={15} /> HERE THIS {periods[game.period].toUpperCase()}
      </div>
      {here.length ? (
        <div className="resident-list">
          {here.map((c) => (
            <button
              key={c.id}
              onClick={() => open({ type: 'talk', id: c.id })}
              aria-label={`Talk to ${c.name}`}
            >
              <Portrait id={c.id} />
              <span>{c.name}</span>
              <MessageCircle size={12} />
            </button>
          ))}
        </div>
      ) : null}
      {invented.length > 0 && (
        <div className="resident-list invented">
          {invented.map((p) => (
            <span key={p.id} className="invented-person" title={p.description}>
              <strong>{p.name}</strong> <small>{p.role}</small>
            </span>
          ))}
        </div>
      )}
      {!here.length && !invented.length && (
        <p>
          A quiet moment to yourself. People move between lessons, the village, and their common
          rooms as the day turns.
        </p>
      )}
    </section>
  );
}

export function DailyCard({ game, visit, open }) {
  const event = eventForDay(game);
  if (!event) return null;
  const completed = game.daily.event?.id === event.id;
  const host = characterById[event.host];
  return (
    <section
      className={'daily-card ' + (completed ? 'complete' : '')}
      aria-label="Today at Lanternmere"
    >
      <div className="daily-host">
        <Portrait id={host.id} emotion="warm" />
      </div>
      <div className="daily-copy">
        <Eyebrow>
          <CalendarDays size={13} />
          {event.month ? 'A FESTIVAL DAY' : 'TODAY AT LANTERNMERE'}
        </Eyebrow>
        <h3>{event.title}</h3>
        <p>{completed ? event.choices[game.daily.event.choice].outcome : event.intro}</p>
        <div className="daily-meta">
          <span>
            <MapPin size={12} />
            {locationById[event.location].name}
          </span>
          <span>With {host.name}</span>
        </div>
        {completed ? (
          <span className="daily-complete">
            <CheckCircle2 size={14} /> A little memory made today
          </span>
        ) : (
          <Button
            onClick={() =>
              game.location === event.location
                ? open({ type: 'event', id: event.id })
                : visit(event.location)
            }
          >
            {game.location === event.location
              ? 'Take part'
              : 'Go to ' + locationById[event.location].name}
            <ArrowRight size={14} />
          </Button>
        )}
      </div>
    </section>
  );
}

export function Gathering({ id, game, act, onClose }) {
  const event = eventById[id];
  if (!event) return null;
  const valid =
    eventForDay(game)?.id === id && game.location === event.location && !game.daily.event;
  return (
    <Modal title={event.title} wide onClose={onClose}>
      <div className="gathering-layout">
        <div className="gathering-art">
          <img src={art(sceneArt(game, event.location))} alt={locationById[event.location].name} />
          <Portrait id={event.host} emotion="warm" />
        </div>
        <div className="gathering-page">
          <Eyebrow>{event.month ? 'A FESTIVAL TRADITION' : 'AN ORDINARY LITTLE ADVENTURE'}</Eyebrow>
          <h3>A moment with {characterById[event.host].name}</h3>
          <p>{event.intro}</p>
          {valid ? (
            <>
              <small>Choose how to help. Both choices make a difference.</small>
              <div className="gathering-choices">
                {event.choices.map((choice, i) => (
                  <button
                    key={choice.label}
                    onClick={() => {
                      act({ type: 'event', id, choice: i });
                      onClose();
                    }}
                  >
                    <div>
                      {choice.label}
                      <small>
                        +{choice.bond} friendship · +{choice.points} house points
                      </small>
                    </div>
                    <ArrowRight size={15} />
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p>
              This gathering is finished or the day has moved on. Tomorrow will bring another small
              adventure.
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}

export function CharacterProfile({ id, game, visit, open, onClose }) {
  const c = characterById[id],
    where = characterLocation(game, id),
    routine = routineFor(game, id),
    event = eventForDay(game);
  return (
    <Modal title={`Getting to know ${c.name}`} wide onClose={onClose}>
      <div className="profile-layout">
        <div className="profile-art">
          <Portrait id={id} emotion={game.bonds[id] > 0 ? 'warm' : 'neutral'} />
          <span>{c.role}</span>
        </div>
        <div className="profile-copy">
          <Eyebrow>A FAMILIAR FACE</Eyebrow>
          <h3>{c.name}</h3>
          <p>{c.bio}</p>
          <div className="profile-friendship">
            <Heart size={16} />
            <strong>{relationshipLabel(game.bonds[id] || 0)}</strong>
            <span>{game.bonds[id] || 0}/100</span>
          </div>
          <div className="friendship-meter">
            <i style={{ width: (game.bonds[id] || 0) + '%' }} />
          </div>
          {isLiveLike(game.mode) ? (
            <>
              <div className="routine-heading">
                <Clock size={14} /> Where to find them today
              </div>
              <ol className="routine-list">
                {routine.map((place, i) => (
                  <li key={i} className={i === game.period ? 'now' : ''}>
                    <span>{periods[i]}</span>
                    <strong>{locationById[place].name}</strong>
                    {i === game.period && <small>NOW</small>}
                  </li>
                ))}
              </ol>
              {event?.host === id && (
                <p className="routine-note">Hosting today’s gathering: {event.title}.</p>
              )}
              <Button
                className="primary"
                onClick={() => {
                  visit(where);
                  onClose();
                }}
              >
                Join {c.name} at {locationById[where].name}
                <ArrowRight size={15} />
              </Button>
              <small className="profile-tip">
                The People page always shows their current whereabouts. Schedules follow game time,
                not your device clock.
              </small>
            </>
          ) : (
            <Button onClick={() => open({ type: 'talk', id })}>
              Have a conversation <MessageCircle size={15} />
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
