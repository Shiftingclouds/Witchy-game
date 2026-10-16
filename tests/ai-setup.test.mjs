import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { mkdtemp, readFile, stat, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createApp } from '../server/app.mjs';
import { createConfigStore, validateConfig } from '../server/ai/config.mjs';
import { providerRequest, parseDialogue, requestDialogue } from '../server/ai/providers.mjs';

const setupCode = 'test-owner-code-not-a-real-secret';
const listen = (server) =>
  new Promise((resolve) =>
    server.listen(0, '127.0.0.1', () => resolve(`http://127.0.0.1:${server.address().port}`)),
  );
const close = (server) => {
  server.closeAllConnections();
  return new Promise((resolve) => server.close(resolve));
};

test('environment credentials remain references when settings are saved and rotate on restart', async (t) => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'lanternmere-env-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const env = {
    AI_SETUP_TOKEN: setupCode,
    AI_PROVIDER: 'openai',
    AI_MODEL: 'fixture',
    AI_API_KEY: 'test-environment-secret',
  };
  const store = await createConfigStore({ directory, env });
  await store.save({ ...store.current(), model: 'another-fixture' });
  const disk = await readFile(path.join(directory, 'ai-config.json'), 'utf8');
  assert.ok(!disk.includes(env.AI_API_KEY));
  assert.equal(JSON.parse(disk).credentialSource, 'environment');
  const restarted = await createConfigStore({
    directory,
    env: { ...env, AI_API_KEY: 'rotated-test-secret' },
  });
  assert.equal(restarted.current().apiKey, 'rotated-test-secret');
  assert.equal(restarted.current().model, 'another-fixture');
  const missing = await createConfigStore({ directory, env: { ...env, AI_API_KEY: '' } });
  assert.equal(missing.current(), null);
  assert.ok(missing.public().issue);
});

test('setup authorizes the owner, tests before saving, preserves working settings on failure, and persists without exposing keys', async (t) => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'lanternmere-ai-'));
  let fail = false,
    received;
  const provider = http.createServer(async (req, res) => {
    let body = '';
    for await (const chunk of req) body += chunk;
    received = { url: req.url, headers: req.headers, body: JSON.parse(body) };
    res.writeHead(fail ? 401 : 200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify(
        fail
          ? { error: 'test-key-must-not-leak' }
          : {
              choices: [
                {
                  message: {
                    content: JSON.stringify({ text: 'I saved a chair for you.', emotion: 'warm' }),
                  },
                },
              ],
            },
      ),
    );
  });
  const baseUrl = (await listen(provider)) + '/v1';
  const store = await createConfigStore({ directory, env: { AI_SETUP_TOKEN: setupCode } });
  const app = createApp({ store, apiOnly: true }),
    url = await listen(app);
  t.after(async () => {
    await close(app);
    await close(provider);
    await rm(directory, { recursive: true, force: true });
  });
  const post = (route, body, token = setupCode, origin) =>
    fetch(url + route, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(origin ? { Origin: origin } : {}),
      },
      body: JSON.stringify(body),
    });
  const settings = {
    provider: 'custom',
    baseUrl,
    model: 'fixture-model',
    apiKey: 'test-key-must-not-leak',
  };
  assert.equal((await post('/api/ai/config', settings, 'wrong')).status, 401);
  assert.equal(
    (await post('/api/ai/config', settings, setupCode, 'https://unrelated.example')).status,
    403,
  );
  let result = await post('/api/ai/test', settings);
  assert.equal(result.status, 200);
  assert.equal((await result.json()).saved, false);
  assert.equal(store.current(), null);
  result = await post('/api/ai/config', settings);
  assert.equal(result.status, 200);
  let body = await result.json();
  assert.equal(body.status.configured, true);
  assert.ok(!JSON.stringify(body).includes(settings.apiKey));
  assert.equal(received.headers.authorization, 'Bearer ' + settings.apiKey);
  assert.equal(received.url, '/v1/chat/completions');
  const storedFile = path.join(directory, 'ai-config.json');
  assert.equal((await stat(storedFile)).mode & 0o777, 0o600);
  const reloaded = await createConfigStore({ directory, env: { AI_SETUP_TOKEN: setupCode } });
  assert.equal(reloaded.current().model, 'fixture-model');
  result = await post('/api/ai/config', { ...settings, model: 'second-model', apiKey: '' });
  assert.equal(result.status, 200);
  assert.equal(store.current().apiKey, settings.apiKey);
  fail = true;
  result = await post('/api/ai/config', { ...settings, model: 'broken-model' });
  assert.equal(result.status, 502);
  body = await result.json();
  assert.ok(body.error.includes('API key'));
  assert.ok(!JSON.stringify(body).includes(settings.apiKey));
  assert.equal(store.current().model, 'second-model');
  result = await fetch(url + '/api/ai/config', {
    headers: { Authorization: 'Bearer ' + setupCode },
  });
  body = await result.json();
  assert.equal(body.hasKey, true);
  assert.equal(body.apiKey, undefined);
  result = await post('/api/ai/config', { enabled: false });
  assert.equal(result.status, 200);
  assert.equal(store.current(), null);
  assert.ok(!(await readFile(storedFile, 'utf8')).includes(settings.apiKey));
  assert.equal(
    (
      await createConfigStore({
        directory,
        env: {
          AI_SETUP_TOKEN: setupCode,
          AI_MODEL: 'environment-model',
          AI_API_KEY: 'environment-key',
        },
      })
    ).current(),
    null,
  );
});

test('provider adapters support native Claude, compatible APIs, and keyless local models', async () => {
  const conversation = {
    system: 'Canonical character facts',
    messages: [{ role: 'user', content: 'Hello' }],
    allowedExpressions: ['neutral', 'warm'],
  };
  const claude = validateConfig({
    provider: 'anthropic',
    model: 'claude-fixture',
    apiKey: 'fake-claude-key',
  });
  const request = providerRequest(claude, conversation);
  assert.equal(request.url, 'https://api.anthropic.com/v1/messages');
  assert.equal(request.headers['x-api-key'], 'fake-claude-key');
  assert.equal(request.headers.Authorization, undefined);
  assert.equal(request.body.system, conversation.system);
  assert.equal(request.body.messages[0].role, 'user');
  const reply = await requestDialogue(claude, conversation, {
    fetchImpl: async (url, options) => {
      assert.equal(options.redirect, 'error');
      return Response.json({
        content: [{ type: 'text', text: '{"text":"Good evening.","emotion":"warm"}' }],
      });
    },
  });
  assert.deepEqual(reply, { text: 'Good evening.', emotion: 'warm' });
  const local = validateConfig({ provider: 'ollama', model: 'local-model' });
  assert.equal(providerRequest(local, conversation).headers.Authorization, undefined);
  for (const provider of ['gemini', 'openrouter', 'openai']) {
    const config = validateConfig({ provider, model: 'test', apiKey: 'fake' });
    assert.ok(providerRequest(config, conversation).url.endsWith('/chat/completions'));
  }
  const prior = validateConfig({
    provider: 'custom',
    baseUrl: 'https://one.example/v1',
    model: 'test',
    apiKey: 'private',
  });
  assert.equal(validateConfig({ ...prior, apiKey: '', model: 'another' }, prior).apiKey, 'private');
  assert.equal(
    validateConfig({ ...prior, apiKey: '', baseUrl: 'https://two.example/v1' }, prior).apiKey,
    '',
  );
  for (const baseUrl of [
    'http://remote.example/v1',
    'https://name:password@example.com/v1',
    'https://example.com/v1?key=secret',
    'https://example.com/v1/chat/completions',
    'file:///tmp/model',
  ])
    assert.throws(() => validateConfig({ provider: 'custom', baseUrl, model: 'test' }));
});

test('provider failures, cancellation, invalid JSON, and excessive replies are bounded', async () => {
  assert.throws(() => parseDialogue('null', ['neutral']));
  assert.throws(() => parseDialogue('{"text":null}', ['neutral']));
  assert.deepEqual(parseDialogue('A plain reply', ['neutral']), {
    text: 'A plain reply',
    emotion: 'neutral',
  });
  assert.deepEqual(
    parseDialogue('```json\n{"text":"Hi","emotion":"missing","points":100}\n```', ['neutral']),
    { text: 'Hi', emotion: 'neutral' },
  );
  const config = validateConfig({ provider: 'ollama', model: 'local' }),
    conversation = { system: 'Test', messages: [], allowedExpressions: ['neutral'] };
  await assert.rejects(
    requestDialogue(config, conversation, {
      fetchImpl: async () => new Response('private provider detail', { status: 429 }),
    }),
    (error) =>
      error.status === 502 && error.message.includes('quota') && !error.message.includes('private'),
  );
  await assert.rejects(
    requestDialogue(config, conversation, {
      fetchImpl: async () => new Response('x'.repeat(513000)),
    }),
    (error) => error.message.includes('too large'),
  );
  await assert.rejects(
    requestDialogue(config, conversation, {
      fetchImpl: async () => Response.json({ choices: [] }),
    }),
    (error) => error.message.includes('empty'),
  );
  const aborted = new AbortController();
  aborted.abort();
  await assert.rejects(
    requestDialogue(config, conversation, {
      signal: aborted.signal,
      fetchImpl: async () => {
        throw new Error('aborted');
      },
    }),
    (error) => error.code === 'cancelled',
  );
});
