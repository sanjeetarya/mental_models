import { mentalModels } from "@/lib/mental-models"
import { ModelCard } from "@/components/model-card"

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-gray-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Explore Mental Models</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Browse our comprehensive library of mental models. Each model is a thinking tool that can help you make
            better decisions and solve problems more effectively.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mentalModels.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      </div>
    </div>
  )
}
