// Run Impeccable's anti-pattern detector over the game's UI sources.
// Exits 1 on any non-advisory finding not covered by recorded ignores (.impeccable/config.json).
// Usage: node scripts/design-detect.mjs [--list] [--advisory]
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

function resolveCli() {
  if (process.env.IMPECCABLE_BIN && existsSync(process.env.IMPECCABLE_BIN))
    return process.env.IMPECCABLE_BIN;
  const base = path.join(os.homedir(), '.claude', 'plugins', 'cache', 'impeccable', 'impeccable');
  if (!existsSync(base)) return null;
  const versions = readdirSync(base).sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true }),
  );
  for (const v of versions.reverse()) {
    const dir = path.join(base, v, 'skills', 'impeccable', 'scripts');
    const cli = path.join(dir, process.platform === 'win32' ? 'impeccable.cmd' : 'impeccable');
    if (existsSync(cli)) return cli;
  }
  return null;
}

const cli = resolveCli();
if (!cli) {
  console.error('Impeccable not found. Install the Impeccable plugin or set IMPECCABLE_BIN.');
  process.exit(2);
}
if (process.argv.includes('--list')) {
  console.log(cli);
  process.exit(0);
}

const targets = ['src'];
let output;
try {
  output = execFileSync(cli, ['detect', '--json', ...targets], {
    encoding: 'utf8',
    shell: process.platform === 'win32',
    maxBuffer: 64 * 1024 * 1024,
  });
} catch (error) {
  output = error.stdout || '[]';
}
const findings = JSON.parse(output.slice(output.indexOf('[')) || '[]');
const blocking = findings.filter((f) => !f.advisory);
const advisory = findings.filter((f) => f.advisory);
for (const f of process.argv.includes('--advisory') ? findings : blocking)
  console.log(`${path.relative(process.cwd(), f.file)}:${f.line} [${f.antipattern}] ${f.snippet}`);
console.log(`${blocking.length} findings, ${advisory.length} advisory notes.`);
process.exit(blocking.length ? 1 : 0);
