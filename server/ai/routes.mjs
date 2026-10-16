import { characterById, expressions } from '../../src/content.mjs';
import { characterPrompt } from '../../src/character-context.mjs';
import { providers } from '../../src/ai/providers.mjs';
import { HttpError } from '../errors.mjs';
import { readJson, sendJson, requireSameOrigin, createRateLimit } from '../http.mjs';
import { validateConfig } from './config.mjs';
import { requestDialogue } from './providers.mjs';

export function createAIRoutes(store, { fetchImpl = fetch } = {}) {
  const dialogueLimit = createRateLimit();
  const setupLimit = createRateLimit({ limit: 20 });
  const status = () => ({
    configured: Boolean(store.current()),
    model: store.current()?.model || null,
  });
  const complete = (config, conversation, signal) =>
    requestDialogue(config, conversation, { fetchImpl, signal });

  return async (req, res, url) => {
    const path = url.pathname;
    if (!path.startsWith('/api/')) return false;
    if (path === '/api/status' && req.method === 'GET') {
      sendJson(res, 200, status());
      return true;
    }
    if (path === '/api/ai/setup' && req.method === 'GET') {
      sendJson(res, 200, { ...status(), providers, requiresSetupCode: true });
      return true;
    }
    requireSameOrigin(req);
    const cancellation = new AbortController();
    const cancel = () => {
      if (!res.writableEnded) cancellation.abort();
    };
    res.once('close', cancel);
    try {
      if (['/api/ai/config', '/api/ai/test'].includes(path)) {
        setupLimit(req.socket.remoteAddress);
        const code = req.headers.authorization?.replace(/^Bearer /, '');
        if (!store.authorize(code))
          throw new HttpError(401, 'Enter the server owner’s setup code.', 'setup_locked');
        if (path === '/api/ai/config' && req.method === 'GET') {
          sendJson(res, 200, store.public());
          return true;
        }
        if (req.method !== 'POST') throw new HttpError(405, 'Use POST.');
        const input = await readJson(req, 12_000);
        if (path === '/api/ai/config' && input.enabled === false) {
          await store.save({ enabled: false });
          sendJson(res, 200, { ...store.public(), status: status() });
          return true;
        }
        const config = validateConfig(input, store.current());
        const built = characterPrompt('rowan', { chapter: 0 });
        // Exercise authentication, the model, dialogue, and expressions before saving.
        const preview = await complete(
          config,
          {
            system: built.prompt,
            messages: [{ role: 'user', content: 'Say a brief hello to a new arrival.' }],
            allowedExpressions: expressions.rowan,
          },
          cancellation.signal,
        );
        if (cancellation.signal.aborted) return true;
        if (path === '/api/ai/config') await store.save(config);
        sendJson(res, 200, {
          ok: true,
          saved: path === '/api/ai/config',
          preview,
          ...(path === '/api/ai/config' ? { config: store.public(), status: status() } : {}),
        });
        return true;
      }
      if (path !== '/api/dialogue') throw new HttpError(404, 'Not found.');
      if (req.method !== 'POST') throw new HttpError(405, 'Use POST.');
      const config = store.current();
      if (!config)
        throw new HttpError(
          503,
          'AI is optional and is not connected. Prepared conversations remain available.',
        );
      dialogueLimit(req.socket.remoteAddress);
      const input = await readJson(req);
      if (
        !Object.hasOwn(characterById, input.character) ||
        typeof input.message !== 'string' ||
        !input.message.trim() ||
        input.message.length > 2000
      )
        throw new HttpError(
          400,
          'Choose a character and enter a message of up to 2,000 characters.',
        );
      const built = characterPrompt(
        input.character,
        input.context || { chapter: input.chapter, location: input.location },
      );
      // Support clients cached before structured character context was added.
      const legacyHistory = Array.isArray(input.history)
        ? input.history
            .slice(-8)
            .filter(
              (m) => m && ['user', 'assistant'].includes(m.role) && typeof m.content === 'string',
            )
            .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }))
        : [];
      const reply = await complete(
        config,
        {
          system: built.prompt,
          messages: [
            ...(input.context ? built.history : legacyHistory),
            { role: 'user', content: input.message.trim() },
          ],
          allowedExpressions: expressions[input.character] || ['neutral'],
        },
        cancellation.signal,
      );
      if (!cancellation.signal.aborted) sendJson(res, 200, reply);
      return true;
    } finally {
      res.off('close', cancel);
    }
  };
}
