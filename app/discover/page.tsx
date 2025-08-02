"use client"

import { useState, useMemo } from "react"
import { mentalModels, domains, useCases } from "@/lib/mental-models"
import { ModelCard } from "@/components/model-card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter } from "lucide-react"

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDomains, setSelectedDomains] = useState<string[]>([])
  const [selectedUseCases, setSelectedUseCases] = useState<string[]>([])

  const filteredModels = useMemo(() => {
    return mentalModels.filter((model) => {
      const matchesSearch =
        searchQuery === "" ||
        model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.oneLiner.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.summary.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesDomains =
        selectedDomains.length === 0 || selectedDomains.some((domain) => model.domains.includes(domain))

      const matchesUseCases =
        selectedUseCases.length === 0 || selectedUseCases.some((useCase) => model.useCases.includes(useCase))

      return matchesSearch && matchesDomains && matchesUseCases
    })
  }, [searchQuery, selectedDomains, selectedUseCases])

  const toggleDomain = (domain: string) => {
    setSelectedDomains((prev) => (prev.includes(domain) ? prev.filter((d) => d !== domain) : [...prev, domain]))
  }

  const toggleUseCase = (useCase: string) => {
    setSelectedUseCases((prev) => (prev.includes(useCase) ? prev.filter((u) => u !== useCase) : [...prev, useCase]))
  }

  const clearFilters = () => {
    setSelectedDomains([])
    setSelectedUseCases([])
    setSearchQuery("")
  }

  return (
    <div className="min-h-screen bg-gray-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Discover Mental Models</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Find the perfect mental models for your needs. Filter by domain, use case, or search for specific concepts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800/50 border-gray-700 sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Filter className="mr-2 h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search models..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                {/* Domains */}
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-3 block">Domains</label>
                  <div className="space-y-2">
                    {domains.map((domain) => (
                      <Badge
                        key={domain}
                        variant={selectedDomains.includes(domain) ? "default" : "outline"}
                        className={`cursor-pointer transition-colors ${
                          selectedDomains.includes(domain)
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "border-gray-600 text-gray-400 hover:bg-gray-700"
                        }`}
                        onClick={() => toggleDomain(domain)}
                      >
                        {domain}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Use Cases */}
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-3 block">Use Cases</label>
                  <div className="space-y-2">
                    {useCases.map((useCase) => (
                      <Badge
                        key={useCase}
                        variant={selectedUseCases.includes(useCase) ? "default" : "outline"}
                        className={`cursor-pointer transition-colors ${
                          selectedUseCases.includes(useCase)
                            ? "bg-green-600 hover:bg-green-700"
                            : "border-gray-600 text-gray-400 hover:bg-gray-700"
                        }`}
                        onClick={() => toggleUseCase(useCase)}
                      >
                        {useCase}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {(selectedDomains.length > 0 || selectedUseCases.length > 0 || searchQuery) && (
                  <button
                    onClick={clearFilters}
                    className="w-full text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Clear all filters
                  </button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <p className="text-gray-300">
                Showing {filteredModels.length} of {mentalModels.length} mental models
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredModels.map((model) => (
                <ModelCard key={model.id} model={model} />
              ))}
            </div>

            {filteredModels.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No mental models match your current filters.</p>
                <button onClick={clearFilters} className="mt-4 text-blue-400 hover:text-blue-300 transition-colors">
                  Clear filters to see all models
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
