import { mkdir, readFile, writeFile, rename, chmod } from 'node:fs/promises';
import path from 'node:path';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { providers, providerById } from '../../src/ai/providers.mjs';
import { HttpError } from '../errors.mjs';

export function validateConfig(input, previous = null) {
  const provider = providerById(input?.provider);
  if (!provider) throw new HttpError(400, 'Choose a supported provider.');
  const model = typeof input.model === 'string' ? input.model.trim() : '';
  if (!model || model.length > 150 || /[\r\n\x00-\x1f]/.test(model))
    throw new HttpError(400, 'Enter a model ID of up to 150 characters.');
  let url;
  try {
    url = new URL(input.baseUrl || provider.baseUrl);
  } catch {
    throw new HttpError(400, 'Enter a valid API base URL.');
  }
  const loopback = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && loopback))
    throw new HttpError(400, 'Use HTTPS for hosted providers, or loopback HTTP for a local model.');
  if (url.username || url.password || url.search || url.hash || url.toString().length > 500)
    throw new HttpError(
      400,
      'The base URL cannot contain credentials, query parameters, or fragments.',
    );
  if (/\/(chat\/completions|messages)\/?$/.test(url.pathname))
    throw new HttpError(400, 'Use the API base URL, without /chat/completions or /messages.');
  const baseUrl = url.toString().replace(/\/$/, '');
  // Never silently forward an existing key to a different provider or host/path.
  const sameTarget = previous?.provider === provider.id && previous?.baseUrl === baseUrl;
  const suppliedKey = typeof input.apiKey === 'string' ? input.apiKey.trim() : '';
  const apiKey = input.clearKey ? '' : suppliedKey || (sameTarget ? previous.apiKey : '') || '';
  if (apiKey.length > 4096 || /[\r\n\x00-\x1f]/.test(apiKey))
    throw new HttpError(400, 'Enter a valid API key.');
  if (provider.requiresKey && !apiKey) throw new HttpError(400, 'This provider needs an API key.');
  return { enabled: true, provider: provider.id, baseUrl, model, apiKey };
}

function environmentConfig(env) {
  if (!env.AI_MODEL) return null;
  const baseUrl = env.AI_BASE_URL || 'https://api.openai.com/v1';
  return validateConfig({
    provider:
      env.AI_PROVIDER ||
      providers.find((provider) => provider.baseUrl === baseUrl.replace(/\/$/, ''))?.id ||
      'custom',
    baseUrl,
    model: env.AI_MODEL,
    apiKey: env.AI_API_KEY || '',
  });
}

export function publicConfig(config, source) {
  return {
    enabled: Boolean(config?.enabled),
    provider: config?.provider || 'openai',
    baseUrl: config?.baseUrl || '',
    model: config?.model || '',
    hasKey: Boolean(config?.apiKey),
    source,
  };
}

/** Server-owned configuration. Writes are atomic; credentials never enter a game save. */
export async function createConfigStore({ directory, env = process.env }) {
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const file = path.join(directory, 'ai-config.json');
  const tokenFile = path.join(directory, 'ai-setup-token');
  let token = env.AI_SETUP_TOKEN;
  if (!token) {
    try {
      await writeFile(tokenFile, randomBytes(32).toString('hex'), { flag: 'wx', mode: 0o600 });
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
    }
    token = (await readFile(tokenFile, 'utf8')).trim();
    await chmod(tokenFile, 0o600);
  }
  if (token.length < 16) throw new Error('AI_SETUP_TOKEN must contain at least 16 characters.');
  let active = null,
    source = 'none',
    issue = null;
  try {
    const saved = JSON.parse(await readFile(file, 'utf8'));
    if (saved.credentialSource === 'environment' && !env.AI_API_KEY) {
      throw new Error('The saved connection requires the AI_API_KEY environment binding.');
    }
    active =
      saved.enabled === false
        ? { enabled: false }
        : validateConfig({
            ...saved,
            ...(saved.credentialSource === 'environment' ? { apiKey: env.AI_API_KEY } : {}),
          });
    source = 'setup';
    await chmod(file, 0o600);
  } catch (error) {
    if (error.code === 'ENOENT') {
      try {
        active = environmentConfig(env);
        source = active ? 'environment' : 'none';
      } catch {
        issue = 'The server environment has incomplete AI settings. Open setup to correct them.';
      }
    } else issue = 'The saved AI configuration could not be read. Open setup to replace it.';
  }
  let pending = Promise.resolve();
  return {
    current: () => (active?.enabled ? { ...active } : null),
    public: () => ({ ...publicConfig(active, source), issue }),
    authorize(value) {
      const actual = Buffer.from(typeof value === 'string' ? value : '');
      const expected = Buffer.from(token);
      return actual.length === expected.length && timingSafeEqual(actual, expected);
    },
    save(config) {
      const persist = async () => {
        const temporary = file + '.' + randomBytes(6).toString('hex') + '.tmp';
        // Retain environment/secret-store bindings by reference. Never copy their
        // values (including ephemeral proxy placeholders) into persistent files.
        const persisted =
          config.apiKey && config.apiKey === env.AI_API_KEY
            ? { ...config, apiKey: '', credentialSource: 'environment' }
            : config;
        await writeFile(temporary, JSON.stringify(persisted, null, 2), { mode: 0o600 });
        await rename(temporary, file);
        active = { ...config };
        source = 'setup';
        issue = null;
        return this.public();
      };
      const result = pending.then(persist);
      pending = result.catch(() => {});
      return result;
    },
  };
}
