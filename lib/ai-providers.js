export const AI_PROVIDERS = [
  {
    id: 'groq',
    name: 'Groq',
    baseURL: 'https://api.groq.com/openai/v1',
    models: ['llama-3.3-70b-versatile', 'mixtral-8x7b-32768'],
    maxTokens: 8192,
    apiKeys: [
      process.env.GROQ_API_KEY_1,
      process.env.GROQ_API_KEY_2,
      process.env.GROQ_API_KEY_3,
      process.env.GROQ_API_KEY_4,
      process.env.GROQ_API_KEY_5
    ].filter(Boolean),
    priority: 1
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    baseURL: 'https://openrouter.ai/api/v1',
    models: ['meta-llama/llama-3.1-8b-instruct:free', 'mistralai/mistral-7b-instruct:free'],
    maxTokens: 4096,
    apiKeys: [
      process.env.OPENROUTER_API_KEY_1,
      process.env.OPENROUTER_API_KEY_2,
      process.env.OPENROUTER_API_KEY_3,
      process.env.OPENROUTER_API_KEY_4
    ].filter(Boolean),
    priority: 2
  }
];
