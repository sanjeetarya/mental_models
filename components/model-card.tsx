import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { MentalModel } from "@/lib/mental-models"

interface ModelCardProps {
  model: MentalModel
}

export function ModelCard({ model }: ModelCardProps) {
  return (
    <Link href={`/model/${model.id}`}>
      <Card className="group bg-gray-800/50 border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 h-full">
        <CardContent className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">{model.icon}</div>
            <Badge variant="secondary" className="bg-gray-700 text-gray-300">
              {model.category}
            </Badge>
          </div>

          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
            {model.name}
          </h3>

          <p className="text-gray-300 text-sm mb-4 flex-grow">{model.oneLiner}</p>

          <div className="flex flex-wrap gap-1">
            {model.useCases.slice(0, 2).map((useCase) => (
              <Badge key={useCase} variant="outline" className="text-xs border-gray-600 text-gray-400">
                {useCase}
              </Badge>
            ))}
            {model.useCases.length > 2 && (
              <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                +{model.useCases.length - 2}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
