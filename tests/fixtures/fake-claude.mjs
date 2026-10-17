// A stand-in for `claude -p` in tests. Reads the prompt on stdin and answers like the real CLI.
// FAKE_CLAUDE_MODE: ok (default) | auth | limit | garbage | slow | error
// FAKE_CLAUDE_REPLY: path to a JSON file used as structured_output (ok mode)
// FAKE_CLAUDE_ARGS: path to write argv and cwd to, for assertions
import { readFileSync, writeFileSync } from 'node:fs';

const mode = process.env.FAKE_CLAUDE_MODE || 'ok';
let stdin = '';
process.stdin.on('data', (chunk) => (stdin += chunk));
process.stdin.on('end', () => {
  if (process.env.FAKE_CLAUDE_ARGS)
    writeFileSync(
      process.env.FAKE_CLAUDE_ARGS,
      JSON.stringify({ argv: process.argv.slice(2), cwd: process.cwd(), stdin }),
    );
  if (process.argv.includes('--version')) {
    process.stdout.write('9.9.9 (Claude Code)\n');
    return;
  }
  const envelope = (extra) =>
    process.stdout.write(
      JSON.stringify({ type: 'result', subtype: 'success', is_error: false, ...extra }),
    );
  if (mode === 'slow')
    return setTimeout(() => envelope({ structured_output: { text: 'late' } }), 60_000);
  if (mode === 'garbage') return process.stdout.write('not json at all');
  if (mode === 'auth')
    return envelope({
      is_error: true,
      subtype: 'error',
      result: 'Invalid API key · Please run /login',
    });
  if (mode === 'limit')
    return envelope({
      is_error: true,
      subtype: 'error',
      api_error_status: 429,
      result: 'Usage limit reached',
    });
  if (mode === 'error') {
    process.stderr.write('boom');
    process.exit(3);
  }
  const reply = process.env.FAKE_CLAUDE_REPLY
    ? JSON.parse(readFileSync(process.env.FAKE_CLAUDE_REPLY, 'utf8'))
    : { text: 'Hello from the fake.' };
  envelope({
    structured_output: reply,
    result: JSON.stringify(reply),
    usage: { output_tokens: 12 },
  });
});
