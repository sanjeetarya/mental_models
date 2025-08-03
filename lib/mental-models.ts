import mentalModelsJson from "./mental-models.json" assert { type: "json" }
export interface MentalModel {
  id: string
  name: string
  oneLiner: string
  category: string
  domains: string[]
  useCases: string[]
  definition: string
  summary: string
  whenToUse: string
  examples: string[]
  quote?: string
  relatedModels: string[]
  icon: string
}
export const mentalModels: MentalModel[] = mentalModelsJson
// export const mentalModels: MentalModel[] = [
//   {
//     id: "inversion",
//     name: "Inversion",
//     oneLiner: "Think backward to avoid stupidity.",
//     category: "General Thinking",
//     domains: ["General Thinking", "Mathematics"],
//     useCases: ["Decision-Making", "Problem Solving", "Business Strategy"],
//     definition:
//       "Inversion is the practice of thinking about what you want to avoid rather than what you want to achieve.",
//     summary:
//       'Instead of asking "How do I succeed?", ask "How do I fail?" Then avoid those failure modes. This approach often reveals hidden risks and unconventional solutions.',
//     whenToUse:
//       "Use when facing complex decisions, planning projects, or when forward thinking feels overwhelming. Particularly powerful for risk assessment and avoiding common pitfalls.",
//     examples: [
//       'Carl Jacobi: "Invert, always invert" - solved mathematical problems by working backwards',
//       "Charlie Munger: Avoided investment mistakes by studying failed companies",
//       "Florence Nightingale: Reduced hospital deaths by identifying what was killing patients",
//     ],
//     quote: "All I want to know is where I'm going to die, so I'll never go there. - Charlie Munger",
//     relatedModels: ["first-principles", "second-order-thinking", "via-negativa"],
//     icon: "↻",
//   },
//   {
//     id: "first-principles",
//     name: "First Principles",
//     oneLiner: "Break down complex problems into fundamental truths.",
//     category: "General Thinking",
//     domains: ["General Thinking", "Physics", "Engineering"],
//     useCases: ["Problem Solving", "Innovation", "Business Strategy"],
//     definition:
//       "First principles thinking involves breaking down complicated problems into basic elements and then reassembling them from the ground up.",
//     summary:
//       "Strip away assumptions and conventional wisdom to get to the fundamental truths. Then build up your reasoning from these basic building blocks.",
//     whenToUse:
//       "Use when facing seemingly impossible problems, challenging conventional wisdom, or when you need breakthrough innovation rather than incremental improvement.",
//     examples: [
//       "Elon Musk: Reduced rocket costs by analyzing raw material costs vs. market prices",
//       'Aristotle: Defined first principles as "the first basis from which a thing is known"',
//       "Richard Feynman: Explained complex physics by breaking it down to simple components",
//     ],
//     quote: "I think it's important to reason from first principles rather than by analogy. - Elon Musk",
//     relatedModels: ["inversion", "occams-razor", "systems-thinking"],
//     icon: "🧱",
//   },
//   {
//     id: "second-order-thinking",
//     name: "Second-Order Thinking",
//     oneLiner: "Consider the consequences of consequences.",
//     category: "General Thinking",
//     domains: ["General Thinking", "Economics", "Systems Thinking"],
//     useCases: ["Decision-Making", "Business Strategy", "Leadership", "Investing"],
//     definition:
//       "Second-order thinking is the practice of not just considering the immediate consequences of your decisions, but also the consequences of those consequences.",
//     summary:
//       'Most people stop at first-order effects. Second-order thinkers ask: "And then what?" This deeper analysis often reveals unintended consequences and better long-term strategies.',
//     whenToUse:
//       "Use for important decisions with long-term implications, policy making, business strategy, and whenever you need to think beyond immediate results.",
//     examples: [
//       "Prohibition: Intended to reduce alcohol consumption, actually increased organized crime",
//       "Social media: Connected people globally, but also created addiction and misinformation",
//       "Antibiotics: Saved millions of lives, but led to antibiotic-resistant bacteria",
//     ],
//     quote:
//       "The curious task of economics is to demonstrate to men how little they really know about what they imagine they can design. - Friedrich Hayek",
//     relatedModels: ["systems-thinking", "unintended-consequences", "feedback-loops"],
//     icon: "🔄",
//   },
//   {
//     id: "occams-razor",
//     name: "Occam's Razor",
//     oneLiner: "The simplest explanation is usually the right one.",
//     category: "General Thinking",
//     domains: ["General Thinking", "Science", "Philosophy"],
//     useCases: ["Problem Solving", "Decision-Making", "Communication"],
//     definition:
//       "Occam's Razor suggests that when faced with competing explanations, the one with the fewest assumptions is usually correct.",
//     summary:
//       "Prefer simple explanations over complex ones. This doesn't mean the simplest is always right, but it's often the best starting point and most likely to be correct.",
//     whenToUse:
//       "Use when evaluating competing theories, debugging problems, making decisions with incomplete information, or communicating complex ideas.",
//     examples: [
//       "Medical diagnosis: Common diseases are more likely than rare ones",
//       "Software debugging: Check simple causes before complex system failures",
//       "Scientific theories: Einstein's E=mc² vs. complex quantum explanations for basic phenomena",
//     ],
//     quote: "Everything should be made as simple as possible, but not simpler. - Albert Einstein",
//     relatedModels: ["first-principles", "signal-vs-noise", "cognitive-load"],
//     icon: "✂️",
//   },
//   {
//     id: "systems-thinking",
//     name: "Systems Thinking",
//     oneLiner: "See the forest, not just the trees.",
//     category: "Systems Thinking",
//     domains: ["Systems Thinking", "Biology", "Economics"],
//     useCases: ["Business Strategy", "Problem Solving", "Leadership"],
//     definition:
//       "Systems thinking is a holistic approach to analysis that focuses on the way that a system's constituent parts interrelate and how systems work over time.",
//     summary:
//       "Instead of breaking down complex problems into parts, systems thinking views problems as part of an overall system. It focuses on relationships, patterns, and context.",
//     whenToUse:
//       "Use when dealing with complex, interconnected problems, organizational issues, or when linear thinking isn't producing results.",
//     examples: [
//       "Ecosystem management: Wolves in Yellowstone affected entire food chain",
//       "Business: Netflix disrupted video rental by thinking about entertainment systems",
//       "Urban planning: Traffic solutions that consider economic, social, and environmental factors",
//     ],
//     quote: "You can't solve a problem with the same thinking that created it. - Albert Einstein",
//     relatedModels: ["second-order-thinking", "feedback-loops", "emergence"],
//     icon: "🕸️",
//   },
//   {
//     id: "confirmation-bias",
//     name: "Confirmation Bias",
//     oneLiner: "We see what we want to see.",
//     category: "Psychology",
//     domains: ["Psychology", "General Thinking"],
//     useCases: ["Decision-Making", "Learning", "Communication"],
//     definition:
//       "Confirmation bias is the tendency to search for, interpret, and recall information in a way that confirms our pre-existing beliefs.",
//     summary:
//       "We naturally seek information that supports our views and ignore contradictory evidence. Recognizing this bias helps us seek disconfirming evidence and make better decisions.",
//     whenToUse:
//       "Use as a check when making important decisions, evaluating information, or when you feel very confident about something.",
//     examples: [
//       "Investment decisions: Only reading bullish news about stocks you own",
//       "Political beliefs: Following news sources that align with your views",
//       "Hiring: Favoring candidates who remind you of yourself",
//     ],
//     quote: "It is the mark of an educated mind to be able to entertain a thought without accepting it. - Aristotle",
//     relatedModels: ["devils-advocate", "steel-manning", "cognitive-dissonance"],
//     icon: "👁️",
//   },
//   {
//     id: "opportunity-cost",
//     name: "Opportunity Cost",
//     oneLiner: "Every choice has a hidden price.",
//     category: "Economics",
//     domains: ["Economics", "General Thinking"],
//     useCases: ["Decision-Making", "Business Strategy", "Career Navigation", "Investing"],
//     definition: "Opportunity cost is the value of the best alternative that you give up when making a choice.",
//     summary:
//       "Every decision involves trade-offs. The true cost of anything is what you give up to get it. Always consider what you're not doing when you choose to do something.",
//     whenToUse:
//       "Use when making resource allocation decisions, career choices, investment decisions, or any time you need to prioritize between options.",
//     examples: [
//       "College: The cost isn't just tuition, but also the income you could have earned working",
//       "Startup: The opportunity cost of starting a company is the salary you give up",
//       "Time: Watching TV has an opportunity cost of reading, exercising, or learning",
//     ],
//     quote: "There is no such thing as a free lunch. - Milton Friedman",
//     relatedModels: ["sunk-cost-fallacy", "pareto-principle", "trade-offs"],
//     icon: "⚖️",
//   },
//   {
//     id: "compound-interest",
//     name: "Compound Interest",
//     oneLiner: "Small consistent actions create exponential results.",
//     category: "Mathematics",
//     domains: ["Mathematics", "Economics", "General Thinking"],
//     useCases: ["Investing", "Learning", "Productivity", "Career Navigation"],
//     definition:
//       "Compound interest is the addition of interest to the principal sum of a loan or deposit, where interest earned also earns interest.",
//     summary:
//       "Small, consistent improvements compound over time to create dramatic results. This applies beyond money to skills, relationships, and habits.",
//     whenToUse:
//       "Use when planning long-term goals, building habits, investing, learning new skills, or any area where consistency matters more than intensity.",
//     examples: [
//       "Warren Buffett: Built wealth through decades of consistent 20% annual returns",
//       "Reading: 30 minutes daily equals 50+ books per year",
//       "Exercise: Small daily workouts create dramatic health improvements over time",
//     ],
//     quote:
//       "Compound interest is the eighth wonder of the world. He who understands it, earns it; he who doesn't, pays it. - Albert Einstein",
//     relatedModels: ["exponential-growth", "consistency", "patience"],
//     icon: "📈",
//   },
// ]

export function getMentalModel(id: string): MentalModel | undefined {
  return mentalModels.find((model) => model.id === id)
}

export function getMentalModelsByCategory(category: string): MentalModel[] {
  return mentalModels.filter((model) => model.category === category)
}

export function getMentalModelsByDomain(domain: string): MentalModel[] {
  return mentalModels.filter((model) => model.domains.includes(domain))
}

export function getMentalModelsByUseCase(useCase: string): MentalModel[] {
  return mentalModels.filter((model) => model.useCases.includes(useCase))
}

export function searchMentalModels(query: string): MentalModel[] {
  const lowercaseQuery = query.toLowerCase()
  return mentalModels.filter(
    (model) =>
      model.name.toLowerCase().includes(lowercaseQuery) ||
      model.oneLiner.toLowerCase().includes(lowercaseQuery) ||
      model.summary.toLowerCase().includes(lowercaseQuery) ||
      model.useCases.some((useCase) => useCase.toLowerCase().includes(lowercaseQuery)),
  )
}

// export const domains = [
//   "General Thinking",
//   "Psychology",
//   "Economics",
//   "Mathematics",
//   "Physics",
//   "Biology",
//   "Systems Thinking",
//   "Philosophy",
//   "Engineering",
//   "Science",
// ]

// export const useCases = [
//   "Decision-Making",
//   "Problem Solving",
//   "Business Strategy",
//   "Career Navigation",
//   "Learning",
//   "Communication",
//   "Leadership",
//   "Investing",
//   "Productivity",
//   "Innovation",
//   "Negotiation",
// ]
// Remove the hard-coded arrays and replace with these functions:

export function getAllDomains(): string[] {
  const allDomains = mentalModels.flatMap(model => model.domains)
  return [...new Set(allDomains)].sort()
}

export function getAllUseCases(): string[] {
  const allUseCases = mentalModels.flatMap(model => model.useCases)
  return [...new Set(allUseCases)].sort()
}

// If you need them as constants for backward compatibility:
export const domains = getAllDomains()
export const useCases = getAllUseCases()
