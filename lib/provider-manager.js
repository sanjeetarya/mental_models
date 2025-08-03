import { OpenAI } from 'openai';
import { AI_PROVIDERS } from './ai-providers';
import { fuzzyMatch } from './fuzzy-matcher';
import mentalModelslist from '../app/api/match-models/mental-models-list.json';
import { mentalModels } from './mental-models';

class AIProviderManager {
  constructor() {
    this.providers = AI_PROVIDERS;
    this.failedKeys = new Map();
    this.keyRotationDelay = 300000; // 5 minutes
  }

  async attemptMatch(challenge) {
    // Try each provider in priority order
    for (const provider of this.getAvailableProviders()) {
      const result = await this.tryProviderWithKeyRotation(provider, challenge);
      if (result.success) {
        return {
          result: result.data,
          provider: provider.id,
          method: 'llm',
          keyUsed: result.keyIndex + 1
        };
      }
    }

    // All AI providers failed, use fuzzy matching
    const fuzzyResult = fuzzyMatch(challenge);
    return {
      result: fuzzyResult,
      provider: 'fuzzy',
      method: 'fallback'
    };
  }

  async tryProviderWithKeyRotation(provider, challenge) {
    const availableKeys = this.getAvailableKeysForProvider(provider);

    for (let i = 0; i < availableKeys.length; i++) {
      const keyIndex = availableKeys[i];
      const apiKey = provider.apiKeys[keyIndex];

      try {
        const result = await this.callProviderWithKey(provider, apiKey, challenge);
        this.onKeySuccess(provider, keyIndex);
        return { success: true, data: result, keyIndex };
      } catch (error) {
        this.onKeyFailure(provider, keyIndex, error);
        continue;
      }
    }

    return { success: false };
  }

  async callProviderWithKey(provider, apiKey, challenge) {
    const client = new OpenAI({
      apiKey,
      baseURL: provider.baseURL,
    });

    const prompt = this.buildPrompt(challenge);

    const response = await client.chat.completions.create({
      model: provider.models[0],
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0,
      max_tokens: Math.min(provider.maxTokens, 2000)
    });

    const content = JSON.parse(response.choices[0].message.content);
    return this.enrichModelData(content);
  }

  buildPrompt(challenge) {
    return `
# MENTAL MODEL MATCHER

You are an expert Mental Model Matcher that helps people find the most relevant mental models for their real-life challenges.

## MENTAL MODEL LIST
${JSON.stringify(mentalModelslist)}

## USER QUERY
${challenge}

## OUTPUT FORMAT
Return exactly this JSON format:
{"recommended_models": [
    {
      "model_id": "model-id-from-list",
      "model_name": "Model Name", 
      "why_this_fits": "2-3 sentences explaining relevance",
      "key_question": "One powerful question this model helps them ask"
    },
    {
      "model_name": "Model Name",
      "why_this_fits": "2-3 sentences explaining relevance", 
      "key_question": "One powerful question this model helps them ask"
    },
    {
      "model_name": "Model Name",
      "why_this_fits": "2-3 sentences explaining relevance",
      "key_question": "One powerful question this model helps them ask"
    }
  ]}`;
  }

  enrichModelData(content) {
    return content.recommended_models.map(rec => {
      const fullModel = mentalModels.find(m => m.name === rec.model_name);
      return {
        model: fullModel,
        relevance: rec.why_this_fits,
        keyQuestion: rec.key_question,
        score: 5,
        isLLMMatch: true
      };
    }).filter(item => item.model);
  }

  getAvailableKeysForProvider(provider) {
    return provider.apiKeys
      .map((_, index) => index)
      .filter(keyIndex => {
        const failedKeysForProvider = this.failedKeys.get(provider.id);
        if (!failedKeysForProvider?.has(keyIndex)) return true;
        
        const failureInfo = failedKeysForProvider.get(keyIndex);
        return Date.now() - failureInfo.timestamp > this.keyRotationDelay;
      });
  }

  getAvailableProviders() {
    return this.providers.filter(provider => 
      this.getAvailableKeysForProvider(provider).length > 0
    );
  }

  onKeySuccess(provider, keyIndex) {
    const failedKeysForProvider = this.failedKeys.get(provider.id);
    if (failedKeysForProvider?.has(keyIndex)) {
      failedKeysForProvider.delete(keyIndex);
    }
  }

  onKeyFailure(provider, keyIndex, error) {
    if (!this.failedKeys.has(provider.id)) {
      this.failedKeys.set(provider.id, new Map());
    }
    
    this.failedKeys.get(provider.id).set(keyIndex, {
      timestamp: Date.now(),
      error: error.message
    });
  }
}

export const providerManager = new AIProviderManager();
