import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('the legacy paper theme is gone', () => {
  for (const file of ['src/styles.css', 'src/dialogue-presentation.css']) {
    const css = readFileSync(file, 'utf8');
    for (const legacy of ['--green', '--paper', '--serif', 'Arial'])
      assert.ok(!css.includes(legacy), `${file} still mentions ${legacy}`);
  }
});
