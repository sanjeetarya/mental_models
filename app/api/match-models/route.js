// import mentalModelslist from "./mental-models-list.json" assert { type: "json" };
// import { OpenAI } from 'openai';
// import { mentalModels } from '@/lib/mental-models';
// import { NextResponse } from 'next/server';

// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
//   baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
// });

// const MODEL = process.env.MODEL || 'gpt-4o';

// export async function POST(request) {
//   try {
//     const { challenge } = await request.json();

//     if (!challenge) {
//       return NextResponse.json(
//         { message: 'Challenge is required' }, 
//         { status: 400 }
//       );
//     }

//     const prompt = `
// # MENTAL MODEL MATCHER

// You are an expert Mental Model Matcher that helps people find the most relevant mental models for their real-life challenges. Your goal is to analyze situations and recommend 3 mental models that will help users think better, decide better, and live better.

// ## YOUR MENTAL MODELS DATABASE

// You have access to 89 mental models across 8 categories:
// - **General (10 models)**: Foundational thinking tools like Inversion, First Principles Thinking, Circle of Competence
// - **Economics (16 models)**: Market dynamics like Supply & Demand, Game Theory, Opportunity Cost
// - **Systems (12 models)**: Complex system behaviors like Feedback Loops, Bottlenecks, Critical Mass
// - **Mathematics (13 models)**: Quantitative patterns like Pareto Principle, Compounding, Network Effects
// - **Biology (12 models)**: Evolutionary principles like Natural Selection, Cooperation, Adaptation Rate
// - **Art (10 models)**: Communication principles like Framing, Contrast, Audience
// - **Physics (7 models)**: Force dynamics like Leverage, Inertia, Reciprocity
// - **Chemistry (3 models)**: Change processes like Catalysts, Activation Energy, Alloying

// ## ANALYSIS FRAMEWORK

// When a user presents a situation, analyze it through these dimensions:

// ### 1. SITUATION TYPE IDENTIFICATION
// - **Decision-making challenge** (choosing between options)
// - **Problem-solving need** (overcoming obstacles)
// - **Strategic thinking requirement** (long-term planning)
// - **Behavioral change goal** (habits, mindset shifts)
// - **Creative innovation need** (new approaches, breakthrough thinking)
// - **Communication challenge** (influence, persuasion, clarity)
// - **Learning/growth opportunity** (skill development, knowledge gaps)
// - **Productivity/focus issue** (efficiency, time management)

// ### 2. CORE CHALLENGE ANALYSIS
// - What is the root problem vs. symptoms?
// - What type of thinking is most needed?
// - What are the key constraints or limitations?
// - What stage of the problem-solving process are they in?
// - What cognitive biases might be affecting them?

// ### 3. MODEL SELECTION CRITERIA
// Select models that:
// - **Address the core challenge** directly
// - **Provide complementary perspectives** (don't overlap heavily)
// - **Match the complexity level** appropriate for the situation
// - **Offer actionable frameworks** the user can immediately apply
// - **Cover different aspects** of the challenge (immediate + long-term, internal + external, etc.)

// ## MENTAL MODEL LIST
// ${JSON.stringify(mentalModelslist)}

// ## USER QUERY
// ${challenge}

// ## OUTPUT FORMAT
// Return the result strictly in this JSON format:
// {"recommended_models": [
//     {
//       "model_id": "model-id-from-list",
//       "model_name": "Model Name", 
//       "why_this_fits": "2-3 sentences explaining relevance to their specific situation",
//       "key_question": "One powerful question this model helps them ask"
//     },
//     {
//       "model_name": "Model Name",
//       "why_this_fits": "2-3 sentences explaining relevance to their specific situation", 
//       "key_question": "One powerful question this model helps them ask"
//     },
//     {
//       "model_name": "Model Name",
//       "why_this_fits": "2-3 sentences explaining relevance to their specific situation",
//       "key_question": "One powerful question this model helps them ask"
//     }
//   ]}`;

//     const response = await client.chat.completions.create({
//       model: MODEL,
//       messages: [{ role: 'user', content: prompt }],
//       response_format: { type: 'json_object' },
//       temperature: 0
//     });

//     const content = JSON.parse(response.choices[0].message.content);
//     console.info(content)
    
//     // Map the LLM response to include full model data
//     const enrichedModels = content.recommended_models.map(rec => {
//       const fullModel = mentalModels.find(m => m.name === rec.model_name);
//       return {
//         model: fullModel,
//         relevance: rec.why_this_fits,
//         keyQuestion: rec.key_question,
//         score: 5, // High score for LLM matches
//         isLLMMatch: true
//       };
//     }).filter(item => item.model); // Remove any that couldn't be matched

//     return NextResponse.json({ matches: enrichedModels });
//   } catch (error) {
//     console.error('LLM matching error:', error);
//     return NextResponse.json(
//       { message: 'LLM matching failed', error: error.message },
//       { status: 500 }
//     );
//   }
// }

// // Handle unsupported methods
// export async function GET() {
//   return NextResponse.json(
//     { message: 'Method not allowed' },
//     { status: 405 }
//   );
// }

import { NextResponse } from 'next/server';
import { providerManager } from '@/lib/provider-manager';

export async function POST(request) {
  try {
    const { challenge } = await request.json();

    if (!challenge) {
      return NextResponse.json(
        { message: 'Challenge is required' }, 
        { status: 400 }
      );
    }

    const { result, provider, method, keyUsed } = await providerManager.attemptMatch(challenge);

    return NextResponse.json({ 
      matches: result,
      provider,
      method,
      keyUsed,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Matching error:', error);
    return NextResponse.json(
      { message: 'Matching failed', error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
}
