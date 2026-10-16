import { providerById } from '../../src/ai/providers.mjs';
import { HttpError } from '../errors.mjs';

export function providerRequest(config, { system, messages }) {
  const provider = providerById(config.provider);
  if (provider.protocol === 'anthropic') {
    return {
      url: config.baseUrl + '/messages',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: { model: config.model, system, messages, max_tokens: 300 },
    };
  }
  return {
    url: config.baseUrl + '/chat/completions',
    headers: {
      'Content-Type': 'application/json',
      ...(config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : {}),
    },
    body: {
      model: config.model,
      messages: [{ role: 'system', content: system }, ...messages],
      ...(config.provider === 'openai' ? { max_completion_tokens: 300 } : { max_tokens: 300 }),
    },
  };
}

async function boundedJson(response) {
  if (!response.body) throw new HttpError(502, 'The provider returned an empty response.');
  const reader = response.body.getReader(),
    chunks = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 512_000) {
        await reader.cancel();
        throw new HttpError(502, 'The provider response was too large.');
      }
      chunks.push(Buffer.from(value));
    }
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch (error) {
    if (error instanceof HttpError) throw error;
    if (error.name === 'AbortError' || error.name === 'TimeoutError') throw error;
    throw new HttpError(502, 'The provider returned unreadable data. Check its API compatibility.');
  } finally {
    reader.releaseLock();
  }
}

export function parseDialogue(raw, allowed) {
  if (typeof raw !== 'string' || !raw.trim())
    throw new HttpError(502, 'The AI returned an empty reply. Try a prepared conversation.');
  let answer;
  try {
    answer = JSON.parse(
      raw
        .trim()
        .replace(/^```(?:json)?\s*/, '')
        .replace(/\s*```$/, ''),
    );
  } catch {
    answer = { text: raw, emotion: 'neutral' };
  }
  if (!answer || typeof answer.text !== 'string' || !answer.text.trim())
    throw new HttpError(502, 'The AI returned an unreadable reply.');
  return {
    text: answer.text.trim().slice(0, 3000),
    emotion: allowed.includes(answer.emotion) ? answer.emotion : 'neutral',
  };
}

export async function requestDialogue(
  config,
  conversation,
  { signal, fetchImpl = fetch, timeoutMs = 25_000 } = {},
) {
  const request = providerRequest(config, conversation);
  const timeout = AbortSignal.timeout(timeoutMs);
  const combined = signal ? AbortSignal.any([signal, timeout]) : timeout;
  try {
    const response = await fetchImpl(request.url, {
      method: 'POST',
      headers: request.headers,
      body: JSON.stringify(request.body),
      signal: combined,
      redirect: 'error',
    });
    if (!response.ok) {
      await response.body?.cancel();
      const messages = {
        401: 'The provider rejected the API key. Check or replace it.',
        403: 'This key cannot access the provider or model.',
        404: 'The endpoint or model was not found. Check the base URL and model ID.',
        429: 'The provider’s quota or rate limit was reached. Check credit and limits, then retry.',
      };
      throw new HttpError(
        502,
        messages[response.status] ||
          'The AI provider could not answer; prepared dialogue still works.',
        'provider_error',
      );
    }
    const payload = await boundedJson(response);
    const raw =
      providerById(config.provider).protocol === 'anthropic'
        ? payload?.content
            ?.filter((part) => part.type === 'text')
            .map((part) => part.text)
            .join('\n')
        : payload?.choices?.[0]?.message?.content;
    return parseDialogue(raw, conversation.allowedExpressions);
  } catch (error) {
    if (error instanceof HttpError) throw error;
    if (signal?.aborted) throw new HttpError(499, 'The request was cancelled.', 'cancelled');
    if (timeout.aborted)
      throw new HttpError(
        504,
        'The AI took too long. Try again or use a prepared conversation.',
        'timeout',
      );
    throw new HttpError(
      502,
      'Could not reach the AI provider. Check its URL, network access, or local model server.',
      'connection_failed',
    );
  }
}
