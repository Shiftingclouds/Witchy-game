// Renderer side of the Claude bridge. AI modes only; Prebuilt modes never call this.
const pref = (key, fallback) => {
  try {
    return localStorage.getItem('lanternmere.' + key) || fallback;
  } catch {
    return fallback;
  }
};

export const MODEL_CHOICES = ['opus', 'fable', 'sonnet', 'haiku'];
export const storyModel = () => pref('ai-story-model', 'opus');
export const housekeepingModel = () => pref('ai-house-model', 'sonnet');
export const debugLogging = () => pref('ai-debug-log', 'off') === 'on';

const bridge = () => (typeof window !== 'undefined' ? window.lanternmere?.ai : undefined);
export const aiAvailable = () => Boolean(bridge());

/**
 * Ask Claude for one structured reply.
 * @returns {Promise<{ok: true, data: object} | {ok: false, error: string, message?: string}>}
 */
export async function askClaude({ id = null, system, prompt, schema, purpose = 'story' }) {
  const ai = bridge();
  if (!ai) return { ok: false, error: 'desktop-only', message: 'AI modes run in the desktop app.' };
  try {
    return await ai.request({
      id,
      system,
      prompt,
      schema,
      model: purpose === 'housekeeping' ? housekeepingModel() : storyModel(),
      timeoutMs: purpose === 'housekeeping' ? 120_000 : 240_000,
      debug: debugLogging(),
    });
  } catch (error) {
    return { ok: false, error: 'failed', message: String(error?.message || error) };
  }
}

export const claudeStatus = async () =>
  bridge()?.status() ?? { available: false, reason: 'desktop-only' };
export const cancelClaude = (id) => bridge()?.cancel(id);

/** Calm, in-world wording for each failure. */
export const ERROR_COPY = {
  'not-installed': 'Claude Code isn’t installed on this computer. Install it, then try again.',
  'not-signed-in':
    'Claude isn’t signed in. Open a terminal and run claude once to sign in, then try again.',
  'usage-limit':
    'Claude needs a rest — your plan’s usage limit has been reached. Try again a little later.',
  timeout: 'The world is taking too long to answer. Try again in a moment.',
  cancelled: 'You stopped that moment. Nothing changed.',
  invalid: 'The reply came back tangled. Try again; nothing changed.',
  failed: 'Something went wrong reaching Claude. Nothing changed; try again.',
  'desktop-only': 'AI modes run in the desktop app.',
};
