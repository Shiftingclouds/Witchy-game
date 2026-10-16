export function entry(s, text) {
  s.journal = [...s.journal, { date: s.date, text }].slice(-150);
  s.feedback = text;
}
export function reward(s, key, points = 5) {
  if (s.rewards.includes(key)) return false;
  s.rewards.push(key);
  s.points += points;
  return true;
}
export function bond(s, id, n = 5) {
  s.bonds[id] = Math.min(100, (s.bonds[id] || 0) + n);
}
