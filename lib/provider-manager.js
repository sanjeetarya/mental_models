import { OpenAI } from 'openai';
import { AI_PROVIDERS } from './ai-providers';
import { fuzzyMatch } from './fuzzy-matcher';
import mentalModelslist from '../app/api/match-models/mental-models-list.json';
import { mentalModels } from './mental-models';
import { AnalyticsLogger } from './analytics-logger';
import { estimateTokens } from './token-counter';

class AIProviderManager {
  constructor() {
    this.providers = AI_PROVIDERS;
    this.failedKeys = new Map();
    this.keyRotationDelay = 300000; // 5 minutes
  }

  async attemptMatch(challenge, deviceData = {}, serverData = {}) {
    const startTime = Date.now();
    const apiCallTimestamp = new Date();
    
    let queryData = {
      query_text: challenge,
      query_length: challenge.length,
      query_tokens: estimateTokens(challenge),
      api_call_timestamp: apiCallTimestamp,
      fallback_method: 'llm',
      success: true
    };

    // Try each provider in priority order
    for (const provider of this.getAvailableProviders()) {
      const result = await this.tryProviderWithKeyRotation(provider, challenge, queryData);
      if (result.success) {
        queryData = {
          ...queryData,
          ...result.analyticsData,
          response_received_timestamp: new Date(),
          total_llm_time_ms: Date.now() - startTime,
          query_output: result.data,
          model_used: provider.models[0],
          model_provider: provider.id,
          api_key_name: `${provider.id.toUpperCase()}_API_KEY_${result.keyIndex + 1}`
        };

        // Log to database
        const queryId = await AnalyticsLogger.logQuery(queryData);
        await AnalyticsLogger.logDeviceData(queryId, deviceData, serverData);
        await AnalyticsLogger.updateModelPerformance(
          provider.id, provider.models[0], queryData.api_key_name,
          true, queryData.total_llm_time_ms,
          queryData.llm_input_tokens, queryData.llm_output_tokens
        );

        return {
          result: result.data,
          provider: provider.id,
          method: 'llm',
          keyUsed: result.keyIndex + 1,
          queryId
        };
      }
    }

    // All AI providers failed, use fuzzy matching
    const fuzzyResult = fuzzyMatch(challenge);
    queryData = {
      ...queryData,
      fallback_method: 'fuzzy',
      response_received_timestamp: new Date(),
      total_llm_time_ms: Date.now() - startTime,
      query_output: fuzzyResult,
      success: true
    };

    const queryId = await AnalyticsLogger.logQuery(queryData);
    await AnalyticsLogger.logDeviceData(queryId, deviceData, serverData);

    return {
      result: fuzzyResult,
      provider: 'fuzzy',
      method: 'fallback',
      queryId
    };
  }

  async tryProviderWithKeyRotation(provider, challenge, queryData) {
    const availableKeys = this.getAvailableKeysForProvider(provider);

    for (let i = 0; i < availableKeys.length; i++) {
      const keyIndex = availableKeys[i];
      const apiKey = provider.apiKeys[keyIndex];

      try {
        const result = await this.callProviderWithKey(provider, apiKey, challenge);
        this.onKeySuccess(provider, keyIndex);
        return { success: true, data: result.data, keyIndex, analyticsData: result.analyticsData };
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
    const inputTokens = estimateTokens(prompt);
    
    const startTime = Date.now();
    
    const response = await client.chat.completions.create({
      model: provider.models[0],
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0,
      max_tokens: Math.min(provider.maxTokens, 2000)
    });

    const responseTime = Date.now() - startTime;
    const content = JSON.parse(response.choices[0].message.content);
    const outputTokens = estimateTokens(JSON.stringify(content));
    
    return {
      data: this.enrichModelData(content),
      analyticsData: {
        llm_input_tokens: inputTokens,
        llm_output_tokens: outputTokens,
        api_response_time_ms: responseTime
      }
    };
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
      "model_id": "model-id-from-list",
      "model_name": "Model Name",
      "why_this_fits": "2-3 sentences explaining relevance", 
      "key_question": "One powerful question this model helps them ask"
    },
    {
      "model_id": "model-id-from-list",
      "model_name": "Model Name",
      "why_this_fits": "2-3 sentences explaining relevance",
      "key_question": "One powerful question this model helps them ask"
    }
  ]}`;
  }

  enrichModelData(content) {
    return content.recommended_models.map(rec => {
      const fullModel = mentalModels.find(m => m.id === rec.model_id);
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
