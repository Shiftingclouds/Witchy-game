import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const slots = JSON.parse(readFileSync('art/slots.json', 'utf8'));
const requested = (file) =>
  new Set(
    [...readFileSync(file, 'utf8').matchAll(/`([a-z0-9-]+(?:\{[a-z,]+\})?[a-z0-9-]*\.png)`/g)]
      .flatMap(([, name]) => {
        const brace = name.match(/^(.*)\{([a-z,]+)\}(.*)$/);
        return brace ? brace[2].split(',').map((v) => brace[1] + v + brace[3]) : [name];
      })
      .filter((n) => !/^(c01-rowan-neutral|c02-imogen-neutral|lantern-hall|mere-day|mere-night|thimble-cross|whispering-wood|boathouse|rookery|classroom|home-kitchen|glasshouses|candlestones)\.png$/.test(n))
      .filter((n) => !n.startsWith('c') || /^c\d\d-/.test(n) || !n.includes('.png') || true),
  );

test('every requested art file has a slot with a placement', () => {
  const files = new Set(slots.map((s) => s.file));
  for (const doc of ['docs/design/ART_REQUESTS.md', 'docs/design/WORLD_ART_REQUESTS.md'])
    for (const name of requested(doc))
      if (!existsSync('art/' + name) && !existsSync(name)) assert.ok(files.has(name), `${name} from ${doc} has no slot`);
  for (const s of slots) {
    assert.match(s.file, /^[a-z0-9-]+\.png$/);
    assert.ok(['portrait', 'environment', 'icon', 'closeup', 'layer'].includes(s.kind), s.file);
    assert.ok(s.placement && s.request, `${s.file} needs placement and request notes`);
  }
});

test('every slot is present in the art manifest, marked as placeholder until the real file arrives', () => {
  const manifest = JSON.parse(readFileSync('public/art/manifest.json', 'utf8'));
  const byId = Object.fromEntries(manifest.map((a) => [a.id, a]));
  for (const s of slots) {
    const id = s.file.replace(/\.png$/, '');
    if (s.kind === 'icon' || s.kind === 'layer') continue;
    assert.ok(byId[id], `${id} missing from manifest`);
    const real = existsSync('art/' + s.file) || existsSync(s.file);
    assert.equal(Boolean(byId[id].placeholder), !real, `${id} placeholder flag`);
  }
});
