import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { characterSheets } from '../src/character-sheets.mjs';
import { characters, expressions, houses } from '../src/content.mjs';
import { castDetails } from '../src/cast.mjs';
const base = new URL('../characters/', import.meta.url),
  sheets = [];
for (const [directory, status] of [
  ['active', 'active'],
  ['proposed', 'proposed'],
]) {
  for (const file of await readdir(new URL(directory + '/', base))) {
    if (!file.endsWith('.json')) continue;
    const sheet = JSON.parse(await readFile(new URL(directory + '/' + file, base), 'utf8'));
    assert.equal(file, sheet.id + '.json');
    assert.equal(sheet.status, status);
    sheets.push(sheet);
  }
}
const ids = new Set(sheets.map((sheet) => sheet.id));
assert.equal(ids.size, sheets.length, 'Duplicate character ids');
const text = (value, label) =>
  assert.ok(typeof value === 'string' && value.trim().length > 0 && value.length <= 3000, label);
for (const sheet of sheets) {
  assert.equal(sheet.schemaVersion, 1);
  assert.match(sheet.id, /^[a-z]+(?:-[a-z]+)*$/);
  for (const field of ['name', 'role']) text(sheet.identity[field], `${sheet.id}: ${field}`);
  assert.ok(sheet.identity.house === null || houses.some((h) => h.id === sheet.identity.house));
  assert.ok(['unspecified', 'proposed', 'confirmed'].includes(sheet.identity.age.status));
  assert.ok(
    sheet.identity.age.value === null ||
      (Number.isInteger(sheet.identity.age.value) && sheet.identity.age.value >= 18),
  );
  for (const field of ['summary', 'motivation', 'fear'])
    text(sheet.canon[field], `${sheet.id}: ${field}`);
  for (const field of ['traits', 'values', 'boundaries']) {
    assert.ok(Array.isArray(sheet.canon[field]) && sheet.canon[field].length > 0);
    sheet.canon[field].forEach((value) => text(value, `${sheet.id}: ${field}`));
  }
  for (const field of ['cadence', 'humour']) text(sheet.voice[field], `${sheet.id}: ${field}`);
  for (const field of ['unmet', 'acquaintance', 'friend', 'closeFriend'])
    text(sheet.relationshipStyle[field], `${sheet.id}: ${field}`);
  assert.equal(
    sheet.relationshipStyle.romance.enabled,
    false,
    'Romance gameplay is not implemented',
  );
  for (const entry of [...sheet.canon.knowledge, ...sheet.canon.privateReactions]) {
    assert.ok(
      Number.isInteger(entry.minimumChapter) &&
        entry.minimumChapter >= 0 &&
        entry.minimumChapter <= 8,
    );
    assert.ok(
      Number.isFinite(entry.minimumBond) && entry.minimumBond >= 0 && entry.minimumBond <= 100,
    );
    text(entry.text, sheet.id + ' knowledge');
  }
  for (const connection of sheet.connections) {
    assert.ok(ids.has(connection.characterId), `${sheet.id}: unknown connection`);
    assert.ok(['established', 'proposed'].includes(connection.status));
    text(connection.description, sheet.id + ' connection');
  }
  assert.equal(sheet.runtime.relationshipScoreSource, `save.bonds.${sheet.id}`);
  if (sheet.status === 'active') {
    const c = characters.find((character) => character.id === sheet.id);
    assert.ok(c, 'Active sheet has no playable identity');
    assert.deepEqual(
      sheet,
      characterSheets[sheet.id],
      'Registry is stale; run npm run sync:characters',
    );
    assert.equal(sheet.presentation.portraitPrefix, c.prefix);
    assert.equal(sheet.presentation.missingArt, false);
    assert.deepEqual(sheet.presentation.availableExpressions, expressions[sheet.id] || ['neutral']);
    assert.equal(c.bio, sheet.canon.summary);
    assert.equal(c.role, sheet.identity.role);
    assert.equal(castDetails[sheet.id].routine.length, 4);
    text(sheet.voice.example, sheet.id + ' example');
  } else {
    assert.equal(sheet.presentation.missingArt, true);
    assert.deepEqual(sheet.presentation.availableExpressions, []);
    assert.ok(!Object.hasOwn(characterSheets, sheet.id));
  }
}
assert.deepEqual(new Set(Object.keys(characterSheets)), new Set(characters.map((c) => c.id)));
console.log(
  `Validated ${characters.length} active and ${sheets.length - characters.length} proposed character sheets, their connections, expressions, registry, and runtime references.`,
);
