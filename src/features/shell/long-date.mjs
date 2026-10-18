// A game date written out the way the grimoire would: "Wednesday, the fourteenth of October".
const ORDINALS = [
  'first',
  'second',
  'third',
  'fourth',
  'fifth',
  'sixth',
  'seventh',
  'eighth',
  'ninth',
  'tenth',
  'eleventh',
  'twelfth',
  'thirteenth',
  'fourteenth',
  'fifteenth',
  'sixteenth',
  'seventeenth',
  'eighteenth',
  'nineteenth',
  'twentieth',
];
const ordinal = (n) =>
  n <= 20
    ? ORDINALS[n - 1]
    : n === 30
      ? 'thirtieth'
      : (n < 30 ? 'twenty-' : 'thirty-') + ORDINALS[(n % 10) - 1];

export function longDate(date) {
  const d = new Date(date + 'T12:00:00Z');
  const opt = (o) => d.toLocaleDateString('en-GB', { ...o, timeZone: 'UTC' });
  return `${opt({ weekday: 'long' })}, the ${ordinal(d.getUTCDate())} of ${opt({ month: 'long' })}`;
}
