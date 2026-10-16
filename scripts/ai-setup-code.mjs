// Run this yourself in the server terminal. Never paste the result into chat or commit it.
import { readFile, existsSync } from 'node:fs';
import { promisify } from 'node:util';
import path from 'node:path';
if (existsSync('.env')) process.loadEnvFile('.env');
try {
  const code =
    process.env.AI_SETUP_TOKEN ||
    (
      await promisify(readFile)(
        path.resolve(process.env.AI_CONFIG_DIR || '.local', 'ai-setup-token'),
        'utf8',
      )
    ).trim();
  process.stdout.write(
    'Server owner setup code (enter only in Lanternmere’s AI setup):\n' + code + '\n',
  );
} catch {
  console.error(
    'Start the game server first with npm run dev or npm start, then run this command again.',
  );
  process.exitCode = 1;
}
