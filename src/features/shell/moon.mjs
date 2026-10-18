// The moon over the Mere: its phase on any game date (0 new, 0.5 full), from the mean lunar month.
const SYNODIC = 29.530588853;
const KNOWN_NEW = Date.UTC(2000, 0, 6, 18, 14) / 86400000;

/** Phase in [0, 1) at noon on `date` (YYYY-MM-DD). */
export function moonPhase(date) {
  const day = Date.parse(date + 'T12:00:00Z') / 86400000;
  const p = ((day - KNOWN_NEW) / SYNODIC) % 1;
  return p < 0 ? p + 1 : p;
}

/** The phases of `count` nights from `date` onward. */
export function moonWeek(date, count = 8) {
  const start = Date.parse(date + 'T12:00:00Z');
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(start + i * 86400000).toISOString().slice(0, 10);
    return { date: d, phase: moonPhase(d) };
  });
}
