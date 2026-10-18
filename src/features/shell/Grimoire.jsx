// The game shell as an illuminated grimoire: an open book on a lamplit desk, ribbon bookmarks for
// navigation (docs/design/grimoire-reference, DESIGN_PLAN.md).
import { DoorOpen, Flame, Menu, Settings, Sun } from 'lucide-react';
import { art } from '../../content.mjs';
import { Motes, Vine } from '../../components/lamplight/ornaments.jsx';

/** Ribbon colours, one silk per section. */
const SILK = {
  world: '#7d2a2a',
  map: '#3f5a3a',
  book: '#2f4660',
  people: '#8a5a1e',
  spells: '#5a3566',
  calendar: '#6e3a1f',
  journal: '#3c4a2a',
};

/**
 * The desk around the book: candle light, drifting motes, gold vines, the top line (the wordmark
 * opens the book's first section; then date, settings, main menu) and the familiar keeping you
 * company. On a narrow window the menu toggle names the section you are reading.
 */
export function Desk({
  game,
  dateText,
  onHome,
  onCalendar,
  onSettings,
  onMenu,
  onToggleNav,
  navOpen,
  homeLabel,
  section,
  reduced,
  children,
}) {
  return (
    <div className="gm-desk">
      <div className="gm-candle" data-light-source aria-hidden="true" />
      {!reduced && (
        <div data-light-source className="gm-motes-wrap" aria-hidden="true">
          <Motes count={26} className="gm-motes" />
        </div>
      )}
      <Vine length={1080} className="gm-desk-vine left" />
      <Vine length={1080} className="gm-desk-vine right" flip />
      <header className="gm-top">
        <button className="gm-home" onClick={onHome} aria-label={homeLabel} title={homeLabel}>
          <Flame size={16} /> Lanternmere
        </button>
        <button
          className="gm-menu-toggle"
          onClick={onToggleNav}
          aria-label="Toggle navigation"
          aria-expanded={Boolean(navOpen)}
        >
          <Menu size={18} />
          {section && <span aria-hidden="true">{section}</span>}
        </button>
        <button className="gm-date" onClick={onCalendar}>
          <Sun size={15} /> {dateText}
        </button>
        <button
          className="gm-round"
          onClick={onSettings}
          aria-label="Settings & saves"
          title="Settings & saves"
        >
          <Settings size={18} />
        </button>
        <button className="gm-round" onClick={onMenu} aria-label="Main menu" title="Main menu">
          <DoorOpen size={17} />
        </button>
      </header>
      {children}
      <img
        className="gm-familiar"
        src={art('fam-' + game.familiar)}
        alt={`Your ${game.familiar} familiar`}
      />
    </div>
  );
}

/** Silk ribbon bookmarks on the book's edge. `items` are [id, label, short label]. */
export function Ribbons({ items, view, onChange, open }) {
  return (
    <nav className={'gm-ribbons' + (open ? ' open' : '')} aria-label="Main navigation">
      {items.map(([id, label, short]) => (
        <button
          key={id}
          style={{ '--silk': SILK[id] }}
          className={view === id ? 'on' : ''}
          aria-current={view === id ? 'page' : undefined}
          aria-label={label}
          onClick={() => onChange(id)}
        >
          {short}
        </button>
      ))}
    </nav>
  );
}

/** The open book: its glow on the desk, stacked page edges, and the pages themselves. */
export function Book({ children, ribbons, view }) {
  return (
    <div className="gm-book">
      <div className="gm-halo" data-light-source aria-hidden="true" />
      <main className="main-content gm-pages" id="main" key={view}>
        {children}
      </main>
      {ribbons}
    </div>
  );
}

/**
 * A two-page spread. Each page scrolls on its own when its content is long; `title` heads the right
 * page, and `foot` stays put at the bottom of the right page (the day's closing actions).
 */
export function Spread({ left, right, folio = 1, title = 'The Quiet Arts', foot, className = '' }) {
  return (
    <div className={'gm-spread ' + className}>
      <section className="gm-page left">
        <div className="gm-running">
          <em>Lanternmere</em>
        </div>
        <Vine length={720} className="gm-margin-vine left" />
        <div className="gm-page-body">{left}</div>
        <span className="gm-folio">{folio}</span>
      </section>
      <div className="gm-gutter" aria-hidden="true" />
      <section className={'gm-page right' + (foot ? ' has-foot' : '')}>
        <div className="gm-running r">
          <em>{title}</em>
        </div>
        <Vine length={720} className="gm-margin-vine right" flip />
        <div className="gm-page-body">{right}</div>
        {foot && <div className="gm-page-foot">{foot}</div>}
        <span className="gm-folio">{folio + 1}</span>
      </section>
    </div>
  );
}

/** One wide leaf across the whole book (the map, and pages not yet laid out as spreads). */
export function Leaf({ children, folio = 1, title, className = '' }) {
  return (
    <div className={'gm-spread gm-leaf ' + className}>
      <section className="gm-page wide">
        {title && (
          <div className="gm-running">
            <em>Lanternmere</em>
            <em>{title}</em>
          </div>
        )}
        <div className="gm-page-body">{children}</div>
        <span className="gm-folio">{folio}</span>
      </section>
    </div>
  );
}

/** A section's opening paragraph with a gilded, vine-wrapped drop capital. */
export function DropCap({ children, className = '' }) {
  const text = String(children);
  return (
    <p className={'gm-drop ' + className}>
      <span className="gm-initial" aria-hidden="true">
        {text[0]}
        <svg viewBox="0 0 80 80">
          <rect x="2" y="2" width="76" height="76" className="box" />
          <path d="M8 70 C 20 60, 14 44, 26 36 S 40 20, 60 12" className="curl" />
          <path
            d="M60 12 q 8 -2 10 4 q -6 4 -10 -4z M26 36 q -8 -4 -6 -10 q 6 2 6 10z M44 22 q 4 -8 10 -6 q -2 6 -10 6z"
            className="leaf"
          />
        </svg>
      </span>
      <span className="gm-sr">{text[0]}</span>
      {text.slice(1)}
    </p>
  );
}
