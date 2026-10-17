import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';

test('no legacy AI provider code or setup route remains', async () => {
  for (const p of [
    'server.mjs',
    'server',
    'src/ai/providers.mjs',
    'src/ai/client.mjs',
    'src/features/ai/AISetup.jsx',
    '.env.example',
  ])
    assert.equal(existsSync(p), false, p);
  const main = await readFile('src/main.jsx', 'utf8');
  assert.doesNotMatch(main, /api\/status|AISetup|serviceWorker/);
  const talk = await readFile('src/features/dialogue/Conversation.jsx', 'utf8');
  assert.doesNotMatch(talk, /apiRequest|ChatGPT|ai-bridge/);
});
