import test from 'node:test';
import assert from 'node:assert/strict';
import { READING_MODES, tokens, contrastRatio, themeVariables } from '../src/theme/tokens.mjs';

test('every mode defines every token', () => {
  const keys = Object.keys(tokens.lamplight).sort();
  for (const m of READING_MODES) assert.deepEqual(Object.keys(tokens[m]).sort(), keys);
});

test('text meets WCAG AA on every surface in every mode', () => {
  for (const m of READING_MODES)
    for (const text of ['ink', 'inkSoft'])
      for (const surface of ['bg', 'surface', 'surfaceStrong', 'backing'])
        assert.ok(
          contrastRatio(tokens[m][text], tokens[m][surface]) >= 4.5,
          `${m} ${text}/${surface} = ${contrastRatio(tokens[m][text], tokens[m][surface]).toFixed(2)}`,
        );
});

test('contrastRatio matches known values', () => {
  assert.equal(Math.round(contrastRatio('#000000', '#ffffff') * 10) / 10, 21);
  assert.equal(contrastRatio('#777777', '#777777'), 1);
});

test('themeVariables names variables predictably', () => {
  const vars = themeVariables('night');
  assert.equal(vars['--lm-surface-strong'], tokens.night.surfaceStrong);
  assert.match(vars['--lm-display'], /Cormorant Garamond/);
  assert.match(vars['--lm-read'], /EB Garamond/);
});
