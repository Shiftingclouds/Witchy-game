# Connect AI to Lanternmere

AI is optional. Both game modes, spells, friendships, choices, and the ending work with prepared dialogue.

## Use the setup page

1. Start the game server with `npm run dev`, or use `npm run build` followed by `npm start` for offline caching.
2. Choose **AI setup & connection help** on the main menu, or **Settings & saves → Open AI setup**. The application also serves the page at `/setup`.
3. In a second terminal on the machine running the game server, run `npm run ai:setup-code`. Enter that code in the setup page. This protects the shared server configuration; do not paste it into chat. The page does not store it in browser storage.
4. Select your provider. Follow the displayed instructions to obtain an API key or start a local model. Enter the model ID your account or local installation supports. Defaults are suggestions, not a guarantee of access.
5. Choose **Test only** to try a greeting without changing settings, or **Test & save connection** to verify and activate it. Testing uses a small real request and may consume provider credit. A failed test leaves your working settings intact.
6. Return to a character and type your own message. The reply uses that character's sheet and this save's relationship context. No restart is needed after a successful setup save.

Keys are never returned by the configuration API. When editing the same provider and base URL, leave the key blank to keep it. Changing the provider or endpoint requires entering a key again if needed. **Disconnect AI and remove saved key** disables AI and removes the setup-saved credential; prepared play continues.

## Providers

| Choice | API hostname / local port | Connection |
| --- | --- | --- |
| OpenAI | `api.openai.com` | OpenAI Chat Completions; API key and billing separate from ChatGPT subscription. |
| Anthropic | `api.anthropic.com` | Native Messages API for Claude. |
| Google Gemini | `generativelanguage.googleapis.com` | Google's OpenAI-compatible endpoint. |
| OpenRouter | `openrouter.ai` | OpenAI-compatible endpoint; choose a catalog model ID. |
| Ollama | loopback port `11434` | Download a model, e.g. `ollama pull llama3.2`, then run Ollama. No key required by default. |
| LM Studio | loopback port `1234` | Load a model and start the local API server. Supply a key only if you enabled authentication. |
| Custom | your provider's API hostname | Must support `/chat/completions`; enter the base URL without this suffix. |

Local means **the game server's machine**, not the visitor's browser. A cloud game server cannot automatically reach Ollama on your laptop. Running both on the same computer is the simplest local arrangement. Once its model is downloaded, a local provider can work without Internet if the browser can still reach the game server. A cached app with no reachable server falls back to prepared dialogue.

Restricted cloud networks must allow the chosen API hostname. Other custom providers need their own hostname added. The setup page does not change firewall rules or install model software.

## Server configuration and hosting

The server generates `.local/ai-setup-token` on first startup, with owner-only file permissions. For managed hosting, set a private `AI_SETUP_TOKEN` of at least 16 characters and enter it in the page instead. Keep the same value across server restarts. `AI_CONFIG_DIR` changes the private configuration directory; put it on persistent storage when using containers.

Successful setup saves write `.local/ai-config.json` with owner-only permissions. This file contains a credential when the provider needs one; `.local/` is ignored by Git and is outside the served `dist/` directory. The key is protected by filesystem permissions, not encrypted at rest. Use your hosting platform's secret store if that is required for your deployment.

You can also copy `.env.example` to an ignored `.env`, or inject `AI_PROVIDER`, `AI_BASE_URL`, `AI_MODEL`, and `AI_API_KEY` through server settings. Environment configuration is used when there is no setup-saved configuration. A setup save or disconnect overrides it. Changing environment values requires a server restart. To return to environment configuration, stop the server, remove only `ai-config.json` from its private configuration directory, and restart. Disconnecting in the page does not delete credentials managed externally in `.env` or hosting settings.

When setup retains an environment-supplied key, the saved file records a reference to `AI_API_KEY` instead of copying its value. Rotating that binding takes effect on restart. If the binding is missing, the connection stays disabled until it is restored or replaced in setup.

The connection is shared by visitors to this server. The setup code protects configuration, not access to public dialogue. Before public hosting, add player authentication, persistent rate limits, and provider spending caps. The included dialogue rate limit is ten requests per minute per connection address; proxies may share that address. It is intended for local development and private use.

## Without a compatible API

In any conversation, choose **Use ChatGPT or another AI**. Write your message, copy and inspect the context, take it to your AI, then paste the answer back and select a supported expression. This deliberately shares the chosen character's context and recent conversation with that service. No provider key or direct connection is needed.

Local fake-provider tests exercise setup, persistence, both API formats, error handling, and in-game replies. No real provider credential is configured in this environment, so paid-provider authentication, current model availability, and provider-specific output quality remain unverified.
