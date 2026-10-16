import { festivals } from '../content.mjs';
import { entry } from './effects.mjs';
export function season(date) {
  const m = Number(date.slice(5, 7));
  return m >= 3 && m <= 5
    ? 'Spring'
    : m >= 6 && m <= 8
      ? 'Summer'
      : m >= 9 && m <= 11
        ? 'Autumn'
        : 'Winter';
}
export function dateLabel(date, opts = {}) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
    ...opts,
  }).format(new Date(date + 'T12:00:00Z'));
}
export function holiday(date) {
  return festivals.find(
    (f) => f.month === Number(date.slice(5, 7)) && f.day === Number(date.slice(8, 10)),
  );
}
export function refreshDay(s) {
  if (!s.daily || s.daily.date !== s.date) s.daily = { date: s.date, checkins: [], event: null };
}
export function advanceTime(s, wholeDay = false) {
  if (!wholeDay && s.period < 3) {
    s.period++;
    return;
  }
  const d = new Date(s.date + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + 1);
  s.date = d.toISOString().slice(0, 10);
  s.period = 0;
  refreshDay(s);
  const event = holiday(s.date);
  if (event) entry(s, `${event.name}: ${event.description}`);
}
