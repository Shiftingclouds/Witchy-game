// Runs `claude -p` on the owner's computer for the AI modes, using their Claude subscription.
// Locked down: no tools, no MCP servers, no personal settings, an empty working folder, no saved sessions.
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const FALLBACK = path.join(
  os.homedir(),
  '.local',
  'bin',
  process.platform === 'win32' ? 'claude.exe' : 'claude',
);

/** Resolve the claude command: test override, then PATH, then the default install folder. */
export function defaultClaudeCommand(env = process.env) {
  if (env.LANTERNMERE_CLAUDE_CMD) return JSON.parse(env.LANTERNMERE_CLAUDE_CMD);
  return ['claude'];
}

function classify(envelope) {
  const text = `${envelope.result ?? ''} ${envelope.error ?? ''}`.toLowerCase();
  if (envelope.api_error_status === 429 || /usage limit|rate limit|limit reached|quota/.test(text))
    return 'usage-limit';
  if (/login|log in|sign in|api key|unauthori|authenticat|credential/.test(text))
    return 'not-signed-in';
  return 'failed';
}

export function createClaudeBridge({ command = defaultClaudeCommand(), workDir, log = null }) {
  mkdirSync(workDir, { recursive: true });
  let queue = Promise.resolve();
  let current = null;

  function run(args, { input = '', timeoutMs = 240_000 } = {}, attempt = command) {
    return new Promise((resolve) => {
      let out = '';
      let err = '';
      let settled = false;
      const finish = (result) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        if (current?.child === child) current = null;
        resolve(result);
      };
      const [bin, ...pre] = attempt;
      const child = spawn(bin, [...pre, ...args], {
        cwd: workDir,
        env: process.env,
        windowsHide: true,
      });
      current = {
        child,
        cancel: () => (
          child.kill(),
          finish({ ok: false, error: 'cancelled', message: 'Cancelled.' })
        ),
      };
      const timer = setTimeout(() => {
        child.kill();
        finish({ ok: false, error: 'timeout', message: 'Claude took too long to answer.' });
      }, timeoutMs);
      child.stdout.on('data', (d) => (out += d));
      child.stderr.on('data', (d) => (err += d));
      child.on('error', (error) => {
        if (
          error.code === 'ENOENT' &&
          attempt === command &&
          command[0] === 'claude' &&
          existsSync(FALLBACK)
        ) {
          settled = true;
          clearTimeout(timer);
          return run(args, { input, timeoutMs }, [FALLBACK]).then(resolve);
        }
        finish({
          ok: false,
          error: error.code === 'ENOENT' ? 'not-installed' : 'failed',
          message:
            error.code === 'ENOENT'
              ? 'Claude Code is not installed on this computer.'
              : error.message,
        });
      });
      child.on('close', (code) => finish({ ok: code === 0, raw: out, stderr: err, code }));
      child.stdin.on('error', () => {});
      child.stdin.end(input);
    });
  }

  async function request({ system, prompt, schema, model = 'opus', timeoutMs = 240_000 }) {
    const args = [
      '-p',
      '--output-format',
      'json',
      '--json-schema',
      JSON.stringify(schema),
      '--tools',
      '',
      '--strict-mcp-config',
      '--setting-sources',
      '',
      '--no-session-persistence',
      '--system-prompt',
      system,
      '--model',
      model,
    ];
    const result = await run(args, { input: prompt, timeoutMs });
    if (result.error) return result;
    let envelope;
    try {
      envelope = JSON.parse(result.raw);
    } catch {
      return result.code === 0
        ? { ok: false, error: 'invalid', message: 'Claude replied in an unexpected format.' }
        : {
            ok: false,
            error: 'failed',
            message: (result.stderr || 'Claude stopped unexpectedly.').slice(0, 300),
          };
    }
    if (envelope.is_error) {
      return {
        ok: false,
        error: classify(envelope),
        message: String(envelope.result || 'Claude could not answer.').slice(0, 300),
      };
    }
    if (!envelope.structured_output || typeof envelope.structured_output !== 'object')
      return { ok: false, error: 'invalid', message: 'Claude did not return a structured reply.' };
    log?.({
      at: new Date().toISOString(),
      model,
      system,
      prompt,
      reply: envelope.structured_output,
    });
    return { ok: true, data: envelope.structured_output, usage: envelope.usage ?? null };
  }

  return {
    /** One request at a time; later calls wait their turn. */
    request(options) {
      const next = queue.then(() => request(options));
      queue = next.catch(() => {});
      return next;
    },
    cancel() {
      current?.cancel();
    },
    async status() {
      const result = await run(['--version'], { timeoutMs: 20_000 });
      if (result.error) return { available: false, reason: result.error };
      return result.ok
        ? { available: true, version: result.raw.trim() }
        : { available: false, reason: 'failed' };
    },
    dispose() {
      current?.child.kill();
    },
  };
}
