// Public metadata only. Credentials and active provider configuration stay on the server.
export const providers = [
  {
    id: 'openai',
    name: 'OpenAI',
    protocol: 'openai',
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4.1-mini',
    requiresKey: true,
    docs: 'https://platform.openai.com/api-keys',
    instructions:
      'Create an API key in the OpenAI platform and enable API billing. A ChatGPT subscription does not include API credit.',
  },
  {
    id: 'anthropic',
    name: 'Anthropic (Claude)',
    protocol: 'anthropic',
    baseUrl: 'https://api.anthropic.com/v1',
    model: 'claude-sonnet-4-5',
    requiresKey: true,
    docs: 'https://console.anthropic.com/',
    instructions:
      'Create an API key in the Anthropic console. Choose a model available to your account and add API credit.',
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    protocol: 'openai',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    model: 'gemini-2.5-flash',
    requiresKey: true,
    docs: 'https://aistudio.google.com/apikey',
    instructions:
      'Create a Gemini API key in Google AI Studio. This connection uses Google’s OpenAI-compatible endpoint; quotas and billing depend on your account.',
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    protocol: 'openai',
    baseUrl: 'https://openrouter.ai/api/v1',
    model: 'openai/gpt-4.1-mini',
    requiresKey: true,
    docs: 'https://openrouter.ai/settings/keys',
    instructions:
      'Create an OpenRouter API key and choose an available model ID from its model catalog.',
  },
  {
    id: 'ollama',
    name: 'Ollama (local)',
    protocol: 'openai',
    baseUrl: 'http://127.0.0.1:11434/v1',
    model: 'llama3.2',
    requiresKey: false,
    docs: 'https://ollama.com/',
    instructions:
      'Install Ollama on the machine running the game server, run “ollama pull llama3.2”, and start Ollama. Use the exact name of a model you have downloaded. No paid API key is required.',
  },
  {
    id: 'lmstudio',
    name: 'LM Studio (local)',
    protocol: 'openai',
    baseUrl: 'http://127.0.0.1:1234/v1',
    model: '',
    requiresKey: false,
    docs: 'https://lmstudio.ai/docs/developer',
    instructions:
      'Load a model in LM Studio and start its local API server on the machine running this game server. Enter the model identifier shown in LM Studio. If you enabled authentication, supply its API key.',
  },
  {
    id: 'custom',
    name: 'Another OpenAI-compatible provider',
    protocol: 'openai',
    baseUrl: '',
    model: '',
    requiresKey: false,
    docs: null,
    instructions:
      'Enter the provider’s API base URL and model ID. Use its API key if required. The endpoint must support /chat/completions. Hosted endpoints require HTTPS; loopback HTTP is supported for local servers.',
  },
];

export function providerById(id) {
  return providers.find((provider) => provider.id === id);
}
