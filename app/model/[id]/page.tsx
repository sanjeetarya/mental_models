import { notFound } from "next/navigation"
import { getMentalModel, mentalModels } from "@/lib/mental-models"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ModelCard } from "@/components/model-card"
import { Quote, Lightbulb, Target, BookOpen, Users } from "lucide-react"

interface ModelPageProps {
  params: {
    id: string
  }
}

export default function ModelPage({ params }: ModelPageProps) {
  const model = getMentalModel(params.id)

  if (!model) {
    notFound()
  }

  const relatedModels = mentalModels.filter((m) => model.relatedModels.includes(m.id)).slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">{model.icon}</div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">{model.name}</h1>
          <p className="text-2xl text-blue-300 mb-6">{model.oneLiner}</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge className="bg-blue-600">{model.category}</Badge>
            {model.domains.map((domain) => (
              <Badge key={domain} variant="outline" className="border-gray-600 text-gray-400">
                {domain}
              </Badge>
            ))}
          </div>
        </div>

        {/* Definition */}
        <Card className="bg-gray-800/50 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <BookOpen className="mr-2 h-5 w-5" />
              What is it?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 text-lg leading-relaxed">{model.definition}</p>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="bg-gray-800/50 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Lightbulb className="mr-2 h-5 w-5 text-yellow-400" />
              How it works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 text-lg leading-relaxed">{model.summary}</p>
          </CardContent>
        </Card>

        {/* When & How to Use */}
        <Card className="bg-gray-800/50 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Target className="mr-2 h-5 w-5 text-green-400" />
              When & How to Use
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">{model.whenToUse}</p>
            <div>
              <h4 className="text-white font-semibold mb-3">Use Cases:</h4>
              <div className="flex flex-wrap gap-2">
                {model.useCases.map((useCase) => (
                  <Badge key={useCase} className="bg-green-600">
                    {useCase}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Examples */}
        <Card className="bg-gray-800/50 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Users className="mr-2 h-5 w-5 text-purple-400" />
              Real-life Examples
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {model.examples.map((example, index) => (
                <div key={index} className="bg-gray-700/50 rounded-lg p-4">
                  <p className="text-gray-300">{example}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quote */}
        {model.quote && (
          <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-800/30 mb-8">
            <CardContent className="p-8">
              <Quote className="h-8 w-8 text-blue-400 mb-4" />
              <blockquote className="text-xl text-gray-200 italic mb-4">"{model.quote}"</blockquote>
            </CardContent>
          </Card>
        )}

        {/* Related Models */}
        {relatedModels.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Related Models</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedModels.map((relatedModel) => (
                <ModelCard key={relatedModel.id} model={relatedModel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
