import mentalModelslist from "./mental-models-list.json" assert { type: "json" };
import { OpenAI } from 'openai';
import { mentalModels } from '@/lib/mental-models';
import { NextResponse } from 'next/server';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
});

const MODEL = process.env.MODEL || 'gpt-4o';

export async function POST(request) {
  try {
    const { challenge } = await request.json();

    if (!challenge) {
      return NextResponse.json(
        { message: 'Challenge is required' }, 
        { status: 400 }
      );
    }

    const prompt = `
# MENTAL MODEL MATCHER

You are an expert Mental Model Matcher that helps people find the most relevant mental models for their real-life challenges. Your goal is to analyze situations and recommend 3 mental models that will help users think better, decide better, and live better.

## MENTAL MODEL LIST
${JSON.stringify(mentalModelslist)}

## USER QUERY
${challenge}

## OUTPUT FORMAT
Return the result strictly in this JSON format:
{"recommended_models": [
    {
      "model_id": "model-id-from-list",
      "model_name": "Model Name", 
      "why_this_fits": "2-3 sentences explaining relevance to their specific situation",
      "key_question": "One powerful question this model helps them ask"
    },
    {
      "model_name": "Model Name",
      "why_this_fits": "2-3 sentences explaining relevance to their specific situation", 
      "key_question": "One powerful question this model helps them ask"
    },
    {
      "model_name": "Model Name",
      "why_this_fits": "2-3 sentences explaining relevance to their specific situation",
      "key_question": "One powerful question this model helps them ask"
    }
  ]}`;

    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0
    });

    const content = JSON.parse(response.choices[0].message.content);
    console.info(content)
    
    // Map the LLM response to include full model data
    const enrichedModels = content.recommended_models.map(rec => {
      const fullModel = mentalModels.find(m => m.name === rec.model_name);
      return {
        model: fullModel,
        relevance: rec.why_this_fits,
        keyQuestion: rec.key_question,
        score: 5, // High score for LLM matches
        isLLMMatch: true
      };
    }).filter(item => item.model); // Remove any that couldn't be matched

    return NextResponse.json({ matches: enrichedModels });
  } catch (error) {
    console.error('LLM matching error:', error);
    return NextResponse.json(
      { message: 'LLM matching failed', error: error.message },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
}
