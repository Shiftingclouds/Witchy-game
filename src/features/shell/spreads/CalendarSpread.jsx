import './spreads.css';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Moon } from 'lucide-react';
import { festivals } from '../../../content.mjs';
import { dateLabel, periods, season } from '../../../engine.mjs';
import { Button } from '../../../components.jsx';
import { DailyCard } from '../../../daily-life.jsx';
import { MarginNote, Moons } from '../../../components/lamplight/marginalia.jsx';
import { Sparkle } from '../../../components/lamplight/ornaments.jsx';
import { Spread } from '../Grimoire.jsx';
import { moonWeek } from '../moon.mjs';

/** Festivals still ahead of today (never today or the past), soonest first, with their next date. */
export function upcomingFestivals(today) {
  const year = Number(today.slice(0, 4));
  const pad = (n) => String(n).padStart(2, '0');
  return festivals
    .map((f) => {
      let date = `${year}-${pad(f.month)}-${pad(f.day)}`;
      if (date <= today) date = `${year + 1}-${pad(f.month)}-${pad(f.day)}`;
      return { ...f, date };
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** The calendar as a spread: a hand-ruled month and the moon on the left, what's ahead on the right. */
export function CalendarSpread({ game, act, visit, open, live }) {
  const [month, setMonth] = useState(game.date.slice(0, 7));
  const [y, m] = month.split('-').map(Number);
  const first = new Date(Date.UTC(y, m - 1, 1));
  const offset = (first.getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const cells = Array.from({ length: offset + days }, (_, i) =>
    i < offset ? null : i - offset + 1,
  );
  const monthEvents = festivals.filter((f) => f.month === m);
  const move = (n) => setMonth(new Date(Date.UTC(y, m - 1 + n, 1)).toISOString().slice(0, 7));
  const left = (
    <>
      <div className="calendar-heading">
        <h1>
          {new Intl.DateTimeFormat('en-GB', {
            month: 'long',
            year: 'numeric',
            timeZone: 'UTC',
          }).format(first)}
        </h1>
        <div>
          <button className="text-button" onClick={() => setMonth(game.date.slice(0, 7))}>
            Today
          </button>
          <button className="icon-button" aria-label="Previous month" onClick={() => move(-1)}>
            <ChevronLeft size={18} />
          </button>
          <button className="icon-button" aria-label="Next month" onClick={() => move(1)}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div className="calendar-grid gm-month">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <strong key={i}>{d}</strong>
        ))}
        {cells.map((d, i) => {
          const event = festivals.find((f) => f.month === m && f.day === d);
          const date = month + '-' + String(d).padStart(2, '0');
          return (
            <div
              key={i}
              className={
                'calendar-day ' +
                (date === game.date ? 'today ' : '') +
                (event ? 'festival ' : '') +
                (d && date < game.date ? 'past' : '')
              }
              title={event ? event.name : undefined}
            >
              <span>{d}</span>
              {event && <small>{event.name}</small>}
            </div>
          );
        })}
      </div>
      <h2 className="gm-sub">
        <span className="gm-rubric">The moon</span> over the Mere
      </h2>
      <Moons nights={moonWeek(game.date, 8)} />
      <MarginNote tilt={-2}>
        {season(month + '-01')} at Lanternmere.{' '}
        {monthEvents.length
          ? monthEvents.map((e) => e.description).join(' ')
          : 'A quieter month. Leave room for small adventures.'}
      </MarginNote>
    </>
  );
  const right = (
    <>
      <h1>Feasts &amp; observances</h1>
      <div className="festival-list gm-feasts">
        {upcomingFestivals(game.date).map((f) => (
          <div key={f.name}>
            <span className="gm-feast-date">
              <strong>{f.day}</strong>
              <small>
                {new Intl.DateTimeFormat('en', { month: 'short', timeZone: 'UTC' }).format(
                  new Date(Date.UTC(2026, f.month - 1, f.day)),
                )}
              </small>
            </span>
            <div>
              <h3>{f.name}</h3>
              <p>{f.description}</p>
            </div>
            <Sparkle size={13} />
          </div>
        ))}
      </div>
      {live && <DailyCard game={game} visit={visit} open={open} />}
      <MarginNote arrow tilt={1.5}>
        It’s {dateLabel(game.date)}, {periods[game.period].toLowerCase()}. Conversations and lessons
        move the day along; story milestones turn the season.
      </MarginNote>
      {live && (
        <div className="passing-time">
          <Button icon={Moon} onClick={() => act({ type: 'rest' })}>
            Rest until tomorrow
          </Button>
        </div>
      )}
    </>
  );
  return <Spread className="gm-calendar" folio={60} left={left} right={right} />;
}
