// Browser tests use an isolated configuration, never the owner's real API key.
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createConfigStore } from '../server/ai/config.mjs';
import { createApp } from '../server/app.mjs';
const directory = await mkdtemp(path.join(os.tmpdir(), 'lanternmere-browser-'));
const store = await createConfigStore({
  directory,
  env: { AI_SETUP_TOKEN: 'browser-tests-only-setup-code' },
});
const server = createApp({ root: path.resolve('dist'), store });
server.listen(4173, '127.0.0.1', () => console.log('Isolated browser test server ready.'));
async function close() {
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
  await rm(directory, { recursive: true, force: true });
}
process.once('SIGINT', close);
process.once('SIGTERM', close);
