import test, { beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createClaudeBridge } from '../electron/claude-bridge.mjs';

const fake = path.resolve('tests/fixtures/fake-claude.mjs');
let dir, argsFile;
const bridge = (env = {}) => {
  Object.assign(process.env, { FAKE_CLAUDE_MODE: 'ok', FAKE_CLAUDE_ARGS: argsFile }, env);
  return createClaudeBridge({ command: [process.execPath, fake], workDir: dir });
};
const ask = (b, extra = {}) =>
  b.request({
    system: 'Rules.',
    prompt: 'Hello?',
    schema: { type: 'object' },
    model: 'opus',
    timeoutMs: 5000,
    ...extra,
  });

beforeEach(() => {
  dir = mkdtempSync(path.join(os.tmpdir(), 'lm-claude-'));
  argsFile = path.join(dir, '..', path.basename(dir) + '-args.json');
});

test('calls claude -p with the locked-down flags and returns structured output', async () => {
  const result = await ask(bridge());
  assert.deepEqual(result.data, { text: 'Hello from the fake.' });
  assert.equal(result.ok, true);
  const { argv, cwd, stdin } = JSON.parse(readFileSync(argsFile, 'utf8'));
  for (const flag of [
    '-p',
    '--strict-mcp-config',
    '--no-session-persistence',
    '--setting-sources',
    '--tools',
  ])
    assert.ok(argv.includes(flag), flag);
  assert.equal(argv[argv.indexOf('--output-format') + 1], 'json');
  assert.equal(argv[argv.indexOf('--model') + 1], 'opus');
  assert.equal(argv[argv.indexOf('--system-prompt') + 1], 'Rules.');
  assert.equal(argv[argv.indexOf('--tools') + 1], '');
  assert.equal(argv[argv.indexOf('--setting-sources') + 1], '');
  assert.deepEqual(JSON.parse(argv[argv.indexOf('--json-schema') + 1]), { type: 'object' });
  assert.ok(!argv.includes('--bare'));
  assert.equal(path.resolve(cwd), path.resolve(dir));
  assert.equal(stdin, 'Hello?');
});

test('maps failures to calm, specific errors', async () => {
  assert.equal((await ask(bridge({ FAKE_CLAUDE_MODE: 'auth' }))).error, 'not-signed-in');
  assert.equal((await ask(bridge({ FAKE_CLAUDE_MODE: 'limit' }))).error, 'usage-limit');
  assert.equal((await ask(bridge({ FAKE_CLAUDE_MODE: 'garbage' }))).error, 'invalid');
  assert.equal((await ask(bridge({ FAKE_CLAUDE_MODE: 'error' }))).error, 'failed');
  const missing = createClaudeBridge({
    command: ['definitely-not-a-real-claude-binary'],
    workDir: dir,
  });
  assert.equal((await ask(missing)).error, 'not-installed');
});

test('times out, and cancel kills the running process', async () => {
  const slow = bridge({ FAKE_CLAUDE_MODE: 'slow' });
  assert.equal((await ask(slow, { timeoutMs: 300 })).error, 'timeout');
  const pending = ask(slow, { timeoutMs: 30_000 });
  setTimeout(() => slow.cancel(), 200);
  const started = Date.now();
  assert.equal((await pending).error, 'cancelled');
  assert.ok(Date.now() - started < 5000);
});

test('requests run one at a time', async () => {
  const b = bridge();
  const order = [];
  await Promise.all([ask(b).then(() => order.push(1)), ask(b).then(() => order.push(2))]);
  assert.deepEqual(order, [1, 2]);
});

test('status reports the installed version or why it is unavailable', async () => {
  assert.deepEqual(await bridge().status(), { available: true, version: '9.9.9 (Claude Code)' });
  const missing = createClaudeBridge({
    command: ['definitely-not-a-real-claude-binary'],
    workDir: dir,
  });
  assert.equal((await missing.status()).available, false);
});

test('cancel targets its own request, even while it is still queued', async () => {
  const b = bridge({ FAKE_CLAUDE_MODE: 'slow' });
  const first = b.request({ id: 'a', system: 's', prompt: 'p', schema: {}, timeoutMs: 30_000 });
  const second = b.request({ id: 'b', system: 's', prompt: 'p', schema: {}, timeoutMs: 30_000 });
  await new Promise((r) => setTimeout(r, 200));
  b.cancel('b');
  assert.equal((await second).error, 'cancelled');
  b.cancel('a');
  assert.equal((await first).error, 'cancelled');
});

test('checking status mid-request does not lose track of the running claude', async () => {
  const b = bridge({ FAKE_CLAUDE_MODE: 'slow' });
  const pending = ask(b, { timeoutMs: 30_000 });
  await new Promise((r) => setTimeout(r, 200));
  await b.status();
  b.dispose();
  const started = Date.now();
  assert.equal((await pending).error, 'cancelled');
  assert.ok(Date.now() - started < 5000);
});

test('after dispose, queued requests never start a new claude', async () => {
  const b = bridge({ FAKE_CLAUDE_MODE: 'slow' });
  const first = ask(b, { timeoutMs: 30_000 });
  const queued = ask(b, { timeoutMs: 30_000 });
  await new Promise((r) => setTimeout(r, 200));
  b.dispose();
  assert.equal((await first).error, 'cancelled');
  assert.equal((await queued).error, 'cancelled');
});
