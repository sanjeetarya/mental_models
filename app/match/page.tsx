"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mentalModels, type MentalModel } from "@/lib/mental-models"
import { Zap, Lightbulb, ArrowRight, Brain, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface MatchResult {
  model: MentalModel
  relevance: string
  keyQuestion?: string
  score: number
  isLLMMatch?: boolean
}

export default function MatchPage() {
  const [challenge, setChallenge] = useState("")
  const [matches, setMatches] = useState<MatchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [matchingMethod, setMatchingMethod] = useState<'llm' | 'keyword'>('llm')
  const [error, setError] = useState<string | null>(null)

  const findMatchesWithLLM = async (): Promise<MatchResult[]> => {
    const response = await fetch('/api/match-models', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ challenge }),
    });

    if (!response.ok) {
      throw new Error(`LLM matching failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.matches;
  }

  const findMatchesWithKeywords = (): MatchResult[] => {
    const challengeLower = challenge.toLowerCase()
    const matchResults: MatchResult[] = []

    mentalModels.forEach((model) => {
      let score = 0
      let relevance = ""

      // Your existing keyword matching logic
      if (
        challengeLower.includes("decision") ||
        challengeLower.includes("choose") ||
        challengeLower.includes("decide")
      ) {
        if (model.useCases.includes("Decision-Making")) {
          score += 3
          relevance = "Perfect for decision-making challenges"
        }
      }

      if (
        challengeLower.includes("stuck") ||
        challengeLower.includes("comfort zone") ||
        challengeLower.includes("fear")
      ) {
        if (model.id === "inversion") {
          score += 4
          relevance = "Think about what's keeping you stuck, and avoid it"
        }
        if (model.id === "second-order-thinking") {
          score += 3
          relevance = "Visualize the long-term cost of inaction"
        }
      }

      if (
        challengeLower.includes("problem") ||
        challengeLower.includes("solve") ||
        challengeLower.includes("complex")
      ) {
        if (model.useCases.includes("Problem Solving")) {
          score += 3
          relevance = "Excellent for breaking down complex problems"
        }
      }

      if (
        challengeLower.includes("business") ||
        challengeLower.includes("strategy") ||
        challengeLower.includes("company")
      ) {
        if (model.useCases.includes("Business Strategy")) {
          score += 3
          relevance = "Essential for business strategy and planning"
        }
      }

      if (
        challengeLower.includes("invest") ||
        challengeLower.includes("money") ||
        challengeLower.includes("financial")
      ) {
        if (model.useCases.includes("Investing")) {
          score += 4
          relevance = "Critical for investment decisions"
        }
      }

      if (challengeLower.includes("career") || challengeLower.includes("job") || challengeLower.includes("work")) {
        if (model.useCases.includes("Career Navigation")) {
          score += 3
          relevance = "Valuable for career planning and decisions"
        }
      }

      if (challengeLower.includes("learn") || challengeLower.includes("study") || challengeLower.includes("skill")) {
        if (model.useCases.includes("Learning")) {
          score += 3
          relevance = "Helps optimize learning and skill development"
        }
      }

      // Add some randomness for variety
      if (score === 0) {
        score = Math.random() * 2
        relevance = "May provide useful perspective on your challenge"
      }

      if (score > 0) {
        matchResults.push({ model, relevance, score, isLLMMatch: false })
      }
    })

    return matchResults.sort((a, b) => b.score - a.score).slice(0, 6)
  }

  const findMatches = async () => {
    if (!challenge.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      let matchResults: MatchResult[] = []

      // Try LLM matching first
      try {
        matchResults = await findMatchesWithLLM()
        setMatchingMethod('llm')
      } catch (llmError) {
        console.warn('LLM matching failed, falling back to keyword matching:', llmError)
        setError('AI matching unavailable, using keyword matching')
        
        // Simulate delay for consistency
        await new Promise((resolve) => setTimeout(resolve, 1000))
        
        matchResults = findMatchesWithKeywords()
        setMatchingMethod('keyword')
      }

      setMatches(matchResults)
    } catch (error) {
      console.error('Matching failed:', error)
      setError('Matching failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Model Matcher</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Describe your challenge, and we'll recommend the most relevant mental models to help you think through it
            clearly.
          </p>
        </div>

        <Card className="bg-gray-800/50 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Lightbulb className="mr-2 h-5 w-5 text-yellow-400" />
              What challenge are you facing?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Describe your situation... For example: 'I'm stuck in my comfort zone and afraid to take risks' or 'I need to make a difficult business decision with limited information'"
              value={challenge}
              onChange={(e) => setChallenge(e.target.value)}
              className="min-h-[120px] bg-gray-700 border-gray-600 text-white resize-none"
            />
            <Button
              onClick={findMatches}
              disabled={!challenge.trim() || isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Finding matches...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Find Matching Models
                </>
              )}
            </Button>
            
            {error && (
              <div className="flex items-center p-3 bg-yellow-900/20 border border-yellow-800/30 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-yellow-400 mr-2" />
                <span className="text-yellow-200 text-sm">{error}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {matches.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <ArrowRight className="mr-2 h-6 w-6 text-green-400" />
                Recommended Mental Models
              </h2>
              <Badge 
                className={matchingMethod === 'llm' ? 'bg-purple-600' : 'bg-gray-600'}
              >
                {matchingMethod === 'llm' ? (
                  <>
                    <Brain className="mr-1 h-3 w-3" />
                    AI Powered
                  </>
                ) : (
                  'Keyword Based'
                )}
              </Badge>
            </div>

            <div className="space-y-6">
              {matches.map((match, index) => (
                <Card key={match.model.id} className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{match.model.icon}</div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{match.model.name}</h3>
                          <p className="text-gray-300">{match.model.oneLiner}</p>
                        </div>
                      </div>
                      <Badge className="bg-green-600">#{index + 1} Match</Badge>
                    </div>

                    <div className="bg-blue-900/20 rounded-lg p-4 mb-4 border border-blue-800/30">
                      <p className="text-blue-200 font-medium">Why this helps:</p>
                      <p className="text-blue-100">{match.relevance}</p>
                    </div>

                    {match.keyQuestion && (
                      <div className="bg-purple-900/20 rounded-lg p-4 mb-4 border border-purple-800/30">
                        <p className="text-purple-200 font-medium">Key question to ask yourself:</p>
                        <p className="text-purple-100 italic">"{match.keyQuestion}"</p>
                      </div>
                    )}

                    {/* <p className="text-gray-300 mb-4">{match.model.summary}</p> */}

                    <div className="flex flex-wrap gap-2 mb-4">
                      {match.model.useCases.map((useCase) => (
                        <Badge key={useCase} variant="outline" className="border-gray-600 text-gray-400">
                          {useCase}
                        </Badge>
                      ))}
                    </div>

                    <Button
                      asChild
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                    >
                      <Link href={`/model/${match.model.id}`}>
                        Learn More <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Example challenges */}
        <Card className="bg-gray-800/50 border-gray-700 mt-8">
          <CardHeader>
            <CardTitle className="text-white">Need inspiration? Try these examples:</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "I'm stuck in my comfort zone and afraid to take risks",
                "I need to make a difficult business decision with limited information",
                "I'm overwhelmed by a complex problem at work",
                "I want to improve my investment strategy",
                "I'm struggling to learn new skills effectively",
                "I need to communicate better with my team",
              ].map((example, index) => (
                <button
                  key={index}
                  onClick={() => setChallenge(example)}
                  className="text-left p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors text-gray-300 hover:text-white"
                >
                  "{example}"
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
