import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, Compass, Zap, TrendingUp, Users, Award } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950">
      {/* Hero Section */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent">
            Judgment {">"} Knowledge
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            A growing library of mental models to help you think clearly and act wisely in an AI-dominated world.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
              <Link href="/explore">
                <Compass className="mr-2 h-5 w-5" />
                Explore Models
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-3 text-lg bg-transparent"
            >
              <Link href="/match">
                <Zap className="mr-2 h-5 w-5" />
                Find the Right Model
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why This Matters Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">Why This Matters</h2>
            <p className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">
              In an age where AI makes knowledge widely available, the real competitive advantage lies in
              decision-making, awareness, and judgment. Mental models are the thinking tools that separate clear
              thinkers from the crowd.
            </p>
          </div>

          {/* Quote */}
          <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-2xl p-8 mb-16 border border-blue-800/30">
            <blockquote className="text-xl sm:text-2xl text-center text-gray-200 italic mb-4">
              "The models have to come from multiple disciplines—because all the wisdom of the world is not to be found
              in one little academic department."
            </blockquote>
            <p className="text-center text-gray-400">— Charlie Munger</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">100+</h3>
                <p className="text-gray-300">Mental Models</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">12</h3>
                <p className="text-gray-300">Disciplines Covered</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6 text-center">
                <Award className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">∞</h3>
                <p className="text-gray-300">Better Decisions</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">Start Thinking Better Today</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Whether you're facing a specific challenge or want to expand your thinking toolkit, we'll help you find the
            right mental models.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
          >
            <Link href="/match">
              <Brain className="mr-2 h-5 w-5" />
              Get Started
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
