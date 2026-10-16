import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Leaf,
  PlugZap,
  ShieldCheck,
  WifiOff,
} from 'lucide-react';
import { providers, providerById } from '../../ai/providers.mjs';
import { apiRequest } from '../../ai/client.mjs';
import { art } from '../../content.mjs';
import { Button, Eyebrow, Portrait } from '../../components.jsx';
import './setup.css';

const defaults = (id) => {
  const provider = providerById(id);
  return {
    provider: id,
    baseUrl: provider.baseUrl,
    model: provider.model,
    apiKey: '',
    clearKey: false,
  };
};

export function AISetup({ ai, online, onStatus, onClose }) {
  const [code, setCode] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [form, setForm] = useState(defaults('openai'));
  const [saved, setSaved] = useState(null);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [preview, setPreview] = useState(null);
  const controller = useRef(null);
  useEffect(() => () => controller.current?.abort(), []);
  const provider = providerById(form.provider);
  const sameTarget =
    saved?.provider === form.provider && saved?.baseUrl === form.baseUrl.replace(/\/$/, '');

  function change(patch) {
    setForm((value) => ({ ...value, ...patch }));
    setNotice('');
    setPreview(null);
    setError('');
  }
  async function run(label, work) {
    if (busy) return;
    setBusy(label);
    setError('');
    setNotice('');
    controller.current = new AbortController();
    try {
      await work(controller.current.signal);
    } catch (error) {
      if (!controller.current.signal.aborted)
        setError(
          error.name === 'TimeoutError'
            ? 'The connection test timed out. Check that the provider or local model is running.'
            : error.message,
        );
    } finally {
      setBusy('');
    }
  }
  function unlock(event) {
    event.preventDefault();
    run('unlock', async (signal) => {
      const config = await apiRequest('/api/ai/config', { setupCode: code, signal });
      setSaved(config);
      setForm(
        config.enabled
          ? {
              provider: config.provider,
              baseUrl: config.baseUrl,
              model: config.model,
              apiKey: '',
              clearKey: false,
            }
          : defaults('openai'),
      );
      setUnlocked(true);
      if (config.issue) setError(config.issue);
    });
  }
  function connect(save) {
    run(save ? 'save' : 'test', async (signal) => {
      const result = await apiRequest(save ? '/api/ai/config' : '/api/ai/test', {
        method: 'POST',
        body: form,
        setupCode: code,
        signal,
      });
      setPreview(result.preview);
      setNotice(
        save
          ? 'Connection tested and saved. Characters can now reply through this provider.'
          : 'The connection works. Use Test & save to make it active.',
      );
      if (save) {
        setSaved(result.config);
        setForm((value) => ({ ...value, apiKey: '', clearKey: false }));
        onStatus(result.status);
      }
    });
  }
  function disconnect() {
    run('disconnect', async (signal) => {
      const result = await apiRequest('/api/ai/config', {
        method: 'POST',
        body: { enabled: false },
        setupCode: code,
        signal,
      });
      onStatus(result.status);
      setSaved(result);
      setForm(defaults('openai'));
      setPreview(null);
      setNotice(
        'AI disconnected and its saved key removed. Your story and friendships are unchanged.',
      );
    });
  }

  return (
    <main className="setup-page">
      <header className="setup-header">
        <button className="text-button" onClick={onClose}>
          <ArrowLeft size={17} /> Back to the game
        </button>
        <span>LANTERNMERE · CONNECTIONS</span>
      </header>
      <section
        className="setup-intro"
        style={{
          backgroundImage: `linear-gradient(90deg,#172b29ed,#172b2977),url(${art('library')})`,
        }}
      >
        <Eyebrow>
          <PlugZap size={16} /> YOUR WORLD, YOUR WAY
        </Eyebrow>
        <h1>
          Give the conversation
          <br />a little more room.
        </h1>
        <p>
          Connect an AI for open-ended chats, or enjoy the whole story with prepared dialogue. Your
          adventure works either way.
        </p>
        <span className="setup-status" role="status">
          {!online ? (
            <>
              <WifiOff size={16} /> Offline · prepared conversations ready
            </>
          ) : ai.configured ? (
            <>
              <CheckCircle2 size={16} /> Active model: {ai.model}
            </>
          ) : (
            <>
              <Leaf size={16} /> Prepared conversations ready · AI optional
            </>
          )}
        </span>
      </section>
      <div className="setup-columns">
        <section className="setup-card">
          <Eyebrow>CONNECT YOUR PROVIDER</Eyebrow>
          <h2>A few details, then a hello.</h2>
          {!online && (
            <p className="setup-notice">
              You’re offline. Setup instructions are still available; reconnect to test or save a
              provider. A local model can work without Internet when the game server can reach it.
            </p>
          )}
          {!unlocked ? (
            <form onSubmit={unlock} className="setup-form">
              <h3>
                <KeyRound size={18} /> 1. Unlock server settings
              </h3>
              <p>Only the person running this game server can change its AI connection.</p>
              <label>
                Setup code
                <input
                  type="password"
                  autoComplete="off"
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  maxLength={256}
                  required
                  aria-describedby="setup-code-help"
                />
              </label>
              <p id="setup-code-help" className="setup-help">
                In the game server’s terminal, run <code>npm run ai:setup-code</code> and enter the
                code here. Start the server first. For managed hosting, use the value of{' '}
                <code>AI_SETUP_TOKEN</code> from your server settings.
              </p>
              <Button className="primary" type="submit" disabled={Boolean(busy) || !code.trim()}>
                {busy === 'unlock' ? 'Unlocking…' : 'Unlock setup'}
              </Button>
            </form>
          ) : (
            <form
              className="setup-form"
              onSubmit={(event) => {
                event.preventDefault();
                connect(true);
              }}
            >
              <h3>
                <PlugZap size={18} /> 2. Choose a connection
              </h3>
              <fieldset disabled={Boolean(busy)}>
                <label>
                  AI provider
                  <select
                    value={form.provider}
                    onChange={(event) => {
                      setForm(defaults(event.target.value));
                      setPreview(null);
                      setNotice('');
                      setError('');
                    }}
                  >
                    {providers.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="provider-instructions">
                  <p>{provider.instructions}</p>
                  {provider.docs && (
                    <a href={provider.docs} target="_blank" rel="noreferrer">
                      Open {provider.name} instructions ↗
                    </a>
                  )}
                </div>
                <label>
                  API base URL
                  <input
                    type="url"
                    value={form.baseUrl}
                    onChange={(event) => change({ baseUrl: event.target.value })}
                    required
                    placeholder="https://your-provider.example/v1"
                    autoComplete="off"
                    maxLength={500}
                  />
                </label>
                <label>
                  Model ID
                  <input
                    value={form.model}
                    onChange={(event) => change({ model: event.target.value })}
                    required
                    maxLength={150}
                    placeholder="The model identifier from your provider"
                    autoComplete="off"
                  />
                </label>
                <small>
                  Suggested models are editable. Availability depends on your provider account or
                  locally installed models.
                </small>
                <label>
                  API key {provider.requiresKey ? '' : '(if required)'}
                  <input
                    type="password"
                    value={form.apiKey}
                    onChange={(event) => change({ apiKey: event.target.value })}
                    autoComplete="new-password"
                    maxLength={4096}
                    required={provider.requiresKey && !(sameTarget && saved?.hasKey)}
                    placeholder={
                      sameTarget && saved?.hasKey
                        ? 'A key is saved; leave blank to keep it'
                        : 'Paste your provider API key here'
                    }
                  />
                </label>
                {sameTarget && saved?.hasKey && !provider.requiresKey && (
                  <label className="setup-checkbox">
                    <input
                      type="checkbox"
                      checked={form.clearKey}
                      onChange={(event) => change({ clearKey: event.target.checked })}
                    />{' '}
                    Remove the saved key for this connection
                  </label>
                )}
              </fieldset>
              <h3>3. Try a greeting</h3>
              <p className="setup-help">
                Testing sends a short greeting request to this provider and may use paid API credit.
                A successful save takes effect immediately. Failed tests keep your current
                connection.
              </p>
              <div className="button-row">
                <Button type="button" onClick={() => connect(false)} disabled={Boolean(busy)}>
                  {busy === 'test' ? 'Testing…' : 'Test only'}
                </Button>
                <Button type="submit" className="primary" disabled={Boolean(busy)}>
                  {busy === 'save' ? 'Testing & saving…' : 'Test & save connection'}
                </Button>
              </div>
              {ai.configured && (
                <button
                  className="text-button"
                  type="button"
                  disabled={Boolean(busy)}
                  onClick={disconnect}
                >
                  {busy === 'disconnect' ? 'Disconnecting…' : 'Disconnect AI and remove saved key'}
                </button>
              )}
            </form>
          )}
          {error && (
            <p className="setup-error" role="alert">
              {error}
            </p>
          )}
          {notice && (
            <p className="setup-notice" role="status">
              {notice}
            </p>
          )}
          {preview && (
            <figure className="setup-preview">
              <Portrait id="rowan" emotion={preview.emotion} />
              <figcaption>
                <small>CONNECTION TEST · ROWAN</small>
                <blockquote>{preview.text}</blockquote>
                <p>This greeting does not change your save.</p>
              </figcaption>
            </figure>
          )}
        </section>
        <aside className="setup-aside">
          <section className="setup-card">
            <ShieldCheck size={23} />
            <h2>Your characters keep their history.</h2>
            <p>
              Chats use the character’s sheet, your friendship level, shared moments, and recent
              conversation. Story secrets unlock as you progress.
            </p>
            <p>
              API keys stay on the server. Personal journal notes and other characters’ chats stay
              out of the request. Your game save never includes credentials.
            </p>
          </section>
          <section className="setup-card">
            <Leaf size={23} />
            <h2>No connection needed.</h2>
            <p>
              Lessons, choices, friendships, and endings work with prepared dialogue. AI replies add
              conversation; game rules decide progress.
            </p>
            <p>
              You can also choose “Use ChatGPT or another AI” in a conversation, copy its context,
              and paste a reply back. No API key required.
            </p>
            <Button onClick={onClose}>Continue with prepared dialogue</Button>
          </section>
          <details className="setup-card" open>
            <summary>Troubleshooting & hosting</summary>
            <ul>
              <li>
                <strong>Local models:</strong> “localhost” means the machine running the game
                server, not a visitor’s phone. Download a model before going offline.
              </li>
              <li>
                <strong>Hosted AI:</strong> allow the provider’s API hostname through your server’s
                network settings.
              </li>
              <li>
                <strong>Invalid key or model:</strong> check API access, model spelling, available
                credit, and provider limits.
              </li>
              <li>
                <strong>Shared server:</strong> one connection serves everyone. Keep the setup code
                private; hosting publicly also needs player access controls and a spending limit.
              </li>
            </ul>
          </details>
        </aside>
      </div>
    </main>
  );
}
