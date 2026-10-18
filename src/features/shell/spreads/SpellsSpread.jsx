import './spreads.css';
import { CheckCircle2, Eye, Flame, GraduationCap, Shield } from 'lucide-react';
import { locationById, spells } from '../../../content.mjs';
import { Button } from '../../../components.jsx';
import { GestureSketch, MarginNote } from '../../../components/lamplight/marginalia.jsx';
import { DropCap, Spread } from '../Grimoire.jsx';

const ICON = { kindle: Flame, echo: Eye, thread: Shield };
// Gesture diagrams exist for these spells; a spell without one shows none.
const GESTURE = { kindle: 'circle', echo: 'fingers' };

function SpellEntry({ spell, game, live, act }) {
  const Icon = ICON[spell.id] || Flame;
  return (
    <section className="spell-card learned gm-spell">
      <div className="gm-sigil" aria-hidden="true">
        <svg viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" />
          <circle cx="60" cy="60" r="46" className="thin" />
          {Array.from({ length: 12 }, (_, i) => (
            <line key={i} x1="60" y1="8" x2="60" y2="16" transform={`rotate(${i * 30} 60 60)`} />
          ))}
        </svg>
        <Icon size={36} strokeWidth={1.2} />
      </div>
      <h2>{spell.name}</h2>
      <p className="gm-school">{spell.school}</p>
      <p>{spell.description}</p>
      <p className="spell-gesture">
        <span className="gm-rubric">Gesture.</span> {spell.gesture}
      </p>
      {GESTURE[spell.id] && <GestureSketch kind={GESTURE[spell.id]} />}
      <p className="gm-question">
        <span className="gm-rubric">Asked in class.</span> {spell.question}
      </p>
      <span className="learned-label">
        <CheckCircle2 size={14} /> In your grimoire
      </span>
      {live && (
        <Button onClick={() => act({ type: 'cast', id: spell.id })}>
          Cast at {locationById[game.location].name}
        </Button>
      )}
    </section>
  );
}

/** A leaf still blank: a faint ring where a sigil will go, and where its lesson is taught. */
function BlankLeaf({ spell }) {
  const room = locationById[spell.location].name;
  return (
    <div className="gm-blank-leaf">
      <div className="gm-sigil faint" aria-hidden="true">
        <svg viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" className="thin" />
          <circle cx="60" cy="60" r="40" className="thin" />
        </svg>
      </div>
      <p>
        <span className="gm-school">{spell.school}</span>
        <br />
        <em>Taught in {room.startsWith('The ') ? 'the ' + room.slice(4) : 'the ' + room}</em>
      </p>
    </div>
  );
}

/** The grimoire: learned spells only, one to a page; the rest are blank leaves. */
export function SpellsSpread({ game, act, visit, open, live }) {
  const learned = spells.filter((s) => game.spells.includes(s.id));
  const blank = spells.length - learned.length;
  const next = spells.find((s) => !game.spells.includes(s.id));
  const [first, ...rest] = learned;
  const left = (
    <>
      <h1>A little book of practical magic</h1>
      <DropCap>
        Not every spell has to change the world. Some just make it warmer. Learn a spell in its
        classroom, then carry it into the world. Your knowledge stays with you.
      </DropCap>
      <p className="gm-count">
        {learned.length === 0
          ? 'No spells learned yet'
          : learned.length === 1
            ? 'One spell learned'
            : `${learned.length} spells learned`}
      </p>
      {first && <SpellEntry spell={first} game={game} live={live} act={act} />}
      {!first && next && (
        <figure className="gm-first-lesson">
          {GESTURE[next.id] && <GestureSketch kind={GESTURE[next.id]} />}
          <MarginNote tilt={-2}>
            {next.school}, the first lesson. {next.gesture}
          </MarginNote>
        </figure>
      )}
    </>
  );
  const right = (
    <>
      {rest.map((s) => (
        <SpellEntry key={s.id} spell={s} game={game} live={live} act={act} />
      ))}
      {blank > 0 && (
        <div className="gm-blank">
          <div className="gm-blank-leaves">
            {spells
              .filter((s) => !game.spells.includes(s.id))
              .map((s) => (
                <BlankLeaf key={s.id} spell={s} />
              ))}
          </div>
          <p className="grimoire-empty">
            {learned.length
              ? `${blank} ${blank === 1 ? 'leaf is' : 'leaves are'} still blank, waiting for a lesson.`
              : 'The pages are still blank. Spells are learned in class; each one you master will be written here.'}
          </p>
          {live && next && (
            <Button
              icon={GraduationCap}
              onClick={() =>
                game.location === next.location
                  ? open({ type: 'lesson', id: next.id })
                  : visit(next.location)
              }
            >
              {game.location === next.location
                ? 'Begin the lesson'
                : 'Visit ' + locationById[next.location].name}
            </Button>
          )}
        </div>
      )}
    </>
  );
  return (
    <Spread className="gm-spells" folio={50} title="Practical Magic" left={left} right={right} />
  );
}
