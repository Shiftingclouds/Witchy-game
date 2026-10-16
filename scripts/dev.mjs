import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
if (existsSync('.env')) process.loadEnvFile('.env');
const api = spawn(process.execPath, ['server.mjs'], {
  stdio: 'inherit',
  env: { ...process.env, PORT: '3001', API_ONLY: '1' },
});
const vite = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '0.0.0.0'], {
  stdio: 'inherit',
});
let closing = false;
function close(code = 0) {
  if (closing) return;
  closing = true;
  api.kill();
  vite.kill();
  process.exitCode = code;
}
process.on('SIGINT', () => close());
process.on('SIGTERM', () => close());
api.on('exit', (c) => close(c || 0));
vite.on('exit', (c) => close(c || 0));
