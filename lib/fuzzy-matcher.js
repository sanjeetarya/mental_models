import Fuse from 'fuse.js';
import { mentalModels } from './mental-models';

class FuzzyMatcher {
  constructor() {
    this.options = {
      includeScore: true,
      threshold: 0.4,
      keys: [
        { name: 'name', weight: 0.3 },
        { name: 'oneLiner', weight: 0.2 },
        { name: 'summary', weight: 0.2 },
        { name: 'useCases', weight: 0.15 },
        { name: 'keywords', weight: 0.1 },
        { name: 'category', weight: 0.05 }
      ]
    };
    
    this.enrichedModels = this.enrichModelsWithKeywords(mentalModels);
    this.fuse = new Fuse(this.enrichedModels, this.options);
  }

  enrichModelsWithKeywords(models) {
    return models.map(model => ({
      ...model,
      keywords: this.generateKeywords(model)
    }));
  }

  generateKeywords(model) {
    const keywords = [];
    
    const categoryKeywords = {
      'general': ['thinking', 'decision', 'problem', 'choice'],
      'economics': ['money', 'cost', 'value', 'market', 'trade'],
      'systems': ['feedback', 'loop', 'complex', 'system', 'process'],
      'mathematics': ['data', 'number', 'pattern', 'probability'],
      'biology': ['evolution', 'growth', 'adaptation', 'survival'],
      'physics': ['force', 'energy', 'momentum', 'leverage'],
      'chemistry': ['change', 'reaction', 'catalyst', 'mix'],
      'art': ['communication', 'message', 'story', 'design']
    };

    if (categoryKeywords[model.category?.toLowerCase()]) {
      keywords.push(...categoryKeywords[model.category.toLowerCase()]);
    }

    const useCaseKeywords = {
      'Decision-Making': ['choose', 'decide', 'option', 'alternative'],
      'Problem Solving': ['solve', 'fix', 'challenge', 'issue', 'stuck'],
      'Business Strategy': ['business', 'strategy', 'company', 'competitive'],
      'Investing': ['invest', 'money', 'financial', 'portfolio', 'risk'],
      'Learning': ['learn', 'study', 'skill', 'knowledge', 'education'],
      'Career Navigation': ['career', 'job', 'work', 'professional']
    };

    model.useCases?.forEach(useCase => {
      if (useCaseKeywords[useCase]) {
        keywords.push(...useCaseKeywords[useCase]);
      }
    });

    return keywords;
  }

  match(challenge) {
    const results = this.fuse.search(challenge);
    
    return results.slice(0, 3).map((result, index) => ({
      model: result.item,
      relevance: this.generateRelevanceExplanation(result.item, challenge),
      score: 5 - result.score * 2,
      isLLMMatch: false,
      matchScore: result.score,
      rank: index + 1
    }));
  }

  generateRelevanceExplanation(model, challenge) {
    const challengeLower = challenge.toLowerCase();
    
    if (model.useCases.some(uc => 
      challengeLower.includes(uc.toLowerCase().split(' ')[0].toLowerCase())
    )) {
      return `This model excels at ${model.useCases[0].toLowerCase()} scenarios like yours.`;
    }
    
    if (challengeLower.includes('decision') || challengeLower.includes('choose')) {
      return `Provides a structured framework for making better decisions in your situation.`;
    }
    
    if (challengeLower.includes('problem') || challengeLower.includes('stuck')) {
      return `Offers a fresh perspective to help you break through this challenge.`;
    }
    
    return `This thinking model can provide valuable insights for your situation.`;
  }
}

export const fuzzyMatcher = new FuzzyMatcher();

export function fuzzyMatch(challenge) {
  return fuzzyMatcher.match(challenge);
}
