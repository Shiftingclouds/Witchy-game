import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createConfigStore } from './server/ai/config.mjs';
import { createApp } from './server/app.mjs';

if (existsSync('.env')) process.loadEnvFile('.env');
const directory = path.dirname(fileURLToPath(import.meta.url));
const store = await createConfigStore({
  directory: path.resolve(process.env.AI_CONFIG_DIR || path.join(directory, '.local')),
});
const server = createApp({
  root: path.join(directory, 'dist'),
  store,
  apiOnly: Boolean(process.env.API_ONLY),
});
const port = Number(process.env.PORT) || 4173;
server.listen(port, process.env.HOST || '0.0.0.0', () => {
  console.log(
    `Lanternmere server listening on port ${port}. AI ${store.current() ? 'configured' : 'optional; not connected'}. Open AI setup in the game to configure a provider.`,
  );
});
function close() {
  server.close();
  server.closeIdleConnections();
}
process.once('SIGINT', close);
process.once('SIGTERM', close);
