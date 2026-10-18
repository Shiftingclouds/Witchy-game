import { createContext, useContext, useState } from 'react';
import { Eye, Flame, MessageCircle, Settings, Sparkles, Leaf } from 'lucide-react';
import * as F from './fixtures.mjs';
import { Motes, Sparkle, Vine } from './ornaments.jsx';
import { GestureSketch, LanternSketch, MarginNote, Moons, PressedLeaf } from './marginalia.jsx';

// True inside the synthesized version F (marginalia, glow, darker parchment).
const Fx = createContext(false);
import './variantC.css';
import './variantF.css';
import './variantF3.css';

const RIBBONS = [
  ['day', 'Today', '#7d2a2a'],
  ['map', 'Map', '#3f5a3a'],
  ['story', 'Story', '#2f4660'],
  ['people', 'People', '#8a5a1e'],
  ['grimoire', 'Spells', '#5a3566'],
  ['calendar', 'Calendar', '#6e3a1f'],
  ['journal', 'Journal', '#3c4a2a'],
];
const SPELL_ICON = { kindle: Flame, echo: Eye };

function Drop({ children }) {
  const [first, ...rest] = children;
  return (
    <p className="vc-drop">
      <span className="vc-initial">
        {first}
        <svg viewBox="0 0 80 80" aria-hidden="true">
          <rect x="2" y="2" width="76" height="76" className="box" />
          <path d="M8 70 C 20 60, 14 44, 26 36 S 40 20, 60 12" className="curl" />
          <path
            d="M60 12 q 8 -2 10 4 q -6 4 -10 -4z M26 36 q -8 -4 -6 -10 q 6 2 6 10z M44 22 q 4 -8 10 -6 q -2 6 -10 6z"
            className="leaf"
          />
        </svg>
      </span>
      {rest.join('')}
    </p>
  );
}

function Spread({ left, right, folio }) {
  return (
    <div className="vc-spread">
      <div className="vc-page left">
        <div className="vc-running">
          <em>Lanternmere</em>
        </div>
        <Vine length={560} className="vc-margin-vine left" />
        {left}
        <span className="vc-folio">{folio}</span>
      </div>
      <div className="vc-gutter" />
      <div className="vc-page right">
        <div className="vc-running r">
          <em>The Quiet Arts</em>
        </div>
        <Vine length={560} className="vc-margin-vine right" flip />
        {right}
        <span className="vc-folio">{folio + 1}</span>
      </div>
    </div>
  );
}

function Day() {
  const f = useContext(Fx);
  return (
    <Spread
      folio={42}
      left={
        <figure className="vc-plate">
          <div className="vc-plate-frame">
            <img src={F.place.art} alt="" />
          </div>
          <figcaption>
            <span className="rubric">Plate iv.</span> {F.place.name}, at evening
          </figcaption>
        </figure>
      }
      right={
        <div className="vc-entry">
          <h1>{F.day.weekday}, the fourteenth of October</h1>
          <Drop>
            {
              'Good evening, Avery. The lanterns of the hall are lit and supper is nearly done. Someone has saved you a seat near the window, where the lake shows through the glass.'
            }
          </Drop>
          <h2>
            <span className="rubric">Present</span> in the hall
          </h2>
          <div className="vc-present">
            {F.peopleHere.map((p) => (
              <button key={p.id} className="vc-vignette">
                <img src={p.portrait} alt="" />
                <span>{p.name}</span>
              </button>
            ))}
          </div>
          <h2>
            <span className="rubric">Tonight’s</span> errand
          </h2>
          <p className="vc-errand">
            <em>{F.story.title}.</em> {F.story.goal}
          </p>
          <div className="vc-acts">
            <button className="vc-ink">
              <Eye size={16} /> Look around
            </button>
            <button className="vc-ink">
              <MessageCircle size={16} /> Speak with Rowan
            </button>
          </div>
          {f && (
            <div className="mg-row">
              <MarginNote arrow tilt={-3}>
                Rowan is the one by the window. He waved, then pretended he hadn’t.
              </MarginNote>
              <LanternSketch />
            </div>
          )}
        </div>
      }
    />
  );
}

function Journal() {
  const f = useContext(Fx);
  return (
    <Spread
      folio={12}
      left={
        <div className="vc-entry">
          <h1>Of the year, in moments</h1>
          {F.journal.slice(0, 3).map((e, i) => (
            <p key={i} className="vc-log">
              <span className="rubric sc">{e.date}.</span> {e.text}
            </p>
          ))}
          {f && (
            <div className="mg-row">
              <PressedLeaf />
              <MarginNote tilt={-4}>
                Pressed this one on the walk back from the Mere. It was the reddest on the path.
              </MarginNote>
            </div>
          )}
        </div>
      }
      right={
        <div className="vc-entry">
          {F.journal.slice(3).map((e, i) => (
            <p key={i} className="vc-log">
              <span className="rubric sc">{e.date}.</span> {e.text}
            </p>
          ))}
          <h2>
            <span className="rubric">Notes</span> to self
          </h2>
          <textarea className="vc-ruled" defaultValue={F.notes} aria-label="Your notes" />
        </div>
      }
    />
  );
}

function Calendar() {
  const f = useContext(Fx);
  const cells = [
    ...Array(F.october.startsOn).fill(null),
    ...Array.from({ length: F.october.days }, (_, i) => i + 1),
  ];
  return (
    <Spread
      folio={60}
      left={
        <div className="vc-entry">
          <h1>The month of October</h1>
          <div className="vc-month">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <span key={i} className="wd">
                {d}
              </span>
            ))}
            {cells.map((d, i) => {
              const m = d && F.calendarMarks[d];
              return (
                <span
                  key={i}
                  className={`d ${m?.kind || ''} ${d && d < F.october.today ? 'past' : ''}`}
                >
                  {d || ''}
                </span>
              );
            })}
          </div>
          <p className="vc-key">
            <span className="d today">14</span> today · <span className="d event">16</span>{' '}
            something to do · <span className="d festival">31</span> a feast
          </p>
          {f && (
            <>
              <h2>
                <span className="rubric">The moon</span> over the Mere
              </h2>
              <Moons />
              <MarginNote tilt={-2}>
                Full moon the week before Emberfall. Tully says the fish come up to look at it.
              </MarginNote>
            </>
          )}
        </div>
      }
      right={
        <div className="vc-entry">
          <h1>Feasts &amp; observances</h1>
          {Object.entries(F.calendarMarks)
            .filter(([, m]) => m.kind !== 'today')
            .map(([d, m]) => (
              <div key={d} className={`vc-obs ${m.kind}`}>
                <span className="num">{d}</span>
                <div>
                  <strong>{m.title}</strong>
                  <em>{m.text || m.place}</em>
                </div>
                {m.kind === 'festival' && <Sparkle size={14} />}
              </div>
            ))}
          {f && (
            <div className="mg-row">
              <MarginNote arrow tilt={2}>
                Find something to leave for Rowan before the thirty-first. Something small, but
                true.
              </MarginNote>
              <PressedLeaf className="small" />
            </div>
          )}
        </div>
      }
    />
  );
}

function Grimoire() {
  const f = useContext(Fx);
  const [a, b] = F.learned;
  const spell = (s) => {
    const Icon = SPELL_ICON[s.id] || Sparkles;
    return (
      <div className="vc-entry vc-spell">
        <div className="vc-sigil">
          <svg viewBox="0 0 120 120" aria-hidden="true">
            <circle cx="60" cy="60" r="54" />
            <circle cx="60" cy="60" r="46" className="thin" />
            {Array.from({ length: 12 }, (_, i) => (
              <line key={i} x1="60" y1="8" x2="60" y2="16" transform={`rotate(${i * 30} 60 60)`} />
            ))}
          </svg>
          <Icon size={38} strokeWidth={1.2} />
        </div>
        <h1>{s.name}</h1>
        <p className="vc-school">{s.school}</p>
        <Drop>{s.description + ' ' + s.explanation}</Drop>
        <p>
          <span className="rubric">Gesture.</span> {s.gesture}
        </p>
        {f && (
          <>
            <GestureSketch kind={s.id === 'kindle' ? 'circle' : 'fingers'} />
            <p className="vc-question">
              <span className="rubric">Asked in class.</span> {s.question}
            </p>
          </>
        )}
      </div>
    );
  };
  return (
    <Spread
      folio={88}
      left={spell(a)}
      right={
        <>
          {spell(b)}
          <p className="vc-blank">
            {F.blankPages} leaf{F.blankPages === 1 ? '' : 'ves'} still blank, waiting for a lesson.
          </p>
        </>
      }
    />
  );
}

function People() {
  const f = useContext(Fx);
  const card = (p) => (
    <button key={p.id} className="vc-portrait">
      <span className="oval">
        <img src={p.portrait} alt="" />
      </span>
      <strong>{p.name}</strong>
      <em>{p.role}</em>
      <span className="leaves" aria-label={`Friendship ${p.bond} of 10`}>
        {Array.from({ length: 10 }, (_, i) => (
          <Leaf key={i} size={10} className={i < p.bond ? 'on' : ''} />
        ))}
      </span>
    </button>
  );
  return (
    <Spread
      folio={24}
      left={
        <div className="vc-entry">
          <h1>Of the people I know</h1>
          <div className="vc-gallery">{F.met.slice(0, 3).map(card)}</div>
        </div>
      }
      right={
        <div className="vc-entry">
          <div className="vc-gallery top">{F.met.slice(3).map(card)}</div>
          {f && (
            <MarginNote arrow tilt={-2}>
              Tully says the swans on the Mere know everyone’s name. Ask him how.
            </MarginNote>
          )}
        </div>
      }
    />
  );
}

function MapPage() {
  return (
    <div className="vc-spread map">
      <div className="vc-mapplate">
        <img src={F.mapArt} alt="Map of Lanternmere" />
        <span className="vc-pin">
          <Sparkle size={12} /> you are here
        </span>
      </div>
      <div className="vc-gutter" />
    </div>
  );
}

function Story() {
  const f = useContext(Fx);
  const titles = [
    'A place at the table',
    'The smallest flame',
    'Notes in the margins',
    'A lantern for the lost',
    'The lake remembers',
    'An open circle',
    'The light we carry',
    'A home made of light',
  ];
  return (
    <Spread
      folio={2}
      left={
        <div className="vc-entry">
          <h1>Contents</h1>
          <ol className="vc-toc">
            {titles.map((t, i) => (
              <li key={t} className={i === 0 ? 'done' : i === 1 ? 'now' : ''}>
                <span className="rubric">
                  {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][i]}.
                </span>
                <span className="t">{t}</span>
                <span className="dots" />
                <span className="pg">{i * 14 + 3}</span>
              </li>
            ))}
          </ol>
        </div>
      }
      right={
        <div className="vc-entry">
          <h1>Chapter the second</h1>
          <Drop>{`${F.story.title}. ${F.story.goal} The classroom door is kept unlocked in the evenings for those who want to practise.`}</Drop>
          <button className="vc-ink">Open the storybook</button>
          {f && (
            <div className="mg-row">
              <LanternSketch />
              <MarginNote tilt={-3}>
                The lantern in the cloisters was lit again tonight. Nobody admits to lighting it.
              </MarginNote>
            </div>
          )}
        </div>
      }
    />
  );
}

const PAGES = {
  day: Day,
  journal: Journal,
  calendar: Calendar,
  grimoire: Grimoire,
  people: People,
  map: MapPage,
  story: Story,
};

// `f`: the synthesized version — rose buttons, arched windows, lighter settings, gold desk vines.
export default function VariantC({ f = false }) {
  const [page, setPage] = useState('day');
  const Page = PAGES[page];
  return (
    <div className={`vc ${f ? 'vf' : ''}`}>
      <div className="vc-desk-light" />
      {f && (
        <>
          <div className="vf-candle" />
          <Motes count={28} className="vf-motes" />
          <Vine length={960} className="vf-desk-vine left" />
          <Vine length={960} className="vf-desk-vine right" flip />
        </>
      )}
      <header className="vc-desk-top">
        <span>
          <Flame size={16} /> Lanternmere
        </span>
        <span className="when">
          {F.day.date} · {F.day.period}
        </span>
        <button aria-label="Settings">
          <Settings size={17} />
        </button>
      </header>
      <div className="vc-book">
        <div className="vc-pages" key={page}>
          <Fx.Provider value={f}>
            <Page />
          </Fx.Provider>
        </div>
        <nav className="vc-ribbons" aria-label="Sections">
          {RIBBONS.map(([id, label, color]) => (
            <button
              key={id}
              style={{ '--ribbon': color }}
              className={page === id ? 'on' : ''}
              onClick={() => setPage(id)}
              aria-current={page === id ? 'page' : undefined}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>
      <img className="vc-cat" src={F.art('fam-cat')} alt="Your cat, keeping you company" />
    </div>
  );
}
